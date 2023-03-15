import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { StatusEnum } from "redux/constant";
import { RootState } from "redux/reducers";
import { getAuthThunk } from "./thunks";

export interface AuthState {
  status: StatusEnum;
  statusAuth: StatusEnum;
  error: string | null;
  accessToken: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  ...{
    status: StatusEnum.IDLE,
    error: null,
    userInfo: null,
  },
  ...{
    statusAuth: StatusEnum.IDLE,
    errorAuth: null,
    userPermissions: [],
    moduleIdsList: [],
    permissionList: [],
  },
};

const KEY_ACCESS_TOKEN = "accessToken";

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: () => {
      localStorage.removeItem(KEY_ACCESS_TOKEN);
      return { ...initialState };
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(getAuthThunk.pending, (state) => {
        state.statusAuth = StatusEnum.LOADING;
      })
      .addCase(getAuthThunk.fulfilled, (state, action) => {
        const response = action.payload;

        console.log("Redux", response.json());

        state.statusAuth = StatusEnum.SUCCEEDED;
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
  (state) => state.statusAuth
);

export const selectUserStatus = createSelector(
  selectAuthState,
  (state) => state.status
);

export const selectAccessToken = createSelector(
  selectAuthState,
  (state) => state.accessToken
);
