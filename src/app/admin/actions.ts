"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createPost, deletePost, updatePost } from "@/lib/posts";
import {
  createProject,
  deleteProject,
  updateProject,
} from "@/lib/projects";
import type { PostStatus } from "@/types/post";
import type { ProjectStatus } from "@/types/project";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function createPostAction(formData: FormData) {
  const name = getString(formData, "name");
  const label = getString(formData, "label");
  const content = getString(formData, "content");
  const rawStatus = getString(formData, "status");
  const slug = slugify(name);

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
  const name = getString(formData, "name");
  const label = getString(formData, "label");
  const content = getString(formData, "content");
  const rawStatus = getString(formData, "status");
  const slug = slugify(name);

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

export async function createProjectAction(formData: FormData) {
  const title = getString(formData, "title");
  const githubUrl = getString(formData, "github_url");
  const imageUrl = getString(formData, "image_url");
  const description = getString(formData, "description");
  const stackInput = getString(formData, "stack");
  const rawStatus = getString(formData, "status");

  if (!title || !githubUrl || !description) {
    throw new Error("Title, GitHub URL, and description are required.");
  }

  const stack = stackInput
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const status: ProjectStatus =
    rawStatus === "published" ? "published" : "draft";

  await createProject({
    title,
    github_url: githubUrl,
    image_url: imageUrl || null,
    description,
    stack,
    status,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  revalidatePath("/admin/projects/new");
  revalidatePath("/projects");

  redirect("/admin");
}

export async function updateProjectAction(formData: FormData) {
  const id = getString(formData, "id");
  const title = getString(formData, "title");
  const githubUrl = getString(formData, "github_url");
  const imageUrl = getString(formData, "image_url");
  const description = getString(formData, "description");
  const stackInput = getString(formData, "stack");
  const rawStatus = getString(formData, "status");

  if (!id || !title || !githubUrl || !description) {
    throw new Error("Title, GitHub URL, and description are required.");
  }

  const stack = stackInput
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const status: ProjectStatus =
    rawStatus === "published" ? "published" : "draft";

  await updateProject({
    id,
    title,
    github_url: githubUrl,
    image_url: imageUrl || null,
    description,
    stack,
    status,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${id}/edit`);
  revalidatePath("/projects");

  redirect("/admin/projects");
}

export async function deleteProjectAction(formData: FormData) {
  const id = getString(formData, "id");

  if (!id) {
    throw new Error("Missing project id.");
  }

  await deleteProject(id);

  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  revalidatePath("/projects");
}
