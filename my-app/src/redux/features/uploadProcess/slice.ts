import { createSlice } from "@reduxjs/toolkit";

import { CommonState } from "redux/common/types";
import { StatusEnum } from "redux/constant";
import { RootState } from "redux/reducers";
import { uploadDatasetThunk, updateinfoThunk } from "./thunks";

export type UploadState = {
  currentStep: number;
  loading: boolean;
  fields: FieldsTableType[];
  fileid?: string;
} & CommonState;

const data: FieldsTableType[] = [
  {
    key: "11",
    name: "John Brown",
  },
  {
    key: "21",
    name: "Jim Green",
  },
  {
    key: "31",
    name: "Joe Black",
  },
  {
    key: "12",
    name: "John Brown",
  },
  {
    key: "22",
    name: "Jim Green",
  },
  {
    key: "32",
    name: "Joe Black",
  },
  {
    key: "13",
    name: "John Brown",
  },
  {
    key: "23",
    name: "Jim Green",
  },
  {
    key: "33",
    name: "Joe Black",
  },
];

const initialState: UploadState = {
  status: StatusEnum.IDLE,
  error: undefined,
  currentStep: 1,
  loading: false,
  fields: data,
};

export type FieldsTableType = {
  key: string;
  name: string;
};

const slice = createSlice({
  name: "upload",
  initialState,
  reducers: {
    next: (state, action) => {
      console.log("Increment");
      state.currentStep += action.payload;
    },
    prev: (state) => {
      console.log("Decrement");
      state.currentStep -= 1;
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
        state.fileid = action.payload['file_id'];
        console.log( state.fileid );
      }),


});

const { reducer } = slice;

export default reducer;

export const { next, prev } = slice.actions;

export const selectUploadState = (state: RootState) => state.upload;
