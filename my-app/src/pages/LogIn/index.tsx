import LogInForm from "./LogInForm";
import styles from "pages/styles.module.scss";

const LogIn: React.FC = () => {
  return (
    <div className="w-screen h-screen grid grid-cols-2">
      <LogInForm />
      <div className={styles.bgLogIn}></div>
    </div>
  );
};

export default LogIn;
