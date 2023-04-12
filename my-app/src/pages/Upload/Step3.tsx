import React, { useState } from "react";
import { Form, Table, Slider } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useAppSelector } from "redux/store";
import { selectUploadState } from "redux/features/uploadProcess/slice";
import { FieldsTableType } from "redux/features/uploadProcess/slice";
import type { SliderMarks } from "antd/es/slider";
import { SecurityLevel } from "redux/constant";

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

const Step3: React.FC = () => {
  const { fields } = useAppSelector(selectUploadState);
  const [attributes, setAttributes] = useState<FieldsTableType[]>([]);
  const [securityLevel, setSecurityLevel] = useState<SecurityLevel>();
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
      setAttributes(selectedRows);
    },
  };

  const onFinish = () => {
    console.log("Send request step 3");
    console.log("Quasi-attribute: ", attributes);
    console.log("Security: ", securityLevel);
    // Send request
  };

  const onSliderChange = (value: any) => {
    console.log(value);
    let level = SecurityLevel.UNSPECIFIED;
    switch (value) {
      case 0:
        level = SecurityLevel.LOW;
        break;
      case 50:
        level = SecurityLevel.MEDIUM;
        break;
      case 100:
        level = SecurityLevel.HIGH;
        break;
      default:
        break;
    }
    setSecurityLevel(level);
  };

  return (
    <Form id="form3" onFinish={onFinish}>
      <div className="">
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
      </div>
      <div className="">
        <Slider
          onChange={onSliderChange}
          marks={marks}
          step={50}
          defaultValue={50}
        />
      </div>
    </Form>
  );
};

export default Step3;
