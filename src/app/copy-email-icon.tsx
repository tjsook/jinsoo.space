"use client";

import { useState } from "react";
import styles from "./page.module.css";

const EMAIL_ADDRESS = "tylerjsook@gmail.com";

export default function CopyEmailIcon() {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    try {
      await navigator.clipboard.writeText(EMAIL_ADDRESS);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // silent fail
    }
  }

  return (
    <button
      type="button"
      className={`${styles.socialLink} ${styles.socialButton}`}
      aria-label={copied ? "Email copied" : "Copy email"}
      title={copied ? "Copied!" : "Copy email"}
      onClick={handleClick}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M22 4L12 13 2 4" />
      </svg>
    </button>
  );
}
