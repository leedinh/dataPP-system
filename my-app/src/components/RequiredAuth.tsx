import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { AuthContext } from "context/AuthContext";
import useAuth from "hook/useAuth";

const RequiredAuth: React.FC = () => {
  const { authenticated, verifyToken } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    verifyToken();
    console.log("Authenticated:", authenticated);
    if (!authenticated) {
      navigate("/logIn");
    }
  }, [authenticated, verifyToken, navigate]);
  return (
    <AuthContext.Provider value={{ authenticated }}>
      <Outlet />
    </AuthContext.Provider>
  );
};
export default RequiredAuth;
