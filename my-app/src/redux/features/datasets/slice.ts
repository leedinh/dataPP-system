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
  getAllDatasetsThunk,
  getTopicDatasetsThunk,
  getTopDownloadThunk,
  getTopUploadThunk,
} from "./thunks";

export type DatasetState = {
  loading: boolean;
  datasets: DatasetInfo[];
  topDownload: DatasetInfo[];
  topUpload: any[];
} & CommonState;

const initialState: DatasetState = {
  status: StatusEnum.IDLE,
  loading: false,
  topDownload: [],
  datasets: [],
  topUpload: [],
};

export type DatasetInfo = {
  date: string;
  did: string;
  filename: string;
  is_anonymized: boolean;
  description: string;
  title: string;
  topic: string;
  uid: string;
  path: string;
  status: string;
  author: string;
  download_count: number;
  file_size: number;
};

const slice = createSlice({
  name: "datasets",
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
          getAllDatasetsThunk,
          getTopicDatasetsThunk,
          getTopDownloadThunk,
          getTopUploadThunk
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
          getAllDatasetsThunk,
          getTopicDatasetsThunk,
          getTopDownloadThunk,
          getTopUploadThunk
        ),
        (state) => {
          state.status = StatusEnum.LOADING;
        }
      )
      .addMatcher(isFulfilled(getAllDatasetsThunk), (state, action) => {
        state.status = StatusEnum.SUCCEEDED;
        state.loading = false;
        state.datasets = action.payload;
        // console.log("Datasets:", action.payload);
      })
      .addMatcher(isFulfilled(getTopDownloadThunk), (state, action) => {
        state.status = StatusEnum.SUCCEEDED;
        state.loading = false;
        state.topDownload = action.payload;
        // console.log("Top download:", action.payload);
      })
      .addMatcher(isFulfilled(getTopUploadThunk), (state, action) => {
        state.status = StatusEnum.SUCCEEDED;
        state.loading = false;
        state.topUpload = action.payload;
        // console.log("Top upload:", action.payload);
      })
      .addMatcher(isFulfilled(getTopicDatasetsThunk), (state, action) => {
        state.status = StatusEnum.SUCCEEDED;
        state.loading = false;
        state.datasets = action.payload;
        // console.log("Datasets:", action.payload);
      }),
});

const { reducer } = slice;

export default reducer;

export const { clear } = slice.actions;

export const selectDatasetState = (state: RootState) => state.datasets;
