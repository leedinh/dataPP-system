import { Table } from "antd";
import { useEffect } from "react";
import { UserInfo, selectAdminState } from "redux/features/admin/slice";
import { getAllUsersAdminThunk } from "redux/features/admin/thunks";
import { useAppDispatch, useAppSelector } from "redux/store";
import useColumn from "./columns";

const UserManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users } = useAppSelector(selectAdminState);
  const { columns } = useColumn();
  // useEffect(() => {
  //   dispatch(getAllUsersAdminThunk());
  // }, []);
  return (
    <>
      <Table dataSource={users} columns={columns}></Table>
    </>
  );
};

export default UserManagement;
