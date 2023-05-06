import { AuthContext } from "context/AuthContext";
import { useState, useContext, useMemo } from "react";
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

  const removeAuth = () => {
    dispatch(logout());
    setAuthenticated(false);
  };

  const activeAuth = () => {
    dispatch(setAuth(true));
    setAuthenticated(true);
  };

  const checkToken = useMemo(() => {
    console.log("Checktoken");
    if (!!localStorage.getItem(KEY_ACCESS_TOKEN)) {
      dispatch(checkTokenThunk()).then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          console.log("active");
          activeAuth();
        } else {
          removeAuth();
        }
      });
    } else {
      removeAuth();
    }
  }, []);

  return {
    checkToken,
    authenticated,
    removeAuth,
    setAuthenticated,
  };
}
