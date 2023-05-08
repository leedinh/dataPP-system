import { Typography } from "antd";

import styles from "pages/styles.module.scss";

const RankDataset: React.FC<any> = ({ title, is_anonymized, author }) => {
  return (
    <div className={styles.rankDetail}>
      <div className={styles.imgDataset}></div>
      <div>
        <Typography>{title}</Typography>
        <Typography>By {author}</Typography>
      </div>
      <div>
        <Typography>{is_anonymized ? "Anonymized" : "Raw"}</Typography>
      </div>
    </div>
  );
};

export default RankDataset;
