export const sortByArray = <T>(
  array: T[],
  sortBy: keyof T,
  order: "asc" | "desc" = "asc"
): T[] => {
  const compareFn = (a: T, b: T): number => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (order === "asc") {
      if (aValue < bValue) return -1;
      if (aValue > bValue) return 1;
      return 0;
    } else {
      if (aValue > bValue) return -1;
      if (aValue < bValue) return 1;
      return 0;
    }
  };

  array.sort(compareFn);

  return array;
};

export const sortNumberArray = (
  array: number[],
  order: "asc" | "desc" = "asc"
): number[] => {
  return order === "asc"
    ? array.sort((a, b) => a - b)
    : array.sort((a, b) => b - a);
};
