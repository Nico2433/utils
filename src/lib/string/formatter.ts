import { camelCasePattern, extraSpacesPattern } from ".";

export const capitalize = (text: string, all?: boolean): string => {
  return all
    ? text
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : text.charAt(0).toUpperCase() + text.slice(1);
};

export const cleanString = (text: string): string => {
  return text.trim().replace(extraSpacesPattern, " ");
};

export const camelCaseDivider = (
  text: string,
  capitalize?: boolean,
  all?: boolean
): string => {
  const words = text.split(camelCasePattern);

  const result = words.map((word, index) => {
    if (capitalize) {
      return all
        ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        : index === 0
        ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        : word.toLowerCase();
    } else {
      return word.toLowerCase();
    }
  });

  return result.join(" ");
};
