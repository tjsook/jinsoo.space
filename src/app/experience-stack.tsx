"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, MouseEvent as ReactMouseEvent } from "react";
import type { ExperienceRecord } from "@/types/experience";
import styles from "./page.module.css";

const TAB_HEIGHT = 40;
const TAB_OVERLAP = 8;
const FRONT_GAP = 6;
const TAB_STEP = TAB_HEIGHT - TAB_OVERLAP;

// Dealing a card runs in two beats: slide it out from under the stack, then
// lift it over the top and lay it down.
const PULL_DISTANCE = 14;
const PULL_MS = 170;
const LAY_MS = 400;

const useMeasureEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

type Deal = { id: string; phase: "out" | "lay" };

export default function ExperienceStack({
  items,
}: {
  items: ExperienceRecord[];
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [slotHeight, setSlotHeight] = useState<number | null>(null);
  const [deal, setDeal] = useState<Deal | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sizerRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  const order = useMemo(() => {
    if (!activeId) return items;
    const active = items.find((item) => item.id === activeId);
    if (!active) return items;
    return [active, ...items.filter((item) => item.id !== activeId)];
  }, [items, activeId]);

  useMeasureEffect(() => {
    const sizer = sizerRef.current;
    if (!sizer) return;
    const measure = () => setSlotHeight(sizer.offsetHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(sizer);
    return () => observer.disconnect();
  }, []);

  function clearTimers() {
    for (const timer of timers.current) window.clearTimeout(timer);
    timers.current = [];
  }

  function dealToTop(nextActiveId: string | null) {
    const incomingId = nextActiveId ?? items[0].id;
    if (order[0].id === incomingId) return;

    clearTimers();
    setDeal({ id: incomingId, phase: "out" });
    timers.current.push(
      window.setTimeout(() => {
        setActiveId(nextActiveId);
        setDeal({ id: incomingId, phase: "lay" });
        timers.current.push(
          window.setTimeout(() => setDeal(null), LAY_MS),
        );
      }, PULL_MS),
    );
  }

  // Keep the newest closure reachable from listeners registered once.
  const dealToTopRef = useRef(dealToTop);
  useEffect(() => {
    dealToTopRef.current = dealToTop;
  });

  useEffect(() => clearTimers, []);

  // pointerdown, not click: React flushes the click update synchronously, so by
  // the time a click listener runs the clicked node may already be unmounted and
  // contains() would report it as an outside click.
  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        dealToTopRef.current(null);
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  function handleContainerClick(event: ReactMouseEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;
    // The front card's face is a link. Let the browser open it instead of
    // reshuffling the stack under the click.
    if (target.closest("a")) return;

    const cardEl = target.closest<HTMLElement>("[data-exp-id]");
    if (!cardEl) return;
    const id = cardEl.dataset.expId;
    if (!id) return;
    const rank = order.findIndex((item) => item.id === id);
    dealToTop(rank > 0 ? id : null);
  }

  const tabCount = order.length - 1;
  // Reserved below the front card for the tabs. Depends only on how many cards
  // are in the group, so shuffling never resizes the stack or its row.
  const tabReserve =
    FRONT_GAP - TAB_OVERLAP + (tabCount - 1) * TAB_STEP + TAB_HEIGHT;

  const tabOffset = (rank: number) =>
    (slotHeight ?? 0) - TAB_OVERLAP + FRONT_GAP + (rank - 1) * TAB_STEP;

  return (
    <div
      ref={containerRef}
      className={styles.experienceStack}
      onClick={handleContainerClick}
      style={{ paddingBottom: tabReserve }}
    >
      {/* Every card in the group, hidden and stacked into a single grid cell, so
          the stack always reserves the height of the tallest one. */}
      <div
        ref={sizerRef}
        className={styles.experienceStackSizer}
        aria-hidden="true"
      >
        {items.map((exp) => (
          <div key={exp.id} className={styles.experienceStackSizerCard}>
            <CardFace exp={exp} />
          </div>
        ))}
      </div>

      <span className={styles.experienceStackCount}>×{order.length}</span>

      {/* Rendered in a fixed order and stacked purely with transform/z-index.
          Reordering these nodes would move them in the DOM, which drops their
          in-flight transitions mid-shuffle. */}
      {items.map((exp) => {
        const rank = order.findIndex((item) => item.id === exp.id);
        const isFront = rank === 0;
        if (!isFront && slotHeight === null) return null;

        const isDealt = deal?.id === exp.id;
        // Only the card on top opens its link; a tab click just deals it up.
        const isLinked = isFront && Boolean(exp.link);
        const isPullingOut = isDealt && deal.phase === "out";
        // The card being covered holds its place until the dealt card is on top
        // of it, then slips underneath into the tab slot.
        const coveredDelay = deal?.phase === "lay" && !isDealt ? LAY_MS * 0.45 : 0;

        let style: CSSProperties;
        if (isPullingOut) {
          // Drawn out from under the stack: squares up to full width and slides
          // clear, still sitting below the card on top.
          style = {
            transform: `translate(0px, ${tabOffset(rank) + PULL_DISTANCE}px) rotate(1.2deg)`,
            width: "100%",
            height: TAB_HEIGHT,
            zIndex: 40 - rank,
            transitionDuration: `${PULL_MS}ms`,
            transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0.35, 1)",
          };
        } else if (isFront) {
          style = {
            transform: "translate(0px, 0px)",
            width: "100%",
            height: slotHeight ?? "auto",
            zIndex: 50,
            transitionDuration: `${LAY_MS}ms`,
          };
        } else {
          style = {
            transform: `translate(${rank * 7}px, ${tabOffset(rank)}px)`,
            width: `calc(100% - ${rank * 14}px)`,
            height: TAB_HEIGHT,
            zIndex: 40 - rank,
            transitionDuration: `${LAY_MS}ms`,
            transitionDelay: `${coveredDelay}ms`,
          };
        }

        return (
          <div
            key={exp.id}
            data-exp-id={exp.id}
            className={[
              styles.experienceStackCard,
              isFront
                ? styles.experienceStackCardFront
                : styles.experienceStackCardTab,
              isLinked ? styles.experienceStackCardLinked : "",
              slotHeight === null ? "" : styles.experienceStackCardReady,
              isDealt ? styles.experienceStackCardLifted : "",
            ]
              .filter(Boolean)
              .join(" ")}
            style={style}
          >
            {/* The element type stays the same whether or not the card is on
                top, so a deal never remounts the face and drops its fade. */}
            {exp.link ? (
              <a
                href={exp.link}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={isFront ? undefined : -1}
                aria-hidden={!isFront}
                className={`${styles.experienceStackFace} ${styles.experienceStackFaceLink}`}
                style={{
                  opacity: isFront ? 1 : 0,
                  pointerEvents: isFront ? "auto" : "none",
                  transitionDelay: `${coveredDelay}ms`,
                }}
              >
                <CardFace exp={exp} />
              </a>
            ) : (
              <div
                className={styles.experienceStackFace}
                aria-hidden={!isFront}
                style={{
                  opacity: isFront ? 1 : 0,
                  pointerEvents: isFront ? "auto" : "none",
                  transitionDelay: `${coveredDelay}ms`,
                }}
              >
                <CardFace exp={exp} />
              </div>
            )}
            <div
              className={styles.experienceStackTabFace}
              aria-hidden={isFront}
              style={{
                height: TAB_HEIGHT,
                opacity: isFront ? 0 : 1,
                pointerEvents: isFront ? "none" : "auto",
                transitionDelay: `${coveredDelay}ms`,
              }}
            >
              <span className={styles.experienceStackPeekRole}>{exp.role}</span>
              <span className={styles.experienceStackPeekDate}>
                {exp.date_range}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CardFace({ exp }: { exp: ExperienceRecord }) {
  return (
    <>
      <div className={styles.experienceCompany}>{exp.company}</div>
      <div className={styles.experienceDate}>{exp.date_range}</div>
      <div className={styles.experienceRole}>{exp.role}</div>
      <div className={styles.experienceDescription}>{exp.description}</div>
    </>
  );
}
