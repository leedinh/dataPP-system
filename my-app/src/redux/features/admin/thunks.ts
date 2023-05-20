import { createAsyncThunk } from "@reduxjs/toolkit";
import { sendGetRequest, sendRequest } from "redux/common/fetch";

export const addTopicAdminThunk = createAsyncThunk(
  "getTopicAdmin",
  async (request: any) => {
    return sendRequest("POST", "/api/admin/add/topic", request, true).then(
      (res: any) => res.json()
    );
  }
);
export const deleteUserThunk = createAsyncThunk(
  "deleteUser",
  async (uid: string) => {
    return sendRequest("DELETE", `/api/admin/user/${uid}/delete`, true).then(
      (res: any) => res.json()
    );
  }
);
export const getAllDatasetsAdminThunk = createAsyncThunk(
  "getAllDatasetsAdmin",
  async (uid: string) => {
    return sendGetRequest(`/api/admin/user/${uid}/datasets`, true).then(
      (res: any) => res.json()
    );
  }
);

export const getAllUsersAdminThunk = createAsyncThunk(
  "getAllUsersAdmin",
  async () => {
    return sendGetRequest(`/api/admin/users`, true).then((res: any) =>
      res.json()
    );
  }
);
