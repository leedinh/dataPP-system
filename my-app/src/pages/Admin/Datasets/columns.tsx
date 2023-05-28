import type { ColumnsType } from "antd/es/table";

import { DatasetInfo } from "redux/features/datasets/slice";
import { useAppDispatch } from "redux/store";
import { RuleInfo } from "redux/features/profile/slice";
import { Tag } from "antd";
import { getTopicLabel, mappingColorStatus } from "redux/constant";
import AnonymizeIcon from "pages/Profile/MyDatasets/AnonymizeIcon";

export default function useColumn() {
  const dispatch = useAppDispatch();

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
      width: 150,
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
      render: (_, { is_anonymized, did, status }) => (
        <AnonymizeIcon
          is_anonymized={is_anonymized}
          did={did}
          status={status}
        />
      ),
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
  ];

  const ruleSetColumns: ColumnsType<RuleInfo> = [];

  return {
    columns,
    ruleSetColumns,
  };
}
