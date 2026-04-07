"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./layout.module.css";

export default function HomeLink() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

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

  if (pathname === "/") {
    return (
      <>
        <button
          type="button"
          className={styles.homeLink}
          aria-label="Open admin login"
          onClick={() => setIsOpen(true)}
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
              <label htmlFor="admin-password" className={styles.srOnly}>
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                placeholder="?"
                autoFocus
                className={styles.passwordInput}
              />
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
