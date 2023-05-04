import { Outlet } from "react-router-dom";

import NavBar from "components/NavBar";
import styles from "pages/styles.module.scss";
import { useAppDispatch, useAppSelector } from "redux/store";
import { useEffect } from "react";
import { selectAuthState } from "redux/features/auth/slice";
import { checkTokenThunk } from "redux/features/auth/thunks";
import { KEY_ACCESS_TOKEN } from "redux/common/fetch";

const HomePage: React.FunctionComponent = () => {
  const dispatch = useAppDispatch();
  const { authenticated } = useAppSelector(selectAuthState);
  useEffect(() => {
    if (localStorage.getItem(KEY_ACCESS_TOKEN)) {
      dispatch(checkTokenThunk());
    }
  }, []);
  return (
    <div className={styles.main}>
      <NavBar auth={authenticated} />
      <Outlet />
    </div>
  );
};

export default HomePage;
