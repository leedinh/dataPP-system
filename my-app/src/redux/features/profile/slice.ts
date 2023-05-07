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
  getUserDatasetsThunk,
  getUserProfileThunk,
  deleteDatasetThunk,
} from "./thunks";
import { DatasetInfo } from "../datasets/slice";

export type UserProfileState = {
  loading: boolean;
  datasets: DatasetInfo[];
  userInfo: any;
} & CommonState;

const initialState: UserProfileState = {
  status: StatusEnum.IDLE,
  loading: false,
  datasets: [],
  userInfo: {},
};

const slice = createSlice({
  name: "profile",
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
          getUserDatasetsThunk,
          getUserProfileThunk,
          deleteDatasetThunk
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
          getUserDatasetsThunk,
          getUserProfileThunk,
          deleteDatasetThunk
        ),
        (state) => {
          state.status = StatusEnum.LOADING;
        }
      )
      .addMatcher(isFulfilled(getUserProfileThunk), (state, action) => {
        state.status = StatusEnum.SUCCEEDED;
        state.loading = false;
        state.userInfo = action.payload;
        console.log("UserInfo: ", state.userInfo);
      })
      .addMatcher(isFulfilled(deleteDatasetThunk), (state, action) => {
        state.status = StatusEnum.SUCCEEDED;
        state.loading = false;
        state.datasets = state.datasets.filter(
          (value) => value.did !== action.meta.arg
        );
      })
      .addMatcher(isFulfilled(getUserDatasetsThunk), (state, action) => {
        state.status = StatusEnum.SUCCEEDED;
        state.loading = false;
        state.datasets = action.payload;
      }),
});

const { reducer } = slice;

export default reducer;

export const { clear } = slice.actions;

export const selectUserProfileState = (state: RootState) => state.profile;
