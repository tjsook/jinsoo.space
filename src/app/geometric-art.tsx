"use client";

import styles from "./section.module.css";

type Shape = {
  type: "square" | "triangle";
  x: number;
  y: number;
  size: number;
  rotation: number;
  opacity: number;
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

function generateShapes(seed: string): Shape[] {
  const rand = seededRandom(hashString(seed));
  const shapes: Shape[] = [];
  const count = 12 + Math.floor(rand() * 8);

  for (let i = 0; i < count; i++) {
    const isTriangle = rand() > 0.45;
    shapes.push({
      type: isTriangle ? "triangle" : "square",
      x: rand() * 200,
      y: 40 + rand() * 700,
      size: 16 + rand() * 32,
      rotation: Math.floor(rand() * 4) * 45,
      opacity: 0.025 + rand() * 0.035,
    });
  }

  return shapes;
}

function renderShape(shape: Shape, index: number) {
  const { type, x, y, size, rotation, opacity } = shape;
  const transform = `translate(${x}, ${y}) rotate(${rotation}, ${size / 2}, ${size / 2})`;

  if (type === "square") {
    return (
      <rect
        key={index}
        x={0}
        y={0}
        width={size}
        height={size}
        transform={transform}
        fill="none"
        stroke="rgba(100, 136, 255, 1)"
        strokeWidth={0.5}
        opacity={opacity}
      />
    );
  }

  const half = size / 2;
  const points = `${half},0 ${size},${size} 0,${size}`;
  return (
    <polygon
      key={index}
      points={points}
      transform={transform}
      fill="none"
      stroke="rgba(100, 136, 255, 1)"
      strokeWidth={0.5}
      opacity={opacity}
    />
  );
}

type GeometricArtProps = {
  seed: string;
};

export default function GeometricArt({ seed }: GeometricArtProps) {
  const shapes = generateShapes(seed);

  return (
    <div className={styles.geometricArt} aria-hidden="true">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 200 800"
        preserveAspectRatio="xMidYMid slice"
        style={{ overflow: "visible" }}
      >
        {shapes.map((shape, i) => renderShape(shape, i))}
      </svg>
    </div>
  );
}
