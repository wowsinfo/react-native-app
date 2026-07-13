import { roundTo } from "./helpers";

export const getAP = (rating: number, battle: number): number => {
  if (rating === -1 || battle === 0) return 0;
  return Number(roundTo(Math.log10(Math.max(10, battle)) * rating));
};

export const getRatingRange = (): number[] => [
  0, 750, 1100, 1350, 1550, 1750, 2100, 2450, 9999,
];

export const getRatingIndex = (rating?: number): number => {
  if (rating == null) return 0;
  const range = getRatingRange();
  const index = range.findIndex((r) => rating < r);
  return index === -1 ? 0 : index;
};

export const getColourList = (): string[] => [
  "#607D8B",
  "#D32F2F",
  "#FF9800",
  "#FFB300",
  "#7CB342",
  "#388E3C",
  "#03A9F4",
  "#9C27B0",
  "#673AB7",
  "black",
];

export const getColour = (rating?: number): string => {
  const colours = getColourList();
  return colours[getRatingIndex(rating)] ?? "#607D8B";
};
