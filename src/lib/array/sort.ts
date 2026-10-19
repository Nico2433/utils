import type { Sort } from "./types";
import { getBy } from "./utils";

/** Returns a sorted copy of `array`, comparing items (or their `by` property) with `<`/`>`. */
export const sortArray = <T>(
  array: readonly T[],
  { by, order = "asc" }: Sort<T> = {}
): T[] => {
  const dir = order === "asc" ? 1 : -1;

  return array.toSorted((a, b) => {
    const x = getBy(a, by);
    const y = getBy(b, by);
    if (x < y) return -dir;
    if (x > y) return dir;
    return 0;
  });
};
