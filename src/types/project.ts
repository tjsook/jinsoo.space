export type ProjectStatus = "draft" | "published";

export type ProjectRecord = {
  id: string;
  title: string;
  github_url: string;
  image_url: string | null;
  description: string;
  stack: string[];
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
};
