import { UserOutlined } from "@ant-design/icons";
import { Avatar, Dropdown } from "antd";
import type { MenuProps } from "antd";
import { useNavigate } from "react-router-dom";

import { logout } from "redux/features/auth/slice";
import { useAppDispatch } from "redux/store";

const UserAvatar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const items: MenuProps["items"] = [
    {
      label: "Log out",
      key: "logOut",
      onClick: () => {
        dispatch(logout());
        navigate("/");
      },
    },
    {
      label: "My datasets",
      key: "myDatasets",
      onClick: () => {
        navigate("/datasets");
      },
    },
  ];
  return (
    <Dropdown arrow menu={{ items }} trigger={["click"]}>
      <Avatar icon={<UserOutlined />} />
    </Dropdown>
  );
};

export default UserAvatar;
