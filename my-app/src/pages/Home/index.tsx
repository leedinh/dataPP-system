import { Outlet } from "react-router-dom";

import NavBar from "components/NavBar";
import styles from "pages/styles.module.scss";
import useAuth from "hook/useAuth";

const HomePage: React.FunctionComponent = () => {
  const { authenticated } = useAuth();
  return (
    <div className={styles.main}>
      <NavBar auth={authenticated} />
      <Outlet />
    </div>
  );
};

export default HomePage;
