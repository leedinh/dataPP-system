import { Button, Space, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DeleteFilled, CheckOutlined, CloseOutlined } from "@ant-design/icons";

import { DatasetInfo } from "redux/features/datasets/slice";
import { deleteDatasetThunk } from "redux/features/profile/thunks";
import { useAppDispatch } from "redux/store";
import EditModal from "./EditModal";

const mappingColorStatus: any = {
  completed: "success",
  idle: "cyan",
  anonymizing: "processing",
  pending: "orange",
  created: "success",
};

export default function useColumn() {
  const dispatch = useAppDispatch();
  const handleDelete = (did: string) => {
    dispatch(deleteDatasetThunk(did));
  };

  const columns: ColumnsType<DatasetInfo> = [
    {
      title: "ID",
      dataIndex: "key",
      render: (_, __, index) => {
        return <>{index + 1}</>;
      },
      align: "center",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: 300,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 700,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Anonymized",
      key: "is_anonymized",
      dataIndex: "is_anonymized",
      render: (_, { is_anonymized }) =>
        is_anonymized ? <CheckOutlined /> : <CloseOutlined />,
      align: "center",
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (_, { status }) => (
        <Tag color={mappingColorStatus[status]} key={status}>
          {status?.toUpperCase() || "UNDEFINED"}
        </Tag>
      ),
      align: "center",
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
