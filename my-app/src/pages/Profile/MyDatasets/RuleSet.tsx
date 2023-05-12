import { useState } from "react";
import { Button, Modal } from "antd";

import { useAppDispatch } from "redux/store";
import { getResultDatasetThunk } from "redux/features/profile/thunks";

type RuleSetProps = {
  did: string;
  disabled: boolean;
};

const RuleSet: React.FC<RuleSetProps> = ({ did, disabled }) => {
  const dispatch = useAppDispatch();
  const [modalOpen, setModalOpen] = useState(false);

  const onClick = () => {
    dispatch(getResultDatasetThunk(did));
    setModalOpen(true);
  };

  return (
    <>
      <Button disabled={disabled} type="link" onClick={onClick}>
        Detail
      </Button>
      <Modal
        title="Rule set"
        centered
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={<Button onClick={() => setModalOpen(false)}>Cancle</Button>}
      >
        Rule Set
      </Modal>
    </>
  );
};

export default RuleSet;
