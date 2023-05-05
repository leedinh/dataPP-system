import { Card, Typography } from "antd";

import styles from "../styles.module.scss";
import { useAppDispatch, useAppSelector } from "redux/store";
import { useEffect } from "react";
import { selectUserProfileState } from "redux/features/profile/slice";
import { getUserProfileThunk } from "redux/features/profile/thunks";

const UserProfile: React.FC = () => {
  const { userInfo } = useAppSelector(selectUserProfileState);
  const { username, mail } = userInfo;
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getUserProfileThunk(""));
  }, [dispatch]);
  return (
    <Card className="w-1/3">
      <div className={styles.bgUser}>
        <div className={styles.bgAvatar}>
          <div className={styles.img}></div>
        </div>
      </div>
      <div className="mt-16">
        <Typography>{username || "---"}</Typography>
        <Typography>{mail || "---"}</Typography>
      </div>
    </Card>
  );
};

export default UserProfile;
