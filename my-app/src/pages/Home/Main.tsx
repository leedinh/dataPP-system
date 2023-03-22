import { useEffect } from "react";

import DataSetWidget from "components/DatasetWidget";
import TopDataset from "components/TopDataset";
import Banner from "components/Banner";

import styles from "pages/styles.module.scss";

const fakeDataset = [
  {
    name: "1",
    type: "abc",
  },
  {
    name: "2",
    type: "abc",
  },
  {
    name: "3",
    type: "abc",
  },
];

const datasetList = [
  {
    author: "A",
    name: "Dataset 1",
    publishAt: "00/00/00",
  },
  {
    author: "A",
    name: "Dataset 2",
    publishAt: "00/00/00",
  },
  {
    author: "A",
    name: "Dataset 3",
    publishAt: "00/00/00",
  },
  {
    author: "A",
    name: "Dataset 4",
    publishAt: "00/00/00",
  },
];

const Main: React.FC = () => {
  useEffect(() => {
    // TO DO: fetch dataset
  }, []);

  return (
    <div className="grid grid-cols-4">
      <div className="p-4">
        <TopDataset title={"Download"} data={fakeDataset} />
      </div>
      <div className="col-span-3 p-4 mx-16">
        <Banner />
        <div className={styles.header}>Dataset</div>
        <div className="grid grid-cols-4 gap-8 justify-items-center">
          {datasetList.map((item) => {
            return <DataSetWidget key={item.name} {...item} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Main;
