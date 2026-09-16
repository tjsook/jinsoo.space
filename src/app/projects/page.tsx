import { getPublishedProjects } from "@/lib/projects";
import PageShell from "../page-shell";
import ProjectEntry from "./project-entry";
import styles from "../section.module.css";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();

  return (
    <PageShell title="projects" eyebrow="(01) projects">
      {projects.length === 0 ? (
        <p className={styles.body}>coming... soon?</p>
      ) : (
        projects.map((project) => (
          <ProjectEntry key={project.id} project={project} />
        ))
      )}
    </PageShell>
  );
}
