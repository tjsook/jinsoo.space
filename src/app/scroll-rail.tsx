"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

const SECTIONS = [
  { id: "experience", label: "experience" },
  { id: "who", label: "who i am" },
  { id: "activity", label: "activity" },
];

/**
 * A hairline of read progress across the top of the window, plus a fixed index
 * of the page's sections down the left edge. The index hides itself on narrow
 * screens, where the gutter it lives in does not exist.
 */
export default function ScrollRail() {
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    let frame = 0;

    function measure() {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? window.scrollY / scrollable : 0);
      frame = 0;
    }

    function handleScroll() {
      if (frame) return;
      frame = window.requestAnimationFrame(measure);
    }

    measure();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        // The section covering the middle of the window wins, so the index
        // never flickers between two that are both partly on screen.
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    for (const section of SECTIONS) {
      const node = document.getElementById(section.id);
      if (node) observer.observe(node);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className={styles.progressTrack} aria-hidden="true">
        <span
          className={styles.progressBar}
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      <nav className={styles.rail} aria-label="Sections">
        {SECTIONS.map((section, index) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className={[
              styles.railItem,
              activeId === section.id ? styles.railItemActive : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <span className={styles.railIndex}>{index + 1}</span>
            <span className={styles.railLabel}>{section.label}</span>
          </a>
        ))}
      </nav>
    </>
  );
}
