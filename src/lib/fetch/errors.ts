import { FETCH_STATUS } from "./status";

export interface FetchErrorOptions {
  /** Parsed error response body (JSON or text). */
  data?: unknown;
  cause?: unknown;
}

export class FetchError extends Error {
  status: FETCH_STATUS;
  /** HTTP status code of the failed response, if any. */
  statusCode?: number;
  /** Parsed error response body (JSON or text), if any. */
  data?: unknown;

  constructor(
    message: string,
    fetchStatus?: FETCH_STATUS,
    statusCode?: number,
    { data, cause }: FetchErrorOptions = {}
  ) {
    super(message, { cause });

    this.name = "FetchError";
    this.status = fetchStatus ?? FETCH_STATUS.ERROR;
    this.statusCode = statusCode;
    this.data = data;
  }
}
