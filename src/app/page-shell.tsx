import type { ReactNode } from "react";
import SiteFooter from "./site-footer";
import SiteHeader from "./site-header";
import styles from "./section.module.css";

type PageShellProps = {
  /** Oversized page title, set in the same display face as the homepage. */
  title?: string;
  /** Small monospace tag above the title. */
  eyebrow?: string;
  children: ReactNode;
  aside?: ReactNode;
};

export default function PageShell({
  title,
  eyebrow,
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
          {eyebrow ? <span className={styles.eyebrow}>{eyebrow}</span> : null}
          <h1 className={styles.pageTitle}>{title}</h1>
        </header>
      ) : null}

      <div className={styles.content}>{children}</div>

      <SiteFooter index="02" />
    </main>
  );
}
