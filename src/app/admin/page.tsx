import LogoutButton from "./logout-button";
import styles from "./admin.module.css";

export default function AdminPage() {
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.title}>admin</h1>
        <p className={styles.body}>You&apos;re in.</p>
        <div className={styles.actions}>
          <p className={styles.action}>publish writing</p>
          <p className={styles.action}>add project</p>
          <p className={styles.action}>upload gallery photo</p>
        </div>
        <LogoutButton />
      </div>
    </main>
  );
}
