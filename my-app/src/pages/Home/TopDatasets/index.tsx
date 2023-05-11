import NoData from "components/NoData";
import RankDataset from "./RankDataset";
import styles from "pages/styles.module.scss";
import { DatasetInfo } from "redux/features/datasets/slice";

type TopDatasetProps = {
  title: string;
  data: DatasetInfo[];
};

const TopDataset: React.FC<TopDatasetProps> = ({ title, data }) => {
  return (
    <div className={`mx-8 ${styles.topDataset}`}>
      <div className={`font-semibold ${styles.header}`}>{title}</div>
      {!!data.length ? (
        data.map((item, idx) => {
          return <RankDataset key={idx} data={item} rank={idx} />;
        })
      ) : (
        <NoData />
      )}
    </div>
  );
};

export default TopDataset;
