import { Navigate, Outlet } from "react-router-dom";
import useAuth from "hook/useAuth";

export const ProtectedRoute = () => {
  const { authenticated } = useAuth();
  if (!authenticated) {
    // user is not authenticated
    return <Navigate to="/" />;
  }
  return <Outlet />;
};
