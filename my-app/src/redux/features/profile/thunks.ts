import { createAsyncThunk } from "@reduxjs/toolkit";
import { sendGetRequest, sendRequest } from "redux/common/fetch";

export const getUserDatasetsThunk = createAsyncThunk(
  "getUserDatasets",
  async () => {
    return sendGetRequest("/api/user/datasets", true).then((res: any) =>
      res.json()
    );
  }
);

export const getUserProfileThunk = createAsyncThunk(
  "getUserProfile",
  async () => {
    return sendGetRequest(`/api/user`, true).then((res: any) => res.json());
  }
);

export const deleteDatasetThunk = createAsyncThunk(
  "deleteDataset",
  async (did: string) => {
    return sendRequest("DELETE", `/api/dataset/delete/${did}`, {}, true).then(
      (res: any) => res.json()
    );
  }
);
