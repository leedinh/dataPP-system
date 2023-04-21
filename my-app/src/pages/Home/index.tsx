import { Outlet } from "react-router-dom";

import NavBar from "components/NavBar";
import styles from "pages/styles.module.scss";

const HomePage: React.FunctionComponent = () => {
  return (
    <div className={styles.main}>
      <NavBar />
      <Outlet />
    </div>
  );
};

export default HomePage;
