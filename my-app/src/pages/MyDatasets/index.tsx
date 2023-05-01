import React, { useState } from "react";
import { Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";

import { DatasetInfo } from "redux/features/datasets/slice";

const columns: ColumnsType<DatasetInfo> = [
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "Author",
    dataIndex: "uid",
    key: "uid",
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
    render: (_, { status }) => <Tag key={status}>{status.toUpperCase()}</Tag>,
  },
  {
    title: "Action",
    key: "action",
    render: (_, { did }) => (
      <Space size="middle">
        <a></a>
        <a></a>
      </Space>
    ),
  },
];

const data: DatasetInfo[] = [
  {
    date: "string",
    did: "string",
    filename: "string",
    is_anonymized: true,
    title: "string",
    topic: "string",
    uid: "string",
    path: "string",
    status: "string",
  },
  {
    date: "string",
    did: "string",
    filename: "string",
    is_anonymized: true,
    title: "string",
    topic: "string",
    uid: "string",
    path: "string",
    status: "string",
  },
  {
    date: "string",
    did: "string",
    filename: "string",
    is_anonymized: true,
    title: "string",
    topic: "string",
    uid: "string",
    path: "string",
    status: "string",
  },
];

const rowSelection = {
  onChange: (selectedRowKeys: React.Key[], selectedRows: DatasetInfo[]) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      "selectedRows: ",
      selectedRows
    );
  },
};

const MyDatasets: React.FC = () => {
  return (
    <Table
      rowSelection={{
        type: "checkbox",
        ...rowSelection,
      }}
      columns={columns}
      dataSource={data}
    />
  );
};

export default MyDatasets;
