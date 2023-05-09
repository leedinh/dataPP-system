import React, { useContext } from "react";
import { Form, Table, Slider } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { SliderMarks } from "antd/es/slider";

import {
  selectUploadState,
  FieldsTableType,
} from "redux/features/uploadProcess/slice";
import { useAppSelector, useAppDispatch } from "redux/store";
import { updateAnonymizedInfoThunk } from "redux/features/uploadProcess/thunks";
import { UploadingContext } from "context/UploadingContext";

type Step3Props = {};

const columns: ColumnsType<FieldsTableType> = [
  {
    title: "Field",
    dataIndex: "name",
    render: (text: string) => <span>{text}</span>,
  },
];

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
  // rowSelection object indicates the need for row selection
  const rowSelection = {
    onChange: (
      selectedRowKeys: React.Key[],
      selectedRows: FieldsTableType[]
    ) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
      formStep3.setFieldValue("qsi", selectedRowKeys);
    },
  };

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
      className="grid grid-cols-3 gap-16"
      id="form3"
      form={formStep3}
      onFinish={onFinish}
      layout="vertical"
    >
      <Form.Item name="qsi">
        <Table
          className="border-collapse rounded-full w-[300px]"
          rowSelection={{
            type: "checkbox",
            ...rowSelection,
          }}
          columns={columns}
          dataSource={fields}
          scroll={{ y: 240 }}
          pagination={false}
        />
      </Form.Item>
      <div className="col-span-2">
        <Form.Item label="Security level" name="sec_level" initialValue={50}>
          <Slider onChange={onSlider1Change} marks={marks} step={1} />
        </Form.Item>
        <Form.Item label="Rule level" name="rule_level" initialValue={50}>
          <Slider onChange={onSlider2Change} marks={marks} step={1} />
        </Form.Item>
      </div>
    </Form>
  );
};

export default Step3;
