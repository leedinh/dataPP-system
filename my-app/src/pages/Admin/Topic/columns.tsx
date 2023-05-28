import { Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DeleteFilled } from "@ant-design/icons";

import { TopicInfo } from "redux/features/admin/slice";
import { useAppDispatch } from "redux/store";

export default function useColumn() {
  const dispatch = useAppDispatch();

  const handleDelete = (tid: string) => {};

  const columns: ColumnsType<TopicInfo> = [
    {
      title: "ID",
      dataIndex: "key",
      render: (_, __, index) => {
        return <>{index + 1}</>;
      },
      align: "center",
    },
    {
      title: "Topic",
      dataIndex: "topic",
      key: "topic",
    },
    {
      title: "Action",
      render: (_, { tid }) => (
        <>
          <Button
            danger
            icon={<DeleteFilled />}
            onClick={() => handleDelete(tid)}
          ></Button>
        </>
      ),
    },
  ];

  return {
    columns,
  };
}
