import type { Search } from "./types";

// Returns the index of `value`, or `~insertionIndex` (always negative) when missing
const binarySearch = <T, V>(
  array: T[],
  value: V,
  getValue: (item: T) => V
): number => {
  let start = 0;
  let end = array.length - 1;

  while (start <= end) {
    const middle = Math.floor((start + end) / 2);
    const current = getValue(array[middle] as T);

    if (current === value) return middle;
    if (current < value) start = middle + 1;
    else end = middle - 1;
  }

  return ~start;
};

/** Binary search: `array` must be sorted ascending by `property`. */
export const searchOnArray = <T, K extends keyof T>(
  array: T[],
  { property, value }: Search<T, K>
): T | undefined => {
  const idx = binarySearch(array, value, (obj) => obj[property]);
  return idx >= 0 ? array[idx] : undefined;
};

/**
 * Binary search: `array` must be sorted ascending by `property`.
 * When missing, returns -1, or the index where it should be inserted if `insertIdx` is true.
 */
export const searchIndexOnArray = <T, K extends keyof T>(
  array: T[],
  { property, value }: Search<T, K>,
  insertIdx?: boolean
): number => {
  const idx = binarySearch(array, value, (obj) => obj[property]);
  return idx >= 0 ? idx : insertIdx ? ~idx : -1;
};

/** Binary search: `array` must be sorted ascending. */
export const searchOnArraySimple = <T>(array: T[], value: T): T | undefined => {
  const idx = binarySearch(array, value, (item) => item);
  return idx >= 0 ? array[idx] : undefined;
};

/**
 * Binary search: `array` must be sorted ascending.
 * When missing, returns -1, or the index where it should be inserted if `insertIdx` is true.
 */
export const searchIndexOnArraySimple = <T>(
  array: T[],
  value: T,
  insertIdx?: boolean
): number => {
  const idx = binarySearch(array, value, (item) => item);
  return idx >= 0 ? idx : insertIdx ? ~idx : -1;
};
