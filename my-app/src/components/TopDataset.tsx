import { Typography } from "antd";
import RankDetail from "./RankDetail";
import styles from "./styles.module.scss";

type TopDatasetProps = {
  title: string;
  data: RankInfo[];
};

export type RankInfo = {
  name: string;
  type: string;
};

const TopDataset: React.FC<TopDatasetProps> = ({ title, data }) => {
  return (
    <div className={styles.topDataset}>
      <div className={styles.header}>{title}</div>
      {data.map((item) => {
        return <RankDetail key={item.name} {...item} />;
      })}
    </div>
  );
};

export default TopDataset;
