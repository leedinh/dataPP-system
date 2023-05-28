import { Table } from "antd";
import { useEffect } from "react";
import { selectAdminState } from "redux/features/admin/slice";
import { useAppDispatch, useAppSelector } from "redux/store";
import useColumn from "./columns";

const DatasetManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { datasets } = useAppSelector(selectAdminState);
  const { columns } = useColumn();
  useEffect(() => {}, []);
  return (
    <>
      <Table dataSource={datasets} columns={columns} />
    </>
  );
};

export default DatasetManagement;
