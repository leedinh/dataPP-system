import { useEffect, useMemo, useState } from "react";

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
import { DatasetInfo } from "redux/features/datasets/slice";

const Main: React.FC = () => {
  const dispatch = useAppDispatch();
  const { datasets, topDownload, topUpload } =
    useAppSelector(selectDatasetState);
  const { topic } = useFilter();

  useEffect(() => {
    if (!!topic) {
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
    <div className="grid grid-cols-7">
      <div className="col-span-2 p-4 flex flex-col gap-8">
        <TopDataset title="Top Download" data={topDownload} />
        <TopUser title="Top Contribution" data={topUpload} />
      </div>
      <div className="col-span-5 p-4 mx-8">
        <Banner />
        <Datasets data={datasets} />
      </div>
    </div>
  );
};

export default Main;
