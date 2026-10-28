import type { Metadata } from "next";
import Link from "next/link";
import { getPageSections } from "@/lib/expression";
import PageShell from "../page-shell";
import styles from "./expression.module.css";

export const metadata: Metadata = {
  title: "expression | jinsoo.space",
  description: "things made, kept, and looked at",
};

// Served from the cache; the admin actions refresh it on every edit.
export const revalidate = 3600;

export default async function ExpressionPage() {
  const sections = await getPageSections();

  return (
    <PageShell wide title="expression">
      <ul className={styles.sectionList}>
        {sections.map((section) => {
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
            <li key={section.id} className={styles.sectionRow}>
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
