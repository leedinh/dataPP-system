import React from "react";
import { Avatar, Button, Card } from "antd";
import { AntDesignOutlined, DownloadOutlined } from "@ant-design/icons";

import { DatasetInfo } from "redux/features/datasets/slice";
import styles from "./styles.module.scss";
import Typography from "antd/es/typography/Typography";

const DataSetWidget: React.FC<DatasetInfo> = ({ author, title, date, did }) => (
  <Card className={styles.datasetCard}>
    <div className={styles.img}></div>
    <div className="flex justify-between">
      <div className="text-left">
        <Typography className="font-semibold">{title}</Typography>
        <Typography className="text-left text-slate-400">
          By {author}
        </Typography>
      </div>
      <div className="">
        <Avatar
          style={{ backgroundColor: "#1890ff" }}
          icon={<AntDesignOutlined />}
        />
      </div>
    </div>
    <div className="flex justify-between mt-4">
      <div className="">
        <Typography>Uploaded at: </Typography>
        <Typography>{date}</Typography>
      </div>
      <Button
        href={`http://localhost:5050/api/downloads/${did}`}
        shape="circle"
        size="large"
        className={styles.downloadButton}
        type="text"
        icon={<DownloadOutlined />}
      ></Button>
    </div>
  </Card>
);

export default DataSetWidget;
