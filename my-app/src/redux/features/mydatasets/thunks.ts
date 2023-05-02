import { createAsyncThunk } from "@reduxjs/toolkit";
import { sendGetRequest } from "redux/common/fetch";

export const getUserDatasetsThunk = createAsyncThunk(
  "getUserDatasets",
  async () => {
    return sendGetRequest("/api/user/datasets", true).then((res: any) =>
      res.json()
    );
  }
);
