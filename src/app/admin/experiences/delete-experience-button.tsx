"use client";

import { useState } from "react";
import { deleteExperienceAction } from "../actions";
import styles from "../admin.module.css";

export default function DeleteExperienceButton({ id }: { id: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={styles.inlineAction}
        onClick={() => setIsOpen(true)}
      >
        delete
      </button>
      {isOpen ? (
        <div
          className={styles.modalOverlay}
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        >
          <div
            className={styles.confirmModal}
            role="dialog"
            aria-modal="true"
            aria-label="Delete experience"
            onClick={(event) => event.stopPropagation()}
          >
            <form action={deleteExperienceAction} className={styles.confirmForm}>
              <input type="hidden" name="id" value={id} />
              <button type="submit" className={styles.confirmButton}>
                are you sure?
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
