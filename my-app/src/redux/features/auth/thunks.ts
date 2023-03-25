import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchData } from "redux/common/fetch";

export const logInThunk = createAsyncThunk("logIn", async (request: any) => {
  return fetchData("/api/login", request).then((res: any) => res.json());
});

export const signUpThunk = createAsyncThunk("signUp", async (request: any) => {
  return fetchData("/api/signup", request).then((res: any) => res.json());
});
