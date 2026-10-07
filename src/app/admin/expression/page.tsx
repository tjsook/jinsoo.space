import Link from "next/link";
import { getExpressionFolders } from "@/lib/expression";
import type { ExpressionFolder } from "@/types/expression";
import {
  createExpressionFolderAction,
  deleteExpressionFolderAction,
} from "./actions";
import ConfirmButton from "./confirm-button";
import styles from "../admin.module.css";

export const dynamic = "force-dynamic";

export default async function ExpressionFoldersPage() {
  let folders: ExpressionFolder[] = [];
  let setupError: string | null = null;

  try {
    folders = await getExpressionFolders();
  } catch (caught) {
    setupError = caught instanceof Error ? caught.message : "Unknown error.";
  }

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.title}>expression</h1>

        {setupError ? (
          <>
            <p className={styles.body}>
              The archive tables are not in the database yet. Run the
              expression section of supabase/schema.sql in the Supabase SQL
              editor, then reload this page.
            </p>
            <p className={styles.formError}>{setupError}</p>
          </>
        ) : (
          <>
            <form
              action={createExpressionFolderAction}
              className={styles.inlineForm}
            >
              <input
                name="name"
                type="text"
                placeholder="new folder name"
                required
                className={styles.input}
              />
              <button type="submit" className={styles.submitButton}>
                create folder
              </button>
            </form>

            <div className={styles.postList}>
              {folders.length === 0 ? (
                <p className={styles.body}>no folders yet</p>
              ) : (
                folders.map((folder) => (
                  <div key={folder.id} className={styles.postRow}>
                    <div className={styles.postMeta}>
                      <p className={styles.body}>{folder.name}</p>
                      <p className={styles.postDetails}>
                        {folder.images.length}{" "}
                        {folder.images.length === 1 ? "image" : "images"}
                      </p>
                    </div>
                    <div className={styles.postActions}>
                      <Link
                        href={`/admin/expression/${folder.id}`}
                        className={styles.inlineAction}
                      >
                        edit
                      </Link>
                      <ConfirmButton
                        label="delete"
                        dialogLabel={`Delete ${folder.name}`}
                        action={deleteExpressionFolderAction}
                        fields={{ id: folder.id }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
