import RankUser from "./RankUser";
import styles from "pages/styles.module.scss";

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
