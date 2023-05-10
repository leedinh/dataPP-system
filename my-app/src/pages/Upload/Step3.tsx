import React, { useContext, useState } from "react";
import { Form, Select } from "antd";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

import { selectUploadState } from "redux/features/uploadProcess/slice";
import { useAppSelector, useAppDispatch } from "redux/store";
import { updateAnonymizedInfoThunk } from "redux/features/uploadProcess/thunks";
import { UploadingContext } from "context/UploadingContext";

type Step3Props = {};

const getDegree = (value: number) => {
  if (value < 50) {
    return "Low";
  } else if (value < 70) {
    return "Medium";
  }
  return "High";
};

const Step3: React.FC<Step3Props> = () => {
  const dispatch = useAppDispatch();
  const { formStep3, next } = useContext(UploadingContext)!;
  const { fields, fileid } = useAppSelector(selectUploadState);
  const [secDegree, setSecDegree] = useState<string>("Medium");
  const [ruleDegree, setRuleDegree] = useState<string>("Medium");

  const onFinish = (values: any) => {
    console.log("Send request step 3", values);
    // Send request
    dispatch(
      updateAnonymizedInfoThunk({
        ...values,
        fileid: fileid,
      })
    ).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        next(1);
      }
    });
  };

  const handleChange = (value: string[]) => {
    formStep3.setFieldValue("qsi", value);
  };

  const onSlider1Change = (value: any) => {
    // console.log(value);
    setSecDegree(getDegree(value));
    formStep3.setFieldValue("sec_level", Number(value));
  };
  const onSlider2Change = (value: any) => {
    // console.log(value);
    setRuleDegree(getDegree(value));
    formStep3.setFieldValue("rule_level", Number(value));
  };

  return (
    <Form
      className="w-2/3"
      id="form3"
      form={formStep3}
      onFinish={onFinish}
      layout="vertical"
    >
      <Form.Item
        label="Choose sensitive attributes: "
        name="qsi"
        rules={[
          { required: true, message: "Please choose at least 1 attribute" },
        ]}
      >
        <Select
          mode="multiple"
          allowClear
          className=""
          placeholder="Please select"
          onChange={handleChange}
          options={fields}
        />
      </Form.Item>
      <Form.Item label="Security level:" name="sec_level" initialValue={50}>
        <Slider onChange={onSlider1Change} min={0} max={100} step={1} />
      </Form.Item>
      <div className="">{secDegree}</div>
      <Form.Item label="Rule level:" name="rule_level" initialValue={50}>
        <Slider onChange={onSlider2Change} min={0} max={100} step={1} />
      </Form.Item>
      <div className="">{ruleDegree}</div>
    </Form>
  );
};

export default Step3;
