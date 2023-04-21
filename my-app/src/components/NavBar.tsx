import React, { useState, memo, useContext } from "react";
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
import { selectAuthState } from "redux/features/auth/slice";
import { AuthContext } from "context/AuthContext";

const { Title } = Typography;

const items: MenuProps["items"] = [
  {
    label: "Home",
    key: "",
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
  const { authenticated } = useContext(AuthContext)!;

  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
    navigate(`/${e.key}`);
  };

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
        <div className="self-center flex gap-4">
          {authenticated && <UserAvatar />}
          {!authenticated && (
            <>
              <Button
                type="text"
                key="logIn"
                onClick={() => navigate("/logIn")}
              >
                Log In
              </Button>
              <Button
                type="primary"
                key="signUp"
                onClick={() => navigate("/signUp")}
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(NavBar);
