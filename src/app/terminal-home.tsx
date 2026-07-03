"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

type TerminalEntry = {
  label: string;
  href: string;
  detail: string;
};

type TerminalHomeProps = {
  entries: TerminalEntry[];
};

export default function TerminalHome({ entries }: TerminalHomeProps) {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown" || event.key === "j") {
        event.preventDefault();
        setActiveIndex((current) => (current + 1) % entries.length);
        return;
      }

      if (event.key === "ArrowUp" || event.key === "k") {
        event.preventDefault();
        setActiveIndex((current) => (current - 1 + entries.length) % entries.length);
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        router.push(entries[activeIndex].href);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, entries, router]);

  return (
    <section className={styles.terminalShell} aria-label="home terminal">
      <div className={styles.terminalHeader}>
        <span className={styles.terminalDot} />
        <span className={styles.terminalTitle}>jinsoo.space</span>
        <span className={styles.terminalMeta}>session: home</span>
      </div>

      <div className={styles.terminalBody}>
        <div className={styles.bootBlock}>
          <p>jinsoo@space:~$ boot</p>
          <p>rendering terminal navigation...</p>
          <p>use ↑ ↓ or j k to move. press enter to open.</p>
        </div>

        <div className={styles.menuBlock}>
          <p className={styles.promptLine}>jinsoo@space:~$ ls</p>
          <ul className={styles.menuList}>
            {entries.map((entry, index) => {
              const isActive = index === activeIndex;

              return (
                <li key={entry.href}>
                  <button
                    type="button"
                    className={styles.menuButton}
                    onMouseEnter={() => setActiveIndex(index)}
                    onFocus={() => setActiveIndex(index)}
                    onClick={() => router.push(entry.href)}
                  >
                    <span
                      className={isActive ? styles.cursorActive : styles.cursorIdle}
                      aria-hidden="true"
                    >
                      {isActive ? ">" : " "}
                    </span>
                    <span className={styles.menuLabel}>{entry.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className={styles.outputBlock}>
          <p className={styles.promptLine}>
            jinsoo@space:~$ cat {entries[activeIndex].label.replaceAll(" ", "-")}
          </p>
          <p className={styles.outputLine}>{entries[activeIndex].detail}</p>
        </div>
      </div>
    </section>
  );
}
