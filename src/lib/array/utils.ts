import type { By, ByValue, FilterOp } from "./types";

export const compareValues = <T>(a: T, b: T, operator: FilterOp): boolean => {
  switch (operator) {
    case "===":
      return a === b;
    case "!==":
      return a !== b;
    case "<=":
      return a <= b;
    case "<":
      return a < b;
    case ">=":
      return a >= b;
    case ">":
      return a > b;
    default:
      throw new Error(`Unsupported filter operator: ${operator}`);
  }
};

/** Returns `item[by]`, or `item` itself when `by` is undefined. */
export const getBy = <T, K extends By<T>>(item: T, by?: K): ByValue<T, K> =>
  (by === undefined ? item : item[by as keyof T]) as ByValue<T, K>;
