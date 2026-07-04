"use client";

import { useState } from "react";
import styles from "../section.module.css";

type ProjectStackTreeProps = {
  items: string[];
};

export default function ProjectStackTree({ items }: ProjectStackTreeProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.projectStackTree} aria-label="Technology stack">
      <button
        type="button"
        className={styles.projectStackToggle}
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
      >
        <span className={styles.projectStackToggleIcon} aria-hidden="true">
          {isOpen ? "-" : "+"}
        </span>
        <span className={styles.projectStackRoot}>stack</span>
      </button>
      {isOpen ? (
        <ul className={styles.projectStackList}>
          {items.map((item, index) => {
            const branch = index === items.length - 1 ? "└──" : "├──";

            return (
              <li key={item} className={styles.projectStackItem}>
                <span className={styles.projectStackBranch} aria-hidden="true">
                  {branch}
                </span>
                <span className={styles.projectStackLabel}>{item}</span>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
