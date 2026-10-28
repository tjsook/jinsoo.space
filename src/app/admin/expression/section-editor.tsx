import type { ExpressionSection } from "@/types/expression";
import {
  createExpressionSectionAction,
  deleteExpressionSectionAction,
  updateExpressionSectionAction,
} from "./actions";
import ConfirmButton from "./confirm-button";
import styles from "../admin.module.css";

function SectionFields({ section }: { section?: ExpressionSection }) {
  return (
    <div className={styles.sectionFields}>
      <input
        name="label"
        type="text"
        placeholder="section name"
        defaultValue={section?.label}
        required
        className={styles.input}
      />
      <input
        name="note"
        type="text"
        placeholder="note, e.g. tbd or open"
        defaultValue={section?.note}
        className={styles.input}
      />
      <input
        name="href"
        type="text"
        placeholder="link (optional), e.g. /expression/archive"
        defaultValue={section?.href ?? ""}
        className={styles.input}
      />
      <input
        name="display_order"
        type="number"
        aria-label="order"
        title="order: lower comes first"
        defaultValue={section?.display_order ?? 0}
        className={`${styles.input} ${styles.orderInput}`}
      />
    </div>
  );
}

/** The rows of /expression: each one saves on its own. */
export default function SectionEditor({
  sections,
}: {
  sections: ExpressionSection[];
}) {
  const nextOrder =
    sections.reduce((top, section) => Math.max(top, section.display_order), -1) + 1;

  return (
    <div className={styles.sectionBlock}>
      <h2 className={styles.blockHeading}>sections</h2>

      <div className={styles.postList}>
        {sections.map((section) => (
          <div key={section.id} className={styles.sectionRow}>
            <form action={updateExpressionSectionAction} className={styles.sectionForm}>
              <input type="hidden" name="id" value={section.id} />
              <SectionFields section={section} />
              <button type="submit" className={styles.submitButton}>
                save
              </button>
            </form>
            <ConfirmButton
              label="delete"
              dialogLabel={`Delete ${section.label}`}
              action={deleteExpressionSectionAction}
              fields={{ id: section.id }}
            />
          </div>
        ))}
      </div>

      <form
        key={nextOrder}
        action={createExpressionSectionAction}
        className={styles.sectionForm}
      >
        <SectionFields
          section={{ id: "", label: "", note: "", href: null, display_order: nextOrder }}
        />
        <button type="submit" className={styles.submitButton}>
          add section
        </button>
      </form>
    </div>
  );
}
