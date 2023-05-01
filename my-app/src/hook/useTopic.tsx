import { DatasetTopic } from "redux/constant";

export default function useTopic() {
  const topicLabels = {
    [DatasetTopic.EDUCATION]: "Education",
    [DatasetTopic.ENTERTAINMENT]: "Entertainment",
    [DatasetTopic.MEDICAL]: "Medical",
    [DatasetTopic.SCIENCE]: "Science",
    [DatasetTopic.SOCIAL]: "Social",
  };

  return {
    topicLabels,
  };
}
