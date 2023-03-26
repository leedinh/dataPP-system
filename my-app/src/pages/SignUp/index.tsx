import SignUpForm from "./SignUpForm";
import styles from "pages/styles.module.scss";

const SignUp: React.FC = () => {
  return (
    <div className="w-screen h-screen grid grid-cols-2">
      <SignUpForm />
      <div className={styles.bgLogIn}></div>
    </div>
  );
};

export default SignUp;
