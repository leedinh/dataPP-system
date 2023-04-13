import { FormInstance, UploadFile } from "antd";
import { createContext } from "react";
import { DatasetTopic } from "redux/constant";

export type UpdateDatasetInfoRequest = {
  is_anonymized: boolean;
  title: string;
  description: string;
  topic: DatasetTopic[];
};

export type UpdateAnonymizedInfoRequest = {
  qsi: string[];
  secLvl: number;
};

export interface UploadingContextType {
  file: UploadFile;
  currentStep: number;
  formStep2: FormInstance<UpdateDatasetInfoRequest>;
  formStep3: FormInstance<UpdateAnonymizedInfoRequest>;
  setFile: (file: UploadFile) => void;
  next: (step: number) => void;
  prev: () => void;
}

export const UploadingContext = createContext<UploadingContextType | null>(
  null
);
