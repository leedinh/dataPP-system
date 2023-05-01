import React from "react";
import { Button, Steps, Space, Form } from "antd";

import { selectUploadState } from "redux/features/uploadProcess/slice";
import { useAppSelector } from "redux/store";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import useUploading from "hook/useUploading";
import { UploadingContext } from "context/UploadingContext";

const items = [
  {
    title: "Dataset",
  },
  {
    title: "Raw Dataset",
  },
  {
    title: "Config",
  },
  {
    title: "Completed",
  },
];

const UploadDataset: React.FC = () => {
  const { loading } = useAppSelector(selectUploadState);
  const contextInit = useUploading();
  const { currentStep, prev } = contextInit;

  const MAX_STEP = items.length - 1;

  return (
    <div className="flex justify-center">
      <div className="w-1/2">
        <div className="shadow-xl shadow-outer p-16 rounded-3xl mb-8">
          <Steps
            current={currentStep - 1}
            percent={50}
            labelPlacement="vertical"
            items={items}
          />
          <div className="mt-8">
            <UploadingContext.Provider value={contextInit}>
              {currentStep === 1 && <Step1 />}
              {currentStep === 2 && <Step2 />}
              {currentStep === 3 && <Step3 />}
              {currentStep === 4 && <Step4 />}
            </UploadingContext.Provider>
          </div>
        </div>
        <Space wrap className="flex justify-between">
          {currentStep < 4 && (
            <>
              <Button
                ghost={currentStep === 1}
                disabled={currentStep === 1}
                onClick={() => prev()}
              >
                Back
              </Button>
              <Form.Item>
                <Button
                  form={`form${currentStep}`}
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                >
                  {currentStep === MAX_STEP ? "Finish" : "Continue"}
                </Button>
              </Form.Item>
            </>
          )}
        </Space>
      </div>
    </div>
  );
};

export default UploadDataset;
