import { readdir } from "node:fs/promises";
import path from "node:path";
import type { GalleryEntry } from "@/types/gallery-entry";

const GALLERY_ROOT = path.join(process.cwd(), "public", "gallery");
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

function sortNaturally(values: string[]) {
  return values.sort((left, right) =>
    left.localeCompare(right, undefined, {
      numeric: true,
      sensitivity: "base",
    }),
  );
}

export async function getGalleryEntries() {
  let folders: string[] = [];

  try {
    folders = await readdir(GALLERY_ROOT);
  } catch {
    return [] satisfies GalleryEntry[];
  }

  const entries = await Promise.all(
    folders.map(async (folder) => {
      const folderPath = path.join(GALLERY_ROOT, folder);
      const stat = await readdir(folderPath, { withFileTypes: true });
      const images = sortNaturally(
        stat
          .filter((entry) => {
            if (!entry.isFile()) {
              return false;
            }

            const extension = path.extname(entry.name).toLowerCase();
            return IMAGE_EXTENSIONS.has(extension);
          })
          .map((entry) => `/gallery/${folder}/${entry.name}`),
      );

      return {
        folder,
        images,
      } satisfies GalleryEntry;
    }),
  );

  return entries.filter((entry) => entry.images.length > 0);
}
