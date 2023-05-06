import { useEffect } from "react";
import LogInForm from "./LogInForm";
import styles from "pages/styles.module.scss";
import { KEY_ACCESS_TOKEN } from "redux/common/fetch";

const LogIn: React.FC = () => {
  useEffect(() => {
    localStorage.removeItem(KEY_ACCESS_TOKEN);
  }, []);
  return (
    <div className="w-screen h-screen grid grid-cols-2">
      <LogInForm />
      <div className={styles.bgLogIn}></div>
    </div>
  );
};

export default LogIn;
