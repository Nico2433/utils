export const assembleString = (
  spaces?: boolean,
  ...string: (string | boolean | null | undefined)[]
) => {
  const filteredString = string.filter((str) => typeof str === "string");
  return filteredString.join(spaces ? " " : "");
};
