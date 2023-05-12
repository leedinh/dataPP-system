import { Modal, Button, Descriptions, Tag } from "antd";
import { DatasetInfo } from "redux/features/datasets/slice";

type DetailDatasetProps = {
  open: boolean;
  close: () => void;
  data: DatasetInfo;
};

const DetailDataset: React.FC<DetailDatasetProps> = ({ open, close, data }) => {
  const {
    is_anonymized,
    author,
    date,
    description,
    download_count,
    title,
    did,
  } = data;
  return (
    <Modal
      title="Dataset Information"
      maskClosable
      centered
      cancelText="Close"
      open={open}
      onCancel={() => close()}
      footer={
        <>
          <Button onClick={() => close()}>Close</Button>
          <Button
            href={`http://localhost:5050/api/dataset/download/${did}`}
            type="primary"
          >
            Download
          </Button>
        </>
      }
    >
      <Descriptions bordered column={1} className="p-4">
        <Descriptions.Item label="Title">
          {title}
          <span className="ml-2">
            {is_anonymized ? (
              <Tag className="w-fit mt-2 bg-black text-white py-1 rounded-lg">
                Anonymized
              </Tag>
            ) : (
              <Tag color="blue" className="w-fit mt-2 py-1 rounded-lg">
                Raw
              </Tag>
            )}
          </span>
        </Descriptions.Item>
        <Descriptions.Item label="Author">{author}</Descriptions.Item>
        <Descriptions.Item label="Description">{description}</Descriptions.Item>
        <Descriptions.Item label="Uploaded at:">{date}</Descriptions.Item>
        <Descriptions.Item label="Downloaded:">
          {download_count}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default DetailDataset;
