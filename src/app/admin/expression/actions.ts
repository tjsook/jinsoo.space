"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/admin-auth";
import {
  addExpressionImage,
  createExpressionFolder,
  createExpressionSection,
  createExpressionUpload,
  deleteExpressionFolder,
  deleteExpressionImage,
  deleteExpressionSection,
  renameExpressionFolder,
  updateExpressionSection,
} from "@/lib/expression";

const IMAGE_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
  "image/svg+xml": "svg",
};

// A server action is a public endpoint: the admin layout guards the pages,
// not the actions behind them, so each action checks the session itself.
async function requireAdmin() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;

  if (!secret || !verifyAdminSession(token, secret)) {
    throw new Error("Not signed in.");
  }
}

function getString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function refresh(folderId?: string) {
  revalidatePath("/expression/archive");
  revalidatePath("/admin/expression");
  if (folderId) revalidatePath(`/admin/expression/${folderId}`);
}

export async function createExpressionFolderAction(formData: FormData) {
  await requireAdmin();

  const name = getString(formData, "name");

  if (!name) {
    throw new Error("Folder name is required.");
  }

  const id = await createExpressionFolder(name);

  refresh();
  redirect(`/admin/expression/${id}`);
}

export async function renameExpressionFolderAction(formData: FormData) {
  await requireAdmin();

  const id = getString(formData, "id");
  const name = getString(formData, "name");

  if (!id || !name) {
    throw new Error("Folder id and name are required.");
  }

  await renameExpressionFolder(id, name);
  refresh(id);
}

export async function deleteExpressionFolderAction(formData: FormData) {
  await requireAdmin();

  const id = getString(formData, "id");

  if (!id) {
    throw new Error("Missing folder id.");
  }

  await deleteExpressionFolder(id);

  refresh(id);
  redirect("/admin/expression");
}

/** Step one of an upload: a signed URL the browser sends the file to. */
export async function createExpressionUploadAction(
  folderId: string,
  contentType: string,
) {
  await requireAdmin();

  const extension = IMAGE_EXTENSIONS[contentType];

  if (!folderId || !extension) {
    throw new Error("Only image files can be added.");
  }

  return createExpressionUpload(folderId, extension);
}

/** Step two: once the file is in storage, record it in its folder. */
export async function addExpressionImageAction(input: {
  folderId: string;
  path: string;
  width: number;
  height: number;
}) {
  await requireAdmin();

  const width = Math.round(input.width);
  const height = Math.round(input.height);

  if (!input.path.startsWith(`${input.folderId}/`) || input.path.includes("..")) {
    throw new Error("Upload does not belong to this folder.");
  }

  if (!(width > 0) || !(height > 0)) {
    throw new Error("Image size is missing.");
  }

  await addExpressionImage({ ...input, width, height });
  refresh(input.folderId);
}

export async function deleteExpressionImageAction(formData: FormData) {
  await requireAdmin();

  const id = getString(formData, "id");
  const folderId = getString(formData, "folder_id");

  if (!id) {
    throw new Error("Missing image id.");
  }

  await deleteExpressionImage(id);
  refresh(folderId);
}

// A bare "acme.com" must not become a relative link; a site path stays as is.
function normalizeHref(value: string) {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  if (/^(mailto:|tel:|\/)/i.test(value)) return value;

  return `https://${value}`;
}

function readSection(formData: FormData) {
  const label = getString(formData, "label");
  const order = Number.parseInt(getString(formData, "display_order"), 10);

  if (!label) {
    throw new Error("Section name is required.");
  }

  return {
    label,
    note: getString(formData, "note"),
    href: normalizeHref(getString(formData, "href")),
    display_order: Number.isFinite(order) ? order : 0,
  };
}

function refreshSections() {
  revalidatePath("/expression");
  revalidatePath("/admin/expression");
}

export async function createExpressionSectionAction(formData: FormData) {
  await requireAdmin();
  await createExpressionSection(readSection(formData));
  refreshSections();
}

export async function updateExpressionSectionAction(formData: FormData) {
  await requireAdmin();

  const id = getString(formData, "id");

  if (!id) {
    throw new Error("Missing section id.");
  }

  await updateExpressionSection(id, readSection(formData));
  refreshSections();
}

export async function deleteExpressionSectionAction(formData: FormData) {
  await requireAdmin();

  const id = getString(formData, "id");

  if (!id) {
    throw new Error("Missing section id.");
  }

  await deleteExpressionSection(id);
  refreshSections();
}
