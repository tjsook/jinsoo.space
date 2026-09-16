"use client";

import { useState } from "react";
import styles from "../admin.module.css";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 12 }, (_, i) =>
  String(currentYear - 10 + i),
);

function parseDateRange(dateRange: string) {
  const ongoing = /current|ongoing|present/i.test(dateRange);
  const parts = dateRange.split(/\s*[—–-]\s*/);

  function extractMonthYear(part: string) {
    const trimmed = (part || "").trim();
    const monthMatch = MONTHS.find((m) =>
      trimmed.toLowerCase().startsWith(m.toLowerCase()),
    );
    const yearMatch = trimmed.match(/\d{4}/);
    return {
      month: monthMatch || "",
      year: yearMatch ? yearMatch[0] : "",
    };
  }

  const start = extractMonthYear(parts[0] || "");
  const end = ongoing ? { month: "", year: "" } : extractMonthYear(parts[1] || "");

  return { start, end, ongoing };
}

type ExperienceFormProps = {
  action: (formData: FormData) => void;
  defaultValues?: {
    id?: string;
    company?: string;
    role?: string;
    date_range?: string;
    description?: string;
    link?: string | null;
    display_order?: number;
    status?: string;
  };
  submitLabel: string;
};

export default function ExperienceForm({
  action,
  defaultValues = {},
  submitLabel,
}: ExperienceFormProps) {
  const parsed = parseDateRange(defaultValues.date_range || "");
  const [startMonth, setStartMonth] = useState(parsed.start.month);
  const [startYear, setStartYear] = useState(parsed.start.year);
  const [endMonth, setEndMonth] = useState(parsed.end.month);
  const [endYear, setEndYear] = useState(parsed.end.year);
  const [ongoing, setOngoing] = useState(parsed.ongoing);

  function composeDateRange() {
    const start = `${startMonth} ${startYear}`.trim();
    if (ongoing) return start ? `${start} — Current` : "Current";
    const end = `${endMonth} ${endYear}`.trim();
    if (!end) return start ? `${start} —` : "";
    return `${start} — ${end}`;
  }

  return (
    <form action={action} className={styles.form}>
      {defaultValues.id ? (
        <input type="hidden" name="id" value={defaultValues.id} />
      ) : null}
      <input type="hidden" name="date_range" value={composeDateRange()} />
      <input
        type="hidden"
        name="display_order"
        value={defaultValues.display_order ?? 0}
      />

      <input
        name="company"
        type="text"
        placeholder="company or org"
        defaultValue={defaultValues.company}
        className={styles.input}
      />
      <input
        name="role"
        type="text"
        placeholder="role"
        defaultValue={defaultValues.role}
        className={styles.input}
      />

      <div className={styles.dateRow}>
        <div className={styles.dateGroup}>
          <span className={styles.dateLabel}>from</span>
          <select
            value={startMonth}
            onChange={(e) => setStartMonth(e.target.value)}
            className={styles.input}
          >
            <option value="">month</option>
            {MONTHS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <select
            value={startYear}
            onChange={(e) => setStartYear(e.target.value)}
            className={styles.input}
          >
            <option value="">year</option>
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.dateGroup}>
          <span className={styles.dateLabel}>to</span>
          {ongoing ? (
            <span className={styles.dateCurrent}>current</span>
          ) : (
            <>
              <select
                value={endMonth}
                onChange={(e) => setEndMonth(e.target.value)}
                className={styles.input}
              >
                <option value="">month</option>
                {MONTHS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <select
                value={endYear}
                onChange={(e) => setEndYear(e.target.value)}
                className={styles.input}
              >
                <option value="">year</option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </>
          )}
          <label className={styles.ongoingLabel}>
            <input
              type="checkbox"
              checked={ongoing}
              onChange={(e) => setOngoing(e.target.checked)}
            />
            ongoing
          </label>
        </div>
      </div>

      <textarea
        name="description"
        placeholder="short description"
        rows={3}
        defaultValue={defaultValues.description}
        className={styles.textarea}
      />
      <input
        name="link"
        type="text"
        placeholder="link (optional) — opens when the card is clicked"
        defaultValue={defaultValues.link ?? ""}
        className={styles.input}
      />
      <select
        name="status"
        className={styles.input}
        defaultValue={defaultValues.status || "draft"}
      >
        <option value="draft">draft</option>
        <option value="published">published</option>
      </select>
      <button type="submit" className={styles.submitButton}>
        {submitLabel}
      </button>
    </form>
  );
}
