export const assembleString = (
  ...string: (string | boolean | null | undefined)[]
) => {
  const filteredString = string.filter((str) => typeof str === "string");
  return filteredString.join("");
};

export const assembleStringWSpaces = (
  ...string: (string | boolean | null | undefined)[]
) => {
  const filteredString = string.filter((str) => typeof str === "string");
  return filteredString.join(" ");
};
