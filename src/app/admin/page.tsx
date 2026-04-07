import Link from "next/link";
import LogoutButton from "./logout-button";
import styles from "./admin.module.css";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.title}>my console</h1>
        <div className={styles.actions}>
          <Link href="/admin/posts/new" className={styles.actionLink}>
            create post
          </Link>
          <Link href="/admin/posts" className={styles.actionLink}>
            view posts
          </Link>
          <Link href="/admin/projects/new" className={styles.actionLink}>
            create project
          </Link>
          <Link href="/admin/projects" className={styles.actionLink}>
            view projects
          </Link>
        </div>
        <LogoutButton />
      </div>
    </main>
  );
}
