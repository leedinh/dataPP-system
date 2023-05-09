import styles from "components/styles.module.scss";
import logo from "assets/logo.png";
import { Button } from "antd";

const BannerAuth: React.FC = () => {
  return (
    <div className="flex flex-col">
      <div className="mb-4  ">
        <img src={logo} width={300} alt="#" />
      </div>
      <h1 className="text-5xl font-semibold text-white">BRAND</h1>
      <div className={styles.borderBasic}>
        <Button className="text-white w-full" type="text" size="large" href="/">
          Go to Home Page
        </Button>
      </div>
    </div>
  );
};

export default BannerAuth;
