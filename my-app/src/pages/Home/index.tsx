import { Outlet } from "react-router-dom";

import NavBar from "components/NavBar";
import styles from "pages/styles.module.scss";
import { useEffect } from "react";
import useAuth from "hook/useAuth";

const HomePage: React.FunctionComponent = () => {
  const { verifyToken, authenticated } = useAuth();
  useEffect(() => {
    verifyToken();
  }, [verifyToken]);
  return (
    <div className={styles.main}>
      <NavBar auth={authenticated} />
      <Outlet />
    </div>
  );
};

export default HomePage;
