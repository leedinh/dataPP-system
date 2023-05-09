import { Typography, Tag } from "antd";

import styles from "pages/styles.module.scss";

const RankDataset: React.FC<any> = ({ title, is_anonymized, author, rank }) => {
  return (
    <div
      id="rank"
      className={`${styles.rankDetail} ${rank === 1 && styles.champion}`}
    >
      <div className={styles.imgDataset}></div>
      <div className="text-left ml-4">
        <Typography className="font-semibold text-ellipsis">{title}</Typography>
        <Typography className="text-slate-400">By {author}</Typography>
      </div>
      <div>
        <Tag color="blue" className="font-bold text-lg rounded-lg px-4 py-1">
          {is_anonymized ? "Anonymized" : "Raw"}
        </Tag>
      </div>
      <div className="">{rank}</div>
    </div>
  );
};

export default RankDataset;
