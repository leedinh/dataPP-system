import { Typography } from "antd";

import styles from "pages/styles.module.scss";

const RankUser: React.FC<any> = ({ username, upload_count, rank }) => {
  return (
    <div className={styles.rankDetail}>
      <div className={styles.imgUser}>{rank}</div>
      <div>
        <Typography className="font-semibold text-xl">{username}</Typography>
      </div>
      <div>
        <Typography>{upload_count}</Typography>
      </div>
    </div>
  );
};

export default RankUser;
