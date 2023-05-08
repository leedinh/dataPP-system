import { useState } from "react";
import { Button, Modal, Form, Input, Select } from "antd";
import { EditFilled } from "@ant-design/icons";

import { optionTopic } from "redux/constant";
import { DatasetInfo } from "redux/features/datasets/slice";
import { useAppDispatch } from "redux/store";
import { updateDatasetThunk } from "redux/features/profile/thunks";

const EditModal: React.FC<DatasetInfo> = ({
  title,
  topic,
  did,
  is_anonymized,
}) => {
  const dispatch = useAppDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [formDataset] = Form.useForm();

  const handleSubmit = () => {
    formDataset.submit();
  };

  const onFinish = (values: any) => {
    // TO DO: send request
    console.log(values);
    dispatch(
      updateDatasetThunk({
        ...values,
        did,
        is_anonymized,
      })
    );
    setModalOpen(false);
  };

  return (
    <>
      <Button
        type="primary"
        icon={<EditFilled />}
        onClick={() => setModalOpen(true)}
      ></Button>
      <Modal
        title="Dataset Information"
        centered
        open={modalOpen}
        onOk={() => handleSubmit()}
        onCancel={() => setModalOpen(false)}
      >
        <Form
          name="basic"
          form={formDataset}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ title, topic }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[
              { required: true, message: "Please input the dataset title!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="topic" label="Topic" rules={[{ required: true }]}>
            <Select style={{ width: 120 }} options={optionTopic} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EditModal;
