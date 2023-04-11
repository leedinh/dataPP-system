import { useEffect, useState } from "react";
import { Form, message, Upload, Checkbox } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import { useAppDispatch } from "redux/store";
import { uploadDatasetThunk } from "redux/features/uploadProcess/thunks";
import { DatasetInfo } from "redux/features/uploadProcess/slice";

const { Dragger } = Upload;

type Step2Props = {
  dataInfo: DatasetInfo;
  next: () => void;
};

const Step2: React.FC<Step2Props> = ({ dataInfo, next }) => {
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

  const handleUpload = (values: any) => {
    const formData = new FormData();
    formData.append("file", file as RcFile);
    console.log(values);
    formData.append("anonymize", values);
    formData.append("dataInfo", Object.entries(dataInfo).toString());
    setUploading(true);
    const response = dispatch(uploadDatasetThunk(formData));
    response
      .then(() => {
        next();
      })
      .catch(() => {
        message.error("upload failed.");
      })
      .finally(() => {
        setUploading(false);
      });
  };

  useEffect(() => {
    console.log(dataInfo);
  }, []);

  return (
    <Form id="form2" onFinish={handleUpload}>
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
      <Form.Item className="mt-4" name="anonymize" valuePropName="checked">
        <Checkbox defaultChecked={false}>
          I want to anonymize this dataset
        </Checkbox>
      </Form.Item>
    </Form>
  );
};

export default Step2;
