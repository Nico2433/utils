export const sortByArray = <T>(
  array: T[],
  sortBy: keyof T,
  order: "asc" | "desc"
): T[] => {
  const sortedArray = [...array];

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

  sortedArray.sort(compareFn);

  return sortedArray;
};
