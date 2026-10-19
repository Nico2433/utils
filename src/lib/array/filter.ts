import type { Filter, FilterSimple } from "./types";
import { compareValues } from "./utils";

/** Keeps items whose `property` passes `checkValue` (or is truthy when omitted). `exclude` inverts it. */
export const filterArray = <T, K extends keyof T>(
  array: T[],
  { property, checkValue, exclude }: Filter<T, K>
): T[] =>
  array.filter((obj) => {
    const match = checkValue
      ? compareValues(obj[property], checkValue.value, checkValue.filterOp)
      : Boolean(obj[property]);
    return exclude ? !match : match;
  });

/** Keeps values that pass `checkValue`. `exclude` inverts it. */
export const filterArraySimple = <T>(
  array: T[],
  { checkValue, exclude }: FilterSimple<T>
): T[] =>
  array.filter((val) => {
    const match = compareValues(val, checkValue.value, checkValue.filterOp);
    return exclude ? !match : match;
  });
