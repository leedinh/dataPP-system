import { Navigate, Outlet } from "react-router-dom";

import Waiting from "pages/Waiting";
import useAuth from "hook/useAuth";
import { KEY_ACCESS_TOKEN } from "redux/common/fetch";

export const ProtectedRoute = () => {
  const { authenticated } = useAuth();

  return authenticated ? (
    <Outlet />
  ) : !!localStorage.getItem(KEY_ACCESS_TOKEN) ? (
    <Waiting />
  ) : (
    <Navigate to="/logIn" />
  );
};
