import type {
  FetchData,
  FetchDataDefaults,
  FetchDataOptParams,
  Query,
} from "./types";
import { FetchError } from "./errors";
import { FETCH_STATUS, getStatusError } from "./status";

const isAbsoluteUrl = (url: string): boolean =>
  /^[a-z][a-z\d+.-]*:/i.test(url);

// Only plain objects/arrays: FormData, Blob, URLSearchParams... go through untouched
const isJsonBody = (body: unknown): body is object =>
  Array.isArray(body) ||
  (typeof body === "object" &&
    body !== null &&
    [Object.prototype, null].includes(Object.getPrototypeOf(body)));

const buildUrl = (
  url: string | URL,
  baseUrl?: string | URL,
  query?: Query
): string | URL => {
  let full = url;
  if (typeof url === "string" && baseUrl !== undefined && !isAbsoluteUrl(url))
    full = `${String(baseUrl).replace(/\/+$/, "")}/${url.replace(/^\/+/, "")}`;

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query ?? {}))
    for (const item of [value].flat())
      if (item !== null && item !== undefined) params.append(key, String(item));
  if (!params.size) return full;

  if (full instanceof URL) {
    const copy = new URL(full);
    params.forEach((value, key) => copy.searchParams.append(key, value));
    return copy;
  }
  return `${full}${full.includes("?") ? "&" : "?"}${params}`;
};

// JSON when the response says so (or doesn't say anything and parses), text otherwise
const parseBody = (text: string, contentType: string | null): unknown => {
  if (!text) return null;
  if (contentType?.includes("json")) return JSON.parse(text);
  if (contentType) return text;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

/** Creates a `fetchData` with default options (base URL, headers, timeout...). */
export const createFetchData = ({
  baseUrl,
  headers: defaultHeaders,
  query: defaultQuery,
  ...defaults
}: FetchDataDefaults = {}): FetchData =>
  (async (
    url: string | URL,
    optParams: FetchDataOptParams = {},
    condition = true
  ) => {
    if (!condition) return null;

    const {
      method = "GET",
      headers: callHeaders,
      query,
      body,
      timeout,
      signal,
      ...rest
    } = { ...defaults, ...optParams };

    if ((method === "GET" || method === "HEAD") && body !== undefined)
      throw new TypeError(`${method} requests cannot have a body`);

    // New object, so neither the caller's nor the default headers are mutated
    const headers = new Headers(defaultHeaders);
    new Headers(callHeaders).forEach((value, key) => headers.set(key, value));

    let requestBody = body as RequestInit["body"];
    if (isJsonBody(body)) {
      if (!headers.has("content-type"))
        headers.set("content-type", "application/json");
      requestBody = JSON.stringify(body);
    }

    const signals = [signal, timeout && AbortSignal.timeout(timeout)].filter(
      (s): s is AbortSignal => s instanceof AbortSignal
    );

    try {
      const fullUrl = buildUrl(url, baseUrl, { ...defaultQuery, ...query });
      const res = await fetch(fullUrl, {
        ...rest,
        method,
        headers,
        body: requestBody,
        signal: signals.length ? AbortSignal.any(signals) : undefined,
      });
      const text = await res.text();
      const contentType = res.headers.get("content-type");

      if (!res.ok) {
        let data: unknown = text;
        try {
          data = parseBody(text, contentType);
        } catch {
          // Keep the raw text when the error body is malformed JSON
        }
        const status = getStatusError(res.status);
        const message = `[Error ${res.status}]: ${text}`;
        throw new FetchError(message, status, res.status, { data });
      }

      try {
        return parseBody(text, contentType);
      } catch (cause) {
        const message = `[Invalid JSON]: ${text}`;
        throw new FetchError(message, FETCH_STATUS.ERROR, res.status, {
          data: text,
          cause,
        });
      }
    } catch (err) {
      if (err instanceof FetchError) throw err;
      const name = (err as Error | undefined)?.name;
      // Caller aborts (e.g. component unmount) are rethrown untouched so they can be ignored
      if (name === "AbortError") throw err;
      if (name === "TimeoutError") {
        const message = `[Timeout]: no response after ${timeout}ms`;
        throw new FetchError(message, FETCH_STATUS.TIMEOUT, undefined, {
          cause: err,
        });
      }
      const message = `[Network error]: ${(err as Error).message}`;
      throw new FetchError(message, FETCH_STATUS.ERROR, undefined, {
        cause: err,
      });
    }
  }) as FetchData;

export const fetchData: FetchData = createFetchData();
