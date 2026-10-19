import type { By, Filter } from "./types";
import { compareValues, getBy } from "./utils";

/** Keeps items (or their `by` property) that pass `op value`. `exclude` inverts it. */
export const filterArray = <T, K extends By<T> = undefined>(
  array: readonly T[],
  { by, op, value, exclude }: Filter<T, K>
): T[] =>
  array.filter((item) => compareValues(getBy(item, by), value, op) !== Boolean(exclude));
