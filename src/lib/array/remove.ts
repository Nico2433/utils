import type { Search } from "./types";
import { searchIndexOnArray, searchIndexOnArraySimple } from "./search";

/** Removes the item matching `value` from an array sorted by `property`. Mutates `array`. */
export const removeFromArray = <T, K extends keyof T>(
  array: T[],
  { property, value }: Search<T, K>
): T[] => {
  const idx = searchIndexOnArray(array, { property, value });
  if (idx !== -1) array.splice(idx, 1);
  return array;
};

/** Removes `value` from a sorted array. Mutates `array`. */
export const removeFromArraySimple = <T>(array: T[], value: T): T[] => {
  const idx = searchIndexOnArraySimple(array, value);
  if (idx !== -1) array.splice(idx, 1);
  return array;
};
