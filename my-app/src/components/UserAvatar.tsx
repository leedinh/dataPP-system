import { UserOutlined } from "@ant-design/icons";
import { Avatar, Dropdown } from "antd";
import type { MenuProps } from "antd";
import { useAuth } from "hook/useAuth";
import { useNavigate } from "react-router-dom";

const UserAvatar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const items: MenuProps["items"] = [
    {
      label: "Log out",
      key: "logOut",
      onClick: () => {
        logout();
        navigate("/logIn");
      },
    },
    {
      label: "My profile",
      key: "myProfile",
      onClick: () => {
        navigate("/profile");
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
