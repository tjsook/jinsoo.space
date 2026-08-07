"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./section.module.css";

const CELL = 48;
const COLS = 8;

type CellData = {
  row: number;
  col: number;
  opacity: number;
  strokeWidth: number;
};

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function generateShape(seed: string, rows: number): CellData[] {
  const rand = seededRandom(hashString(seed));
  const grid: boolean[][] = [];

  let center = 3 + rand() * (COLS - 6);
  let halfWidth = 2 + rand() * 2;

  for (let r = 0; r < rows; r++) {
    grid[r] = new Array(COLS).fill(false);

    center += (rand() - 0.5) * 1.2;
    center = Math.max(2, Math.min(COLS - 3, center));

    halfWidth += (rand() - 0.5) * 0.8;
    halfWidth = Math.max(1.5, Math.min(5, halfWidth));

    const left = Math.max(0, Math.floor(center - halfWidth));
    const right = Math.min(COLS - 1, Math.ceil(center + halfWidth));

    for (let c = left; c <= right; c++) {
      grid[r][c] = true;
    }
  }

  const cells: CellData[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < COLS; c++) {
      if (!grid[r][c]) continue;

      const above = r > 0 && grid[r - 1]?.[c];
      const below = r < rows - 1 && grid[r + 1]?.[c];
      const left = c > 0 && grid[r][c - 1];
      const right = c < COLS - 1 && grid[r][c + 1];
      const isEdge = !above || !below || !left || !right;

      if (isEdge && rand() < 0.3) continue;

      const thick = rand() < 0.15;
      cells.push({
        row: r,
        col: c,
        opacity: 0.15 + rand() * 0.2,
        strokeWidth: thick ? 1.5 + rand() * 1.5 : 0.5,
      });
    }
  }

  return cells;
}

type GeometricArtProps = {
  seed: string;
};

export default function GeometricArt({ seed }: GeometricArtProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!ref.current) return;
    const page = ref.current.closest("main");
    if (page) setHeight(page.scrollHeight);
  }, []);

  const extraRows = 3;
  const rows = Math.max(1, Math.floor(height / CELL)) + extraRows * 2;
  const cells = height > 0 ? generateShape(seed, rows) : [];
  const svgWidth = COLS * CELL;
  const svgHeight = rows * CELL;
  const offsetY = -extraRows * CELL;

  return (
    <div ref={ref} className={styles.geometricArt} aria-hidden="true">
      {height > 0 && (
        <svg
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{ marginTop: offsetY }}
        >
          {cells.map((cell) => {
            const x = cell.col * CELL;
            const y = cell.row * CELL;
            return (
              <rect
                key={`${cell.row}-${cell.col}`}
                x={x}
                y={y}
                width={CELL}
                height={CELL}
                fill="none"
                stroke={`rgba(100, 136, 255, ${cell.opacity})`}
                strokeWidth={cell.strokeWidth}
              />
            );
          })}
        </svg>
      )}
    </div>
  );
}
