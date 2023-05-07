import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "redux/store";
import { selectDatasetState } from "redux/features/datasets/slice";
import {
  getTopicDatasetsThunk,
  getAllDatasetsThunk,
  getTopDownloadThunk,
  getTopUploadThunk,
} from "redux/features/datasets/thunks";
import useFilter from "hook/useFilter";
import TopDataset from "components/TopDataset";
import Banner from "components/Banner";
import Datasets from "./Datasets";

const Main: React.FC = () => {
  const dispatch = useAppDispatch();
  const { datasets, topDownload, topUpload } = useAppSelector(selectDatasetState);
  const { topic } = useFilter();

  useEffect(() => {
    if (!!topic) {
      dispatch(getTopicDatasetsThunk(topic));
    } else {
      dispatch(getAllDatasetsThunk());
    }
    dispatch(getTopDownloadThunk());
    dispatch(getTopUploadThunk());
  }, [dispatch, topic]);

  return (
    <div className="grid grid-cols-4">
      <div className="p-4 flex flex-col gap-8">
        <TopDataset title={"Download"} data={topDownload} />
        <TopDataset title={"Download"} data={topUpload} />
      </div>
      <div className="col-span-3 p-4 mx-16">
        <Banner />
        <Datasets data={datasets} />
      </div>
    </div>
  );
};

export default Main;
