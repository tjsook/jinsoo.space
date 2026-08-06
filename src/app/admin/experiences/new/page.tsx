import { createExperienceAction } from "../../actions";
import styles from "../../admin.module.css";

export const dynamic = "force-dynamic";

export default function NewExperiencePage() {
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.title}>add experience</h1>
        <form action={createExperienceAction} className={styles.form}>
          <input
            name="company"
            type="text"
            placeholder="company or org"
            className={styles.input}
          />
          <input
            name="role"
            type="text"
            placeholder="role"
            className={styles.input}
          />
          <input
            name="date_range"
            type="text"
            placeholder="2025 — or 2024 — 2025"
            className={styles.input}
          />
          <textarea
            name="description"
            placeholder="short description"
            rows={3}
            className={styles.textarea}
          />
          <input
            name="display_order"
            type="number"
            placeholder="display order (0 = first)"
            defaultValue="0"
            className={styles.input}
          />
          <select name="status" className={styles.input} defaultValue="draft">
            <option value="draft">draft</option>
            <option value="published">published</option>
          </select>
          <button type="submit" className={styles.submitButton}>
            save experience
          </button>
        </form>
      </div>
    </main>
  );
}
