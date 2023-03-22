import { Typography } from "antd";
import { RankInfo } from "./TopDataset";

import styles from "./styles.module.scss";

const RankDetail: React.FC<RankInfo> = ({ name, type }) => {
  return (
    <div className={styles.rankDetail}>
      <div>cover</div>
      <div>
        <Typography>{name}</Typography>
      </div>
      <div>
        <Typography>{type}</Typography>
      </div>
    </div>
  );
};

export default RankDetail;
