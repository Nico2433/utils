import type { By } from "./types";
import { insertIndexOnArray } from "./search";
import { getBy } from "./utils";

/** Returns a copy of the sorted `array` with `item` inserted in order, skipping duplicates. */
export const addToArray = <T, K extends By<T> = undefined>(
  array: readonly T[],
  item: T,
  by?: K
): T[] => {
  const value = getBy(item, by);
  const idx = insertIndexOnArray(array, value, by);
  const current = array[idx];
  return idx < array.length && getBy(current as T, by) === value
    ? [...array]
    : array.toSpliced(idx, 0, item);
};
