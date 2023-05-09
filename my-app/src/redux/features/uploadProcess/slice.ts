import {
  createSlice,
  isRejected,
  isFulfilled,
  isPending,
} from "@reduxjs/toolkit";
import { notification } from "antd";

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
  fields: any[];
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
      .addMatcher(
        isRejected(
          uploadDatasetThunk,
          updateDatasetInfoThunk,
          updateAnonymizedInfoThunk
        ),
        (state, action) => {
          state.status = StatusEnum.FAILED;
          console.log(action);
          notification.error({
            message: action.error.message || "",
          });
        }
      )
      .addMatcher(
        isPending(
          uploadDatasetThunk,
          updateDatasetInfoThunk,
          updateAnonymizedInfoThunk
        ),
        (state, action) => {
          state.status = StatusEnum.LOADING;
          console.log(action);
        }
      )
      .addMatcher(isFulfilled(uploadDatasetThunk), (state, action) => {
        state.status = StatusEnum.SUCCEEDED;
        state.loading = false;
        state.fileid = action.payload["file_id"];
        console.log(state.fileid);
      })
      .addMatcher(isFulfilled(updateDatasetInfoThunk), (state, action) => {
        state.status = StatusEnum.SUCCEEDED;
        state.loading = false;
        console.log("After step 2: ", action.payload);
        state.fields = (action.payload.columns as Array<string>).map(
          (value, index) => {
            return {
              label: value,
              value: index,
            };
          }
        );
      })
      .addMatcher(isFulfilled(updateAnonymizedInfoThunk), (state, action) => {
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
