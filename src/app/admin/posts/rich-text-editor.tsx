"use client";

import { useEffect, useRef, useState } from "react";
import {
  parseRichText,
  serializeRichText,
  type RichTextRun,
} from "@/lib/rich-text";
import styles from "../admin.module.css";

type RichTextEditorProps = {
  name: string;
  placeholder?: string;
  defaultValue?: string;
};

const BLOCK_TAGS = new Set([
  "DIV",
  "P",
  "LI",
  "UL",
  "OL",
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "BLOCKQUOTE",
  "TR",
]);
const SKIPPED_TAGS = new Set(["STYLE", "SCRIPT", "META", "LINK", "TITLE"]);

/** Reads bold and italics off an element, by tag and by inline style. */
function styleOf(element: HTMLElement, inherited: Omit<RichTextRun, "text">) {
  let { bold, italic } = inherited;

  if (element.tagName === "B" || element.tagName === "STRONG") bold = true;
  if (element.tagName === "I" || element.tagName === "EM") italic = true;

  // Google Docs wraps a paste in <b style="font-weight:normal"> and marks the
  // real emphasis on spans, so an inline style overrides the tag.
  const weight = element.style.fontWeight;
  if (weight) {
    bold = weight === "bold" || weight === "bolder" || parseInt(weight, 10) >= 600;
  }

  const fontStyle = element.style.fontStyle;
  if (fontStyle) italic = fontStyle === "italic" || fontStyle === "oblique";

  return { bold, italic };
}

/**
 * Flattens editor or pasted markup into styled runs, one "\n" per line break.
 * The editor keeps whitespace as typed. Pasted HTML follows HTML's rule
 * instead: whitespace collapses unless the source asks to preserve it.
 */
function readRuns(root: Node, keepWhitespace: boolean): RichTextRun[] {
  const runs: RichTextRun[] = [];
  const endsWithBreak = () =>
    runs.length === 0 || runs[runs.length - 1].text.endsWith("\n");
  const plain = { bold: false, italic: false };

  function walk(node: Node, style: Omit<RichTextRun, "text">, keep: boolean) {
    if (node.nodeType === Node.TEXT_NODE) {
      let text = node.textContent ?? "";

      if (!keep) {
        text = text.replace(/\s+/g, " ");
        if (text === " " && endsWithBreak()) return;
      }

      if (text) runs.push({ text, ...style });
      return;
    }

    if (!(node instanceof HTMLElement) || SKIPPED_TAGS.has(node.tagName)) return;

    if (node.tagName === "BR") {
      runs.push({ text: "\n", ...plain });
      return;
    }

    const isBlock = BLOCK_TAGS.has(node.tagName);
    const next = styleOf(node, style);
    const keepNext =
      keep || node.tagName === "PRE" || node.style.whiteSpace.startsWith("pre");

    if (isBlock && !endsWithBreak()) runs.push({ text: "\n", ...plain });
    node.childNodes.forEach((child) => walk(child, next, keepNext));
    if (isBlock && !endsWithBreak()) runs.push({ text: "\n", ...plain });
  }

  root.childNodes.forEach((child) => walk(child, plain, keepWhitespace));

  return runs;
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Styled runs -> the only markup the editor ever holds: text, b, i, br. */
function runsToHtml(runs: RichTextRun[]) {
  return runs
    .map((run) => {
      let html = escapeHtml(run.text).replace(/\n/g, "<br>");

      if (run.italic) html = `<i>${html}</i>`;
      if (run.bold) html = `<b>${html}</b>`;

      return html;
    })
    .join("");
}

/**
 * A textarea that shows bold and italics as you type. It keeps the two styles
 * from pasted rich text (Google Docs, Word, a web page) and drops the rest.
 * The form receives the marked-up text through a hidden input.
 */
export default function RichTextEditor({
  name,
  placeholder,
  defaultValue = "",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(defaultValue);
  const [active, setActive] = useState({ bold: false, italic: false });

  // The editor's content is set once, by hand: React must not re-render the
  // children of an element the user is typing into.
  useEffect(() => {
    if (editorRef.current) {
      // Form posts store "\r\n"; left in, each one would read as two breaks.
      const text = defaultValue.replace(/\r\n?/g, "\n");
      editorRef.current.innerHTML = runsToHtml(parseRichText(text));
    }
  }, [defaultValue]);

  useEffect(() => {
    function syncActive() {
      const editor = editorRef.current;
      const selection = document.getSelection();

      if (!editor || !selection?.anchorNode) return;
      if (!editor.contains(selection.anchorNode)) return;

      setActive({
        bold: document.queryCommandState("bold"),
        italic: document.queryCommandState("italic"),
      });
    }

    document.addEventListener("selectionchange", syncActive);
    return () => document.removeEventListener("selectionchange", syncActive);
  }, []);

  function sync() {
    const editor = editorRef.current;
    if (!editor) return;

    const runs = readRuns(editor, true);
    const isEmpty = runs.every((run) => run.text.trim() === "");

    // An emptied editor keeps a stray <br>, which would hide the placeholder.
    if (isEmpty && editor.innerHTML !== "") editor.innerHTML = "";

    setValue(isEmpty ? "" : serializeRichText(runs));
  }

  function applyStyle(command: "bold" | "italic") {
    editorRef.current?.focus();
    document.execCommand(command);
    sync();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    // One <br> per Enter keeps the markup flat; browsers otherwise add <div>s.
    if (event.key === "Enter" && !event.nativeEvent.isComposing) {
      event.preventDefault();
      document.execCommand("insertLineBreak");
      sync();
    }
  }

  function handlePaste(event: React.ClipboardEvent<HTMLDivElement>) {
    event.preventDefault();

    const html = event.clipboardData.getData("text/html");
    const text = event.clipboardData.getData("text/plain");
    const runs: RichTextRun[] = html
      ? readRuns(new DOMParser().parseFromString(html, "text/html").body, false)
      : [{ text, bold: false, italic: false }];

    // A pasted block ends in a line break the user did not ask for.
    const last = runs[runs.length - 1];
    if (html && last?.text.endsWith("\n")) last.text = last.text.slice(0, -1);

    document.execCommand("insertHTML", false, runsToHtml(runs));
    sync();
  }

  return (
    <div className={styles.richEditor}>
      <div className={styles.richToolbar}>
        <button
          type="button"
          className={`${styles.richToolButton} ${active.bold ? styles.richToolButtonActive : ""}`}
          aria-label="Bold"
          aria-pressed={active.bold}
          title="Bold (⌘B)"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => applyStyle("bold")}
        >
          <b>B</b>
        </button>
        <button
          type="button"
          className={`${styles.richToolButton} ${active.italic ? styles.richToolButtonActive : ""}`}
          aria-label="Italic"
          aria-pressed={active.italic}
          title="Italic (⌘I)"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => applyStyle("italic")}
        >
          <i>I</i>
        </button>
      </div>
      <div
        ref={editorRef}
        className={`${styles.textarea} ${styles.richInput}`}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        aria-label={placeholder}
        data-placeholder={placeholder}
        onInput={sync}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
      />
      <input type="hidden" name={name} value={value} />
    </div>
  );
}
