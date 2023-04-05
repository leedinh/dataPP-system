import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppstoreOutlined,
  HomeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Typography, Menu, Input } from "antd";
import type { MenuProps } from "antd";

import UserAvatar from "./UserAvatar";
import styles from "./styles.module.scss";
import { useAppSelector } from "redux/store";
import { selectAuthStatus } from "redux/features/auth/slice";

const { Title } = Typography;

const items: MenuProps["items"] = [
  {
    label: "Home",
    key: "home",
    icon: <HomeOutlined />,
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
  const authStatus = useAppSelector(selectAuthStatus);

  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
    navigate(`/${e.key}`);
  };

  // const onSearch = (value: string) => console.log(value);

  useEffect(() => {}, [authStatus]);

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
          {authStatus && <UserAvatar />}
          {!authStatus && (
            <>
              <Button key="logIn" onClick={() => navigate("/logIn")}>
                Log In
              </Button>
              <Button key="signUp" onClick={() => navigate("/signUp")}>
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
