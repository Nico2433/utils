import type { Find } from "./types";

export const findOnArray = <T>(
  array: T[],
  { property, value }: Find<T>
): T | undefined => {
  return value
    ? array.find((obj) => obj[property] === value)
    : array.find((obj) => obj[property]);
};

export const findIndexOnArray = <T>(
  array: T[],
  { property, value }: Find<T>
): number => {
  return value
    ? array.findIndex((obj) => obj[property] === value)
    : array.findIndex((obj) => obj[property]);
};

export const findOnArraySimple = <T>(array: T[], value: T): T | undefined => {
  return array.find((item) => item === value);
};

export const findIndexOnArraySimple = <T>(array: T[], value: T): number => {
  return array.findIndex((item) => item === value);
};
