import { Result } from "antd";
import { ToolFilled } from "@ant-design/icons";

const NoData: React.FC = () => {
  return (
    <Result icon={<ToolFilled />} title="Your operation has been executed" />
  );
};

export default NoData;
