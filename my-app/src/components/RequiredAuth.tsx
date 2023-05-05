import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "context/AuthContext";
import { useAppDispatch, useAppSelector } from "redux/store";
import { selectAuthState } from "redux/features/auth/slice";
import { useEffect } from "react";
import { checkTokenThunk } from "redux/features/auth/thunks";

const RequiredAuth: React.FC = () => {
  const { authenticated } = useAppSelector(selectAuthState);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkTokenThunk());
  }, []);

  return authenticated ? (
    <AuthContext.Provider value={{ authenticated }}>
      <Outlet />
    </AuthContext.Provider>
  ) : (
    <Navigate to={"/logIn"} />
  );
};
export default RequiredAuth;
