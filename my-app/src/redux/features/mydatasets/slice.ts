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
import { getUserDatasetsThunk } from "./thunks";
import { DatasetInfo } from "../datasets/slice";

export type DatasetState = {
  loading: boolean;
  datasets: DatasetInfo[];
} & CommonState;

const initialState: DatasetState = {
  status: StatusEnum.IDLE,
  loading: false,
  datasets: [],
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
      .addMatcher(isRejected(getUserDatasetsThunk), (state, action) => {
        state.status = StatusEnum.FAILED;
        console.log(action);
        notification.error({
          message: action.error.message || "",
        });
      })
      .addMatcher(isPending(getUserDatasetsThunk), (state) => {
        state.status = StatusEnum.LOADING;
      })
      .addMatcher(isFulfilled(getUserDatasetsThunk), (state, action) => {
        state.status = StatusEnum.SUCCEEDED;
        state.loading = false;
        state.datasets = action.payload;
        console.log("Datasets:", action.payload);
      }),
});

const { reducer } = slice;

export default reducer;

export const { clear } = slice.actions;

export const selectUserDatasetState = (state: RootState) => state.user;
