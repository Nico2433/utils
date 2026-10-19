import type { SortOrder } from "./types";

/** Sorts by `sortBy`. Mutates `array`. */
export const sortByArray = <T>(
  array: T[],
  sortBy: keyof T,
  order: SortOrder = "asc"
): T[] => {
  const dir = order === "asc" ? 1 : -1;

  return array.sort((a, b) => {
    if (a[sortBy] < b[sortBy]) return -dir;
    if (a[sortBy] > b[sortBy]) return dir;
    return 0;
  });
};

/** Sorts numerically. Mutates `array`. */
export const sortNumberArray = (
  array: number[],
  order: SortOrder = "asc"
): number[] =>
  array.sort(order === "asc" ? (a, b) => a - b : (a, b) => b - a);
