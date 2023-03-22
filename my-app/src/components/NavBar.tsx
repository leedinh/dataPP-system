import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppstoreOutlined,
  MailOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Typography } from "antd";
import type { MenuProps } from "antd";
import { Menu, Input } from "antd";

import UserAvatar from "./UserAvatar";
import styles from "./styles.module.scss";

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
    setCurrent(e.key);
    navigate(`/${e.key}`);
  };

  const onSearch = (value: string) => console.log(value);

  return (
    <div className="flex items-stretch px-4">
      <div className="flex-auto text-left">
        <Title className="inline-block align-top">LOGO</Title>
      </div>
      <div className={`self-center ${styles.navBar}`}>
        <div className="self-center">
          <Input
            className={styles.searchBar}
            placeholder="dataset name"
            prefix={<Button type="ghost" icon={<SearchOutlined />} />}
          />
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
    </div>
  );
};

export default NavBar;
