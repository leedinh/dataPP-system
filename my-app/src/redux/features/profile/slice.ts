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
  getHistoryDatasetThunk,
  getResultDatasetThunk,
} from "./thunks";
import { DatasetInfo } from "../datasets/slice";

export type UserProfileState = {
  loading: boolean;
  datasets: DatasetInfo[];
  userInfo: any;
  history: HistoryInfo[];
  result: any;
} & CommonState;

const initialState: UserProfileState = {
  status: StatusEnum.IDLE,
  loading: false,
  datasets: [],
  userInfo: {},
  history: [],
  result: {},
};

type HistoryInfo = {
  status: string;
  time: string;
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
          updateDatasetThunk,
          getHistoryDatasetThunk,
          getResultDatasetThunk
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
          updateDatasetThunk,
          getHistoryDatasetThunk,
          getResultDatasetThunk
        ),
        (state) => {
          state.status = StatusEnum.LOADING;
        }
      )
      .addMatcher(isFulfilled(getUserProfileThunk), (state, action) => {
        state.status = StatusEnum.SUCCEEDED;
        state.loading = false;
        state.userInfo = action.payload;
        // console.log("User infor: ", state.userInfo);
      })
      .addMatcher(isFulfilled(getHistoryDatasetThunk), (state, action) => {
        state.status = StatusEnum.SUCCEEDED;
        state.loading = false;
        state.history = action.payload.histories;
        // console.log("History: ", state.history);
      })
      .addMatcher(isFulfilled(getResultDatasetThunk), (state, action) => {
        state.status = StatusEnum.SUCCEEDED;
        state.loading = false;
        state.result = action.payload;
        console.log("Result: ", state.history);
      })
      .addMatcher(isFulfilled(deleteDatasetThunk), (state, action) => {
        state.status = StatusEnum.SUCCEEDED;
        state.loading = false;
        state.datasets = state.datasets.filter(
          (value) => value.did !== action.meta.arg
        );
        notification.success({
          message: `Delete dataset successfully`,
        });
      })
      .addMatcher(isFulfilled(updateUsernameThunk), (state, action) => {
        state.status = StatusEnum.SUCCEEDED;
        state.loading = false;
        state.userInfo.username = action.meta.arg;
        notification.success({
          message: `Update username successfully`,
        });
      })
      .addMatcher(isFulfilled(updateDatasetThunk), (state, action) => {
        state.status = StatusEnum.SUCCEEDED;
        state.loading = false;
        const { did, topic, title } = action.meta.arg;
        const idx = state.datasets.findIndex((value) => value.did === did);
        state.datasets[idx].title = title;
        state.datasets[idx].topic = topic;
        notification.success({
          message: `Update dataset successfully`,
        });
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
