import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Layout, theme } from 'antd';
import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import LayoutSider from './component/sider';
import LayoutFooter from "./component/footer";

const { Header, Content } = Layout;

export default function DashboardLayout() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout hasSider>
      <LayoutSider collapsed={collapsed}/>
      <Layout className="site-layout" style={{ marginLeft: collapsed ? 80 : 250 }}>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <div className="flex justify-between items-center h-full w-full m-auto">
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: `px-6 text-lg cursor-pointer transition ease-in-out delay-150 drop-shadow-none hover:drop-shadow-xl`,
              onClick: () => setCollapsed(!collapsed),
            })}
          </div>
        </Header>
        <Content
          style={{
            background: colorBgContainer,
            overflow: 'initial',
            margin: '24px 16px',
            padding: 24,
          }}>
          <Outlet />
        </Content>
        <LayoutFooter />
      </Layout>
    </Layout>
  );
};

const texts = {
  themeLabel: 'Cambiar colores',
};
