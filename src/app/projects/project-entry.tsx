import { Fragment } from "react";
import type { ProjectRecord } from "@/types/project";
import styles from "../section.module.css";

type ProjectEntryProps = {
  project: ProjectRecord;
  index: number;
};

/**
 * One project, read as a spec sheet: number and title, the write-up, then the
 * stack as a dense line of parts. Nothing folds away — every field the admin
 * panel holds is on the page.
 */
export default function ProjectEntry({ project, index }: ProjectEntryProps) {
  const paragraphs = project.description
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <article className={styles.project}>
      <div className={styles.projectHead}>
        <span className={styles.projectIndex}>{index + 1}</span>
        <h2 className={styles.projectTitle}>{project.title}</h2>
        {project.github_url ? (
          <a
            href={project.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.projectSource}
          >
            source
            <span className={styles.projectSourceArrow} aria-hidden="true">
              ↗
            </span>
          </a>
        ) : null}
      </div>

      <div className={styles.projectBody}>
        <div className={styles.projectDescription}>
          {(paragraphs.length > 0 ? paragraphs : [project.description]).map(
            (paragraph, paragraphIndex) => (
              <p
                key={`${project.id}-paragraph-${paragraphIndex}`}
                className={`${styles.projectParagraph} ${styles.preserveBreaks}`}
              >
                {paragraph}
              </p>
            ),
          )}
        </div>

        {project.stack.length > 0 ? (
          <div className={styles.projectStack}>
            <span className={styles.projectStackLabel}>
              stack
              <span className={styles.projectStackCount}>
                {project.stack.length}
              </span>
            </span>
            <p className={styles.projectStackList}>
              {project.stack.map((item, itemIndex) => (
                <Fragment key={item}>
                  <span className={styles.projectStackItem}>{item}</span>
                  {itemIndex < project.stack.length - 1 ? (
                    <>
                      {" "}
                      <span className={styles.projectStackDot} aria-hidden="true">
                        ·
                      </span>{" "}
                    </>
                  ) : null}
                </Fragment>
              ))}
            </p>
          </div>
        ) : null}
      </div>
    </article>
  );
}
