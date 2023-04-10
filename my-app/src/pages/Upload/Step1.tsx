import { useState } from "react";
import { Button, message, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import { useAppDispatch } from "redux/store";
import { uploadDatasetThunk } from "redux/features/uploadProcess/thunks";

const { Dragger } = Upload;

const Step1: React.FC = () => {
  const [fileList, setFileList] = useState<UploadFile>();
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
        setFileList(info.file);
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
    const formData = new FormData();
    formData.append("file", fileList as RcFile);
    setUploading(true);
    const response = dispatch(uploadDatasetThunk(formData));
    response
      .catch(() => {
        message.error("upload failed.");
      })
      .finally(() => {
        setUploading(false);
      });
  };

  return (
    <>
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
      <Button
        type="primary"
        onClick={handleUpload}
        disabled={!!!fileList}
        loading={uploading}
        className="mt-4"
      >
        {uploading ? "Uploading" : "Start Upload"}
      </Button>
    </>
  );
};

export default Step1;
