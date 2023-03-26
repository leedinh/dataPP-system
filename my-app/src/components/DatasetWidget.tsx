import React from "react";
import { Avatar, Button, Card, Tooltip } from "antd";
import {
  AntDesignOutlined,
  UserOutlined,
  DownloadOutlined,
} from "@ant-design/icons";

import styles from "./styles.module.scss";
import Typography from "antd/es/typography/Typography";

const { Meta } = Card;

type DataSetWidgetProps = {
  author: string;
  name: string;
  publishAt: string;
};

const DataSetWidget: React.FC<DataSetWidgetProps> = ({
  author,
  name,
  publishAt,
}) => (
  <Card className={styles.datasetCard}>
    <div className={styles.img}></div>
    <div className="flex justify-between">
      <div className="">
        <Typography>{name}</Typography>
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
        <Typography>Latest update: {publishAt}</Typography>
      </div>
      <Button shape="circle" icon={<DownloadOutlined />}></Button>
    </div>
  </Card>
);

export default DataSetWidget;
