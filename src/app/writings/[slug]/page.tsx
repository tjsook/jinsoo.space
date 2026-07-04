import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formatDisplayDate } from "@/lib/format-date";
import { getPublishedPostBySlug } from "@/lib/posts";
import PublicTerminalHeader from "../../public-terminal-header";
import styles from "../../section.module.css";

export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jinsoo.space";

function getExcerpt(content: string) {
  const normalized = content.replace(/\s+/g, " ").trim();

  if (normalized.length <= 180) {
    return normalized;
  }

  return `${normalized.slice(0, 177).trimEnd()}...`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    return {
      title: "writing not found | jinsoo.space",
      description: "the requested writing could not be found",
    };
  }

  const url = `${siteUrl}/writings/${post.slug}`;
  const description = getExcerpt(post.content);
  const imageUrl = `${siteUrl}/writings/${post.slug}/opengraph-image`;

  return {
    title: `${post.name} | jinsoo.space`,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      url,
      title: post.name,
      description,
      siteName: "jinsoo.space",
      publishedTime: post.created_at,
      modifiedTime: post.updated_at,
      tags: [post.label],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${post.name} preview card`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.name,
      description,
      images: [imageUrl],
    },
  };
}

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
        <PublicTerminalHeader />
        <div className={styles.frameBody}>
          <h1 className={styles.title}>{post.name}</h1>
          <p className={styles.body}>
            {post.label} / {formatDisplayDate(post.created_at)}
          </p>
          <p className={`${styles.body} ${styles.compactBody} ${styles.preserveBreaks}`}>
            {post.content}
          </p>
        </div>
      </div>
    </main>
  );
}
