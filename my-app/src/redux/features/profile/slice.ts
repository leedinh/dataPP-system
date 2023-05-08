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
  updateUsernameThunk,
  updateDatasetThunk,
} from "./thunks";
import { DatasetInfo } from "../datasets/slice";

export type UserProfileState = {
  loading: boolean;
  datasets: DatasetInfo[];
  userInfo: UserInfo;
} & CommonState;

const initialState: UserProfileState = {
  status: StatusEnum.IDLE,
  loading: false,
  datasets: [],
  userInfo: {
    username: "",
    email: "",
    upload_count: 0,
  },
};

type UserInfo = {
  username: string;
  email: string;
  upload_count: number;
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
          deleteDatasetThunk,
          updateUsernameThunk,
          updateDatasetThunk
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
          deleteDatasetThunk,
          updateUsernameThunk,
          updateDatasetThunk
        ),
        (state) => {
          state.status = StatusEnum.LOADING;
        }
      )
      .addMatcher(isFulfilled(getUserProfileThunk), (state, action) => {
        state.status = StatusEnum.SUCCEEDED;
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addMatcher(isFulfilled(deleteDatasetThunk), (state, action) => {
        state.status = StatusEnum.SUCCEEDED;
        state.loading = false;
        state.datasets = state.datasets.filter(
          (value) => value.did !== action.meta.arg
        );
      })
      .addMatcher(isFulfilled(updateUsernameThunk), (state, action) => {
        state.status = StatusEnum.SUCCEEDED;
        state.loading = false;
        state.userInfo.username = action.meta.arg;
      })
      .addMatcher(isFulfilled(updateDatasetThunk), (state, action) => {
        state.status = StatusEnum.SUCCEEDED;
        state.loading = false;
        const { did, topic, title } = action.meta.arg;
        const idx = state.datasets.findIndex((value) => value.did === did);
        state.datasets[idx].title = title;
        state.datasets[idx].topic = topic;
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
