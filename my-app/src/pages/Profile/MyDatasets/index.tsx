import React, { useEffect } from "react";
import { Table } from "antd";

import { DatasetInfo } from "redux/features/datasets/slice";
import { useAppDispatch, useAppSelector } from "redux/store";
import { getUserDatasetsThunk } from "redux/features/profile/thunks";
import { selectUserProfileState } from "redux/features/profile/slice";
import useColumn from "./columns";
import styles from "pages/styles.module.scss";

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
  }, [dispatch]);
  return (
    <Table
      className={styles.datasetsTable}
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
