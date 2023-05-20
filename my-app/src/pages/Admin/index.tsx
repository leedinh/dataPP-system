import React, { useState } from "react";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { Link, Outlet } from "react-router-dom";
import UserManagement from "./Users";
import TopicManagement from "./Topic";

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem(
    "User",
    "1",
    <Link to={"/admin/users"}>
      <UserOutlined />
    </Link>
  ),
  getItem("Datasets", "9", <FileOutlined />),
];

const Admin: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <div className="grid grid-cols-5 gap-16">
      <div className="col-span-4">
        <div className="text-left">
          <h1>User Management</h1>
        </div>
        <UserManagement />
      </div>
      <div className="">
        <TopicManagement />
      </div>
    </div>
  );
};

export default Admin;
