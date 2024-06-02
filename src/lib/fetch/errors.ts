import { FETCH_STATUS } from "./status";

export class FetchError extends Error {
  status: FETCH_STATUS;

  constructor(message: string, fetchStatus?: FETCH_STATUS) {
    super(message);

    this.name = "[FetchError]";
    this.status = fetchStatus ?? FETCH_STATUS.ERROR;
  }
}
