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
      color: "red",
    },
    label: <strong>Low</strong>,
  },
  50: {
    style: {
      color: "yellow",
    },
    label: <strong>Medium</strong>,
  },
  100: {
    style: {
      color: "green",
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
    );
    next(1);
  };

  const onSliderChange = (value: any) => {
    console.log(value);
    formStep3.setFieldValue("sec_level", Number(value));
  };

  return (
    <Form id="form3" form={formStep3} onFinish={onFinish}>
      <Form.Item name="qsi">
        <Table
          className="w-1/3 border-collapse rounded-full"
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
      <Form.Item name="sec_level" initialValue={50}>
        <Slider onChange={onSliderChange} marks={marks} step={1} />
      </Form.Item>
      <Form.Item name="rule_level" initialValue={50}>
        <Slider onChange={onSliderChange} marks={marks} step={1} />
      </Form.Item>
    </Form>
  );
};

export default Step3;
