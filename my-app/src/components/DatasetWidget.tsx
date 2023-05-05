import React from "react";
import { Avatar, Button, Card, Tooltip } from "antd";
import {
  AntDesignOutlined,
  UserOutlined,
  DownloadOutlined,
} from "@ant-design/icons";

import { DatasetInfo } from "redux/features/datasets/slice";
import styles from "./styles.module.scss";
import Typography from "antd/es/typography/Typography";

const DataSetWidget: React.FC<DatasetInfo> = ({ author, title, date, did }) => (
  <Card className={styles.datasetCard}>
    <div className={styles.img}></div>
    <div className="flex justify-between">
      <div className="text-left">
        <Typography>{title}</Typography>
        <Typography className="text-left">By {author}</Typography>
      </div>
      <div className="">
        <Avatar.Group
          maxCount={2}
          maxStyle={{ color: "#f56a00", backgroundColor: "#fde3cf" }}
        >
          <Avatar src="https://joesch.moe/api/v1/random?key=2" />
          <Avatar style={{ backgroundColor: "#f56a00" }}>K</Avatar>
          <Tooltip title="Ant User" placement="top">
            <Avatar
              style={{ backgroundColor: "#87d068" }}
              icon={<UserOutlined />}
            />
          </Tooltip>
          <Avatar
            style={{ backgroundColor: "#1890ff" }}
            icon={<AntDesignOutlined />}
          />
        </Avatar.Group>
      </div>
    </div>
    <div className="flex justify-between mt-4">
      <div className="">
        <Typography>Latest update: {date}</Typography>
      </div>
      <Button
        href={`http://localhost:5050/api/downloads/${did}`}
        shape="circle"
        icon={<DownloadOutlined />}
      ></Button>
    </div>
  </Card>
);

export default DataSetWidget;
