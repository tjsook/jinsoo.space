import Link from "next/link";
import { getExpressionFolders, getExpressionSections } from "@/lib/expression";
import type { ExpressionFolder, ExpressionSection } from "@/types/expression";
import {
  createExpressionFolderAction,
  deleteExpressionFolderAction,
} from "./actions";
import ConfirmButton from "./confirm-button";
import SectionEditor from "./section-editor";
import styles from "../admin.module.css";

export const dynamic = "force-dynamic";

function SetupNotice({ error }: { error: string }) {
  return (
    <>
      <p className={styles.body}>
        Part of the expression setup is not in the database yet. Run the
        expression blocks at the end of supabase/schema.sql in the Supabase SQL
        editor, then reload this page.
      </p>
      <p className={styles.formError}>{error}</p>
    </>
  );
}

export default async function ExpressionFoldersPage() {
  // Each half loads on its own, so a table that is not set up yet only takes
  // its own half of the page down.
  const [folderResult, sectionResult] = await Promise.allSettled([
    getExpressionFolders(),
    getExpressionSections(),
  ]);
  const folders: ExpressionFolder[] =
    folderResult.status === "fulfilled" ? folderResult.value : [];
  const sections: ExpressionSection[] =
    sectionResult.status === "fulfilled" ? sectionResult.value : [];
  const setupError = (result: PromiseSettledResult<unknown>) =>
    result.status === "rejected"
      ? result.reason instanceof Error
        ? result.reason.message
        : "Unknown error."
      : null;
  const folderError = setupError(folderResult);
  const sectionError = setupError(sectionResult);

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.title}>expression</h1>

        {sectionError ? (
          <SetupNotice error={sectionError} />
        ) : (
          <SectionEditor sections={sections} />
        )}

        {folderError ? (
          <SetupNotice error={folderError} />
        ) : (
          <>
            <h2 className={styles.blockHeading}>archive folders</h2>
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
