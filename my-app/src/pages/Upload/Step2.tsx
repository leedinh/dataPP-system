import React, { useContext } from "react";
import { Form, Checkbox, Input, Select, message } from "antd";
import { optionTopic } from "redux/constant";
import { selectUploadState } from "redux/features/uploadProcess/slice";
import { useAppDispatch, useAppSelector } from "redux/store";
import { updateDatasetInfoThunk } from "redux/features/uploadProcess/thunks";
import { UploadingContext } from "context/UploadingContext";

type Step2Props = {};

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

const Step2: React.FC<Step2Props> = () => {
  const dispatch = useAppDispatch();
  const { fileid } = useAppSelector(selectUploadState);
  const { formStep2, next } = useContext(UploadingContext)!;
  const onFinish = (values: any) => {
    console.log("Submit form 2");
    console.log(values);
    // Send request
    const response = dispatch(
      updateDatasetInfoThunk({ ...values, fileid: fileid })
    );
    response
      .then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          next(values["is_anonymized"] ? 1 : 2);
        }
      })
      .catch(() => {
        message.error("upload failed.");
      })
      .finally(() => {});
  };

  return (
    <Form
      {...layout}
      id="form2"
      form={formStep2}
      name="datasetInfo"
      style={{ maxWidth: 600 }}
      validateMessages={validateMessages}
      onFinish={onFinish}
    >
      <Form.Item name="title" label="Name" rules={[{ required: true }]}>
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
      <Form.Item
        className="mt-4"
        name="is_anonymized"
        valuePropName="checked"
        initialValue={false}
      >
        <Checkbox defaultChecked={false}>
          I want to anonymize this dataset
        </Checkbox>
      </Form.Item>
    </Form>
  );
};

export default Step2;
