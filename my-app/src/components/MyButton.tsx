import { Button } from "antd";

type MyButtonProps = {
  label: string;
};

const MyButton: React.FC<MyButtonProps> = ({ label }) => {
  return (
    <Button type="primary" htmlType="submit" className="w-full">
      {label}
    </Button>
  );
};

export default MyButton;
