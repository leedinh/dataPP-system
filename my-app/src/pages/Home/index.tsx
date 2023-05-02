import { Outlet } from "react-router-dom";

import NavBar from "components/NavBar";
import styles from "pages/styles.module.scss";
import { useAppDispatch, useAppSelector } from "redux/store";
import { useEffect } from "react";
import { selectAuthState, verifyToken } from "redux/features/auth/slice";

const HomePage: React.FunctionComponent = () => {
  const dispatch = useAppDispatch();
  const { authenticated } = useAppSelector(selectAuthState);
  useEffect(() => {
    dispatch(verifyToken());
  }, []);
  return (
    <div className={styles.main}>
      <NavBar auth={authenticated} />
      <Outlet />
    </div>
  );
};

export default HomePage;
