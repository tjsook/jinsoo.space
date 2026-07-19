"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

type TerminalEntry = {
  label: string;
  href: string;
  detail: string;
};

type TerminalHomeProps = {
  entries: TerminalEntry[];
  children?: ReactNode;
};

export default function TerminalHome({ entries, children }: TerminalHomeProps) {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isOpen && event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
        return;
      }

      if (isOpen) {
        return;
      }

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
  }, [activeIndex, entries, isOpen, router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };

        setErrorMessage(data.error ?? "Login failed.");
        return;
      }

      setIsOpen(false);
      setPassword("");
      router.push("/admin");
      router.refresh();
    } catch {
      setErrorMessage("Something went wrong. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <section className={styles.terminalShell} aria-label="home terminal">
        <div className={styles.terminalHeader}>
          <button
            type="button"
            className={styles.terminalStarButton}
            aria-label="Open admin login"
            onClick={() => {
              setErrorMessage("");
              setIsOpen(true);
            }}
          >
            <Image src="/favicon.ico" alt="" width={28} height={28} priority />
          </button>
          <span className={styles.terminalTitle}>jinsoo.space</span>
        </div>

        <div className={styles.terminalBody}>
          <div className={styles.menuBlock}>
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
            <p className={styles.outputLine}>{entries[activeIndex].detail}</p>
          </div>

          {children}
        </div>
      </section>

      {isOpen ? (
        <div
          className={styles.modalOverlay}
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        >
          <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-label="Admin login"
            onClick={(event) => event.stopPropagation()}
          >
            <form className={styles.modalForm} onSubmit={handleSubmit}>
              <label htmlFor="admin-password" className={styles.srOnly}>
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                placeholder="who are you"
                autoFocus
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={styles.passwordInput}
              />
              {errorMessage ? (
                <p className={styles.errorMessage}>{errorMessage}</p>
              ) : null}
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
