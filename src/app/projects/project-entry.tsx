"use client";

import { useState } from "react";
import type { ProjectRecord } from "@/types/project";
import styles from "../section.module.css";

type ProjectEntryProps = {
  project: ProjectRecord;
};

export default function ProjectEntry({ project }: ProjectEntryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const paragraphs = project.description
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <div className={styles.projectEntry}>
      <div className={styles.projectHeader}>
        <button
          type="button"
          className={styles.projectToggle}
          onClick={() => setIsOpen((current) => !current)}
          aria-expanded={isOpen}
          aria-label={`${isOpen ? "Collapse" : "Expand"} ${project.title}`}
        >
          <span
            className={`${styles.projectToggleIcon} ${
              isOpen ? styles.projectToggleIconOpen : ""
            }`}
            aria-hidden="true"
          >
            {">"}
          </span>
        </button>
        <a
          href={project.github_url}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.link} ${styles.projectTitle}`}
        >
          {project.title}
        </a>
      </div>

      {isOpen ? (
        <div className={styles.projectBody}>
          <div className={styles.projectDescription}>
            {(paragraphs.length > 0 ? paragraphs : [project.description]).map(
              (paragraph, index) => (
                <p
                  key={`${project.id}-paragraph-${index}`}
                  className={`${styles.projectParagraph} ${styles.preserveBreaks}`}
                >
                  {paragraph}
                </p>
              ),
            )}
          </div>
          {project.stack.length > 0 ? (
            <div className={styles.projectStackSide}>
              <span className={styles.projectStackLabel}>stack</span>
              <ul className={styles.projectStackList}>
                {project.stack.map((item, index) => {
                  const branch =
                    index === project.stack.length - 1 ? "└──" : "├──";
                  return (
                    <li key={item} className={styles.projectStackItem}>
                      <span
                        className={styles.projectStackBranch}
                        aria-hidden="true"
                      >
                        {branch}
                      </span>
                      <span className={styles.projectStackName}>{item}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
