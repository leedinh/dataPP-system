import { createAsyncThunk } from "@reduxjs/toolkit";
import { sendGetRequest } from "redux/common/fetch";

export const getAllDatasetsThunk = createAsyncThunk(
  "getAllDatasets",
  async () => {
    return sendGetRequest("/api/datasets").then((res: any) => res.json());
  }
);

export const getTopicDatasetsThunk = createAsyncThunk(
  "getTopicDatasets",
  async (topic: string) => {
    return sendGetRequest(`/api/datasets/${topic}`).then((res: any) =>
      res.json()
    );
  }
);

export const getTopDownloadThunk = createAsyncThunk(
  "getTopDownload",
  async () => {
    return sendGetRequest(`/api/dataset/top_download`).then((res: any) =>
      res.json()
    );
  }
);

export const getTopUploadThunk = createAsyncThunk("getTopUpload", async () => {
  return sendGetRequest(`/api/user/top_upload`).then((res: any) => res.json());
});
