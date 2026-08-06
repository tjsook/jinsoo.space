import { getExperienceById } from "@/lib/experiences";
import { updateExperienceAction } from "../../../actions";
import styles from "../../../admin.module.css";

export const dynamic = "force-dynamic";

export default async function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const experience = await getExperienceById(id);

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.title}>edit experience</h1>
        <form action={updateExperienceAction} className={styles.form}>
          <input type="hidden" name="id" value={experience.id} />
          <input
            name="company"
            type="text"
            placeholder="company or org"
            defaultValue={experience.company}
            className={styles.input}
          />
          <input
            name="role"
            type="text"
            placeholder="role"
            defaultValue={experience.role}
            className={styles.input}
          />
          <input
            name="date_range"
            type="text"
            placeholder="2025 — or 2024 — 2025"
            defaultValue={experience.date_range}
            className={styles.input}
          />
          <textarea
            name="description"
            placeholder="short description"
            rows={3}
            defaultValue={experience.description}
            className={styles.textarea}
          />
          <input
            name="display_order"
            type="number"
            placeholder="display order (0 = first)"
            defaultValue={experience.display_order}
            className={styles.input}
          />
          <select
            name="status"
            className={styles.input}
            defaultValue={experience.status}
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
