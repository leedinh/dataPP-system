import { Button, Table } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import { useEffect } from "react";
import { selectAdminState } from "redux/features/admin/slice";
import { useAppDispatch, useAppSelector } from "redux/store";
import useColumn from "./columns";

const TopicManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { topics } = useAppSelector(selectAdminState);
  const { columns } = useColumn();
  useEffect(() => {}, []);
  return (
    <>
      <div className="text-left flex justify-between items-center ">
        <h1>Topic Management</h1>
        <Button type="primary" icon={<PlusOutlined />}></Button>
      </div>
      <Table dataSource={topics} columns={columns} />
    </>
  );
};

export default TopicManagement;
