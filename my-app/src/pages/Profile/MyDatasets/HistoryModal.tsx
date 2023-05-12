import { useState } from "react";
import { Button, Modal } from "antd";
import { HistoryOutlined } from "@ant-design/icons";

import { useAppDispatch } from "redux/store";
import { getHistoryDatasetThunk } from "redux/features/profile/thunks";
import Progress from "./Progress";

type HistoryModalProps = {
  did: string;
};

const HistoryModal: React.FC<HistoryModalProps> = ({ did }) => {
  const dispatch = useAppDispatch();
  const [modalOpen, setModalOpen] = useState(false);

  const onClick = () => {
    dispatch(getHistoryDatasetThunk(did));
    setModalOpen(true);
  };

  return (
    <>
      <Button icon={<HistoryOutlined />} onClick={onClick}></Button>
      <Modal
        title="History"
        centered
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={<Button onClick={() => setModalOpen(false)}>Cancle</Button>}
      >
        <Progress />
      </Modal>
    </>
  );
};

export default HistoryModal;
