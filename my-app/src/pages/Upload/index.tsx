import React, { useEffect } from "react";
import { Button, Steps, Space, Form } from "antd";
import { selectUploadState } from "redux/features/uploadProcess/slice";
import { prev } from "redux/features/uploadProcess/slice";
import { useAppDispatch, useAppSelector } from "redux/store";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";

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
  const { currentStep, loading } = useAppSelector(selectUploadState);
  const dispatch = useAppDispatch();

  const MAX_STEP = items.length - 1;

  useEffect(() => {
    console.log("Step ", currentStep);
  }, [currentStep]);

  return (
    <div className="flex justify-center">
      <div className="w-1/2">
        <div className="shadow-xl p-16 rounded-3xl mb-8">
          <Steps
            current={currentStep - 1}
            percent={50}
            labelPlacement="vertical"
            items={items}
          />
          <div className="mt-8">
            {currentStep === 1 && <Step1 />}
            {currentStep === 2 && <Step2 />}
            {currentStep === 3 && <Step3 />}
            {currentStep === 4 && <Step4 />}
          </div>
        </div>
        <Space wrap className="flex justify-between">
          {currentStep < 4 && (
            <>
              <Button
                ghost={currentStep === 1}
                disabled={currentStep === 1}
                onClick={() => dispatch(prev())}
              >
                Back
              </Button>
              {currentStep === MAX_STEP ? (
                <Button loading={loading} type="primary">
                  Finish
                </Button>
              ) : (
                <Form.Item>
                  <Button
                    form={`form${currentStep}`}
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                  >
                    Continue
                  </Button>
                </Form.Item>
              )}
            </>
          )}
        </Space>
      </div>
    </div>
  );
};

export default UploadDataset;
