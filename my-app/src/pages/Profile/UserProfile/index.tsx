import { useEffect, useState } from "react";
import { Card, Typography, Button, Input, notification, Progress } from "antd";
import { EditFilled, CloudOutlined } from "@ant-design/icons";

import { selectUserProfileState } from "redux/features/profile/slice";
import { MAX_STORAGE } from "redux/constant";
import {
  getUserProfileThunk,
  updateUsernameThunk,
} from "redux/features/profile/thunks";
import { useAppDispatch, useAppSelector } from "redux/store";
import styles from "pages/styles.module.scss";

const calculatePercentage = (storageCount: number) => {
  const res = ((storageCount / Math.pow(2, 30)) * 100) / MAX_STORAGE;
  return res < 1 ? 1 : res;
};

const calculateRestStorage = (storageCount: number) => {
  return (MAX_STORAGE - storageCount / Math.pow(2, 30)).toFixed(3);
};

const UserProfile: React.FC = () => {
  const { userInfo } = useAppSelector(selectUserProfileState);
  const { username, email, storage_count } = userInfo;
  const [edit, setEdit] = useState(false);
  const [newUsername, setNewUsername] = useState<string>(username);
  const dispatch = useAppDispatch();

  const handleChangeUsername = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNewUsername(e.target.value);
  };

  const changeUsername = () => {
    if (newUsername && username !== newUsername) {
      dispatch(updateUsernameThunk(newUsername));
    } else {
      notification.info({
        message: "Please enter new username",
      });
    }
    setEdit(false);
  };

  useEffect(() => {
    dispatch(getUserProfileThunk());
  }, [dispatch]);

  return (
    <>
      <Card className={styles.userProfile}>
        <div className={styles.bgUser}>
          <div className={styles.bgAvatar}>
            <div className={styles.img}></div>
          </div>
        </div>
        <div className="mt-16">
          <div className="flex justify-center items-center gap-4">
            <Typography className="font-bold">Username: </Typography>
            {edit ? (
              <>
                <Input
                  className="w-1/4 mr-2"
                  defaultValue={username}
                  maxLength={20}
                  onChange={handleChangeUsername}
                />
                <Button type="primary" onClick={changeUsername}>
                  Save
                </Button>
              </>
            ) : (
              <>
                <Typography>{username || "---"}</Typography>
                <Button
                  icon={<EditFilled />}
                  onClick={() => setEdit(true)}
                ></Button>
              </>
            )}
          </div>
          <div className="flex justify-center gap-4 mt-2">
            <Typography className="font-bold">Email:</Typography>
            <Typography> {email || "---"}</Typography>
          </div>
        </div>
      </Card>
      <Card className={styles.userProfile}>
        <CloudOutlined className={styles.cloudIcon} />
        <h3>Your storage</h3>
        <span className="text-slate-400">
          Supervise your drive space in the easiest way
        </span>
        <div className="flex justify-between mt-4">
          <div className="">Free: {calculateRestStorage(storage_count)} GB</div>
          <div className="">{MAX_STORAGE} GB</div>
        </div>
        <Progress
          percent={calculatePercentage(storage_count)}
          showInfo={false}
        />
      </Card>
    </>
  );
};

export default UserProfile;
