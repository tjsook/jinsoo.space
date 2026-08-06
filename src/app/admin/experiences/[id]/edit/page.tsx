import { getExperienceById } from "@/lib/experiences";
import { updateExperienceAction } from "../../../actions";
import ExperienceForm from "../../experience-form";
import styles from "../../../admin.module.css";

export const dynamic = "force-dynamic";

export default async function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const experience = await getExperienceById(id);

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.title}>edit experience</h1>
        <ExperienceForm
          action={updateExperienceAction}
          defaultValues={experience}
          submitLabel="save changes"
        />
      </div>
    </main>
  );
}
