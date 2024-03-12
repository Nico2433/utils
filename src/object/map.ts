export const mapObj = <T extends Record<string, any>>(
  obj: T,
  callback: (
    value: T[keyof T],
    metadata: { key: string; index: number; obj: T }
  ) => T[keyof T]
): T => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value], index) => [
      key,
      callback(value, { key, index, obj }),
    ])
  ) as T;
};

export const mapObjToArr = <T extends Record<string, any>, U>(
  obj: T,
  callback: (
    value: T[keyof T],
    metadata: { key: string; index: number; obj: T }
  ) => U
): U[] => {
  return Object.entries(obj).map(([key, value], index) =>
    callback(value, { key, index, obj })
  );
};
