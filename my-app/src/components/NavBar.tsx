import React, { memo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppstoreOutlined, HomeOutlined } from "@ant-design/icons";
import { Button, Typography, Menu } from "antd";
import type { MenuProps } from "antd";

import { useAuth } from "hook/useAuth";
import UserAvatar from "./UserAvatar";
import styles from "./styles.module.scss";
import { KEY_ACCESS_TOKEN } from "redux/common/fetch";

const { Title } = Typography;

const items: MenuProps["items"] = [
  {
    label: "Home",
    key: "/",
    icon: <HomeOutlined />,
  },
  {
    label: "Upload",
    key: "/upload",
    icon: <AppstoreOutlined />,
  },
];

type NavBarProps = {};

const NavBar: React.FC<NavBarProps> = () => {
  const { pathname } = useLocation();
  const { authenticated } = useAuth();
  const navigate = useNavigate();

  const onClick: MenuProps["onClick"] = (e) => {
    navigate(`${e.key}`);
  };

  return (
    <div className="flex items-stretch px-4">
      <div className="flex-auto text-left">
        <Title className="inline-block align-top">LOGO</Title>
      </div>
      <div className={`self-center ${styles.navBar}`}>
        <div className="self-center">
          <Menu
            onClick={onClick}
            selectedKeys={[pathname]}
            mode="horizontal"
            items={items}
          />
        </div>
        <div className="self-center flex gap-4">
          {authenticated || !!localStorage.getItem(KEY_ACCESS_TOKEN) ? (
            <UserAvatar />
          ) : (
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
