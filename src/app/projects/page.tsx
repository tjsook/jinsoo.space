import { getPublishedProjects } from "@/lib/projects";
import PublicTerminalHeader from "../public-terminal-header";
import ProjectEntry from "./project-entry";
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
            projects.map((project) => (
              <ProjectEntry key={project.id} project={project} />
            ))
          )}
        </div>
      </div>
    </main>
  );
}
