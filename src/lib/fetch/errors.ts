import { FETCH_STATUS } from ".";

export class FetchError extends Error {
  status: FETCH_STATUS;
  /** HTTP status code of the failed response, if any. */
  statusCode?: number;

  constructor(message: string, fetchStatus?: FETCH_STATUS, statusCode?: number) {
    super(message);

    this.name = "FetchError";
    this.status = fetchStatus ?? FETCH_STATUS.ERROR;
    this.statusCode = statusCode;
  }
}
