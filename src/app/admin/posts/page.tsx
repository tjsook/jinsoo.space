import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import DeletePostButton from "./delete-post-button";
import styles from "../admin.module.css";

export const dynamic = "force-dynamic";

export default async function ViewPostsPage() {
  const posts = await getAllPosts();

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.title}>view posts</h1>
        <div className={styles.postList}>
          {posts.length === 0 ? (
            <p className={styles.body}>no posts yet</p>
          ) : (
            posts.map((post) => (
              <div key={post.id} className={styles.postRow}>
                <div className={styles.postMeta}>
                  <p className={styles.body}>{post.name}</p>
                  <p className={styles.postDetails}>
                    {post.status} / {post.label}
                  </p>
                </div>
                <div className={styles.postActions}>
                  <Link
                    href={`/admin/posts/${post.id}/edit`}
                    className={styles.inlineAction}
                  >
                    edit
                  </Link>
                  <DeletePostButton id={post.id} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
