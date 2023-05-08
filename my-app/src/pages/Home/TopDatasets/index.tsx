import RankDataset from "./RankDataset";
import styles from "pages/styles.module.scss";

type TopDatasetProps = {
  title: string;
  data: any[];
};

const TopDataset: React.FC<TopDatasetProps> = ({ title, data }) => {
  return (
    <div className={`mx-8 ${styles.topDataset}`}>
      <div className={styles.header}>{title}</div>
      {data.map((item, idx) => {
        return <RankDataset key={idx} {...item} />;
      })}
    </div>
  );
};

export default TopDataset;
