import { createSupabaseServerClient } from "@/lib/supabase-server";
import type { ProjectRecord, ProjectStatus } from "@/types/project";

type CreateProjectInput = {
  title: string;
  github_url: string;
  image_url: string | null;
  description: string;
  stack: string[];
  status: ProjectStatus;
};

type UpdateProjectInput = CreateProjectInput & {
  id: string;
};

export async function createProject(input: CreateProjectInput) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("projects")
    .insert(input)
    .select(
      "id, title, github_url, image_url, description, stack, status, created_at, updated_at",
    )
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as ProjectRecord;
}

export async function getPublishedProjects() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("projects")
    .select(
      "id, title, github_url, image_url, description, stack, status, created_at, updated_at",
    )
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as ProjectRecord[];
}

export async function getAllProjects() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("projects")
    .select(
      "id, title, github_url, image_url, description, stack, status, created_at, updated_at",
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as ProjectRecord[];
}

export async function getProjectById(id: string) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("projects")
    .select(
      "id, title, github_url, image_url, description, stack, status, created_at, updated_at",
    )
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as ProjectRecord;
}

export async function updateProject(input: UpdateProjectInput) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("projects")
    .update({
      title: input.title,
      github_url: input.github_url,
      image_url: input.image_url,
      description: input.description,
      stack: input.stack,
      status: input.status,
    })
    .eq("id", input.id)
    .select(
      "id, title, github_url, image_url, description, stack, status, created_at, updated_at",
    )
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as ProjectRecord;
}

export async function deleteProject(id: string) {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}
