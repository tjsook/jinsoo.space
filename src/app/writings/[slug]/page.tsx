import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formatDisplayDate } from "@/lib/format-date";
import { getPublishedPostBySlug, getPublishedPosts } from "@/lib/posts";
import { stripRichText } from "@/lib/rich-text";
import GeometricArt from "../../geometric-art";
import PageShell from "../../page-shell";
import RichText from "../../rich-text";
import styles from "../../section.module.css";

// Served from the cache; the admin actions refresh it on every edit.
export const revalidate = 3600;

// Published posts are built ahead of time. A post published later is rendered
// on its first visit, then cached like the rest.
export async function generateStaticParams() {
  const posts = await getPublishedPosts();

  return posts.map((post) => ({ slug: post.slug }));
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jinsoo.space";

function getExcerpt(content: string) {
  const normalized = stripRichText(content).replace(/\s+/g, " ").trim();

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
    <PageShell
      aside={<GeometricArt seed={slug} />}
      back={{ href: "/writings", label: "writings" }}
      eyebrow={`${post.label} / ${formatDisplayDate(post.created_at)}`}
      title={post.name}
      compactTitle
    >
      <p
        className={`${styles.body} ${styles.compactBody} ${styles.preserveBreaks}`}
      >
        <RichText content={post.content} />
      </p>
    </PageShell>
  );
}
