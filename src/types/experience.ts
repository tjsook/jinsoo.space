export type ExperienceStatus = "draft" | "published";

export type ExperienceRecord = {
  id: string;
  company: string;
  role: string;
  date_range: string;
  description: string;
  display_order: number;
  status: ExperienceStatus;
  created_at: string;
  updated_at: string;
};
