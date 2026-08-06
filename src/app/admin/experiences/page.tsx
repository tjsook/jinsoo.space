import Link from "next/link";
import { getAllExperiences } from "@/lib/experiences";
import DeleteExperienceButton from "./delete-experience-button";
import styles from "../admin.module.css";

export const dynamic = "force-dynamic";

export default async function ViewExperiencesPage() {
  const experiences = await getAllExperiences();

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.title}>view experiences</h1>
        <div className={styles.postList}>
          {experiences.length === 0 ? (
            <p className={styles.body}>no experiences yet</p>
          ) : (
            experiences.map((exp) => (
              <div key={exp.id} className={styles.postRow}>
                <div className={styles.postMeta}>
                  <p className={styles.body}>
                    {exp.company} — {exp.role}
                  </p>
                  <p className={styles.postDetails}>
                    {exp.date_range} · order {exp.display_order} · {exp.status}
                  </p>
                </div>
                <div className={styles.postActions}>
                  <Link
                    href={`/admin/experiences/${exp.id}/edit`}
                    className={styles.inlineAction}
                  >
                    edit
                  </Link>
                  <DeleteExperienceButton id={exp.id} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
