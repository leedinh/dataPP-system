import { UserOutlined } from "@ant-design/icons";
import { Avatar, Dropdown } from "antd";
import type { MenuProps } from "antd";

import { logout } from "redux/features/auth/slice";
import { useAppDispatch } from "redux/store";

const UserAvatar: React.FC = () => {
  const dispatch = useAppDispatch();
  const items: MenuProps["items"] = [
    {
      label: "Log out",
      key: "logOut",
      onClick: () => {
        dispatch(logout());
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
