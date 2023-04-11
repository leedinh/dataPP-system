export enum StatusEnum {
  "IDLE" = "IDLE",
  "LOADING" = "LOADING",
  "SUCCEEDED" = "SUCCEEDED",
  "FAILED" = "FAILED",
}

export enum DatasetTopic {
  UNSPECIFIED = 0,
  SCIENCE = 1,
  EDUCATION = 2,
  ENTERTAINMENT = 3,
  SOCIAL = 4,
  MEDICAL = 5,
}

export const isLoading = (status: StatusEnum) => status === StatusEnum.LOADING;

export const RECORD_LIMIT = 100;
export const ALL_RECORD_LIMIT = 999;
