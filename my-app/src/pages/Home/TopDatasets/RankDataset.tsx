import { Typography, Tag } from "antd";

import styles from "pages/styles.module.scss";
import rank1 from "assets/rank1.png";
import rank2 from "assets/silver_trophy.png";
import rank3 from "assets/copper_trophy.png";

const mappingRankImage: any = {
  [1]: rank1,
  [2]: rank2,
  [3]: rank3,
};

const RankDataset: React.FC<any> = ({ title, is_anonymized, author, rank }) => {
  return (
    <div
      id="rank"
      className={`${styles.rankDetail} ${rank === 1 && styles.champion}`}
    >
      <div className={`${styles.imgDataset}`}></div>
      <div className="grow text-left ml-4 col-span-2 self-center">
        <Typography className="font-semibold text-ellipsis">{title}</Typography>
        <Typography className="text-slate-400">By {author}</Typography>
      </div>
      <div className={`self-center ${styles.tag}`}>
        <Tag color="blue" className="font-bold text-sm rounded-lg px-4 py-1">
          {is_anonymized ? "Anonymized" : "Raw"}
        </Tag>
      </div>
      <div className="self-center">
        {!!mappingRankImage[rank] ? (
          <img width={50} src={mappingRankImage[rank]} alt="#" />
        ) : (
          rank
        )}
      </div>
    </div>
  );
};

export default RankDataset;
