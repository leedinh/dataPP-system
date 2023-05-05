import React, { useEffect } from "react";
import { Button, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DeleteFilled, EditFilled } from "@ant-design/icons";

import { DatasetInfo } from "redux/features/datasets/slice";
import { useAppDispatch, useAppSelector } from "redux/store";
import {
  deleteDatasetThunk,
  getUserDatasetsThunk,
} from "redux/features/profile/thunks";
import { selectUserProfileState } from "redux/features/profile/slice";
import useColumn from "./columns";

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
  const dispatch = useAppDispatch();
  const { datasets } = useAppSelector(selectUserProfileState);
  const { columns } = useColumn();

  useEffect(() => {
    dispatch(getUserDatasetsThunk());
  }, []);
  return (
    <Table
      rowSelection={{
        type: "checkbox",
        ...rowSelection,
      }}
      rowKey={"did"}
      columns={columns}
      dataSource={datasets}
    />
  );
};

export default MyDatasets;
