import { useState } from "react";
import { Form, message, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import { next } from "redux/features/uploadProcess/slice";
import { useAppDispatch } from "redux/store";

const { Dragger } = Upload;

type Step1Props = {};

const Step1: React.FC<Step1Props> = () => {
  const [file, setFile] = useState<UploadFile>();
  const [uploading, setUploading] = useState(false);
  const dispatch = useAppDispatch();
  const props: UploadProps = {
    name: "file",
    multiple: false,
    accept: ".csv",
    beforeUpload: () => {
      return false;
    },
    maxCount: 1,
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
        setFile(info.file);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const handleUpload = () => {
    console.log("Submit form 1");
    let formData = new FormData();
    formData.append("file", file as RcFile);
    setUploading(true);
    // Send request

    dispatch(next());
  };

  return (
    <Form id="form1" onFinish={handleUpload}>
      <Form.Item className="mt-4">
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibited from
            uploading company data or other banned files.
          </p>
        </Dragger>
      </Form.Item>
    </Form>
  );
};

export default Step1;
