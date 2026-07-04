import { ImageResponse } from "next/og";
import { getPublishedPostBySlug } from "@/lib/posts";

export const runtime = "nodejs";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

function getExcerpt(content: string) {
  const normalized = content.replace(/\s+/g, " ").trim();

  if (normalized.length <= 180) {
    return normalized;
  }

  return `${normalized.slice(0, 177).trimEnd()}...`;
}

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  const title = post?.name ?? "jinsoo.space";
  const label = post?.label ?? "writing";
  const excerpt = post ? getExcerpt(post.content) : "writing preview";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 64px",
          background: "#000000",
          color: "#eaf2ff",
          fontFamily:
            '"SFMono-Regular", Menlo, Monaco, "Cascadia Mono", "Segoe UI Mono", "Roboto Mono", monospace',
          border: "2px solid #4d7cff",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
            fontSize: 28,
            color: "#4d7cff",
          }}
        >
          <span>★</span>
          <span>jinsoo.space</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "22px",
          }}
        >
          <div
            style={{
              fontSize: 24,
              color: "#87abff",
              textTransform: "lowercase",
            }}
          >
            {label}
          </div>
          <div
            style={{
              fontSize: 64,
              lineHeight: 1.08,
              fontWeight: 600,
              letterSpacing: "-0.04em",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 28,
              lineHeight: 1.45,
              color: "#eaf2ff",
              maxWidth: "92%",
            }}
          >
            {excerpt}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
