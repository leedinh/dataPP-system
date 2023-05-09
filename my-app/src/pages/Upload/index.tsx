import React from "react";
import { Button, Steps, Space, Divider } from "antd";
import { ArrowRightOutlined, ArrowLeftOutlined } from "@ant-design/icons";

import { selectUploadState } from "redux/features/uploadProcess/slice";
import { useAppSelector } from "redux/store";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import useUploading from "hook/useUploading";
import { UploadingContext } from "context/UploadingContext";
import styles from "pages/styles.module.scss";

const items = [
  {
    title: "Upload Dataset",
  },
  {
    title: "Dataset Information",
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

  return (
    <div className="flex justify-center mt-8">
      <div className="w-1/2">
        <div className={styles.uploadContainer}>
          <div className="px-16">
            <Steps
              responsive
              current={currentStep - 1}
              percent={50}
              labelPlacement="vertical"
              items={items}
            />
          </div>
          <Divider className="border-2" />
          <div className="mt-8 flex justify-center items-center h-[450px]">
            <UploadingContext.Provider value={contextInit}>
              {currentStep === 1 && <Step1 />}
              {currentStep === 2 && <Step2 />}
              {currentStep === 3 && <Step3 />}
              {currentStep === 4 && <Step4 />}
            </UploadingContext.Provider>
          </div>
        </div>
        <Space wrap className="flex justify-between mt-8">
          {currentStep < 4 && (
            <>
              <Button
                shape="circle"
                size="large"
                ghost={currentStep === 1}
                disabled={currentStep === 1}
                onClick={() => prev()}
                icon={<ArrowLeftOutlined />}
              ></Button>
              <Button
                shape="circle"
                size="large"
                form={`form${currentStep}`}
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<ArrowRightOutlined />}
              ></Button>
            </>
          )}
        </Space>
      </div>
    </div>
  );
};

export default UploadDataset;
