import { Typography } from "antd";

import styles from "./styles.module.scss";

const RankUser: React.FC<any> = ({ username, upload_count }) => {
  return (
    <div className={styles.rankDetail}>
      <div className={styles.imgDataset}></div>
      <div>
        <Typography>{username}</Typography>
      </div>
      <div>
        <Typography>{upload_count}</Typography>
      </div>
    </div>
  );
};

export default RankUser;
