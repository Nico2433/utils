export type FilterOp = "===" | "!==" | "<=" | "<" | ">=" | ">";

export type SortOrder = "asc" | "desc";

/** Property used to compare items. `undefined` compares the items themselves. */
export type By<T> = keyof T | undefined;

/** Type of the compared value: `T[K]` when comparing by a property, `T` otherwise. */
export type ByValue<T, K extends By<T>> = [K] extends [keyof T] ? T[K] : T;

export interface Filter<T, K extends By<T> = undefined> {
  by?: K;
  op: FilterOp;
  value: ByValue<T, K>;
  /** Keeps the items that do NOT match. */
  exclude?: boolean;
}

export interface Sort<T> {
  by?: keyof T;
  order?: SortOrder;
}
