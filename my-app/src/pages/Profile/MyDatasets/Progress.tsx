import React from "react";
import { Steps } from "antd";

import { useAppSelector } from "redux/store";
import { selectUserProfileState } from "redux/features/profile/slice";

const Progress: React.FC = () => {
  const { history } = useAppSelector(selectUserProfileState);
  return (
    <>
      <Steps
        progressDot
        current={history.length - 1}
        direction="vertical"
        items={
          history?.map(({ status, time }) => {
            return {
              title: status,
              description: time,
            };
          }) || []
        }
      />
    </>
  );
};

export default Progress;
