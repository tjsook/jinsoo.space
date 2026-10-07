"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { scatter, scatterApart, type Point, type Size } from "@/lib/scatter";
import type { ExpressionFolder } from "@/types/expression";
import styles from "../expression.module.css";

type ArchiveDesktopProps = {
  folders: ExpressionFolder[];
  isSample: boolean;
};

type ImageLayout = Point & Size & { rotate: number; z: number };

type OpenWindow = Point &
  Size & {
    folderId: string;
    z: number;
    /** The scrollable canvas the images sit on; taller than the window if full. */
    canvas: Size;
    images: Record<string, ImageLayout>;
    topImageZ: number;
  };

const ICON: Size = { width: 104, height: 116 };
const WINDOW_BAR = 36;
const CANVAS_PADDING = 16;
const COMPACT_WIDTH = 640;
/** Share of a window's canvas its images may cover before it grows. */
const MAX_FILL = 0.34;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), Math.max(min, max));

const between = (min: number, max: number) => min + Math.random() * (max - min);

/** Follows one pointer from press to release; a small wobble is still a click. */
function trackDrag(
  event: React.PointerEvent,
  onMove: (dx: number, dy: number) => void,
  onEnd?: (moved: boolean) => void,
) {
  if (event.button !== 0) return;

  const startX = event.clientX;
  const startY = event.clientY;
  let moved = false;

  const move = (next: PointerEvent) => {
    const dx = next.clientX - startX;
    const dy = next.clientY - startY;

    if (!moved && Math.hypot(dx, dy) < 4) return;

    moved = true;
    onMove(dx, dy);
  };

  const end = () => {
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", end);
    window.removeEventListener("pointercancel", end);
    onEnd?.(moved);
  };

  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", end);
  window.addEventListener("pointercancel", end);
}

/** Fresh random spots for the folder icons; icons never sit on each other. */
function scatterFolders(folders: ExpressionFolder[], desktop: Size) {
  const points = scatterApart(folders.length, ICON, desktop);

  return Object.fromEntries(
    folders.map((folder, index) => [folder.id, points[index]]),
  );
}

/** A new window for a folder, with its images thrown across it at random. */
function createWindow(
  folder: ExpressionFolder,
  desktop: Size,
  z: number,
): OpenWindow {
  const compact = desktop.width < COMPACT_WIDTH;
  const width = compact ? desktop.width : Math.min(desktop.width - 32, 1120);
  const height = compact ? desktop.height : Math.min(desktop.height - 32, 760);
  const x = compact
    ? 0
    : clamp((desktop.width - width) / 2 + between(-60, 60), 0, desktop.width - width);
  const y = compact
    ? 0
    : clamp((desktop.height - height) / 2 + between(-40, 40), 0, desktop.height - height);

  const innerWidth = width - CANVAS_PADDING * 2;
  const visibleHeight = height - WINDOW_BAR - CANVAS_PADDING * 2;
  const shapes = folder.images.map((image) => {
    const side = between(0.8, 1.2);
    const scale = side / Math.max(image.width, image.height);

    return { width: image.width * scale, height: image.height * scale };
  });

  // Images may only overlap a little, so they may only fill part of the
  // canvas. They shrink to fit what is visible, down to a floor; past that
  // the canvas grows taller and the window scrolls.
  const shapeArea = shapes.reduce((sum, shape) => sum + shape.width * shape.height, 0);
  const roomy = Math.sqrt((MAX_FILL * innerWidth * visibleHeight) / (shapeArea || 1));
  const longest = clamp(roomy, compact ? 110 : 150, clamp(innerWidth * 0.3, 120, 300));
  const sizes = shapes.map((shape) => ({
    width: shape.width * longest,
    height: shape.height * longest,
  }));
  const innerHeight = Math.max(
    visibleHeight,
    (shapeArea * longest * longest) / (MAX_FILL * innerWidth),
  );
  const points = scatter(
    sizes,
    { width: innerWidth, height: innerHeight },
    { maxPairOverlap: 0.35, maxTotalOverlap: 0.6 },
  );

  return {
    folderId: folder.id,
    x,
    y,
    width,
    height,
    z,
    canvas: {
      width: innerWidth + CANVAS_PADDING * 2,
      height: innerHeight + CANVAS_PADDING * 2,
    },
    images: Object.fromEntries(
      folder.images.map((image, index) => [
        image.id,
        {
          x: points[index].x + CANVAS_PADDING,
          y: points[index].y + CANVAS_PADDING,
          ...sizes[index],
          rotate: between(-5, 5),
          z: index + 1,
        },
      ]),
    ),
    topImageZ: folder.images.length,
  };
}

