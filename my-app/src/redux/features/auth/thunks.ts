import { createAsyncThunk } from "@reduxjs/toolkit";
import { sendGetRequest, sendRequest } from "redux/common/fetch";

export const logInThunk = createAsyncThunk("logIn", async (request: any) => {
  return sendRequest("POST", "/api/login", request).then((res: any) =>
    res.json()
  );
});

export const signUpThunk = createAsyncThunk("signUp", async (request: any) => {
  return sendRequest("POST", "/api/signup", request).then((res: any) =>
    res.json()
  );
});

export const checkTokenThunk = createAsyncThunk("checkToken", async () => {
  return sendGetRequest("/api/check_token", true).then((res: any) =>
    res.json()
  );
});