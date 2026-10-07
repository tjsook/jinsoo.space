import type { ExpressionFolder } from "@/types/expression";

/**
 * Throwaway folders for looking at the archive in development, before any
 * real folder exists. Never served in production.
 */
export const SAMPLE_FOLDERS: ExpressionFolder[] = [
  {
    id: "sample-film",
    name: "film",
    images: [
      { id: "sample-film-01", url: "/expression-samples/film-01.svg", width: 1600, height: 900 },
      { id: "sample-film-02", url: "/expression-samples/film-02.svg", width: 1400, height: 1000 },
      { id: "sample-film-03", url: "/expression-samples/film-03.svg", width: 1600, height: 900 },
      { id: "sample-film-04", url: "/expression-samples/film-04.svg", width: 1400, height: 1000 },
      { id: "sample-film-05", url: "/expression-samples/film-05.svg", width: 1600, height: 900 },
      { id: "sample-film-06", url: "/expression-samples/film-06.svg", width: 1400, height: 1000 },
    ],
  },
  {
    id: "sample-sketches",
    name: "sketches",
    images: [
      { id: "sample-sketches-01", url: "/expression-samples/sketches-01.svg", width: 1200, height: 900 },
      { id: "sample-sketches-02", url: "/expression-samples/sketches-02.svg", width: 800, height: 1200 },
      { id: "sample-sketches-03", url: "/expression-samples/sketches-03.svg", width: 1200, height: 900 },
      { id: "sample-sketches-04", url: "/expression-samples/sketches-04.svg", width: 800, height: 1200 },
      { id: "sample-sketches-05", url: "/expression-samples/sketches-05.svg", width: 1200, height: 900 },
    ],
  },
  {
    id: "sample-screens",
    name: "screens",
    images: [
      { id: "sample-screens-01", url: "/expression-samples/screens-01.svg", width: 900, height: 1350 },
      { id: "sample-screens-02", url: "/expression-samples/screens-02.svg", width: 1200, height: 800 },
      { id: "sample-screens-03", url: "/expression-samples/screens-03.svg", width: 900, height: 1350 },
      { id: "sample-screens-04", url: "/expression-samples/screens-04.svg", width: 1200, height: 800 },
    ],
  },
  {
    id: "sample-misc",
    name: "misc",
    images: [
      { id: "sample-misc-01", url: "/expression-samples/misc-01.svg", width: 1200, height: 800 },
      { id: "sample-misc-02", url: "/expression-samples/misc-02.svg", width: 900, height: 1350 },
    ],
  },
  {
    id: "sample-empty",
    name: "empty",
    images: [
    ],
  },
];
