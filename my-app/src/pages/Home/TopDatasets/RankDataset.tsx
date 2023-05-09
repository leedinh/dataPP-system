import { Typography, Tag } from "antd";

import styles from "pages/styles.module.scss";

const RankDataset: React.FC<any> = ({ title, is_anonymized, author, rank }) => {
  return (
    <div className={styles.rankDetail}>
      <div className={styles.imgDataset}></div>
      <div className="text-left ml-4">
        <Typography className="font-semibold">{title}</Typography>
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
