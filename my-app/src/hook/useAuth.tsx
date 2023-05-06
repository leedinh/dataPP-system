import { AuthContext } from "context/AuthContext";
import { useState, useContext, useMemo, useCallback } from "react";
import { checkTokenThunk } from "redux/features/auth/thunks";
import { useAppDispatch, useAppSelector } from "redux/store";
import { KEY_ACCESS_TOKEN } from "redux/common/fetch";
import { selectAuthState } from "redux/features/auth/slice";
import { logout, setAuth } from "redux/features/auth/slice";

export const useAuth = () => {
  return useContext(AuthContext);
};

export default function useProvideAuth() {
  const { authenticated: authRedux } = useAppSelector(selectAuthState);
  const [authenticated, setAuthenticated] = useState(authRedux);
  const dispatch = useAppDispatch();

  const removeAuth = useCallback(() => {
    dispatch(logout());
    setAuthenticated(false);
  }, [dispatch]);

  const activeAuth = useCallback(() => {
    dispatch(setAuth(true));
    setAuthenticated(true);
  }, [dispatch]);

  const checkToken = useMemo(() => {
    if (!!localStorage.getItem(KEY_ACCESS_TOKEN)) {
      dispatch(checkTokenThunk()).then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          activeAuth();
        } else {
          removeAuth();
        }
      });
    } else {
      removeAuth();
    }
  }, [dispatch, activeAuth, removeAuth]);

  return {
    checkToken,
    authenticated,
    removeAuth,
    setAuthenticated,
  };
}
