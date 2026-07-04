import { getAboutContent } from "@/lib/about-content";
import { updateAboutContentAction } from "../actions";
import styles from "../admin.module.css";

export const dynamic = "force-dynamic";

export default async function EditAboutPage() {
  const about = await getAboutContent();

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.title}>edit about</h1>
        <form action={updateAboutContentAction} className={styles.form}>
          <input
            name="title"
            type="text"
            placeholder="title"
            defaultValue={about.title}
            className={styles.input}
          />
          <textarea
            name="content"
            placeholder="content"
            rows={14}
            defaultValue={about.content}
            className={styles.textarea}
          />
          <button type="submit" className={styles.submitButton}>
            save about
          </button>
        </form>
      </div>
    </main>
  );
}
