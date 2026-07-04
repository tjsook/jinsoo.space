"use client";

import { useState } from "react";
import styles from "../section.module.css";

const EMAIL_ADDRESS = "tylerjsook@gmail.com";

export default function CopyEmailLink() {
  const [label, setLabel] = useState("email me");

  async function handleClick() {
    try {
      await navigator.clipboard.writeText(EMAIL_ADDRESS);
      setLabel("copied email");
      window.setTimeout(() => {
        setLabel("email me");
      }, 1600);
    } catch {
      setLabel("copy failed");
      window.setTimeout(() => {
        setLabel("email me");
      }, 1600);
    }
  }

  return (
    <button type="button" className={styles.linkButton} onClick={handleClick}>
      {label}
    </button>
  );
}
