import { Outlet } from "react-router-dom";
import { AuthContext } from "context/AuthContext";
import useAuth from "hook/useAuth";

const RequiredAuth: React.FC = () => {
  const { authenticated } = useAuth();
  return (
    <AuthContext.Provider value={{ authenticated }}>
      <Outlet />
    </AuthContext.Provider>
  );
};
export default RequiredAuth;
