import { Result } from "antd";
import { ToolFilled } from "@ant-design/icons";

const NoData: React.FC = () => {
  return (
    <Result icon={<ToolFilled />} subTitle="Your operation has been executed" />
  );
};

export default NoData;
