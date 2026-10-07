import { randomUUID } from "node:crypto";
import { SAMPLE_FOLDERS } from "@/lib/expression-samples";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import type { ExpressionFolder } from "@/types/expression";

export const EXPRESSION_BUCKET = "expression";

const FOLDER_COLUMNS =
  "id, name, created_at, expression_images(id, url, width, height, created_at)";

type FolderRow = {
  id: string;
  name: string;
  expression_images: {
    id: string;
    url: string;
    width: number;
    height: number;
    created_at: string;
  }[];
};

function toFolder(row: FolderRow): ExpressionFolder {
  return {
    id: row.id,
    name: row.name,
    images: [...row.expression_images]
      .sort((a, b) => a.created_at.localeCompare(b.created_at))
      .map(({ id, url, width, height }) => ({ id, url, width, height })),
  };
}

/** Every folder with its images, oldest folder first. Throws on a bad query. */
export async function getExpressionFolders() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("expression_folders")
    .select(FOLDER_COLUMNS)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as FolderRow[]).map(toFolder);
}

/**
 * The folders the public archive shows. A missing table must not take the
 * page down, and development falls back to throwaway samples so the archive
 * can be looked at before any real folder exists.
 */
export async function getArchiveFolders(): Promise<{
  folders: ExpressionFolder[];
  isSample: boolean;
}> {
  let folders: ExpressionFolder[] = [];

  try {
    folders = await getExpressionFolders();
  } catch {
    folders = [];
  }

  if (folders.length === 0 && process.env.NODE_ENV !== "production") {
    return { folders: SAMPLE_FOLDERS, isSample: true };
  }

  return { folders, isSample: false };
}

export async function getExpressionFolderById(id: string) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("expression_folders")
    .select(FOLDER_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? toFolder(data as FolderRow) : null;
}

export async function createExpressionFolder(name: string) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("expression_folders")
    .insert({ name })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data.id as string;
}

export async function renameExpressionFolder(id: string, name: string) {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from("expression_folders")
    .update({ name })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

async function removeStoredFiles(paths: (string | null)[]) {
  const stored = paths.filter((path): path is string => Boolean(path));
  if (stored.length === 0) return;

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.storage
    .from(EXPRESSION_BUCKET)
    .remove(stored);

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteExpressionFolder(id: string) {
  const supabase = createSupabaseServerClient();
  const { data: images, error: readError } = await supabase
    .from("expression_images")
    .select("storage_path")
    .eq("folder_id", id);

  if (readError) {
    throw new Error(readError.message);
  }

  // The image rows go with the folder; their files have to be removed by hand.
  const { error } = await supabase
    .from("expression_folders")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  await removeStoredFiles((images ?? []).map((image) => image.storage_path));
}

/** A one-off URL the browser uploads one image to, straight into storage. */
export async function createExpressionUpload(folderId: string, extension: string) {
  const supabase = createSupabaseServerClient();
  const path = `${folderId}/${randomUUID()}.${extension}`;
  const { data, error } = await supabase.storage
    .from(EXPRESSION_BUCKET)
    .createSignedUploadUrl(path);

  if (error) {
    throw new Error(error.message);
  }

  return { path, signedUrl: data.signedUrl };
}

export async function addExpressionImage(input: {
  folderId: string;
  path: string;
  width: number;
  height: number;
}) {
  const supabase = createSupabaseServerClient();
  const { data: file } = supabase.storage
    .from(EXPRESSION_BUCKET)
    .getPublicUrl(input.path);
  const { error } = await supabase.from("expression_images").insert({
    folder_id: input.folderId,
    url: file.publicUrl,
    storage_path: input.path,
    width: input.width,
    height: input.height,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteExpressionImage(id: string) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("expression_images")
    .delete()
    .eq("id", id)
    .select("storage_path")
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  await removeStoredFiles([data?.storage_path ?? null]);
}
