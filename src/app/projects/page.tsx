import { getPublishedProjects } from "@/lib/projects";
import PageShell from "../page-shell";
import ProjectEntry from "./project-entry";
import styles from "../section.module.css";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();
  const toolCount = new Set(projects.flatMap((project) => project.stack)).size;

  return (
    <PageShell
      title="projects"
      eyebrow={
        projects.length > 0
          ? `${projects.length} builds · ${toolCount} tools`
          : undefined
      }
    >
      {projects.length === 0 ? (
        <p className={styles.body}>coming... soon?</p>
      ) : (
        <div className={styles.projectList}>
          {projects.map((project, index) => (
            <ProjectEntry key={project.id} project={project} index={index} />
          ))}
        </div>
      )}
    </PageShell>
  );
}
