import { getPublishedProjects } from "@/lib/projects";
import styles from "../section.module.css";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.title}>projects</h1>
        {projects.length === 0 ? (
          <p className={styles.body}>coming... soon?</p>
        ) : (
          projects.map((project) => (
            <div key={project.id} className={styles.projectEntry}>
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                {project.title}
              </a>
              <p className={`${styles.body} ${styles.compactBody} ${styles.preserveBreaks}`}>
                {project.description}
              </p>
              {project.stack.length > 0 ? (
                <p className={styles.projectStack}>
                  {project.stack.join(" • ")}
                </p>
              ) : null}
            </div>
          ))
        )}
      </div>
    </main>
  );
}
