import { camelCasePattern, extraSpacesPattern } from ".";

const upperFirst = (word: string): string =>
  word.charAt(0).toUpperCase() + word.slice(1);

/** Capitalizes the first letter, or every word's first letter when `all` is true. */
export function capitalize<S extends string>(text: S, all?: false): Capitalize<S>;
export function capitalize(text: string, all: true): string;
export function capitalize(text: string, all?: boolean): string {
  return all ? text.split(" ").map(upperFirst).join(" ") : upperFirst(text);
}

/** Trims and collapses repeated whitespace into single spaces. */
export const cleanString = (text: string): string =>
  text.trim().replace(extraSpacesPattern, " ");

/** Splits camelCase into lowercase words, e.g. "helloWorld" -> "hello world". */
export const camelCaseDivider = (
  text: string,
  capitalize?: boolean,
  all?: boolean
): string =>
  text
    .split(camelCasePattern)
    .map((word, index) =>
      capitalize && (all || index === 0)
        ? upperFirst(word.toLowerCase())
        : word.toLowerCase()
    )
    .join(" ");
