type StringPart = string | boolean | null | undefined;

/** Joins only the string parts, so `cond && "text"` can be passed inline. */
export const assembleString = (...parts: StringPart[]): string =>
  parts.filter((part) => typeof part === "string").join("");

/** Like `assembleString`, separating parts with spaces. */
export const assembleStringWSpaces = (...parts: StringPart[]): string =>
  parts.filter((part) => typeof part === "string").join(" ");
