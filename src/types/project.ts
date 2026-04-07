export type ProjectStatus = "draft" | "published";

export type ProjectRecord = {
  id: string;
  title: string;
  github_url: string;
  description: string;
  stack: string[];
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
};
