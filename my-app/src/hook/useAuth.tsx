import { useState } from "react";
import jwt_decode from "jwt-decode";

import { clear } from "redux/features/uploadProcess/slice";
import { useAppDispatch } from "redux/store";
import { KEY_ACCESS_TOKEN } from "redux/common/fetch";

export default function useAuth() {
  const [authenticated, setAuthenticated] = useState(true);
  const dispatch = useAppDispatch();
  dispatch(clear());

  const logout = () => {
    localStorage.removeItem(KEY_ACCESS_TOKEN);
    setAuthenticated(false);
    window.location.replace("/");
  };

  const verifyToken = () => {
    let token = localStorage.getItem(KEY_ACCESS_TOKEN);
    if (!!token) {
      const tokenInfo = jwt_decode(token);
      console.log("Info: ", tokenInfo);
      const expiredTime = (tokenInfo as any).exp;
      const currentTime = Number(new Date().getTime() / 1000);
      console.log(expiredTime, currentTime);
      if (expiredTime < currentTime) {
        logout();
      } else {
        setAuthenticated(true);
      }
    }
  };

  return {
    authenticated,
    logout,
    verifyToken,
  };
}
