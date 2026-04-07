import styles from "../../admin.module.css";

export const dynamic = "force-dynamic";

export default function NewProjectPage() {
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.title}>create project</h1>
        <p className={styles.body}>Project creation is coming next.</p>
      </div>
    </main>
  );
}
