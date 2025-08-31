import React, { useState } from "react";
import { RightCircleOutlined, LeftCircleOutlined } from "@ant-design/icons";
import { Button, Menu, Layout } from "antd";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { FolderOutput, FolderSymlink, LayoutDashboard } from "lucide-react";

const { Sider, Content } = Layout;

export default function Home() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const items = [
    {
      key: "dashboard",
      icon: <LayoutDashboard size={16} />,
      label: "Dashboard",
    },
    {
      key: "incoming",
      icon: <FolderSymlink size={16} />,
      label: "Incoming Certificate",
    },
    {
      key: "outgoing",
      icon: <FolderOutput size={16} />,
      label: "Outgoing Certificate",
    },
  ];

  const onMenuClick = (e) => {
    navigate(`/${e.key}`);
  };

  return (
    <Layout className="w-full min-h-screen">
      {/* Sidebar Fixed */}
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        theme="light"
        width={200}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          height: "100vh",
        }}
      >
        <div className="p-2 text-left">
          <Button type="primary" onClick={toggleCollapsed}>
            {collapsed ? <RightCircleOutlined /> : <LeftCircleOutlined />}
          </Button>
        </div>
        <Menu
          mode="inline"
          theme="light"
          items={items}
          onClick={onMenuClick}
          selectedKeys={[location.pathname.replace("/", "") || "dashboard"]}
          style={{ fontSize: "12px" }}
        />
      </Sider>

      {/* Content Shift */}
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 200, // otomatis geser sesuai Sider
          transition: "all 0.2s",
        }}
      >
        <Content className="bg-gray-100 p-4 w-full min-h-screen">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
