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
