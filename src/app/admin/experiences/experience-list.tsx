"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import type { ExperienceRecord } from "@/types/experience";
import { reorderExperiencesAction } from "../actions";
import DeleteExperienceButton from "./delete-experience-button";
import styles from "../admin.module.css";

type ExperienceListProps = {
  experiences: ExperienceRecord[];
};

export default function ExperienceList({ experiences: initial }: ExperienceListProps) {
  const [items, setItems] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const dragIndex = useRef<number | null>(null);
  const dragOverIndex = useRef<number | null>(null);

  const orderChanged =
    items.length > 0 &&
    items.some((item, i) => item.id !== initial[i]?.id);

  function handleDragStart(index: number) {
    dragIndex.current = index;
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (dragOverIndex.current === index) return;
    dragOverIndex.current = index;

    const from = dragIndex.current;
    if (from === null || from === index) return;

    setItems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(index, 0, moved);
      dragIndex.current = index;
      return next;
    });
  }

  function handleDragEnd() {
    dragIndex.current = null;
    dragOverIndex.current = null;
  }

  async function handleSaveOrder() {
    setSaving(true);
    setSaved(false);
    const ordering = items.map((item, index) => ({
      id: item.id,
      display_order: index,
    }));

    const formData = new FormData();
    formData.set("ordering", JSON.stringify(ordering));
    await reorderExperiencesAction(formData);

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (items.length === 0) {
    return <p className={styles.body}>no experiences yet</p>;
  }

  return (
    <>
      <div className={styles.postList}>
        {items.map((exp, index) => (
          <div
            key={exp.id}
            className={styles.dragRow}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
          >
            <span className={styles.dragHandle} aria-hidden="true">
              ⠿
            </span>
            <div className={styles.dragContent}>
              <div className={styles.postMeta}>
                <p className={styles.body}>
                  {exp.company} — {exp.role}
                </p>
                <p className={styles.postDetails}>
                  {exp.date_range} · {exp.status}
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
          </div>
        ))}
      </div>
      {orderChanged ? (
        <button
          type="button"
          className={styles.submitButton}
          onClick={handleSaveOrder}
          disabled={saving}
        >
          {saving ? "saving..." : "save order"}
        </button>
      ) : null}
      {saved ? <p className={styles.body}>order saved</p> : null}
    </>
  );
}
