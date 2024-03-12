export type FilterOp = "===" | "!==" | "<=" | "<" | ">=" | ">";

export interface Filter<T> {
  property: keyof T;
  checkValue?: {
    filterOp: FilterOp;
    value: T[keyof T];
  };
}

export interface FilterOnArrayParams<T> extends Filter<T> {
  exclude?: boolean;
}
