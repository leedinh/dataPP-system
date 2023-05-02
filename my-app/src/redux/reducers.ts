import { combineReducers } from "@reduxjs/toolkit";

import auth from "redux/features/auth/slice";
import upload from "redux/features/uploadProcess/slice";
import datasets from "redux/features/datasets/slice";
import user from "redux/features/mydatasets/slice";

const rootReducer = combineReducers({ auth, upload, datasets, user });

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
