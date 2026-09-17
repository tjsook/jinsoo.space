"use client";

import { useState } from "react";
import styles from "./page.module.css";

const EMAIL_ADDRESS = "tylerjsook@gmail.com";

/** The text-link twin of the header's copy-email icon. */
export default function CopyEmailInline() {
  const [label, setLabel] = useState("email");

  async function handleClick() {
    try {
      await navigator.clipboard.writeText(EMAIL_ADDRESS);
      setLabel("copied");
    } catch {
      setLabel("copy failed");
    }
    window.setTimeout(() => setLabel("email"), 1600);
  }

  return (
    <button
      type="button"
      className={`${styles.outLink} ${styles.outLinkButton}`}
      onClick={handleClick}
    >
      {label}
      <span className={styles.outArrow} aria-hidden="true">
        ⧉
      </span>
    </button>
  );
}
