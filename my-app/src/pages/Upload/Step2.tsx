import React, { useContext } from "react";
import { Form, Checkbox, Input, Select, message } from "antd";
import { optionTopic } from "redux/constant";
import { selectUploadState } from "redux/features/uploadProcess/slice";
import { useAppDispatch, useAppSelector } from "redux/store";
import { updateDatasetInfoThunk } from "redux/features/uploadProcess/thunks";
import { UploadingContext } from "context/UploadingContext";
import styles from "pages/styles.module.scss";

type Step2Props = {};

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
    <>
      <Form
        id="form2"
        className={styles.form}
        layout="vertical"
        form={formStep2}
        name="datasetInfo"
        validateMessages={validateMessages}
        onFinish={onFinish}
        title="Dataset Information"
        size="large"
      >
        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input maxLength={120} />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea maxLength={200} showCount />
        </Form.Item>
        <Form.Item
          initialValue={1}
          name="topic"
          label="Topic"
          rules={[{ required: true }]}
        >
          <Select onChange={handleChange} options={optionTopic} />
        </Form.Item>
        <Form.Item
          name="is_anonymized"
          valuePropName="checked"
          initialValue={true}
        >
          <Checkbox className="w-full" defaultChecked={true}>
            I want to anonymize this dataset
          </Checkbox>
        </Form.Item>
      </Form>
    </>
  );
};

export default Step2;
