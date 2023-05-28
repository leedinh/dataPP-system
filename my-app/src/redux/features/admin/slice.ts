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
  deleteUserThunk,
  getAllDatasetsAdminThunk,
  addTopicAdminThunk,
  getAllUsersAdminThunk,
} from "./thunks";
import { DatasetInfo } from "../datasets/slice";

export type AdminState = {
  loading: boolean;
  users: UserInfo[];
  datasets: DatasetInfo[];
  topics: TopicInfo[];
} & CommonState;

const fakeDataTopic: TopicInfo[] = [
  {
    tid: "1",
    topic: "EDUCATION",
  },
  {
    tid: "2",
    topic: "SCIENCE",
  },
  {
    tid: "3",
    topic: "SOCIAL",
  },
  {
    tid: "1",
    topic: "MEDICAL",
  },
  {
    tid: "1",
    topic: "ENTERTAINMENT",
  },
];

const fakeData: UserInfo[] = [
  {
    uid: "1",
    username: "vyntt",
    email: "123@gmail.com",
    storage_count: 43412341,
    upload_count: 3,
  },
  {
    uid: "2",
    username: "test",
    email: "abc@gmail.com",
    storage_count: 43412341,
    upload_count: 3,
  },
  {
    uid: "3",
    username: "hain",
    email: "hain@gmail.com",
    storage_count: 43412341,
    upload_count: 3,
  },
  {
    uid: "4",
    username: "dinhle",
    email: "dinh@gmail.com",
    storage_count: 43412341,
    upload_count: 3,
  },
  {
    uid: "5",
    username: "nttvy",
    email: "234@gmail.com",
    storage_count: 43412341,
    upload_count: 3,
  },
  {
    uid: "6",
    username: "test1",
    email: "abcd@gmail.com",
    storage_count: 43412341,
    upload_count: 3,
  },
];

const fakeDataDatasets: DatasetInfo[] = [
  {
    author: "vyntt",
    date: "2023-05-15",
    description: "This is vyntt's dataset",
    did: "123",
    download_count: 3,
    file_size: 2344,
    filename: "input.csv",
    is_anonymized: false,
    path: "",
    status: "completed",
    title: "Dataset 1",
    topic: "1",
    uid: "234234",
  },
  {
    author: "vyntt",
    date: "2023-05-14",
    description: "This is vyntt's dataset",
    did: "123",
    download_count: 5,
    file_size: 4234,
    filename: "input.csv",
    is_anonymized: true,
    path: "",
    status: "anonymizing",
    title: "Population dataset",
    topic: "4",
    uid: "234234",
  },
  {
    author: "vyntt",
    date: "2023-05-15",
    description: "This is vyntt's dataset",
    did: "123",
    download_count: 3,
    file_size: 4568,
    filename: "input.csv",
    is_anonymized: true,
    path: "",
    status: "completed",
    title: "Dataset 2",
    topic: "3",
    uid: "234234",
  },
  {
    author: "vyntt",
    date: "2023-05-10",
    description: "This is vyntt's dataset",
    did: "123",
    download_count: 1,
    file_size: 2344,
    filename: "input.csv",
    is_anonymized: true,
    path: "",
    status: "anonymizing",
    title: "Dataset 3",
    topic: "1",
    uid: "234234",
  },
  {
    author: "vyntt",
    date: "2023-05-15",
    description: "This is vyntt's dataset",
    did: "123",
    download_count: 0,
    file_size: 2344,
    filename: "input.csv",
    is_anonymized: true,
    path: "",
    status: "anonymizing",
    title: "Dataset 4",
    topic: "4",
    uid: "234234",
  },
  {
    author: "vyntt",
    date: "2023-05-15",
    description: "This is vyntt's dataset",
    did: "123",
    download_count: 0,
    file_size: 2344,
    filename: "input.csv",
    is_anonymized: false,
    path: "",
    status: "completed",
    title: "Dataset 5",
    topic: "2",
    uid: "234234",
  },
];

const initialState: AdminState = {
  loading: false,
  users: fakeData,
  status: StatusEnum.IDLE,
  datasets: fakeDataDatasets,
  topics: fakeDataTopic,
};

export type TopicInfo = {
  tid: string;
  topic: string;
};

export type UserInfo = {
  username: string;
  uid: string;
  email: string;
  upload_count: number;
  storage_count: number;
};

const slice = createSlice({
  name: "admin",
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
          deleteUserThunk,
          getAllDatasetsAdminThunk,
          addTopicAdminThunk
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
          deleteUserThunk,
          getAllDatasetsAdminThunk,
          addTopicAdminThunk
        ),
        (state) => {
          state.status = StatusEnum.LOADING;
        }
      )
      .addMatcher(isFulfilled(deleteUserThunk), (state, action) => {
        state.status = StatusEnum.SUCCEEDED;
        state.loading = false;
        state.users = state.users.filter(
          (value) => value.uid === action.meta.arg
        );
        // console.log("User infor: ", state.userInfo);
      })
      .addMatcher(isFulfilled(getAllDatasetsAdminThunk), (state, action) => {
        state.status = StatusEnum.SUCCEEDED;
        state.loading = false;
        state.datasets = action.payload.histories;
        // console.log("History: ", state.history);
      })
      .addMatcher(isFulfilled(getAllUsersAdminThunk), (state, action) => {
        state.status = StatusEnum.SUCCEEDED;
        state.loading = false;
        state.users = action.payload.histories;
        // console.log("History: ", state.history);
      })
      .addMatcher(isFulfilled(addTopicAdminThunk), (state, action) => {
        state.status = StatusEnum.SUCCEEDED;
        state.loading = false;
        // state.result = action.payload;
      }),
});

const { reducer } = slice;

export default reducer;

export const { clear } = slice.actions;

export const selectAdminState = (state: RootState) => state.admin;
