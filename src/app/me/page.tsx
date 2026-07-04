import { getAboutContent } from "@/lib/about-content";
import PublicTerminalHeader from "../public-terminal-header";
import styles from "../section.module.css";

export const dynamic = "force-dynamic";

export default async function MePage() {
  const about = await getAboutContent();
  const paragraphs = about.content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <PublicTerminalHeader />
        <div className={styles.frameBody}>
          <h1 className={styles.title}>{about.title}</h1>
          {(paragraphs.length > 0 ? paragraphs : [about.content]).map(
            (paragraph, index) => (
              <p
                key={`about-paragraph-${index}`}
                className={`${styles.body} ${styles.compactBody} ${styles.preserveBreaks}`}
              >
                {paragraph}
              </p>
            ),
          )}
        </div>
      </div>
    </main>
  );
}
