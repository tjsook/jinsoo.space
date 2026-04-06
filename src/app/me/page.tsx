import Link from "next/link";
import styles from "../section.module.css";

export default function ProjectsPage() {
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.title}>who am i</h1>
        <p className={styles.body}>This page is under construction.</p>
        <Link href="/" className={styles.backLink}>
          back
        </Link>
      </div>
    </main>
  );
}
