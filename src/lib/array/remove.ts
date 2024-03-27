import type { Search } from ".";
import { searchIndexOnArray, searchIndexOnArraySimple } from ".";

export const removeFromArray = <T>(
  array: T[],
  { property, value }: Search<T>
): T[] => {
  const idx = searchIndexOnArray(array, { property, value });

  if (idx === -1) {
    return array;
  }

  array.splice(idx, 1);
  return array;
};

export const removeFromArraySimple = <T>(array: T[], value: T): T[] => {
  const idx = searchIndexOnArraySimple(array, value);

  if (idx === -1) {
    return array;
  }

  array.splice(idx, 1);
  return array;
};
