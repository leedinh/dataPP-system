import {
  createSelector,
  createSlice,
  isRejected,
  isPending,
  isFulfilled,
} from "@reduxjs/toolkit";
import jwt_decode from "jwt-decode";

import { CommonState } from "redux/common/types";
import { StatusEnum } from "redux/constant";
import { RootState } from "redux/reducers";
import { logInThunk, signUpThunk } from "./thunks";
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
      state = { ...initialState };
      console.log("Log out", state);
      window.location.replace("/");
    },
    verifyToken: (state) => {
      let token = localStorage.getItem(KEY_ACCESS_TOKEN);
      if (!!token) {
        const tokenInfo = jwt_decode(token);
        console.log("Info: ", tokenInfo);
        const expiredTime = (tokenInfo as any).exp;
        const currentTime = Number(new Date().getTime() / 1000);
        console.log(expiredTime, currentTime);
        if (expiredTime < currentTime) {
          logout();
        } else {
          state.authenticated = true;
        }
      }
    },
  },
  extraReducers: (builder) =>
    builder
      .addMatcher(isRejected(logInThunk, signUpThunk), (state, action) => {
        state.status = StatusEnum.FAILED;
        console.log(action);
        notification.error({
          message: action.error.message || "",
        });
      })
      .addMatcher(isPending(logInThunk, signUpThunk), (state, action) => {
        state.status = StatusEnum.LOADING;
        console.log(action);
      })
      .addMatcher(isFulfilled(signUpThunk), (state, action) => {
        state.statusSignUp = StatusEnum.SUCCEEDED;
        state.email = action.meta.arg.email;
      })
      .addMatcher(isFulfilled(logInThunk), (state, action) => {
        const response = action.payload;

        console.log(action);

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

export const { logout, verifyToken } = slice.actions;

export default reducer;

export const selectAuthState = (state: RootState) => state.auth;

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
