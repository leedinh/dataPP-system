import NoData from "components/NoData";
import RankDataset from "./RankDataset";
import styles from "pages/styles.module.scss";

type TopDatasetProps = {
  title: string;
  data: any[];
};

const TopDataset: React.FC<TopDatasetProps> = ({ title, data }) => {
  return (
    <div className={`mx-8 ${styles.topDataset}`}>
      <div className={`font-semibold ${styles.header}`}>{title}</div>
      {!!data.length ? (
        data.map((item, idx) => {
          return <RankDataset key={idx} {...item} rank={idx + 1} />;
        })
      ) : (
        <NoData />
      )}
    </div>
  );
};

export default TopDataset;
