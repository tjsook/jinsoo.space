import { notFound } from "next/navigation";
import { formatDisplayDate } from "@/lib/format-date";
import { getPublishedPostBySlug } from "@/lib/posts";
import styles from "../../section.module.css";

export const dynamic = "force-dynamic";

export default async function WritingDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.title}>{post.name}</h1>
        <p className={styles.body}>
          {post.label} / {formatDisplayDate(post.created_at)}
        </p>
        <p className={`${styles.body} ${styles.compactBody} ${styles.preserveBreaks}`}>
          {post.content}
        </p>
      </div>
    </main>
  );
}
