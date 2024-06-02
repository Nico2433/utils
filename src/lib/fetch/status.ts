export enum FETCH_STATUS {
  INACTIVE,
  LOADING,
  SUCCESS,
  NOT_FOUND,
  UNAUTHORIZED,
  INVALID,
  CONFLICT,
  ERROR,
}

export const getStatusError = (resStatus: number): FETCH_STATUS => {
  let status: FETCH_STATUS | undefined;

  switch (resStatus) {
    case 400:
      {
        status = FETCH_STATUS.INVALID;
      }
      break;

    case 401:
      {
        status = FETCH_STATUS.UNAUTHORIZED;
      }
      break;

    case 404:
      {
        status = FETCH_STATUS.NOT_FOUND;
      }
      break;

    case 409:
      {
        status = FETCH_STATUS.CONFLICT;
      }
      break;

    default:
      {
        status = FETCH_STATUS.ERROR;
      }
      break;
  }

  return status;
};
