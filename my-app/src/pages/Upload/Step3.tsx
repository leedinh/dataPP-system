import React, { useContext } from "react";
import { Form, Slider, Select } from "antd";
import type { SliderMarks } from "antd/es/slider";

import { selectUploadState } from "redux/features/uploadProcess/slice";
import { useAppSelector, useAppDispatch } from "redux/store";
import { updateAnonymizedInfoThunk } from "redux/features/uploadProcess/thunks";
import { UploadingContext } from "context/UploadingContext";

type Step3Props = {};

const marks: SliderMarks = {
  0: {
    style: {
      color: "#E76161",
    },
    label: <strong>Low</strong>,
  },
  50: {
    style: {
      color: "#FFD95A",
    },
    label: <strong>Medium</strong>,
  },
  100: {
    style: {
      color: "#A4D0A4",
    },
    label: <strong>High</strong>,
  },
};

const Step3: React.FC<Step3Props> = () => {
  const dispatch = useAppDispatch();
  const { formStep3, next } = useContext(UploadingContext)!;
  const { fields, fileid } = useAppSelector(selectUploadState);

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
    console.log(value);
    formStep3.setFieldValue("sec_level", Number(value));
  };
  const onSlider2Change = (value: any) => {
    console.log(value);
    formStep3.setFieldValue("sec_level", Number(value));
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
      <div className="col-span-2">
        <Form.Item label="Security level:" name="sec_level" initialValue={50}>
          <Slider onChange={onSlider1Change} marks={marks} step={1} />
        </Form.Item>
        <Form.Item label="Rule level:" name="rule_level" initialValue={50}>
          <Slider onChange={onSlider2Change} marks={marks} step={1} />
        </Form.Item>
      </div>
    </Form>
  );
};

export default Step3;
