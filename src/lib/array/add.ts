import type { Search } from ".";
import { searchIndexOnArray, searchIndexOnArraySimple } from ".";

/** Inserts `data` keeping `array` sorted by `property`, skipping duplicates. Mutates `array`. */
export const addToArray = <T, K extends keyof T>(
  array: T[],
  data: T,
  { property, value }: Search<T, K>
): T[] => {
  const idx = searchIndexOnArray(array, { property, value }, true);
  if (array[idx]?.[property] !== value) array.splice(idx, 0, data);
  return array;
};

/** Inserts `value` keeping `array` sorted, skipping duplicates. Mutates `array`. */
export const addToArraySimple = <T>(array: T[], value: T): T[] => {
  const idx = searchIndexOnArraySimple(array, value, true);
  if (array[idx] !== value) array.splice(idx, 0, value);
  return array;
};
