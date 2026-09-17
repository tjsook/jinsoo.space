import { getPublishedProjects } from "@/lib/projects";
import PageShell from "../page-shell";
import ProjectEntry from "./project-entry";
import styles from "../section.module.css";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();

  return (
    <PageShell wide title="projects">
      {projects.length === 0 ? (
        <p className={styles.body}>coming... soon?</p>
      ) : (
        <div className={styles.projectList}>
          {projects.map((project) => (
            <ProjectEntry key={project.id} project={project} />
          ))}
        </div>
      )}
    </PageShell>
  );
}
