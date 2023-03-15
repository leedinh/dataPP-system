import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { ThunkAction } from "redux-thunk";
import { configureStore, Action } from "@reduxjs/toolkit";

import rootReducer, { RootState } from "./reducers";

const isDebug = () => {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.REACT_APP_DEBUG === "false"
  )
    return false;

  return true;
};

const store = configureStore({
  reducer: rootReducer,
  devTools: isDebug(),
});

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export type AppThunk = ThunkAction<void, RootState, null, Action<string>>;

export default store;
