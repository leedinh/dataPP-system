import { createAsyncThunk } from "@reduxjs/toolkit";
import { sendGetRequest } from "redux/common/fetch";

export const getAllDatasetsThunk = createAsyncThunk(
  "getAllDatasets",
  async () => {
    return sendGetRequest("/api/datasets").then((res: any) => res.json());
  }
);
