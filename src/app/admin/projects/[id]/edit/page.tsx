import { getProjectById } from "@/lib/projects";
import { updateProjectAction } from "../../../actions";
import styles from "../../../admin.module.css";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectById(id);

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.title}>edit project</h1>
        <form action={updateProjectAction} className={styles.form}>
          <input type="hidden" name="id" value={project.id} />
          <input
            name="title"
            type="text"
            placeholder="title"
            defaultValue={project.title}
            className={styles.input}
          />
          <input
            name="github_url"
            type="url"
            placeholder="github link"
            defaultValue={project.github_url}
            className={styles.input}
          />
          <input
            name="image_url"
            type="url"
            placeholder="image link"
            defaultValue={project.image_url ?? ""}
            className={styles.input}
          />
          <textarea
            name="description"
            placeholder="description"
            rows={6}
            defaultValue={project.description}
            className={styles.textarea}
          />
          <input
            name="stack"
            type="text"
            placeholder="react, next.js, typescript"
            defaultValue={project.stack.join(", ")}
            className={styles.input}
          />
          <select
            name="status"
            className={styles.input}
            defaultValue={project.status}
          >
            <option value="draft">draft</option>
            <option value="published">published</option>
          </select>
          <button type="submit" className={styles.submitButton}>
            save changes
          </button>
        </form>
      </div>
    </main>
  );
}
