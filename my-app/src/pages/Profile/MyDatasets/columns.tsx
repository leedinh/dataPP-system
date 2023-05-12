import { Button, Space, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  DeleteFilled,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

import { DatasetInfo } from "redux/features/datasets/slice";
import { deleteDatasetThunk } from "redux/features/profile/thunks";
import { useAppDispatch } from "redux/store";
import EditModal from "./EditModal";
import { getTopicLabel, mappingColorStatus } from "redux/constant";
import HistoryModal from "./HistoryModal";

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
      width: 150,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (_, { description }) => (
        <span className="inline">{description}</span>
      ),
      width: 250,
    },
    {
      title: "Size",
      dataIndex: "file_size",
      key: "file_size",
      width: 100,
      render: (_, { file_size }) => (
        <span>{(file_size / Math.pow(2, 10)).toFixed(2)} MB</span>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 130,
    },
    {
      title: "Anonymized",
      key: "is_anonymized",
      dataIndex: "is_anonymized",
      render: (_, { is_anonymized }) =>
        is_anonymized ? <CheckCircleOutlined /> : <CloseCircleOutlined />,
      align: "center",
    },
    {
      title: "Topic",
      key: "topic",
      dataIndex: "topic",
      render: (_, { topic }) => (
        <Tag color={mappingColorStatus[topic]} key={topic}>
          {getTopicLabel(Number(topic)) || "-"}
        </Tag>
      ),
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
          <HistoryModal did={value.did} />
        </Space>
      ),
    },
  ];

  return {
    columns,
  };
}
