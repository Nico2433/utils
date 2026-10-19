import type { FetchData } from ".";
import { FetchError, getStatusError } from ".";

export const fetchData: FetchData = async (
  url,
  optParams = {},
  condition = true
) => {
  if (!condition) return null;

  const { method = "GET", headers, body, ...rest } = optParams;

  // Copy so the caller's headers object is never mutated
  const config = { ...rest, method, headers: { ...headers }, body };

  if (method !== "GET" && body !== undefined) {
    // Only plain objects/arrays: FormData, Blob, URLSearchParams... go through untouched
    const isJson =
      Array.isArray(body) ||
      (typeof body === "object" &&
        body !== null &&
        [Object.prototype, null].includes(Object.getPrototypeOf(body)));
    const hasContentType = Object.keys(config.headers).some(
      (key) => key.toLowerCase() === "content-type"
    );

    if (isJson) {
      if (!hasContentType) config.headers["content-type"] = "application/json";
      config.body = JSON.stringify(body);
    }
  }

  const res = await fetch(url, config as RequestInit);

  if (!res.ok) {
    const status = res.status;
    const errMessage = `[Error ${status}]: ${await res.text()}`;
    throw new FetchError(errMessage, getStatusError(status), status);
  }

  // Empty bodies (e.g. 204 No Content) would make res.json() throw
  const text = await res.text();
  return text ? JSON.parse(text) : null;
};
