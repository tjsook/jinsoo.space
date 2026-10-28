export type ExpressionImage = {
  id: string;
  url: string;
  width: number;
  height: number;
};

export type ExpressionFolder = {
  id: string;
  name: string;
  images: ExpressionImage[];
};

export type ExpressionSection = {
  id: string;
  label: string;
  note: string;
  /** Where the row opens. A row without one is not built yet. */
  href: string | null;
  display_order: number;
};
