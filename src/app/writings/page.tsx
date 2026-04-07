import { getPublishedPosts } from "@/lib/posts";
import styles from "../section.module.css";

export const dynamic = "force-dynamic";

export default async function WritingsPage() {
  const posts = await getPublishedPosts();

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.title}>writings</h1>
        {posts.length === 0 ? (
          <p className={styles.body}>Nothing published yet.</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className={styles.body}>
              <p>{post.name}</p>
              <p>{post.label}</p>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
