/**
 * Post bodies stay plain text in the database. Bold and italics ride along as
 * inline markers: `**bold**`, `*italic*`, `***both***`. A literal asterisk or
 * backslash is stored escaped (`\*`, `\\`).
 */

export type RichTextRun = {
  text: string;
  bold: boolean;
  italic: boolean;
};

type Marker = "*" | "**" | "***";

type Token =
  | { kind: "text"; value: string }
  | { kind: "stars"; length: number };

function tokenize(content: string): Token[] {
  const tokens: Token[] = [];
  let buffer = "";

  const flush = () => {
    if (buffer) {
      tokens.push({ kind: "text", value: buffer });
      buffer = "";
    }
  };

  for (let i = 0; i < content.length; i += 1) {
    const char = content[i];
    const next = content[i + 1];

    if (char === "\\" && (next === "*" || next === "\\")) {
      buffer += next;
      i += 1;
      continue;
    }

    if (char !== "*") {
      buffer += char;
      continue;
    }

    let length = 1;
    while (content[i + length] === "*") length += 1;

    flush();
    tokens.push({ kind: "stars", length });
    i += length - 1;
  }

  flush();

  return tokens;
}

function pushRun(runs: RichTextRun[], run: RichTextRun) {
  if (!run.text) return;

  const last = runs[runs.length - 1];

  if (last && last.bold === run.bold && last.italic === run.italic) {
    last.text += run.text;
    return;
  }

  runs.push({ ...run });
}

const MARKERS: Marker[] = ["***", "**", "*"];

/** Marked-up text -> styled runs. A marker with no partner stays literal. */
export function parseRichText(content: string): RichTextRun[] {
  const tokens = tokenize(content);
  const runs: RichTextRun[] = [];
  const open: Record<Marker, boolean> = { "*": false, "**": false, "***": false };
  const style = () => ({
    bold: open["**"] || open["***"],
    italic: open["*"] || open["***"],
  });

  tokens.forEach((token, index) => {
    if (token.kind === "text") {
      pushRun(runs, { text: token.value, ...style() });
      return;
    }

    // Two styled runs that touch share one run of asterisks ("**a***b*"), so
    // a run first closes what is open, then opens with what is left.
    let remaining = token.length;

    while (remaining > 0) {
      const closing = MARKERS.find(
        (marker) => open[marker] && marker.length <= remaining,
      );

      if (closing) {
        open[closing] = false;
        remaining -= closing.length;
        continue;
      }

      const opening = MARKERS.find((marker) => marker.length <= remaining)!;
      const hasPartner = tokens
        .slice(index + 1)
        .some((later) => later.kind === "stars" && later.length >= opening.length);

      if (hasPartner) {
        open[opening] = true;
      } else {
        pushRun(runs, { text: opening, ...style() });
      }

      remaining -= opening.length;
    }
  });

  return runs;
}

function escapeText(text: string) {
  return text.replace(/[\\*]/g, (char) => `\\${char}`);
}

/** Styled runs -> marked-up text, the form the database stores. */
export function serializeRichText(input: RichTextRun[]): string {
  const runs: RichTextRun[] = [];

  for (const run of input) {
    // Styling on whitespace alone is invisible, so it is not worth a marker.
    const blank = run.text.trim() === "";
    pushRun(runs, blank ? { text: run.text, bold: false, italic: false } : run);
  }

  return runs
    .map((run) => {
      const marker = run.bold && run.italic ? "***" : run.bold ? "**" : run.italic ? "*" : "";

      if (!marker) return escapeText(run.text);

      // Markers hug the words; surrounding whitespace stays outside them.
      const [, lead, core, trail] = run.text.match(/^(\s*)([\s\S]*?)(\s*)$/) ?? [
        "",
        "",
        run.text,
        "",
      ];

      return `${lead}${marker}${escapeText(core)}${marker}${trail}`;
    })
    .join("");
}

/** Marked-up text -> the words alone, for excerpts and previews. */
export function stripRichText(content: string): string {
  return parseRichText(content)
    .map((run) => run.text)
    .join("");
}
