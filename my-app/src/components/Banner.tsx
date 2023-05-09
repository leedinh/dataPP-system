import { Button } from "antd";
import styles from "./styles.module.scss";
import { useNavigate } from "react-router-dom";

const Banner: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.banner}>
      <div className="text-4xl font-semibold w-1/3 px-12 text-white">
        Discover, collect and share your datasets
      </div>
      <div className="w-1/3 px-12 py-4 text-white font-lg">
        Enter in this open world. Discover now the resources or anonymize your
        own!
      </div>
      <div className="px-12 ">
        <Button
          className="text-sm h-10 font-bold"
          shape="round"
          onClick={() => navigate("/upload")}
        >
          Upload now
        </Button>
      </div>
    </div>
  );
};

export default Banner;
