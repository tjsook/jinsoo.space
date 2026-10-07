"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  addExpressionImageAction,
  createExpressionUploadAction,
} from "./actions";
import styles from "../admin.module.css";

/** The archive lays images out by their shape, so each upload records it. */
function readImageSize(file: File) {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new window.Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      // An SVG without a declared size reports none; treat it as square.
      resolve({
        width: image.naturalWidth || 1000,
        height: image.naturalHeight || 1000,
      });
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`${file.name} is not an image this browser can read.`));
    };
    image.src = url;
  });
}

/**
 * Adds images to a folder. Each file goes straight from the browser to
 * storage through a one-off signed URL, so a large photo never has to pass
 * through a server action.
 */
export default function ImageUploader({ folderId }: { folderId: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.target;
    const files = Array.from(input.files ?? []);

    if (files.length === 0) return;

    setIsBusy(true);
    setError(null);

    let added = 0;

    try {
      for (const file of files) {
        setStatus(`uploading ${added + 1} of ${files.length}...`);

        const size = await readImageSize(file);
        const { path, signedUrl } = await createExpressionUploadAction(
          folderId,
          file.type,
        );
        const response = await fetch(signedUrl, {
          method: "PUT",
          headers: {
            "content-type": file.type,
            "cache-control": "max-age=31536000",
          },
          body: file,
        });

        if (!response.ok) {
          throw new Error(`Upload of ${file.name} failed (${response.status}).`);
        }

        await addExpressionImageAction({ folderId, path, ...size });
        added += 1;
      }

      setStatus(`${added} ${added === 1 ? "image" : "images"} added`);
    } catch (caught) {
      setStatus(added > 0 ? `${added} of ${files.length} added` : null);
      setError(caught instanceof Error ? caught.message : "Upload failed.");
    } finally {
      input.value = "";
      setIsBusy(false);
      router.refresh();
    }
  }

  return (
    <div className={styles.uploader}>
      <label
        className={`${styles.submitButton} ${styles.fileButton} ${isBusy ? styles.fileButtonBusy : ""}`}
      >
        add images
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif,image/svg+xml"
          multiple
          disabled={isBusy}
          className={styles.fileInput}
          onChange={handleChange}
        />
      </label>
      {status ? <p className={styles.postDetails}>{status}</p> : null}
      {error ? <p className={styles.formError}>{error}</p> : null}
    </div>
  );
}
