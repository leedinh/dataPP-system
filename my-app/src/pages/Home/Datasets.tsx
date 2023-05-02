import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "redux/store";
import { selectDatasetState } from "redux/features/datasets/slice";
import { getTopicDatasetsThunk } from "redux/features/datasets/thunks";
import DatasetWidget from "components/DatasetWidget";
import useFilter from "hook/useFilter";
import useTopic from "hook/useTopic";
import styles from "pages/styles.module.scss";

const Datasets: React.FC = () => {
  const dispatch = useAppDispatch();
  const { topicLabels } = useTopic();
  const { datasets } = useAppSelector(selectDatasetState);
  const { pushQuery, topic } = useFilter();

  const onChange = (topic: string) => {
    console.log("Click button ", topic);
    pushQuery("topic", topic);
  };

  useEffect(() => {
    dispatch(getTopicDatasetsThunk(topic || "1"));
  }, [dispatch, topic]);

  return (
    <>
      <div className="grid grid-cols-3 mt-8">
        <div className="col-span-2 justify-self-start">Dataset</div>
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
      <div className="grid grid-cols-4 gap-8 justify-items-center">
        {datasets.map((item) => {
          return <DatasetWidget key={item.did} {...item} />;
        })}
      </div>
    </>
  );
};

export default Datasets;