/**
 * The archive as a small desktop. Folders land somewhere new on every visit
 * and can be dragged anywhere; opening one puts its images in a window, also
 * scattered fresh each time and also free to move.
 */
export default function ArchiveDesktop({ folders, isSample }: ArchiveDesktopProps) {
  const desktopRef = useRef<HTMLDivElement>(null);
  // Windows always sit above the folder icons.
  const topZ = useRef(1000);
  const topFolderZ = useRef(1);
  const dragged = useRef(false);
  const [desktop, setDesktop] = useState<Size | null>(null);
  const [positions, setPositions] = useState<Record<string, Point> | null>(null);
  const [folderOrder, setFolderOrder] = useState<Record<string, number>>({});
  const [windows, setWindows] = useState<OpenWindow[]>([]);

  useEffect(() => {
    const node = desktopRef.current;
    if (!node) return;

    const observer = new ResizeObserver(() => {
      const size = { width: node.clientWidth, height: node.clientHeight };

      setDesktop(size);
      // The first measurement scatters the folders; later ones only keep
      // everything on screen.
      setPositions((current) =>
        current
          ? Object.fromEntries(
              Object.entries(current).map(([id, point]) => [
                id,
                {
                  x: clamp(point.x, 0, size.width - ICON.width),
                  y: clamp(point.y, 0, size.height - ICON.height),
                },
              ]),
            )
          : scatterFolders(folders, size),
      );
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, [folders]);

  useEffect(() => {
    function closeTopWindow(event: KeyboardEvent) {
      if (event.key !== "Escape") return;

      setWindows((current) => {
        const top = Math.max(...current.map((open) => open.z));
        return current.filter((open) => open.z !== top);
      });
    }

    window.addEventListener("keydown", closeTopWindow);
    return () => window.removeEventListener("keydown", closeTopWindow);
  }, []);

  function nextZ() {
    topZ.current += 1;
    return topZ.current;
  }

  function updateWindow(folderId: string, change: (open: OpenWindow) => OpenWindow) {
    setWindows((current) =>
      current.map((open) => (open.folderId === folderId ? change(open) : open)),
    );
  }

  function raiseWindow(folderId: string) {
    const z = nextZ();
    updateWindow(folderId, (open) => ({ ...open, z }));
  }

  function openFolder(folder: ExpressionFolder) {
    if (!desktop) return;

    if (windows.some((open) => open.folderId === folder.id)) {
      raiseWindow(folder.id);
      return;
    }

    setWindows((current) => [...current, createWindow(folder, desktop, nextZ())]);
  }

  function dragFolder(event: React.PointerEvent, folderId: string) {
    const origin = positions?.[folderId];
    if (!desktop || !origin) return;

    topFolderZ.current += 1;
    const z = topFolderZ.current;
    setFolderOrder((current) => ({ ...current, [folderId]: z }));

    trackDrag(
      event,
      (dx, dy) => {
        setPositions((current) => ({
          ...current,
          [folderId]: {
            x: clamp(origin.x + dx, 0, desktop.width - ICON.width),
            y: clamp(origin.y + dy, 0, desktop.height - ICON.height),
          },
        }));
      },
      (moved) => {
        // The click that ends a drag must not open the folder.
        dragged.current = moved;
      },
    );
  }

  function dragWindow(event: React.PointerEvent, open: OpenWindow) {
    if (!desktop) return;

    trackDrag(event, (dx, dy) => {
      updateWindow(open.folderId, (current) => ({
        ...current,
        x: clamp(open.x + dx, 80 - open.width, desktop.width - 80),
        y: clamp(open.y + dy, 0, desktop.height - WINDOW_BAR),
      }));
    });
  }

  function dragImage(event: React.PointerEvent, open: OpenWindow, imageId: string) {
    const origin = open.images[imageId];
    const z = open.topImageZ + 1;

    updateWindow(open.folderId, (current) => ({
      ...current,
      topImageZ: z,
      images: { ...current.images, [imageId]: { ...current.images[imageId], z } },
    }));

    trackDrag(event, (dx, dy) => {
      updateWindow(open.folderId, (current) => ({
        ...current,
        images: {
          ...current.images,
          [imageId]: {
            ...current.images[imageId],
            x: clamp(origin.x + dx, 0, current.canvas.width - origin.width),
            y: clamp(origin.y + dy, 0, current.canvas.height - origin.height),
          },
        },
      }));
    });
  }

  return (
    <div className={styles.desktopFrame}>
      <div className={styles.menuBar}>
        <Link href="/expression" className={styles.menuLink}>
          <span aria-hidden="true">← </span>expression
        </Link>
        <span className={styles.menuTitle}>archive</span>
        <span className={styles.menuMeta}>
          {folders.length} {folders.length === 1 ? "folder" : "folders"}
        </span>
      </div>

      <div ref={desktopRef} className={styles.desktop}>
        {folders.length === 0 ? (
          <p className={styles.desktopEmpty}>nothing archived yet</p>
        ) : null}

        {positions
          ? folders.map((folder) => {
              const point = positions[folder.id];
              if (!point) return null;

              return (
                <button
                  key={folder.id}
                  type="button"
                  className={styles.folder}
                  style={{
                    left: point.x,
                    top: point.y,
                    zIndex: folderOrder[folder.id] ?? 1,
                  }}
                  onPointerDown={(event) => dragFolder(event, folder.id)}
                  onClick={() => {
                    if (dragged.current) {
                      dragged.current = false;
                      return;
                    }

                    openFolder(folder);
                  }}
                >
                  <span className={styles.folderIcon} aria-hidden="true" />
                  <span className={styles.folderName}>{folder.name}</span>
                </button>
              );
            })
          : null}

        {windows.map((open) => {
          const folder = folders.find((item) => item.id === open.folderId);
          if (!folder) return null;

          return (
            <section
              key={open.folderId}
              className={styles.window}
              style={{
                left: open.x,
                top: open.y,
                width: open.width,
                height: open.height,
                zIndex: open.z,
              }}
              aria-label={`${folder.name} folder`}
              onPointerDown={() => raiseWindow(open.folderId)}
            >
              <header
                className={styles.windowBar}
                onPointerDown={(event) => dragWindow(event, open)}
              >
                <button
                  type="button"
                  className={styles.windowClose}
                  aria-label={`Close ${folder.name}`}
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={() =>
                    setWindows((current) =>
                      current.filter((item) => item.folderId !== open.folderId),
                    )
                  }
                >
                  ×
                </button>
                <span className={styles.windowName}>{folder.name}</span>
                <span className={styles.windowMeta}>
                  {folder.images.length}{" "}
                  {folder.images.length === 1 ? "image" : "images"}
                </span>
              </header>

              <div className={styles.windowBody}>
                {folder.images.length === 0 ? (
                  <p className={styles.windowEmpty}>nothing in here yet</p>
                ) : (
                  <div
                    className={styles.canvas}
                    style={{ width: open.canvas.width, height: open.canvas.height }}
                  >
                    {folder.images.map((image) => {
                      const layout = open.images[image.id];
                      if (!layout) return null;

                      return (
                        <div
                          key={image.id}
                          className={styles.photo}
                          style={{
                            left: layout.x,
                            top: layout.y,
                            width: layout.width,
                            height: layout.height,
                            zIndex: layout.z,
                            transform: `rotate(${layout.rotate}deg)`,
                          }}
                          onPointerDown={(event) => dragImage(event, open, image.id)}
                        >
                          <Image
                            src={image.url}
                            alt=""
                            width={image.width}
                            height={image.height}
                            sizes="320px"
                            draggable={false}
                            unoptimized={image.url.endsWith(".svg")}
                            className={styles.photoImage}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>
          );
        })}

        {isSample ? (
          <span className={styles.sampleNote}>sample folders · dev only</span>
        ) : null}
      </div>
    </div>
  );
}
