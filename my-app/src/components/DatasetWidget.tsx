import React, { useState } from "react";
import { Avatar, Button, Card, Tag } from "antd";
import { AntDesignOutlined, DownloadOutlined } from "@ant-design/icons";
import { API_HOST } from "config/config";
import { DatasetInfo } from "redux/features/datasets/slice";
import styles from "./styles.module.scss";
import Typography from "antd/es/typography/Typography";
import DetailDataset from "./DetailDataset";

const DataSetWidget: React.FC<DatasetInfo> = (data) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { author, is_anonymized, date, title, did } = data;

  return (
    <>
      <Card className={styles.datasetCard} onClick={() => setModalOpen(true)}>
        <div className={styles.img}></div>
        <div className="flex justify-between">
          <div className="text-left flex flex-col gap-1">
            <Typography className="font-semibold">{title}</Typography>
            <Typography className="text-left text-slate-400">
              By {author}
            </Typography>
            {is_anonymized ? (
              <Tag className="w-fit mt-2 bg-black text-white px-3 py-1 rounded-lg">
                Anonymized
              </Tag>
            ) : (
              <Tag color="blue" className="w-fit mt-2 px-3 py-1 rounded-lg">
                Raw
              </Tag>
            )}
          </div>
          <div className="">
            <Avatar
              style={{ backgroundColor: "#1890ff" }}
              icon={<AntDesignOutlined />}
            />
          </div>
        </div>
        <div className="flex justify-between mt-4">
          <div>
            <Typography>Uploaded at: </Typography>
            <Typography>{date}</Typography>
          </div>
          <Button
            href={`${API_HOST}/api/dataset/download/${did}`}
            shape="circle"
            size="large"
            className={styles.downloadButton}
            type="text"
            icon={<DownloadOutlined />}
          ></Button>
        </div>
      </Card>
      <DetailDataset
        data={data}
        open={modalOpen}
        close={() => setModalOpen(false)}
      />
    </>
  );
};

export default DataSetWidget;
