import { createPostAction } from "../../actions";
import styles from "../../admin.module.css";

export const dynamic = "force-dynamic";

export default function NewPostPage() {
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.title}>create post</h1>
        <form action={createPostAction} className={styles.form}>
          <input
            name="name"
            type="text"
            placeholder="name"
            className={styles.input}
          />
          <input
            name="slug"
            type="text"
            placeholder="slug"
            className={styles.input}
          />
          <input
            name="label"
            type="text"
            placeholder="label"
            className={styles.input}
          />
          <select name="status" className={styles.input} defaultValue="draft">
            <option value="draft">draft</option>
            <option value="published">published</option>
          </select>
          <textarea
            name="content"
            placeholder="content"
            rows={10}
            className={styles.textarea}
          />
          <button type="submit" className={styles.submitButton}>
            save writing
          </button>
        </form>
      </div>
    </main>
  );
}
