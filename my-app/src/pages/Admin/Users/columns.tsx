import type { ColumnsType } from "antd/es/table";
import { DeleteFilled } from "@ant-design/icons";

import { Button } from "antd";
import { deleteDatasetThunk } from "redux/features/profile/thunks";
import { useAppDispatch } from "redux/store";
import { UserInfo } from "redux/features/admin/slice";
import DatasetDialog from "./DatasetsDialog";

export default function useColumn() {
  const dispatch = useAppDispatch();
  const handleDelete = (uid: string) => {
    dispatch(deleteDatasetThunk(uid));
  };

  const columns: ColumnsType<UserInfo> = [
    {
      title: "ID",
      dataIndex: "key",
      render: (_, __, index) => {
        return <>{index + 1}</>;
      },
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Upload datasets",
      dataIndex: "upload_count",
      key: "upload_count",
    },
    {
      title: "Free storage",
      dataIndex: "storage_count",
      key: "storage_count",
    },
    {
      title: "Action",
      render: (_, { uid }) => {
        return (
          <>
            <Button
              danger
              icon={<DeleteFilled />}
              onClick={() => handleDelete(uid)}
              className="mr-4"
            ></Button>
            <DatasetDialog />
          </>
        );
      },
    },
  ];

  return {
    columns,
  };
}
