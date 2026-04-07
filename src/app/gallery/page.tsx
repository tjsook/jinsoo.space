import { getGalleryEntries } from "@/lib/gallery";
import GalleryCarousel from "./gallery-carousel";
import styles from "../section.module.css";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const entries = await getGalleryEntries();

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.title}>gallery</h1>
        {entries.length === 0 ? (
          <p className={styles.body}>
            woah! where is everything?
          </p>
        ) : (
          entries.map((entry) => (
            <GalleryCarousel
              key={entry.folder}
              folder={entry.folder}
              images={entry.images}
            />
          ))
        )}
      </div>
    </main>
  );
}
