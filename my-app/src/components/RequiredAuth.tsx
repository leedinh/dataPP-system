import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "context/AuthContext";
import { useAppSelector } from "redux/store";
import { selectAuthState } from "redux/features/auth/slice";

const RequiredAuth: React.FC = () => {
  const { authenticated } = useAppSelector(selectAuthState);
  return authenticated ? (
    <AuthContext.Provider value={{ authenticated }}>
      <Outlet />
    </AuthContext.Provider>
  ) : (
    <Navigate to={"/logIn"} />
  );
};
export default RequiredAuth;
