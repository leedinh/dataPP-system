import { createSelector, createSlice } from "@reduxjs/toolkit";

import { CommonState } from "redux/common/types";
import { StatusEnum } from "redux/constant";
import { RootState } from "redux/reducers";
import { logInThunk, signUpThunk } from "./thunks";
import { KEY_ACCESS_TOKEN } from "redux/common/fetch";

export type AuthState = {
  accessToken?: string;
  email?: string;
  statusSignUp: StatusEnum;
} & CommonState;

const initialState: AuthState = {
  status: StatusEnum.IDLE,
  error: undefined,
  statusSignUp: StatusEnum.IDLE,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem(KEY_ACCESS_TOKEN);
      state.email = undefined;
      return { ...initialState };
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(signUpThunk.rejected, (state) => {
        state.statusSignUp = StatusEnum.FAILED;
      })
      .addCase(signUpThunk.pending, (state) => {
        state.statusSignUp = StatusEnum.LOADING;
      })
      .addCase(logInThunk.rejected, (state) => {
        state.status = StatusEnum.FAILED;
      })
      .addCase(logInThunk.pending, (state) => {
        state.status = StatusEnum.LOADING;
      })
      .addCase(signUpThunk.fulfilled, (state, action) => {
        console.log("Set success");
        state.statusSignUp = StatusEnum.SUCCEEDED;
        state.email = action.meta.arg.email;
      })
      .addCase(logInThunk.fulfilled, (state, action) => {
        const response = action.payload;

        console.log(action);

        if (response["access_token"]) {
          localStorage.setItem(KEY_ACCESS_TOKEN, response.access_token);
          state.email = action.meta.arg.email;
          state.status = StatusEnum.SUCCEEDED;
        } else {
          state.status = StatusEnum.FAILED;
        }
      }),
});

const { reducer } = slice;

export const { logout } = slice.actions;

export default reducer;

export const selectAuthState = (state: RootState) => state.auth;

export const selectAuthError = createSelector(
  selectAuthState,
  (state) => state.error
);

export const selectAuthStatus = createSelector(
  selectAuthState,
  () => !!localStorage.getItem(KEY_ACCESS_TOKEN)
);

export const selectAccessToken = createSelector(
  selectAuthState,
  (state) => state.accessToken
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
