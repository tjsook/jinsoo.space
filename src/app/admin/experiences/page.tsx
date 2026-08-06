import Link from "next/link";
import { getAllExperiences } from "@/lib/experiences";
import ExperienceList from "./experience-list";
import styles from "../admin.module.css";

export const dynamic = "force-dynamic";

export default async function ViewExperiencesPage() {
  const experiences = await getAllExperiences();

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.title}>experiences</h1>
        <Link href="/admin/experiences/new" className={styles.actionLink}>
          + add new
        </Link>
        <ExperienceList experiences={experiences} />
      </div>
    </main>
  );
}
