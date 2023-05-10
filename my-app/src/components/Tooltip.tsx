import { Tooltip } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

type CustomTooltipProps = {
  message: string;
};

const CustomTooltip: React.FC<CustomTooltipProps> = ({ message }) => {
  return (
    <Tooltip placement="topLeft" title={message}>
      <ExclamationCircleOutlined />
    </Tooltip>
  );
};

export default CustomTooltip;
