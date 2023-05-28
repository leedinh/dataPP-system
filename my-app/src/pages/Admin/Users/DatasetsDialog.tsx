import { useState } from "react";
import { Button, Modal } from "antd";
import { InfoOutlined } from "@ant-design/icons";
import DatasetManagement from "../Datasets";

const DatasetDialog: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
      <Button
        type="primary"
        icon={<InfoOutlined />}
        onClick={() => setModalOpen(true)}
      ></Button>
      <Modal
        title="Datasets of vyntt"
        centered
        width={1200}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={<Button onClick={() => setModalOpen(false)}>Cancel</Button>}
      >
        <DatasetManagement />
      </Modal>
    </>
  );
};

export default DatasetDialog;
