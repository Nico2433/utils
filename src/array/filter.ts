import { compareValues } from ".";
import type { FilterOnArrayParams } from "./types";

export const filterOnArray = <T>(
  array: T[],
  { property, checkValue, exclude }: FilterOnArrayParams<T>
): T[] => {
  if (checkValue) {
    if (!exclude)
      return array.filter((obj) =>
        compareValues(obj[property], checkValue.value, checkValue.filterOp)
      );

    return array.filter(
      (obj) =>
        !compareValues(obj[property], checkValue.value, checkValue.filterOp)
    );
  } else {
    if (!exclude) return array.filter((obj) => obj[property]);
    return array.filter((obj) => !obj[property]);
  }
};
