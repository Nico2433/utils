export type FilterOp = "===" | "!==" | "<=" | "<" | ">=" | ">";

interface ArrayFc<T> {
  property: keyof T;
}

export interface Filter<T> extends ArrayFc<T> {
  checkValue?: {
    filterOp: FilterOp;
    value: T[keyof T];
  };
  exclude?: boolean;
}

export interface FilterSimple<T> {
  checkValue?: {
    filterOp: FilterOp;
    value: T;
  };
  exclude?: boolean;
}

export interface Search<T> extends ArrayFc<T> {
  value: T[keyof T];
}

export interface Find<T> extends ArrayFc<T> {
  value?: T[keyof T];
}
