import { AuthContext } from "context/AuthContext";
import useProvideAuth from "hook/useAuth";

const RequiredAuth: React.FC<any> = ({ children }) => {
  const { authenticated, removeAuth, setAuthenticated } = useProvideAuth();

  return (
    <AuthContext.Provider
      value={{ authenticated, logout: removeAuth, setAuth: setAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export default RequiredAuth;
