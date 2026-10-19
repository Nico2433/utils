export type ObjKey<T> = Extract<keyof T, string>;

export interface ObjMetadata<T> {
  key: ObjKey<T>;
  index: number;
  obj: T;
}
