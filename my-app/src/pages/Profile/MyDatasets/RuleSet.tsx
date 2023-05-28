import { useState } from "react";
import { Button, Descriptions, Modal, Table, Tag } from "antd";

import { useAppDispatch, useAppSelector } from "redux/store";
import { getResultDatasetThunk } from "redux/features/profile/thunks";
import { useRuleColumn } from "./columns";
import { selectUserProfileState } from "redux/features/profile/slice";
import { mappingColorLevel } from "redux/constant";

type RuleSetProps = {
  did: string;
  disabled: boolean;
};

const RuleSet: React.FC<RuleSetProps> = ({ did, disabled }) => {
  const dispatch = useAppDispatch();
  const { result } = useAppSelector(selectUserProfileState);
  const [modalOpen, setModalOpen] = useState(false);
  const { columns } = useRuleColumn();

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
        width={1200}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={<Button onClick={() => setModalOpen(false)}>Cancel</Button>}
      >
        <Descriptions column={2} className="mt-4">
          <Descriptions.Item label="K">{result?.k}</Descriptions.Item>
          <Descriptions.Item label="Security level ">
            {!!result ? (
              <Tag color={mappingColorLevel[result.sec_level]}>
                {result.sec_level}
              </Tag>
            ) : (
              "---"
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Rule amount ">
            {result?.no_rule || "---"}
          </Descriptions.Item>
          <Descriptions.Item label="Rule level ">
            {!!result ? (
              <Tag color={mappingColorLevel[result.rule_level]}>
                {result.rule_level}
              </Tag>
            ) : (
              "---"
            )}
          </Descriptions.Item>
        </Descriptions>
        <Table
          bordered
          scroll={{ y: 500 }}
          columns={columns}
          dataSource={result?.rules || []}
        />
      </Modal>
    </>
  );
};

export default RuleSet;
