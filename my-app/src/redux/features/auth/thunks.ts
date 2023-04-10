import { createAsyncThunk } from "@reduxjs/toolkit";
import { KEY_ACCESS_TOKEN, postData } from "redux/common/fetch";

export const logInThunk = createAsyncThunk("logIn", async (request: any) => {
  return postData(
    "/api/login",
    request,
    !!localStorage.getItem(KEY_ACCESS_TOKEN)
  ).then((res: any) => res.json());
});

export const signUpThunk = createAsyncThunk("signUp", async (request: any) => {
  return postData("/api/signup", request).then((res: any) => res.json());
});
