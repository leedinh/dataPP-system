import { DatasetInfo } from "redux/features/datasets/slice";
import DatasetWidget from "components/DatasetWidget";
import useFilter from "hook/useFilter";
import useTopic from "hook/useTopic";
import styles from "pages/styles.module.scss";

type DatasetsProps = {
  data: DatasetInfo[];
};

const Datasets: React.FC<DatasetsProps> = ({ data }) => {
  const { topicLabels } = useTopic();
  const { pushQuery, topic } = useFilter();

  const onChange = (topic: string) => {
    console.log("Click button ", topic);
    pushQuery("topic", topic);
  };

  return (
    <>
      <div className="grid grid-cols-3 mt-8">
        <div className="col-span-2 justify-self-start text-3xl">Dataset</div>
        <div className="justify-self-end flex gap-4">
          {Object.entries(topicLabels).map(([key, value]) => {
            return (
              <div
                onClick={() => onChange(key)}
                key={key}
                className={`${styles.tab} ${topic === key && styles.tabActive}`}
              >
                {value}
              </div>
            );
          })}
        </div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center mt-4">
        {data.map((item) => {
          return <DatasetWidget key={item.did} {...item} />;
        })}
      </div>
    </>
  );
};

export default Datasets;
