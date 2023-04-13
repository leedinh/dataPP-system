import { useEffect, useState } from "react";
import { useForm } from "antd/es/form/Form";
import type { UploadFile } from "antd/es/upload/interface";

import { selectUploadState, clear } from "redux/features/uploadProcess/slice";
import { useAppDispatch, useAppSelector } from "redux/store";
import {
  UpdateAnonymizedInfoRequest,
  UpdateDatasetInfoRequest,
  UploadingContextType,
} from "context/UploadingContext";

export default function useUploading() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formStep2] = useForm<UpdateDatasetInfoRequest>();
  const [formStep3] = useForm<UpdateAnonymizedInfoRequest>();
  const [file, setFile] = useState<UploadFile>();
  const { fileid } = useAppSelector(selectUploadState);
  const dispatch = useAppDispatch();

  const next = (step: number) => {
    setCurrentStep(currentStep + step);
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  useEffect(() => {
    console.log("Other process uploading");
    dispatch(clear());
  }, [fileid, dispatch]);

  return {
    file: file,
    currentStep: currentStep,
    formStep2: formStep2,
    formStep3: formStep3,
    setFile: setFile,
    next: next,
    prev: prev,
  } as UploadingContextType;
}
