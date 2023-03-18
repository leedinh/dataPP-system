import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchData } from "redux/common/dispatch";

export const getAuthThunk = createAsyncThunk("auth", async (request: any) => {
  return await fetchData(request);
});
