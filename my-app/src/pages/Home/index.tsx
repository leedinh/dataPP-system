import { Outlet } from "react-router-dom";

import NavBar from "components/NavBar";
import styles from "pages/styles.module.scss";
import { useEffect } from "react";
// import { useAppDispatch, useAppSelector } from "redux/store";
// import { verifyToken, selectAuthState } from "redux/features/auth/slice";
import { AuthContext } from "context/AuthContext";
import useAuth from "hook/useAuth";

const HomePage: React.FunctionComponent = () => {
  const { authenticated, verifyToken } = useAuth();
  useEffect(() => {
    verifyToken();
    console.log("Authenticated:", authenticated);
  }, []);
  return (
    <div className={styles.main}>
      <AuthContext.Provider value={{ authenticated }}>
        <NavBar />
        <Outlet />
      </AuthContext.Provider>
    </div>
  );
};

export default HomePage;
