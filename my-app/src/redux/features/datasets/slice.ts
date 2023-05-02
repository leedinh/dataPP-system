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
import { getAllDatasetsThunk, getTopicDatasetsThunk } from "./thunks";

export type DatasetState = {
  loading: boolean;
  datasets: DatasetInfo[];
} & CommonState;

const initialState: DatasetState = {
  status: StatusEnum.IDLE,
  loading: false,
  datasets: [],
};

export type DatasetInfo = {
  date: string;
  did: string;
  filename: string;
  is_anonymized: true;
  title: string;
  topic: string;
  uid: string;
  path: string;
  status: string;
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
        isRejected(getAllDatasetsThunk, getTopicDatasetsThunk),
        (state, action) => {
          state.status = StatusEnum.FAILED;
          console.log(action);
          notification.error({
            message: action.error.message || "",
          });
        }
      )
      .addMatcher(
        isPending(getAllDatasetsThunk, getTopicDatasetsThunk),
        (state) => {
          state.status = StatusEnum.LOADING;
        }
      )
      .addMatcher(isFulfilled(getAllDatasetsThunk), (state, action) => {
        state.status = StatusEnum.SUCCEEDED;
        state.loading = false;
        state.datasets = action.payload;
        console.log("Datasets:", action.payload);
      })
      .addMatcher(isFulfilled(getTopicDatasetsThunk), (state, action) => {
        state.status = StatusEnum.SUCCEEDED;
        state.loading = false;
        state.datasets = action.payload;
        console.log("Datasets:", action.payload);
      }),
});

const { reducer } = slice;

export default reducer;

export const { clear } = slice.actions;

export const selectDatasetState = (state: RootState) => state.datasets;
