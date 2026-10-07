"use client";

import { useState } from "react";
import styles from "../admin.module.css";

type ConfirmButtonProps = {
  label: string;
  /** What the dialog is confirming, for screen readers. */
  dialogLabel: string;
  action: (formData: FormData) => void | Promise<void>;
  fields: Record<string, string>;
};

/** A destructive action behind the console's "are you sure?" step. */
export default function ConfirmButton({
  label,
  dialogLabel,
  action,
  fields,
}: ConfirmButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={styles.inlineAction}
        onClick={() => setIsOpen(true)}
      >
        {label}
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
            aria-label={dialogLabel}
            onClick={(event) => event.stopPropagation()}
          >
            <form
              action={action}
              className={styles.confirmForm}
              onSubmit={() => setIsOpen(false)}
            >
              {Object.entries(fields).map(([name, value]) => (
                <input key={name} type="hidden" name={name} value={value} />
              ))}
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
