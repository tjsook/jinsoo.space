"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { upsertAboutContent } from "@/lib/about-content";
import {
  createExperience,
  deleteExperience,
  updateExperience,
  bulkUpdateDisplayOrder,
} from "@/lib/experiences";
import { createPost, deletePost, updatePost } from "@/lib/posts";
import {
  createProject,
  deleteProject,
  updateProject,
} from "@/lib/projects";
import type { ExperienceStatus } from "@/types/experience";
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

  if (!name) {
    throw new Error("Title is required.");
  }

  if (!slug) {
    throw new Error("Title needs at least one letter or number.");
  }

  if (!label) {
    throw new Error("Label is required.");
  }

  if (!content) {
    throw new Error("Content is required.");
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

  if (!id) {
    throw new Error("Missing post id.");
  }

  if (!name) {
    throw new Error("Title is required.");
  }

  if (!slug) {
    throw new Error("Title needs at least one letter or number.");
  }

  if (!label) {
    throw new Error("Label is required.");
  }

  if (!content) {
    throw new Error("Content is required.");
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

export async function createExperienceAction(formData: FormData) {
  const company = getString(formData, "company");
  const role = getString(formData, "role");
  const dateRange = getString(formData, "date_range");
  const description = getString(formData, "description");
  const displayOrder = parseInt(getString(formData, "display_order") || "0", 10);
  const rawStatus = getString(formData, "status");

  if (!company || !role || !dateRange) {
    throw new Error("Company, role, and date range are required.");
  }

  const status: ExperienceStatus =
    rawStatus === "published" ? "published" : "draft";

  await createExperience({
    company,
    role,
    date_range: dateRange,
    description,
    display_order: isNaN(displayOrder) ? 0 : displayOrder,
    status,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/experiences");
  revalidatePath("/");

  redirect("/admin/experiences");
}

export async function updateExperienceAction(formData: FormData) {
  const id = getString(formData, "id");
  const company = getString(formData, "company");
  const role = getString(formData, "role");
  const dateRange = getString(formData, "date_range");
  const description = getString(formData, "description");
  const displayOrder = parseInt(getString(formData, "display_order") || "0", 10);
  const rawStatus = getString(formData, "status");

  if (!id || !company || !role || !dateRange) {
    throw new Error("Company, role, and date range are required.");
  }

  const status: ExperienceStatus =
    rawStatus === "published" ? "published" : "draft";

  await updateExperience({
    id,
    company,
    role,
    date_range: dateRange,
    description,
    display_order: isNaN(displayOrder) ? 0 : displayOrder,
    status,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/experiences");
  revalidatePath(`/admin/experiences/${id}/edit`);
  revalidatePath("/");

  redirect("/admin/experiences");
}

export async function deleteExperienceAction(formData: FormData) {
  const id = getString(formData, "id");

  if (!id) {
    throw new Error("Missing experience id.");
  }

  await deleteExperience(id);

  revalidatePath("/admin");
  revalidatePath("/admin/experiences");
  revalidatePath("/");
}

export async function reorderExperiencesAction(formData: FormData) {
  const raw = getString(formData, "ordering");
  if (!raw) {
    throw new Error("Missing ordering data.");
  }

  const ordering = JSON.parse(raw) as { id: string; display_order: number }[];
  await bulkUpdateDisplayOrder(ordering);

  revalidatePath("/admin/experiences");
  revalidatePath("/");
}

export async function updateAboutContentAction(formData: FormData) {
  const title = getString(formData, "title");
  const content = getString(formData, "content");

  if (!title || !content) {
    throw new Error("Title and content are required.");
  }

  await upsertAboutContent({
    title,
    content,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/about");
  revalidatePath("/me");

  redirect("/admin");
}
