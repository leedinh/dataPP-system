import React, { useState } from "react";
import { Button, Steps, Space, Form } from "antd";
import Step1 from "./Step1";
import Step2 from "./Step2";
import { DatasetInfo } from "redux/features/uploadProcess/slice";

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
];

const UploadDataset: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formInfo] = Form.useForm<DatasetInfo>();

  const MAX_STEP = items.length;

  const nextStep = () => {
    const next = currentStep + 1;
    setCurrentStep(next);
  };

  const previousStep = () => {
    const prev = currentStep - 1;
    setCurrentStep(prev);
  };

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
            {currentStep === 1 && <Step1 form={formInfo} next={nextStep} />}
            {currentStep === 2 && (
              <Step2 dataInfo={formInfo.getFieldsValue()} next={nextStep} />
            )}
          </div>
        </div>
        <Space wrap className="flex justify-between">
          <Button
            ghost={currentStep === 1}
            disabled={currentStep === 1}
            onClick={previousStep}
          >
            Back
          </Button>
          {currentStep === MAX_STEP ? (
            <Button type="primary">Finish</Button>
          ) : (
            <Form.Item>
              <Button
                form={`form${currentStep}`}
                type="primary"
                htmlType="submit"
              >
                Continue
              </Button>
            </Form.Item>
          )}
        </Space>
      </div>
    </div>
  );
};

export default UploadDataset;
