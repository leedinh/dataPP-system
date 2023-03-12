import React, { useState } from "react";
import { AppstoreOutlined, MailOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import type { MenuProps } from "antd";
import { Menu } from "antd";

import UserAvatar from "./UserAvatar";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const items: MenuProps["items"] = [
  {
    label: "Home",
    key: "home",
    icon: <MailOutlined />,
  },
  {
    label: "Upload",
    key: "upload",
    icon: <AppstoreOutlined />,
  },
];

const NavBar: React.FC = () => {
  const [current, setCurrent] = useState("home");
  const navigate = useNavigate();

  const onClick: MenuProps["onClick"] = (e) => {
    console.log(e.key);
    setCurrent(e.key);
    navigate(`/${e.key}`);
  };

  return (
    <div className="flex items-stretch px-4">
      <div className="flex-auto text-left">
        <Title className="inline-block align-top">LOGO</Title>
      </div>
      <div className="flex-2 self-center">
        <Menu
          onClick={onClick}
          selectedKeys={[current]}
          mode="horizontal"
          items={items}
        />
      </div>
      <div className="self-center">
        <UserAvatar />
      </div>
    </div>
  );
};

export default NavBar;
