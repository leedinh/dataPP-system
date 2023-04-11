import { createSlice } from "@reduxjs/toolkit";

import { CommonState } from "redux/common/types";
import { StatusEnum, DatasetTopic } from "redux/constant";
import { RootState } from "redux/reducers";
import { uploadDatasetThunk } from "./thunks";

export type UploadState = {
  dataInfo?: DatasetInfo;
} & CommonState;

export type DatasetInfo = {
  name: string;
  description: string;
  topic: DatasetTopic;
};

const initialState: UploadState = {
  status: StatusEnum.IDLE,
  error: undefined,
};

const slice = createSlice({
  name: "upload",
  initialState,
  reducers: {
    setDataInfo: (state, action) => {
      console.log("Set datainfo", action.payload);
      state.dataInfo = action.payload;
    },
  },
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

export const { setDataInfo } = slice.actions;

export const selectUploadState = (state: RootState) => state.upload;
