import React from "react";
import { SmileOutlined } from "@ant-design/icons";
import { Button, Result } from "antd";

const Step4: React.FC = () => (
  <Result
    icon={<SmileOutlined />}
    title="Great, we have done all the operations!"
    subTitle="Thank for your contribution"
    extra={
      <>
        <Button href="/" type="primary">
          Back to Homepage
        </Button>
        <Button type="text" href="/profile">
          See your datasets
        </Button>
      </>
    }
  />
);

export default Step4;
