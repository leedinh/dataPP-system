import { createAsyncThunk } from "@reduxjs/toolkit";
import { uploadFile } from "redux/common/fetch";

export const uploadDatasetThunk = createAsyncThunk(
  "uploadDataset",
  async (request: any) => {
    return uploadFile("/api/upload", request).then((res: any) => res.json());
  }
);
