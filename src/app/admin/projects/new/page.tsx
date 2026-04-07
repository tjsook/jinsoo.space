import { createProjectAction } from "../../actions";
import styles from "../../admin.module.css";

export const dynamic = "force-dynamic";

export default function NewProjectPage() {
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.title}>create project</h1>
        <form action={createProjectAction} className={styles.form}>
          <input
            name="title"
            type="text"
            placeholder="title"
            className={styles.input}
          />
          <input
            name="github_url"
            type="url"
            placeholder="github link"
            className={styles.input}
          />
          <input
            name="image_url"
            type="url"
            placeholder="image link"
            className={styles.input}
          />
          <textarea
            name="description"
            placeholder="description"
            rows={6}
            className={styles.textarea}
          />
          <input
            name="stack"
            type="text"
            placeholder="react, next.js, typescript"
            className={styles.input}
          />
          <select name="status" className={styles.input} defaultValue="draft">
            <option value="draft">draft</option>
            <option value="published">published</option>
          </select>
          <button type="submit" className={styles.submitButton}>
            save project
          </button>
        </form>
      </div>
    </main>
  );
}
