export const forEachObj = <T extends Record<string, any>>(
  obj: T,
  callback: (
    value: T[keyof T],
    metadata: { key: string; index: number; obj: T }
  ) => void
): void => {
  Object.entries(obj).forEach(([key, value], index) => {
    callback(value, { key, index, obj });
  });
};
