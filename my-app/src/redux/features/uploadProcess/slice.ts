import { createSlice } from "@reduxjs/toolkit";

import { CommonState } from "redux/common/types";
import { StatusEnum } from "redux/constant";
import { RootState } from "redux/reducers";
import {
  uploadDatasetThunk,
  updateDatasetInfoThunk,
  updateAnonymizedInfoThunk,
} from "./thunks";

export type UploadState = {
  loading: boolean;
  fields: FieldsTableType[];
  fileid?: string;
} & CommonState;

const initialState: UploadState = {
  status: StatusEnum.IDLE,
  loading: false,
  fields: [],
};

export type FieldsTableType = {
  key: number;
  name: string;
};

const slice = createSlice({
  name: "upload",
  initialState,
  reducers: {
    clear: (state) => {
      state = { ...initialState };
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(uploadDatasetThunk.rejected, (state) => {
        state.status = StatusEnum.FAILED;
        state.loading = false;
      })
      .addCase(uploadDatasetThunk.pending, (state) => {
        state.status = StatusEnum.LOADING;
        state.loading = true;
      })
      .addCase(uploadDatasetThunk.fulfilled, (state, action) => {
        state.status = StatusEnum.SUCCEEDED;
        state.loading = false;
        state.fileid = action.payload["file_id"];
        console.log(state.fileid);
      })
      .addCase(updateDatasetInfoThunk.rejected, (state) => {
        state.status = StatusEnum.FAILED;
        state.loading = false;
      })
      .addCase(updateDatasetInfoThunk.pending, (state) => {
        state.status = StatusEnum.LOADING;
        state.loading = true;
      })
      .addCase(updateDatasetInfoThunk.fulfilled, (state, action) => {
        state.status = StatusEnum.SUCCEEDED;
        state.loading = false;
        console.log("After step 2: ", action.payload);
        state.fields = (action.payload.columns as Array<string>).map(
          (value, index) => {
            return {
              key: index,
              name: value,
            };
          }
        );
      })
      .addCase(updateAnonymizedInfoThunk.rejected, (state) => {
        state.status = StatusEnum.FAILED;
        state.loading = false;
      })
      .addCase(updateAnonymizedInfoThunk.pending, (state) => {
        state.status = StatusEnum.LOADING;
        state.loading = true;
      })
      .addCase(updateAnonymizedInfoThunk.fulfilled, (state, action) => {
        console.log(action);
        state.status = StatusEnum.SUCCEEDED;
        state.loading = false;
        console.log("After step 3: ", state);
      }),
});

const { reducer } = slice;

export default reducer;

export const { clear } = slice.actions;

export const selectUploadState = (state: RootState) => state.upload;
