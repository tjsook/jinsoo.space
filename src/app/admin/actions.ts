"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createPost, deletePost, updatePost } from "@/lib/posts";
import type { PostStatus } from "@/types/post";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

export async function createPostAction(formData: FormData) {
  const slug = getString(formData, "slug");
  const name = getString(formData, "name");
  const label = getString(formData, "label");
  const content = getString(formData, "content");
  const rawStatus = getString(formData, "status");

  if (!slug || !name || !label || !content) {
    throw new Error("All fields are required.");
  }

  const status: PostStatus =
    rawStatus === "published" ? "published" : "draft";

  await createPost({
    slug,
    name,
    label,
    content,
    status,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/posts");
  revalidatePath("/writings");

  redirect("/admin");
}

export async function updatePostAction(formData: FormData) {
  const id = getString(formData, "id");
  const slug = getString(formData, "slug");
  const name = getString(formData, "name");
  const label = getString(formData, "label");
  const content = getString(formData, "content");
  const rawStatus = getString(formData, "status");

  if (!id || !slug || !name || !label || !content) {
    throw new Error("All fields are required.");
  }

  const status: PostStatus =
    rawStatus === "published" ? "published" : "draft";

  await updatePost({
    id,
    slug,
    name,
    label,
    content,
    status,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/posts");
  revalidatePath(`/admin/posts/${id}/edit`);
  revalidatePath("/writings");

  redirect("/admin/posts");
}

export async function deletePostAction(formData: FormData) {
  const id = getString(formData, "id");

  if (!id) {
    throw new Error("Missing post id.");
  }

  await deletePost(id);

  revalidatePath("/admin");
  revalidatePath("/admin/posts");
  revalidatePath("/writings");
}
