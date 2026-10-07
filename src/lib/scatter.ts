/**
 * Random placement for the archive: folder icons on the desktop and images in
 * a window. Things may overlap, but never so far that one hides another.
 */

export type Size = { width: number; height: number };
export type Point = { x: number; y: number };

type ScatterOptions = {
  /** Most of the smaller item that any one neighbour may cover (0 to 1). */
  maxPairOverlap: number;
  /** Most of any item that all its neighbours together may cover (0 to 1). */
  maxTotalOverlap: number;
  /** Random positions tried per item before the least bad one is kept. */
  attempts?: number;
};

function overlapArea(a: Point & Size, b: Point & Size) {
  const width = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x);
  const height = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y);

  return width > 0 && height > 0 ? width * height : 0;
}

export function scatter(
  items: Size[],
  area: Size,
  { maxPairOverlap, maxTotalOverlap, attempts = 200 }: ScatterOptions,
): Point[] {
  const placed: (Point & Size)[] = [];
  // How much of each placed item is already under its neighbours.
  const covered: number[] = [];

  for (const item of items) {
    const rangeX = Math.max(area.width - item.width, 0);
    const rangeY = Math.max(area.height - item.height, 0);
    const itemArea = item.width * item.height;

    let best: { point: Point; overlaps: number[]; cost: number } | null = null;

    for (let attempt = 0; attempt < attempts; attempt += 1) {
      const point = { x: Math.random() * rangeX, y: Math.random() * rangeY };
      const candidate = { ...point, ...item };
      const overlaps = placed.map((other) => overlapArea(candidate, other));

      let ownCover = 0;
      let cost = 0;

      overlaps.forEach((overlap, index) => {
        if (overlap === 0) return;

        const other = placed[index];
        const otherArea = other.width * other.height;
        const pair = overlap / Math.min(itemArea, otherArea);
        const otherCover = covered[index] + overlap / otherArea;

        ownCover += overlap / itemArea;
        cost += Math.max(pair - maxPairOverlap, 0);
        cost += Math.max(otherCover - maxTotalOverlap, 0);
      });

      cost += Math.max(ownCover - maxTotalOverlap, 0);

      if (!best || cost < best.cost) best = { point, overlaps, cost };
      if (cost === 0) break;
    }

    const chosen = best!;

    chosen.overlaps.forEach((overlap, index) => {
      const other = placed[index];
      covered[index] += overlap / (other.width * other.height);
    });

    covered.push(
      chosen.overlaps.reduce((sum, overlap) => sum + overlap, 0) / itemArea,
    );
    placed.push({ ...chosen.point, ...item });
  }

  return placed.map(({ x, y }) => ({ x, y }));
}

/**
 * Random spots for equal-sized items that must not touch, such as folder
 * icons. Free placement is tried first; on a crowded surface the items take
 * shuffled cells of a grid instead, which cannot collide.
 */
export function scatterApart(count: number, item: Size, area: Size): Point[] {
  const items = Array.from({ length: count }, () => item);

  for (let round = 0; round < 3; round += 1) {
    const points = scatter(items, area, { maxPairOverlap: 0, maxTotalOverlap: 0 });
    const boxes = points.map((point) => ({ ...point, ...item }));
    const collides = boxes.some((box, index) =>
      boxes.slice(index + 1).some((other) => overlapArea(box, other) > 0),
    );

    if (!collides) return points;
  }

  const columns = Math.max(Math.floor(area.width / item.width), 1);
  const rows = Math.max(Math.ceil(count / columns), Math.floor(area.height / item.height), 1);
  const cellWidth = area.width / columns;
  const cellHeight = Math.max(area.height / rows, item.height);
  const cells = Array.from({ length: columns * rows }, (_, index) => index);

  for (let index = cells.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [cells[index], cells[swap]] = [cells[swap], cells[index]];
  }

  return cells.slice(0, count).map((cell) => ({
    x: (cell % columns) * cellWidth + Math.random() * (cellWidth - item.width),
    y:
      Math.floor(cell / columns) * cellHeight +
      Math.random() * Math.max(cellHeight - item.height, 0),
  }));
}
