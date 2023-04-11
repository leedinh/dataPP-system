import React from "react";
import { Form, FormInstance, Input, Select, Button } from "antd";
import { DatasetTopic } from "redux/constant";
import { DatasetInfo, setDataInfo } from "redux/features/uploadProcess/slice";

type Step1Props = {
  form: FormInstance<DatasetInfo>;
  next: () => void;
};

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

/* eslint-disable no-template-curly-in-string */
const validateMessages = {
  required: "${label} is required!",
};

const handleChange = (value: string) => {
  console.log(`selected ${value}`);
};

const optionTopic = [
  {
    value: DatasetTopic.EDUCATION,
    label: "Education",
  },
  {
    value: DatasetTopic.ENTERTAINMENT,
    label: "Entertainment",
  },
  {
    value: DatasetTopic.MEDICAL,
    label: "Medical",
  },
  {
    value: DatasetTopic.SCIENCE,
    label: "Science",
  },
  {
    value: DatasetTopic.SOCIAL,
    label: "Social",
  },
  {
    value: DatasetTopic.UNSPECIFIED,
    label: "Other",
  },
];

const Step1: React.FC<Step1Props> = ({ form, next }) => {
  return (
    <Form
      {...layout}
      id="form1"
      form={form}
      name="datasetInfo"
      style={{ maxWidth: 600 }}
      validateMessages={validateMessages}
      onFinish={() => next()}
    >
      <Form.Item name="name" label="Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="description" label="Description">
        <Input.TextArea />
      </Form.Item>
      <Form.Item name="topic" label="Topic" rules={[{ required: true }]}>
        <Select
          style={{ width: 120 }}
          onChange={handleChange}
          options={optionTopic}
        />
      </Form.Item>
    </Form>
  );
};

export default Step1;
