import { combineReducers } from "@reduxjs/toolkit";

import auth from "redux/features/auth/slice";

const rootReducer = combineReducers({ auth });

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
