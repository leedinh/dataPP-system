import { AuthContext } from "context/AuthContext";
import { useContext, useMemo, useCallback } from "react";
import { checkTokenThunk } from "redux/features/auth/thunks";
import { useAppDispatch, useAppSelector } from "redux/store";
import { KEY_ACCESS_TOKEN } from "redux/common/fetch";
import { logout, setAuth, selectAuthState } from "redux/features/auth/slice";

export const useAuth = () => {
  return useContext(AuthContext);
};

export default function useProvideAuth() {
  const { authenticated } = useAppSelector(selectAuthState);
  const dispatch = useAppDispatch();
  const token = localStorage.getItem(KEY_ACCESS_TOKEN);

  const removeAuth = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  const activeAuth = useCallback(() => {
    dispatch(setAuth(true));
  }, [dispatch]);

  useMemo(() => {
    if (!!token) {
      dispatch(checkTokenThunk());
    } else {
      removeAuth();
    }
  }, [dispatch, removeAuth, token]);

  return {
    authenticated,
    removeAuth,
    activeAuth,
  };
}
