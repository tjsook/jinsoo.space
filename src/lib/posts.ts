import { createSupabaseServerClient } from "@/lib/supabase-server";
import type { PostRecord, PostStatus } from "@/types/post";

type CreatePostInput = {
  slug: string;
  name: string;
  content: string;
  label: string;
  status: PostStatus;
};

export async function getPublishedPosts() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("posts")
    .select("id, slug, name, content, label, status, created_at, updated_at")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as PostRecord[];
}

export async function getAllPosts() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("posts")
    .select("id, slug, name, content, label, status, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as PostRecord[];
}

export async function createPost(input: CreatePostInput) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("posts")
    .insert(input)
    .select("id, slug, name, content, label, status, created_at, updated_at")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as PostRecord;
}
