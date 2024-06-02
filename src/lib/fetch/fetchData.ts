import { FetchError } from "./errors";
import { getStatusError } from "./status";
import type { FetchData } from "./types";

export const fetchData: FetchData = async (
  url,
  optParams = {},
  condition = true
) => {
  const { method = "GET", headers, body, ...rest } = optParams;

  if (condition) {
    const config = {
      method,
      headers,
      body,
      ...rest,
    };

    if (method === "POST" || method === "PUT") {
      const isForm = body instanceof FormData;
      const isJson =
        !isForm && (Array.isArray(body) || typeof body === "object");

      const contentType = isJson ? "application/json" : null;

      if (!config.headers?.["content-type"] && contentType) {
        if (!config.headers) config.headers = {};
        config.headers["content-type"] = contentType;
      }

      config.body = isForm
        ? body
        : isJson
        ? JSON.stringify(body)
        : typeof body === "string" && body;
    }

    const res = await fetch(url, config as RequestInit);

    if (!res.ok) {
      const status = res.status;
      const errMessage = `[Error ${status}]: ${await res.text()}`;
      throw new FetchError(errMessage, getStatusError(status));
    }

    const data = await res.json();
    return data;
  } else {
    return null;
  }
};
