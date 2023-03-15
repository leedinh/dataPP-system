export enum StatusEnum {
  "IDLE" = "IDLE",
  "LOADING" = "LOADING",
  "SUCCEEDED" = "SUCCEEDED",
  "FAILED" = "FAILED",
}

export const isLoading = (status: StatusEnum) => status === StatusEnum.LOADING;

export const RECORD_LIMIT = 100;
export const ALL_RECORD_LIMIT = 999;
