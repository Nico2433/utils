import type { FilterOp } from "./types";

export const compareValues = <T>(a: T, b: T, operator: FilterOp): boolean => {
  switch (operator) {
    case "===":
      return a === b;
    case "!==":
      return a !== b;
    case "<=":
      return a <= b;
    case "<":
      return a < b;
    case ">=":
      return a >= b;
    case ">":
      return a > b;
    default:
      throw new Error(`Unsupported filter operator: ${operator}`);
  }
};
