import { getAllPosts } from "@/lib/posts";
import { createPostAction } from "./actions";
import LogoutButton from "./logout-button";
import styles from "./admin.module.css";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const posts = await getAllPosts();

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.title}>my console</h1>
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
        <div className={styles.actions}>
          {posts.length === 0 ? (
            <p className={styles.action}>no writings yet</p>
          ) : (
            posts.map((post) => (
              <p key={post.id} className={styles.action}>
                {post.status} / {post.label} / {post.name}
              </p>
            ))
          )}
        </div>
        <LogoutButton />
      </div>
    </main>
  );
}
