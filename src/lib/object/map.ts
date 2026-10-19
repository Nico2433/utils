import type { ObjKey, ObjMetadata } from "./types";

/** Maps every value of `obj`, keeping its keys. */
export const mapObj = <T extends object, U>(
  obj: T,
  callback: (value: T[ObjKey<T>], metadata: ObjMetadata<T>) => U
): Record<ObjKey<T>, U> =>
  Object.fromEntries(
    (Object.keys(obj) as ObjKey<T>[]).map((key, index) => [
      key,
      callback(obj[key], { key, index, obj }),
    ])
  ) as Record<ObjKey<T>, U>;

/** Maps every value of `obj` into an array. */
export const mapObjToArr = <T extends object, U>(
  obj: T,
  callback: (value: T[ObjKey<T>], metadata: ObjMetadata<T>) => U
): U[] =>
  (Object.keys(obj) as ObjKey<T>[]).map((key, index) =>
    callback(obj[key], { key, index, obj })
  );
