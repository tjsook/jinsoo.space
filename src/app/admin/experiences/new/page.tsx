import { createExperienceAction } from "../../actions";
import ExperienceForm from "../experience-form";
import styles from "../../admin.module.css";

export const dynamic = "force-dynamic";

export default function NewExperiencePage() {
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.title}>add experience</h1>
        <ExperienceForm
          action={createExperienceAction}
          submitLabel="save experience"
        />
      </div>
    </main>
  );
}
