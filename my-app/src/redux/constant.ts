export enum StatusEnum {
  "IDLE" = "IDLE",
  "LOADING" = "LOADING",
  "SUCCEEDED" = "SUCCEEDED",
  "FAILED" = "FAILED",
}

export enum DatasetTopic {
  SCIENCE = 1,
  EDUCATION = 2,
  ENTERTAINMENT = 3,
  SOCIAL = 4,
  MEDICAL = 5,
}

export const mappingColorStatus: { [key: string]: string } = {
  completed: "success",
  idle: "cyan",
  anonymizing: "processing",
  pending: "orange",
  created: "success",
  failed: "red",
};

export const optionTopic = [
  {
    value: DatasetTopic.EDUCATION,
    label: "Education",
  },
  {
    value: DatasetTopic.ENTERTAINMENT,
    label: "Entertainment",
  },
  {
    value: DatasetTopic.MEDICAL,
    label: "Medical",
  },
  {
    value: DatasetTopic.SCIENCE,
    label: "Science",
  },
  {
    value: DatasetTopic.SOCIAL,
    label: "Social",
  },
];

export const getTopicLabel = (topic: DatasetTopic) => {
  return optionTopic.find((value) => value.value === topic)?.label;
};

export const isLoading = (status: StatusEnum) => status === StatusEnum.LOADING;

export const RECORD_LIMIT = 100;
export const ALL_RECORD_LIMIT = 999;
export const MAX_STORAGE = 3221225472 / Math.pow(2, 30);
