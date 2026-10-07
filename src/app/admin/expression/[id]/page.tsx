import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getExpressionFolderById } from "@/lib/expression";
import {
  deleteExpressionImageAction,
  renameExpressionFolderAction,
} from "../actions";
import ConfirmButton from "../confirm-button";
import ImageUploader from "../image-uploader";
import styles from "../../admin.module.css";

export const dynamic = "force-dynamic";

export default async function EditExpressionFolderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const folder = await getExpressionFolderById(id);

  if (!folder) {
    notFound();
  }

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <Link href="/admin/expression" className={styles.inlineAction}>
          ← all folders
        </Link>
        <h1 className={styles.title}>edit folder</h1>

        <form action={renameExpressionFolderAction} className={styles.inlineForm}>
          <input type="hidden" name="id" value={folder.id} />
          <input
            name="name"
            type="text"
            placeholder="folder name"
            defaultValue={folder.name}
            required
            className={styles.input}
          />
          <button type="submit" className={styles.submitButton}>
            rename
          </button>
        </form>

        <ImageUploader folderId={folder.id} />

        {folder.images.length === 0 ? (
          <p className={styles.body}>no images in this folder yet</p>
        ) : (
          <div className={styles.thumbGrid}>
            {folder.images.map((image) => (
              <div key={image.id} className={styles.thumb}>
                <Image
                  src={image.url}
                  alt=""
                  width={image.width}
                  height={image.height}
                  sizes="200px"
                  unoptimized={image.url.endsWith(".svg")}
                  className={styles.thumbImage}
                />
                <ConfirmButton
                  label="remove"
                  dialogLabel="Remove image"
                  action={deleteExpressionImageAction}
                  fields={{ id: image.id, folder_id: folder.id }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
