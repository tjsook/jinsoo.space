import { getPublishedProjects } from "@/lib/projects";
import PublicTerminalHeader from "../public-terminal-header";
import ProjectStackTree from "./project-stack-tree";
import styles from "../section.module.css";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <PublicTerminalHeader />
        <div className={styles.frameBody}>
          <h1 className={styles.title}>projects</h1>
          {projects.length === 0 ? (
            <p className={styles.body}>coming... soon?</p>
          ) : (
            projects.map((project) => {
              const paragraphs = project.description
                .split(/\n\s*\n/)
                .map((paragraph) => paragraph.trim())
                .filter(Boolean);

              return (
                <div key={project.id} className={styles.projectEntry}>
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.link} ${styles.projectTitle}`}
                  >
                    {project.title}
                  </a>
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
                    <ProjectStackTree items={project.stack} />
                  ) : null}
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}
