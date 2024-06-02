import type { IncomingHttpHeaders } from "http";

export interface FetchDataOptParams {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: HttpHeaders;
  body?: {} | [] | string;
  [key: string]: unknown;
}

type RemoveIndexSignature<T> = {
  [K in keyof T as string extends K
    ? never
    : number extends K
    ? never
    : symbol extends K
    ? never
    : K]: T[K];
};

type HttpDefaultHeaders = RemoveIndexSignature<IncomingHttpHeaders>;

export interface HttpHeaders extends HttpDefaultHeaders {}

export type FetchData = {
  <T>(url: string, optParams?: FetchDataOptParams): Promise<T>;
  <T>(
    url: string,
    optParams?: FetchDataOptParams,
    condition?: boolean
  ): Promise<T | null>;
};
