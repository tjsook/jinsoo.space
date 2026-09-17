import type { ReactNode } from "react";
import Link from "next/link";
import SiteHeader from "./site-header";
import styles from "./section.module.css";

type PageShellProps = {
  /** Oversized page title, set in the same display face as the homepage. */
  title?: string;
  /** Small monospace tag above the title. */
  eyebrow?: string;
  /** Way back to the list a page came from. */
  back?: { href: string; label: string };
  /** Long titles, like a writing's, set a step down from a page name. */
  compactTitle?: boolean;
  children: ReactNode;
  aside?: ReactNode;
};

export default function PageShell({
  title,
  eyebrow,
  back,
  compactTitle = false,
  children,
  aside,
}: PageShellProps) {
  return (
    <main className={styles.page}>
      <div className={styles.gridOverlay} aria-hidden="true" />
      {aside}

      <SiteHeader />

      {title ? (
        <header className={styles.pageHead}>
          {back ? (
            <Link href={back.href} className={styles.backLink}>
              <span className={styles.backArrow} aria-hidden="true">
                ←
              </span>
              {back.label}
            </Link>
          ) : null}
          {eyebrow ? <span className={styles.eyebrow}>{eyebrow}</span> : null}
          <h1
            className={[
              styles.pageTitle,
              compactTitle ? styles.pageTitleCompact : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {title}
          </h1>
        </header>
      ) : null}

      <div className={styles.content}>{children}</div>
    </main>
  );
}
