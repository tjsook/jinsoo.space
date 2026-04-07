import Link from "next/link";
import { getAllProjects } from "@/lib/projects";
import DeleteProjectButton from "./delete-project-button";
import styles from "../admin.module.css";

export const dynamic = "force-dynamic";

export default async function ViewProjectsPage() {
  const projects = await getAllProjects();

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.title}>view projects</h1>
        <div className={styles.postList}>
          {projects.length === 0 ? (
            <p className={styles.body}>no projects yet</p>
          ) : (
            projects.map((project) => (
              <div key={project.id} className={styles.postRow}>
                <div className={styles.postMeta}>
                  <p className={styles.body}>{project.title}</p>
                  <p className={styles.postDetails}>{project.status}</p>
                </div>
                <div className={styles.postActions}>
                  <Link
                    href={`/admin/projects/${project.id}/edit`}
                    className={styles.inlineAction}
                  >
                    edit
                  </Link>
                  <DeleteProjectButton id={project.id} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
