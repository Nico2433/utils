import type { By, ByValue } from "./types";
import { getBy } from "./utils";

/** First item equal to `value` (or whose `by` property equals it). */
export const findOnArray = <T, K extends By<T> = undefined>(
  array: readonly T[],
  value: ByValue<T, K>,
  by?: K
): T | undefined => array.find((item) => getBy(item, by) === value);

export const findIndexOnArray = <T, K extends By<T> = undefined>(
  array: readonly T[],
  value: ByValue<T, K>,
  by?: K
): number => array.findIndex((item) => getBy(item, by) === value);
