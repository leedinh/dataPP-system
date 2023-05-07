import {
  createSelector,
  createSlice,
  isRejected,
  isPending,
  isFulfilled,
} from "@reduxjs/toolkit";

import { CommonState } from "redux/common/types";
import { StatusEnum } from "redux/constant";
import { RootState } from "redux/reducers";
import { logInThunk, signUpThunk, checkTokenThunk } from "./thunks";
import { KEY_ACCESS_TOKEN } from "redux/common/fetch";
import { notification } from "antd";

export type AuthState = {
  email?: string;
  statusSignUp: StatusEnum;
  authenticated: boolean;
} & CommonState;

const initialState: AuthState = {
  status: StatusEnum.IDLE,
  error: undefined,
  statusSignUp: StatusEnum.IDLE,
  authenticated: false,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem(KEY_ACCESS_TOKEN);
      state.authenticated = false;
    },
    setAuth: (state, action) => {
      state.authenticated = action.payload;
    },
  },
  extraReducers: (builder) =>
    builder
      .addMatcher(
        isRejected(logInThunk, signUpThunk, checkTokenThunk),
        (state, action) => {
          state.status = StatusEnum.FAILED;
          notification.error({
            message: action.error.message || "",
          });
        }
      )
      .addMatcher(isRejected(checkTokenThunk), (state, action) => {
        state.authenticated = false;
        localStorage.removeItem(KEY_ACCESS_TOKEN);
      })
      .addMatcher(
        isPending(logInThunk, signUpThunk, checkTokenThunk),
        (state) => {
          state.status = StatusEnum.LOADING;
        }
      )
      .addMatcher(isFulfilled(signUpThunk), (state, action) => {
        state.statusSignUp = StatusEnum.SUCCEEDED;
        state.email = action.meta.arg.email;
      })
      .addMatcher(isFulfilled(checkTokenThunk), (state) => {
        state.status = StatusEnum.SUCCEEDED;
        state.authenticated = true;
      })
      .addMatcher(isFulfilled(logInThunk), (state, action) => {
        const response = action.payload;

        if (response["access_token"]) {
          localStorage.setItem(KEY_ACCESS_TOKEN, response.access_token);
          state.email = action.meta.arg.email;
          state.status = StatusEnum.SUCCEEDED;
          state.authenticated = true;
        } else {
          state.status = StatusEnum.FAILED;
        }
      }),
});

const { reducer } = slice;

export const { logout, setAuth } = slice.actions;

export default reducer;

export const selectAuthState = (state: RootState) => state.auth;

export const selectAuthLoading = createSelector(
  selectAuthState,
  (state) => state.status === StatusEnum.LOADING
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state) => state.error
);

export const selectEmail = createSelector(
  selectAuthState,
  (state) => state.email
);

export const selectLogInStatus = createSelector(
  selectAuthState,
  (state) => state.status
);

export const selectSignUpStatus = createSelector(
  selectAuthState,
  (state) => state.statusSignUp
);
