import { Typography } from "antd";

import styles from "pages/styles.module.scss";
import rank1 from "assets/rank1_user.png";
import rank2 from "assets/silver_user.png";
import rank3 from "assets/copper_user.png";

const mappingRankImage: any = {
  [1]: rank1,
  [2]: rank2,
  [3]: rank3,
};

const RankUser: React.FC<any> = ({ username, upload_count, rank }) => {
  return (
    <div className={`${styles.rankDetail} ${rank === 1 && styles.champion}`}>
      <div className={`${styles.imgUser} self-center`}>
        {!!mappingRankImage[rank] ? (
          <img width={50} src={mappingRankImage[rank]} alt="#" />
        ) : (
          rank
        )}
      </div>
      <div>
        <Typography className="font-semibold text-lg">{username}</Typography>
      </div>
      <div className="self-center">
        <Typography>{upload_count}</Typography>
      </div>
    </div>
  );
};

export default RankUser;
