export type PostStatus = "draft" | "published";

export type PostRecord = {
  id: string;
  slug: string;
  name: string;
  content: string;
  label: string;
  status: PostStatus;
  created_at: string;
  updated_at: string;
};
