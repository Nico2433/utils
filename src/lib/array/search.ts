import type { By, ByValue } from "./types";
import { getBy } from "./utils";

// Returns the index of `value`, or `~insertionIndex` (always negative) when missing
const binarySearch = <T, K extends By<T>>(
  array: readonly T[],
  value: ByValue<T, K>,
  by?: K
): number => {
  let start = 0;
  let end = array.length - 1;

  while (start <= end) {
    const middle = Math.floor((start + end) / 2);
    const current = getBy(array[middle] as T, by);

    if (current === value) return middle;
    if (current < value) start = middle + 1;
    else end = middle - 1;
  }

  return ~start;
};

/** Binary search: `array` must be sorted ascending (by `by` when given). */
export const searchOnArray = <T, K extends By<T> = undefined>(
  array: readonly T[],
  value: ByValue<T, K>,
  by?: K
): T | undefined => {
  const idx = binarySearch(array, value, by);
  return idx >= 0 ? array[idx] : undefined;
};

/** Binary search: `array` must be sorted ascending. Returns -1 when missing. */
export const searchIndexOnArray = <T, K extends By<T> = undefined>(
  array: readonly T[],
  value: ByValue<T, K>,
  by?: K
): number => Math.max(binarySearch(array, value, by), -1);

/** Index where `value` is, or where it should be inserted to keep `array` sorted. */
export const insertIndexOnArray = <T, K extends By<T> = undefined>(
  array: readonly T[],
  value: ByValue<T, K>,
  by?: K
): number => {
  const idx = binarySearch(array, value, by);
  return idx >= 0 ? idx : ~idx;
};
