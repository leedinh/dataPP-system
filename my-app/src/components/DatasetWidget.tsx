import React, { useState } from "react";
import { Avatar, Button, Card, Descriptions, Modal, Tag } from "antd";
import { AntDesignOutlined, DownloadOutlined } from "@ant-design/icons";

import { DatasetInfo } from "redux/features/datasets/slice";
import styles from "./styles.module.scss";
import Typography from "antd/es/typography/Typography";

const DataSetWidget: React.FC<DatasetInfo> = ({
  author,
  title,
  date,
  did,
  is_anonymized,
  download_count,
  description,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

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
            {!is_anonymized ? (
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
            href={`http://localhost:5050/api/downloads/${did}`}
            shape="circle"
            size="large"
            className={styles.downloadButton}
            type="text"
            icon={<DownloadOutlined />}
          ></Button>
        </div>
      </Card>
      <Modal
        title="Dataset Information"
        maskClosable
        centered
        cancelText="Close"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={
          <Button onClick={() => setModalOpen(false)} type="primary">
            Close
          </Button>
        }
      >
        <Descriptions bordered column={1} className="pt-4">
          <Descriptions.Item label="Title">
            {title}
            <Tag className="ml-4">{is_anonymized ? "Anonymized" : "Raw"}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Author">{author}</Descriptions.Item>
          <Descriptions.Item label="Description">
            {description}
          </Descriptions.Item>
          <Descriptions.Item label="Uploaded at:">{date}</Descriptions.Item>
          <Descriptions.Item label="Downloaded:">
            {download_count}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    </>
  );
};

export default DataSetWidget;
