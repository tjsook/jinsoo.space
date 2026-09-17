import Link from "next/link";
import { formatDisplayDate } from "@/lib/format-date";
import { getPublishedPosts } from "@/lib/posts";
import PageShell from "../page-shell";
import styles from "../section.module.css";

export const dynamic = "force-dynamic";

export default async function WritingsPage() {
  const posts = await getPublishedPosts();

  return (
    <PageShell title="writings">
      {posts.length === 0 ? (
        <p className={styles.body}>the brain is empty for now</p>
      ) : (
        posts.map((post) => (
          <Link
            key={post.id}
            href={`/writings/${post.slug}`}
            className={styles.writingEntry}
          >
            <div className={styles.writingName}>{post.name}</div>
            <div className={styles.writingMeta}>
              {post.label} / {formatDisplayDate(post.created_at)}
            </div>
          </Link>
        ))
      )}
    </PageShell>
  );
}
