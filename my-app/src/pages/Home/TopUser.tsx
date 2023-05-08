import RankUser from "components/RankUser";
import styles from "components/styles.module.scss";

type TopUserProps = {
  title: string;
  data: any[];
};

const TopUser: React.FC<TopUserProps> = ({ title, data }) => {
  return (
    <div className={`mx-8 ${styles.topDataset}`}>
      <div className={styles.header}>{title}</div>
      {data.map((item, idx) => {
        return <RankUser key={idx} {...item} />;
      })}
    </div>
  );
};

export default TopUser;
