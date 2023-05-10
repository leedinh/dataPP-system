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
import TopDataset from "./TopDatasets";
import Banner from "components/Banner";
import Datasets from "./Datasets";
import TopUser from "./TopUsers";

const Main: React.FC = () => {
  const dispatch = useAppDispatch();
  const { datasets, topDownload, topUpload } =
    useAppSelector(selectDatasetState);
  const { topic } = useFilter();

  useEffect(() => {
    if (topic !== "-1") {
      dispatch(getTopicDatasetsThunk(topic));
    } else {
      dispatch(getAllDatasetsThunk());
    }
  }, [dispatch, topic]);

  useEffect(() => {
    dispatch(getTopDownloadThunk());
    dispatch(getTopUploadThunk());
  }, [dispatch]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-7">
      <div className="lg:col-span-2 p-4 flex flex-row lg:flex-col xs:flex-col gap-8">
        <TopUser title="Top Contribution" data={topUpload} />
        <TopDataset title="Top Download" data={topDownload} />
      </div>
      <div className="lg:col-span-5 p-4 mx-8">
        <Banner />
        <Datasets data={datasets} />
      </div>
    </div>
  );
};

export default Main;
