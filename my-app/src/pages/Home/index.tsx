import { Outlet } from "react-router-dom";

import NavBar from "components/NavBar";
import styles from "pages/styles.module.scss";
import { useEffect } from "react";
import jwt_decode from "jwt-decode";
import { KEY_ACCESS_TOKEN } from "redux/common/fetch";
import { useAppDispatch } from "redux/store";
import { logout } from "redux/features/auth/slice";

const HomePage: React.FunctionComponent = () => {
  const dispatch = useAppDispatch();
  const verifyToken = () => {
    let token = localStorage.getItem(KEY_ACCESS_TOKEN);
    if (!!token) {
      const tokenInfo = jwt_decode(token);
      console.log("Info: ", tokenInfo);
      const expiredTime = (tokenInfo as any).exp;
      const currentTime = Number(new Date().getTime() / 1000);
      console.log(expiredTime, currentTime);
      if (expiredTime < currentTime) {
        dispatch(logout());
        console.log("Alo");
      }
    }
  };
  useEffect(() => {
    verifyToken();
  }, []);
  return (
    <div className={styles.main}>
      <NavBar />
      <Outlet />
    </div>
  );
};

export default HomePage;
