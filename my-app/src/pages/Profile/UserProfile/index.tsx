import { useEffect, useState } from "react";
import { Card, Typography, Button, Input } from "antd";
import { EditFilled } from "@ant-design/icons";

import { selectUserProfileState } from "redux/features/profile/slice";
import {
  getUserProfileThunk,
  updateUsernameThunk,
} from "redux/features/profile/thunks";
import { useAppDispatch, useAppSelector } from "redux/store";
import styles from "pages/styles.module.scss";

const UserProfile: React.FC = () => {
  const { userInfo } = useAppSelector(selectUserProfileState);
  const { username, email } = userInfo;
  const [edit, setEdit] = useState(false);
  const [newUsername, setNewUsername] = useState(username);
  const dispatch = useAppDispatch();

  const handleChangeUsername = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNewUsername(e.target.value);
  };

  const changeUsername = () => {
    dispatch(updateUsernameThunk(newUsername));
    setEdit(false);
  };

  useEffect(() => {
    dispatch(getUserProfileThunk());
  }, [dispatch]);

  return (
    <Card className={styles.userProfile}>
      <div className={styles.bgUser}>
        <div className={styles.bgAvatar}>
          <div className={styles.img}></div>
        </div>
      </div>
      <div className="mt-16">
        {edit ? (
          <>
            <Input
              className="w-1/2 mr-4"
              defaultValue={username}
              maxLength={20}
              onChange={handleChangeUsername}
            />
            <Button type="primary" onClick={changeUsername}>
              Save
            </Button>
          </>
        ) : (
          <div>
            <Typography>{username || "---"}</Typography>
            <Button
              icon={<EditFilled />}
              onClick={() => setEdit(true)}
            ></Button>
          </div>
        )}
        <Typography>{email || "---"}</Typography>
      </div>
    </Card>
  );
};

export default UserProfile;
