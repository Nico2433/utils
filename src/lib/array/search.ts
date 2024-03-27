import type { Search } from "./types";

export const searchOnArray = <T>(
  array: T[],
  { property, value }: Search<T>
): T | undefined => {
  let start = 0;
  let end = array.length - 1;

  while (start <= end) {
    let middle = Math.floor((start + end) / 2);

    if (array[middle][property] === value) {
      return array[middle];
    } else if (array[middle][property] < value) {
      start = middle + 1;
    } else {
      end = middle - 1;
    }
  }
};

export const searchIndexOnArray = <T>(
  array: T[],
  { property, value }: Search<T>,
  insertIdx?: boolean
): number => {
  let start = 0;
  let end = array.length - 1;

  while (start <= end) {
    let middle = Math.floor((start + end) / 2);

    if (array[middle][property] === value) {
      return middle;
    } else if (array[middle][property] < value) {
      start = middle + 1;
    } else {
      end = middle - 1;
    }
  }

  return insertIdx ? start : -1;
};

export const searchOnArraySimple = <T>(array: T[], value: T): T | undefined => {
  let start = 0;
  let end = array.length - 1;

  while (start <= end) {
    let middle = Math.floor((start + end) / 2);

    if (array[middle] === value) {
      return array[middle];
    } else if (array[middle] < value) {
      start = middle + 1;
    } else {
      end = middle - 1;
    }
  }
};

export const searchIndexOnArraySimple = <T>(
  array: T[],
  value: T,
  insertIndex?: boolean
): number => {
  let start = 0;
  let end = array.length - 1;

  while (start <= end) {
    let middle = Math.floor((start + end) / 2);

    if (array[middle] === value) {
      return middle;
    } else if (array[middle] < value) {
      start = middle + 1;
    } else {
      end = middle - 1;
    }
  }

  return insertIndex ? start : -1;
};
