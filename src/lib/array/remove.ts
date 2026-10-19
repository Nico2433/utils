import type { By, ByValue } from "./types";
import { searchIndexOnArray } from "./search";

/** Returns a copy of the sorted `array` without the item matching `value`. */
export const removeFromArray = <T, K extends By<T> = undefined>(
  array: readonly T[],
  value: ByValue<T, K>,
  by?: K
): T[] => {
  const idx = searchIndexOnArray(array, value, by);
  return idx === -1 ? [...array] : array.toSpliced(idx, 1);
};
