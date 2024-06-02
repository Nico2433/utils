import type { Filter, FilterSimple } from ".";
import { compareValues } from ".";

export const filterArray = <T>(
  array: T[],
  { property, checkValue, exclude }: Filter<T>
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

export const filterArraySimple = <T>(
  array: T[],
  { checkValue, exclude }: FilterSimple<T>
) => {
  if (!exclude)
    return array.filter((val) =>
      compareValues(val, checkValue.value, checkValue.filterOp)
    );

  return array.filter(
    (val) => !compareValues(val, checkValue.value, checkValue.filterOp)
  );
};
