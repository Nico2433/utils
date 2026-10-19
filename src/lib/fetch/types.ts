export type HttpMethod =
  | "GET"
  | "HEAD"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "OPTIONS";

export type HttpHeaders = Record<string, string>;

export type QueryValue = string | number | boolean | null | undefined;

/** `null`/`undefined` values are skipped, arrays repeat the key. */
export type Query = Record<string, QueryValue | QueryValue[]>;

export interface FetchDataOptParams
  extends Omit<RequestInit, "method" | "headers" | "body"> {
  method?: HttpMethod;
  headers?: HttpHeaders;
  /** Plain objects and arrays are sent as JSON. */
  body?: RequestInit["body"] | object;
  /** Search params appended to the URL. */
  query?: Query;
  /** Milliseconds before the request fails with `FETCH_STATUS.TIMEOUT`. */
  timeout?: number;
}

export interface FetchDataDefaults extends FetchDataOptParams {
  /** Prepended to relative URLs (`"/users"`, `"users"`). */
  baseUrl?: string | URL;
}

/**
 * Resolves with the parsed body: JSON for JSON responses, text otherwise,
 * or `null` when the response is empty (e.g. 204).
 * When `condition` is false, no request is made and it resolves with `null`.
 */
export type FetchData = {
  <T>(url: string | URL, optParams?: FetchDataOptParams): Promise<T>;
  <T>(
    url: string | URL,
    optParams: FetchDataOptParams | undefined,
    condition: boolean
  ): Promise<T | null>;
};
