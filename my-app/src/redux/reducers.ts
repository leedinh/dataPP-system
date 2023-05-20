import { combineReducers } from "@reduxjs/toolkit";

import auth from "redux/features/auth/slice";
import upload from "redux/features/uploadProcess/slice";
import datasets from "redux/features/datasets/slice";
import profile from "redux/features/profile/slice";
import admin from "redux/features/admin/slice";

const rootReducer = combineReducers({ auth, upload, datasets, profile, admin });

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
