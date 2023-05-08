import { Button, Space, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DeleteFilled } from "@ant-design/icons";

import { DatasetInfo } from "redux/features/datasets/slice";
import { deleteDatasetThunk } from "redux/features/profile/thunks";
import { useAppDispatch } from "redux/store";
import EditModal from "./EditModal";

export default function useColumn() {
  const dispatch = useAppDispatch();
  const handleDelete = (did: string) => {
    dispatch(deleteDatasetThunk(did));
  };

  const columns: ColumnsType<DatasetInfo> = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Author",
      dataIndex: "author",
      key: "author",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (_, { status }) => (
        <Tag key={status}>{status?.toUpperCase() || "UNDEFINED"}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, value) => (
        <Space size="middle">
          <Button
            danger
            icon={<DeleteFilled />}
            onClick={() => handleDelete(value.did)}
          ></Button>
          <EditModal {...value} />
        </Space>
      ),
    },
  ];

  return {
    columns,
  };
}
