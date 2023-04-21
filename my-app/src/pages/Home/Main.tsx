import { useEffect } from "react";

import DataSetWidget from "components/DatasetWidget";
import TopDataset from "components/TopDataset";
import Banner from "components/Banner";

import styles from "pages/styles.module.scss";
import { useAppDispatch, useAppSelector } from "redux/store";
import { getAllDatasetsThunk } from "redux/features/datasets/thunks";
import { selectDatasetState } from "redux/features/datasets/slice";

const Main: React.FC = () => {
  const dispatch = useAppDispatch();
  const { datasets } = useAppSelector(selectDatasetState);

  useEffect(() => {
    // TO DO: fetch dataset
    console.log("Main");
    dispatch(getAllDatasetsThunk());
  }, [dispatch]);

  return (
    <div className="grid grid-cols-4">
      <div className="p-4">
        {/* <TopDataset title={"Download"} data={fakeDataset} /> */}
      </div>
      <div className="col-span-3 p-4 mx-16">
        <Banner />
        <div className={styles.header}>Dataset</div>
        <div className="grid grid-cols-4 gap-8 justify-items-center">
          {datasets.map((item) => {
            return <DataSetWidget key={item.did} {...item} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Main;
