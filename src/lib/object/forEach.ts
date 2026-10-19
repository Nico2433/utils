import type { ObjKey, ObjMetadata } from "./types";

/** Iterates own enumerable string keys of `obj`. */
export const forEachObj = <T extends object>(
  obj: T,
  callback: (value: T[ObjKey<T>], metadata: ObjMetadata<T>) => void
): void => {
  (Object.keys(obj) as ObjKey<T>[]).forEach((key, index) => {
    callback(obj[key], { key, index, obj });
  });
};
