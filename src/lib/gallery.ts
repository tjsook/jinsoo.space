import type { Dirent } from "node:fs";
import { readdir } from "node:fs/promises";
import path from "node:path";
import type { GalleryEntry } from "@/types/gallery-entry";

const GALLERY_ROOT = path.join(process.cwd(), "public", "gallery");
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

function sortNaturally(values: string[]) {
  return values.sort((left, right) => {
    const leftBase = path.basename(left, path.extname(left));
    const rightBase = path.basename(right, path.extname(right));
    const leftNumber = Number(leftBase);
    const rightNumber = Number(rightBase);
    const leftIsNumber = Number.isInteger(leftNumber) && leftBase.trim() !== "";
    const rightIsNumber =
      Number.isInteger(rightNumber) && rightBase.trim() !== "";

    if (leftIsNumber && rightIsNumber) {
      return leftNumber - rightNumber;
    }

    return left.localeCompare(right, undefined, {
      numeric: true,
      sensitivity: "base",
    });
  });
}

export async function getGalleryEntries() {
  let rootEntries: Dirent<string>[] = [];

  try {
    rootEntries = await readdir(GALLERY_ROOT, { withFileTypes: true });
  } catch {
    return [] satisfies GalleryEntry[];
  }

  const entries = await Promise.all(
    rootEntries
      .filter((entry) => entry.isDirectory())
      .map(async (entry) => {
      const folder = entry.name;
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
