import { createSupabaseServerClient } from "@/lib/supabase-server";
import type { ExperienceRecord, ExperienceStatus } from "@/types/experience";

const COLUMNS =
  "id, company, role, date_range, description, link, display_order, status, created_at, updated_at";

type CreateExperienceInput = {
  company: string;
  role: string;
  date_range: string;
  description: string;
  link: string | null;
  display_order: number;
  status: ExperienceStatus;
};

type UpdateExperienceInput = CreateExperienceInput & {
  id: string;
};

export async function createExperience(input: CreateExperienceInput) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("experiences")
    .insert(input)
    .select(COLUMNS)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as ExperienceRecord;
}

export async function getPublishedExperiences() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("experiences")
    .select(COLUMNS)
    .eq("status", "published")
    .order("display_order", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as ExperienceRecord[];
}

export async function getAllExperiences() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("experiences")
    .select(COLUMNS)
    .order("display_order", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as ExperienceRecord[];
}

export async function getExperienceById(id: string) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("experiences")
    .select(COLUMNS)
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as ExperienceRecord;
}

export async function updateExperience(input: UpdateExperienceInput) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("experiences")
    .update({
      company: input.company,
      role: input.role,
      date_range: input.date_range,
      description: input.description,
      link: input.link,
      display_order: input.display_order,
      status: input.status,
    })
    .eq("id", input.id)
    .select(COLUMNS)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as ExperienceRecord;
}

export async function bulkUpdateDisplayOrder(
  ordering: { id: string; display_order: number }[],
) {
  const supabase = createSupabaseServerClient();
  for (const { id, display_order } of ordering) {
    const { error } = await supabase
      .from("experiences")
      .update({ display_order })
      .eq("id", id);
    if (error) {
      throw new Error(error.message);
    }
  }
}

export async function deleteExperience(id: string) {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("experiences").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}
