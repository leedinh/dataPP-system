import NoData from "components/NoData";
import RankUser from "./RankUser";
import styles from "pages/styles.module.scss";

type TopUserProps = {
  title: string;
  data: any[];
};

const TopUser: React.FC<TopUserProps> = ({ title, data }) => {
  return (
    <div className={`mx-8 ${styles.topDataset}`}>
      <div className={`font-semibold ${styles.header}`}>{title}</div>
      {!!data.length ? (
        data.map((item, idx) => {
          return <RankUser key={idx} {...item} rank={idx + 1} />;
        })
      ) : (
        <NoData />
      )}
    </div>
  );
};

export default TopUser;
