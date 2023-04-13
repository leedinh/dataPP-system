import { useContext } from "react";
import { Form, message, notification, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import type { RcFile, UploadProps } from "antd/es/upload/interface";
import { uploadDatasetThunk } from "redux/features/uploadProcess/thunks";
import { useAppDispatch } from "redux/store";
import { UploadingContext } from "context/UploadingContext";

const { Dragger } = Upload;

type Step1Props = {};

const Step1: React.FC<Step1Props> = () => {
  const { file, setFile, next } = useContext(UploadingContext)!;
  const dispatch = useAppDispatch();
  const props: UploadProps = {
    name: "file",
    multiple: false,
    fileList: file ? [file] : [],
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
    // Send request
    if (!!file) {
      const response = dispatch(uploadDatasetThunk(formData));
      response
        .then((value) => {
          console.log(value);
          next(1);
        })
        .catch(() => {
          message.error("upload failed.");
        })
        .finally(() => {});
    } else {
      notification.error({
        placement: "topRight",
        duration: 3,
        message: "Please upload file",
      });
    }
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
