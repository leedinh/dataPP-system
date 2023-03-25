import { UserOutlined } from "@ant-design/icons";
import { Avatar, Dropdown } from "antd";
import type { MenuProps } from "antd";

import { logout } from "redux/features/auth/slice";

const items: MenuProps["items"] = [
  {
    label: "Log out",
    key: "logOut",
    onClick: () => {
      logout();
      window.location.reload();
    },
  },
];

const UserAvatar: React.FC = () => {
  return (
    <Dropdown arrow menu={{ items }} trigger={["click"]}>
      <Avatar icon={<UserOutlined />} />
    </Dropdown>
  );
};

export default UserAvatar;
