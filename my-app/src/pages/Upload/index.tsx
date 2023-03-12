import React, { useState } from "react";
import { Button, Steps, Space } from "antd";
import { Outlet, useNavigate } from "react-router-dom";

const items = [
  {
    title: "Finished",
  },
  {
    title: "In Progress",
  },
  {
    title: "Waiting",
  },
  {
    title: "Waiting",
  },
];

const UploadDataset: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const MAX_STEP = items.length;

  const nextStep = () => {
    const next = currentStep + 1;
    setCurrentStep(next);
    navigate(`step${next}`);
  };

  const previousStep = () => {
    const prev = currentStep - 1;
    setCurrentStep(prev);
    navigate(`step${prev}`);
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
          <Outlet />
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
            <Button onClick={nextStep} type="primary">
              Continue
            </Button>
          )}
        </Space>
      </div>
    </div>
  );
};

export default UploadDataset;
