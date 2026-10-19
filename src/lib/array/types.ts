export type FilterOp = "===" | "!==" | "<=" | "<" | ">=" | ">";

export type SortOrder = "asc" | "desc";

export interface CheckValue<V> {
  filterOp: FilterOp;
  value: V;
}

// K is inferred from `property`, so `value` must match that property's type
export interface Filter<T, K extends keyof T = keyof T> {
  property: K;
  checkValue?: CheckValue<T[K]>;
  exclude?: boolean;
}

export interface FilterSimple<T> {
  checkValue: CheckValue<T>;
  exclude?: boolean;
}

export interface Search<T, K extends keyof T = keyof T> {
  property: K;
  value: T[K];
}

export interface Find<T, K extends keyof T = keyof T> {
  property: K;
  value?: T[K];
}
