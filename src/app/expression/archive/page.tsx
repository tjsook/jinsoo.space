import type { Metadata } from "next";
import { getArchiveFolders } from "@/lib/expression";
import SiteHeader from "../../site-header";
import ArchiveDesktop from "./archive-desktop";
import styles from "../expression.module.css";

// Served from the cache; the admin actions refresh it on every edit.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "archive | jinsoo.space",
  description: "folders of things worth keeping",
};

export default async function ArchivePage() {
  const { folders, isSample } = await getArchiveFolders();

  return (
    <main className={styles.archivePage}>
      <SiteHeader />
      <ArchiveDesktop folders={folders} isSample={isSample} />
    </main>
  );
}
