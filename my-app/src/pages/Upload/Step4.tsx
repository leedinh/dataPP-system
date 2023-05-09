import React from "react";
import { SmileOutlined } from "@ant-design/icons";
import { Button, Result } from "antd";

const Step4: React.FC = () => (
  <Result
    icon={<SmileOutlined />}
    title="Great, we have done all the operations!"
    extra={
      <Button href="/profile" type="primary">
        Next
      </Button>
    }
  />
);

export default Step4;
