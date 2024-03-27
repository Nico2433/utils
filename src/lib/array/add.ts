import type { Search } from ".";
import { searchIndexOnArray, searchIndexOnArraySimple } from ".";

export const addToArray = <T>(
  array: T[],
  data: T,
  { property, value }: Search<T>
): T[] => {
  const idx = searchIndexOnArray(array, { property, value }, true);

  if (idx < array.length && array[idx][property] === value) {
    return array;
  }

  array.splice(idx, 0, data);
  return array;
};

export const addToArraySimple = <T>(array: T[], value: T): T[] => {
  const idx = searchIndexOnArraySimple(array, value, true);

  if (idx < array.length && array[idx] === value) {
    return array;
  }

  array.splice(idx, 0, value);
  return array;
};
