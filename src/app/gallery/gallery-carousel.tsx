"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "../section.module.css";

export default function GalleryCarousel({
  folder,
  images,
}: {
  folder: string;
  images: string[];
}) {
  const [index, setIndex] = useState(0);
  const currentImage = images[index];

  return (
    <section className={styles.galleryEntry}>
      <p className={styles.body}>{folder}</p>
      <div className={styles.galleryViewer}>
        <button
          type="button"
          className={styles.galleryButton}
          onClick={() => setIndex((current) => Math.max(current - 1, 0))}
          disabled={index === 0}
          aria-label="Previous image"
        >
          {"<"}
        </button>
        <div className={styles.galleryImageFrame}>
          <Image
            src={currentImage}
            alt={`${folder} image ${index + 1}`}
            width={1200}
            height={1200}
            className={styles.galleryImage}
            unoptimized
          />
        </div>
        <button
          type="button"
          className={styles.galleryButton}
          onClick={() =>
            setIndex((current) => Math.min(current + 1, images.length - 1))
          }
          disabled={index === images.length - 1}
          aria-label="Next image"
        >
          {">"}
        </button>
      </div>
    </section>
  );
}
