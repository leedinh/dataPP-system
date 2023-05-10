import { useState } from "react";
import { Typography } from "antd";

import styles from "pages/styles.module.scss";
import rank1 from "assets/rank1.png";
import rank2 from "assets/silver_trophy.png";
import rank3 from "assets/copper_trophy.png";
import DetailDataset from "components/DetailDataset";
import { DatasetInfo } from "redux/features/datasets/slice";

const mappingRankImage: any = {
  [1]: rank1,
  [2]: rank2,
  [3]: rank3,
};

type RankDatasetProps = {
  data: DatasetInfo;
  rank: number;
};

const RankDataset: React.FC<RankDatasetProps> = ({ data, rank }) => {
  const { title, download_count, author } = data;
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
      <div
        id="rank"
        className={`hover:cursor-pointer ${styles.rankDetail} ${
          rank === 1 && styles.champion
        }`}
        onClick={() => setModalOpen(true)}
      >
        <div className={` ${styles.imgDataset}`}></div>
        <div className="grow text-left ml-4 col-span-2 self-center">
          <Typography className="font-semibold text-ellipsis">
            {title}
          </Typography>
          <Typography className="text-slate-400">By {author}</Typography>
          <Typography className="text-slate-400">
            Downloaded {download_count} times
          </Typography>
        </div>
        <div className="self-center">
          {!!mappingRankImage[rank] ? (
            <img width={40} src={mappingRankImage[rank]} alt="#" />
          ) : (
            rank
          )}
        </div>
      </div>
      <DetailDataset
        data={data}
        open={modalOpen}
        close={() => setModalOpen(false)}
      />
    </>
  );
};

export default RankDataset;
