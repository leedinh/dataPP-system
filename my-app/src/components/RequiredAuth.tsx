import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "context/AuthContext";
import useAuth from "hook/useAuth";

const RequiredAuth: React.FC = () => {
  const { authenticated } = useAuth();
  console.log(authenticated);
  return authenticated ? (
    <AuthContext.Provider value={{ authenticated }}>
      <Outlet />
    </AuthContext.Provider>
  ) : (
    <Navigate to={"/logIn"} />
  );
};
export default RequiredAuth;
