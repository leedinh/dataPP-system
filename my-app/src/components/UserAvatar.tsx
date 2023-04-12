import { UserOutlined } from "@ant-design/icons";
import { Avatar, Dropdown } from "antd";
import type { MenuProps } from "antd";

import { KEY_ACCESS_TOKEN } from "redux/common/fetch";

const items: MenuProps["items"] = [
  {
    label: "Log out",
    key: "logOut",
    onClick: () => {
      localStorage.removeItem(KEY_ACCESS_TOKEN);
      window.location.replace("/");
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
