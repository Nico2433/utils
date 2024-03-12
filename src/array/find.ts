import { compareValues } from ".";
import type { Filter } from "./types";

export const findArrayIndex = <T>(
  array: T[],
  { property, checkValue }: Filter<T>
): number => {
  return checkValue
    ? array.findIndex((obj) =>
        compareValues(obj[property], checkValue.value, checkValue.filterOp)
      )
    : array.findIndex((obj) => obj[property]);
};

export const findOnArray = <T>(
  array: T[],
  { property, checkValue }: Filter<T>
): T | undefined => {
  return checkValue
    ? array.find((obj) =>
        compareValues(obj[property], checkValue.value, checkValue.filterOp)
      )
    : array.find((obj) => obj[property]);
};
