import { createSlice } from "@reduxjs/toolkit";

import { CommonState } from "redux/common/types";
import { StatusEnum } from "redux/constant";
import { RootState } from "redux/reducers";
import { uploadDatasetThunk } from "./thunks";

export type UploadState = {} & CommonState;

const initialState: UploadState = {
  status: StatusEnum.IDLE,
  error: undefined,
};

const slice = createSlice({
  name: "upload",
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(uploadDatasetThunk.rejected, (state) => {
        state.status = StatusEnum.FAILED;
      })
      .addCase(uploadDatasetThunk.pending, (state) => {
        state.status = StatusEnum.LOADING;
      })
      .addCase(uploadDatasetThunk.fulfilled, (state, action) => {
        console.log("Set success");
        state.status = StatusEnum.SUCCEEDED;
        console.log(action);
      }),
});

const { reducer } = slice;

export default reducer;

export const selectAuthState = (state: RootState) => state.upload;
