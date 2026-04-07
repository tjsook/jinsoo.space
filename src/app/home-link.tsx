"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styles from "./layout.module.css";

export default function HomeLink() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { 
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

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

  if (pathname === "/") {
    return (
      <>
        <button
          type="button"
          className={styles.homeLink}
          aria-label="Open admin login"
          onClick={() => {
            setErrorMessage("");
            setIsOpen(true);
          }}
        >
          <Image src="/favicon.ico" alt="" width={22} height={22} priority />
        </button>
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

  return (
    <Link href="/" className={styles.homeLink} aria-label="Home">
      <Image src="/favicon.ico" alt="" width={22} height={22} priority />
    </Link>
  );
}
