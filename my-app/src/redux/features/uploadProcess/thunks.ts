import { createAsyncThunk } from "@reduxjs/toolkit";
import { uploadFile, sendRequest } from "redux/common/fetch";

export const uploadDatasetThunk = createAsyncThunk(
  "uploadDataset",
  async (request: any) => {
    return uploadFile("/api/dataset/upload", request).then((res: any) => res.json());
  }
);

export const updateDatasetInfoThunk = createAsyncThunk(
  "updateDatasetInfo",
  async (request: any) => {
    return sendRequest(
      "PATCH",
      `/api/dataset/update_info/${request.fileid}`,
      request,
      true
    ).then((res: any) => res.json());
  }
);

export const updateAnonymizedInfoThunk = createAsyncThunk(
  "updateAnonymizedInfo",
  async (request: any) => {
    return sendRequest(
      "POST",
      `/api/anonymize/${request.fileid || ""}`,
      request,
      true
    ).then((res: any) => res.json());
  }
);
