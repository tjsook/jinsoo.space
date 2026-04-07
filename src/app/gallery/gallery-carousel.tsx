"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "../section.module.css";

const HOLD_SCROLL_SPEED = 0.7;
const INITIAL_SCROLL_STEP = 12;

export default function GalleryCarousel({
  folder,
  images,
}: {
  folder: string;
  images: string[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const holdDirectionRef = useRef<-1 | 1 | 0>(0);
  const lastTimestampRef = useRef<number | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(images.length > 1);

  function updateButtonState() {
    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    const maxScrollLeft = viewport.scrollWidth - viewport.clientWidth;

    setCanScrollLeft(viewport.scrollLeft > 1);
    setCanScrollRight(viewport.scrollLeft < maxScrollLeft - 1);
  }

  useEffect(() => {
    updateButtonState();

    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    const handleScroll = () => updateButtonState();
    const handleResize = () => updateButtonState();

    viewport.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      viewport.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [images.length]);

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  function stopHold() {
    holdDirectionRef.current = 0;
    lastTimestampRef.current = null;

    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  }

  function stepScroll(timestamp: number) {
    const viewport = viewportRef.current;

    if (!viewport || holdDirectionRef.current === 0) {
      frameRef.current = null;
      return;
    }

    if (lastTimestampRef.current === null) {
      lastTimestampRef.current = timestamp;
    }

    const delta = timestamp - lastTimestampRef.current;
    lastTimestampRef.current = timestamp;

    viewport.scrollLeft += holdDirectionRef.current * delta * HOLD_SCROLL_SPEED;
    updateButtonState();

    const maxScrollLeft = viewport.scrollWidth - viewport.clientWidth;

    if (
      viewport.scrollLeft <= 0 ||
      viewport.scrollLeft >= maxScrollLeft
    ) {
      stopHold();
      return;
    }

    frameRef.current = requestAnimationFrame(stepScroll);
  }

  function startHold(direction: -1 | 1) {
    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    const maxScrollLeft = viewport.scrollWidth - viewport.clientWidth;

    if (
      (direction === -1 && viewport.scrollLeft <= 0) ||
      (direction === 1 && viewport.scrollLeft >= maxScrollLeft)
    ) {
      return;
    }

    viewport.scrollLeft += direction * INITIAL_SCROLL_STEP;
    updateButtonState();

    holdDirectionRef.current = direction;
    lastTimestampRef.current = null;

    if (frameRef.current === null) {
      frameRef.current = requestAnimationFrame(stepScroll);
    }
  }

  return (
    <section className={styles.galleryEntry}>
      <div className={styles.galleryHeader}>
        <p className={styles.body}>{folder}</p>
        <button
          type="button"
          className={styles.galleryToggle}
          onClick={() => {
            stopHold();
            setIsOpen((current) => !current);
          }}
          aria-label={isOpen ? "Hide folder images" : "Show folder images"}
          aria-expanded={isOpen}
        >
          {isOpen ? "-" : "+"}
        </button>
      </div>
      {isOpen ? (
        <div className={styles.galleryViewer}>
        <button
          type="button"
          className={styles.galleryButton}
          onMouseDown={(event) => {
            event.preventDefault();
            startHold(-1);
          }}
          onMouseUp={stopHold}
          onMouseLeave={stopHold}
          onTouchStart={() => startHold(-1)}
          onTouchEnd={stopHold}
          onTouchCancel={stopHold}
          disabled={!canScrollLeft}
          aria-label="Previous image"
        >
          {"<"}
        </button>
        <div className={styles.galleryViewportShell}>
          <div ref={viewportRef} className={styles.galleryViewport}>
            <div className={styles.galleryTrack}>
              {images.map((image, index) => (
                <div key={image} className={styles.galleryImageFrame}>
                  <Image
                    src={image}
                    alt={`${folder} image ${index + 1}`}
                    width={1200}
                    height={1200}
                    className={styles.galleryImage}
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </div>
          <div className={styles.galleryViewportOverlay} aria-hidden="true" />
        </div>
        <button
          type="button"
          className={styles.galleryButton}
          onMouseDown={(event) => {
            event.preventDefault();
            startHold(1);
          }}
          onMouseUp={stopHold}
          onMouseLeave={stopHold}
          onTouchStart={() => startHold(1)}
          onTouchEnd={stopHold}
          onTouchCancel={stopHold}
          disabled={!canScrollRight}
          aria-label="Next image"
        >
          {">"}
        </button>
        </div>
      ) : null}
    </section>
  );
}
