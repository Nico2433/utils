import type { Find } from "./types";

// Without `value`, matches the first item whose `property` is truthy
const matcher =
  <T, K extends keyof T>({ property, value }: Find<T, K>) =>
  (obj: T): boolean =>
    value !== undefined ? obj[property] === value : Boolean(obj[property]);

export const findOnArray = <T, K extends keyof T>(
  array: T[],
  find: Find<T, K>
): T | undefined => array.find(matcher(find));

export const findIndexOnArray = <T, K extends keyof T>(
  array: T[],
  find: Find<T, K>
): number => array.findIndex(matcher(find));

export const findOnArraySimple = <T>(array: T[], value: T): T | undefined =>
  array.find((item) => item === value);

export const findIndexOnArraySimple = <T>(array: T[], value: T): number =>
  array.indexOf(value);
