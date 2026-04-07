import Link from "next/link";
import { formatDisplayDate } from "@/lib/format-date";
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
          <p className={styles.body}>the brain is empty for now</p>
        ) : (
          posts.map((post) => (
            <Link
              key={post.id}
              href={`/writings/${post.slug}`}
              className={styles.link}
            >
              {post.name} / {post.label} / {formatDisplayDate(post.created_at)}
            </Link>
          ))
        )}
      </div>
    </main>
  );
}
