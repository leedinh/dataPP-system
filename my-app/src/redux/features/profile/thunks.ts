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

export const updateUsernameThunk = createAsyncThunk(
  "updateUsername",
  async (newUsername: string) => {
    return sendRequest(
      "PATCH",
      `/api/user/update_info`,
      { username: newUsername },
      true
    ).then((res: any) => res.json());
  }
);

export const updateDatasetThunk = createAsyncThunk(
  "updateDataset",
  async (request: any) => {
    return sendRequest(
      "PATCH",
      `/api/dataset/update_info/${request.did}`,
      request,
      true
    ).then((res: any) => res.json());
  }
);

export const getHistoryDatasetThunk = createAsyncThunk(
  "getHistoryDataset",
  async (did: string) => {
    return sendGetRequest(`/api/dataset/history/${did}`, true).then(
      (res: any) => res.json()
    );
  }
);

export const getResultDatasetThunk = createAsyncThunk(
  "getResultDataset",
  async (did: string) => {
    return sendGetRequest(`/api/dataset/anonymize/${did}/result`, true).then(
      (res: any) => res.json()
    );
  }
);
