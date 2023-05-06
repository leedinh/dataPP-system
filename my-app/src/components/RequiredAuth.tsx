import { AuthContext } from "context/AuthContext";
import useProvideAuth from "hook/useAuth";

const RequiredAuth: React.FC<any> = ({ children }) => {
  const { authenticated, removeAuth } = useProvideAuth();

  return (
    <AuthContext.Provider value={{ authenticated, logout: removeAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
export default RequiredAuth;
