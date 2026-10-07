import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "../page-shell";
import styles from "./expression.module.css";

export const metadata: Metadata = {
  title: "expression | jinsoo.space",
  description: "things made, kept, and looked at",
};

type ExpressionSection = {
  label: string;
  /** Where the section opens. A section without one is not built yet. */
  href?: string;
  note: string;
};

// The page is a list of sections; a new one is a new entry here.
const SECTIONS: ExpressionSection[] = [
  { label: "right now", note: "tbd" },
  { label: "archive", href: "/expression/archive", note: "open" },
];

export default function ExpressionPage() {
  return (
    <PageShell wide title="expression">
      <ul className={styles.sectionList}>
        {SECTIONS.map((section) => {
          const body = (
            <>
              <span className={styles.sectionLabel}>{section.label}</span>
              <span className={styles.sectionNote}>
                {section.note}
                {section.href ? <span aria-hidden="true"> +</span> : null}
              </span>
            </>
          );

          return (
            <li key={section.label} className={styles.sectionRow}>
              {section.href ? (
                <Link
                  href={section.href}
                  className={`${styles.sectionInner} ${styles.sectionInnerLinked}`}
                >
                  {body}
                </Link>
              ) : (
                <div className={styles.sectionInner}>{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </PageShell>
  );
}
