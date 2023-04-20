import { combineReducers } from "@reduxjs/toolkit";

import auth from "redux/features/auth/slice";
import upload from "redux/features/uploadProcess/slice";

const rootReducer = combineReducers({ auth, upload });

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
