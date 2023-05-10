import { Button } from "antd";
import styles from "./styles.module.scss";
import { useNavigate } from "react-router-dom";
import banner from "assets/banner.png";

const Banner: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="relative">
      <img width={"100%"} className={styles.banner} src={banner} alt="#" />
      <div className="text-left absolute top-10 inset-0 px-16">
        <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-semibold w-1/3 text-white">
          Discover, collect and share your datasets
        </div>
        <div className="w-1/3 py-4 text-white font-lg">
          Enter in this open world. Discover now the resources or anonymize your
          own!
        </div>
        <div>
          <Button
            className="invisible 2xl:visible h-10 font-bold"
            shape="round"
            onClick={() => navigate("/upload")}
          >
            Upload now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Banner;
