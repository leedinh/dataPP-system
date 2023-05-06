import { useEffect } from "react";
import LogInForm from "./LogInForm";
import styles from "pages/styles.module.scss";
import useProvideAuth from "hook/useAuth";

const LogIn: React.FC = () => {
  const { authenticated, removeAuth } = useProvideAuth();
  useEffect(() => {
    authenticated && removeAuth();
  }, []);
  return (
    <div className="w-screen h-screen grid grid-cols-2">
      <LogInForm />
      <div className={styles.bgLogIn}></div>
    </div>
  );
};

export default LogIn;
