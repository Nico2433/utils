export type StringPart = string | boolean | null | undefined;

export type ClassValue = StringPart | Record<string, unknown> | ClassValue[];

/** Joins only the string parts, so `cond && "text"` can be passed inline. */
export const concat = (...parts: StringPart[]): string =>
  parts.filter((part) => typeof part === "string").join("");

const toClasses = (value: ClassValue): string[] => {
  if (typeof value === "string") return value ? [value] : [];
  if (Array.isArray(value)) return value.flatMap(toClasses);
  if (value && typeof value === "object")
    return Object.keys(value).filter((key) => value[key]);
  return [];
};

/**
 * Joins class names with spaces, skipping falsy values.
 * Objects add each key whose value is truthy: `cn("btn", { active: isActive })`.
 */
export const cn = (...values: ClassValue[]): string =>
  values.flatMap(toClasses).join(" ");
