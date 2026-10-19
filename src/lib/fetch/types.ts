export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type HttpHeaders = Record<string, string>;

export interface FetchDataOptParams
  extends Omit<RequestInit, "method" | "headers" | "body"> {
  method?: HttpMethod;
  headers?: HttpHeaders;
  /** Plain objects and arrays are sent as JSON. */
  body?: RequestInit["body"] | object;
}

/**
 * Resolves with the parsed JSON body, or `null` when the response is empty (e.g. 204).
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
