import RankDetail from "./RankDetail";
import styles from "./styles.module.scss";

type TopDatasetProps = {
  title: string;
  data: any[];
};

export type RankInfo = {
  name: string;
  type: string;
  author: string;
};

const TopDataset: React.FC<TopDatasetProps> = ({ title, data }) => {
  return (
    <div className={`mx-8 ${styles.topDataset}`}>
      <div className={styles.header}>{title}</div>
      {data.map((item) => {
        return <RankDetail key={item.title} {...item} />;
      })}
    </div>
  );
};

export default TopDataset;
