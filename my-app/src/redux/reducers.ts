import { combineReducers } from "@reduxjs/toolkit";

import auth from "redux/features/auth/slice";
import upload from "redux/features/uploadProcess/slice";
import datasets from "redux/features/datasets/slice";

const rootReducer = combineReducers({ auth, upload, datasets });

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
