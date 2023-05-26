import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from "react";
import { Grid, Layout, theme } from 'antd';
import { Outlet } from "react-router-dom";

import LayoutFooter from "./component/footer";
import LayoutSider from './component/sider';

const { Header, Content } = Layout;

export default function DashboardLayout() {
  const {
    token: { colorBgContainer, colorBgLayout },
  } = theme.useToken();
  const screens = Grid.useBreakpoint();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => { setCollapsed(!screens.lg); }, [screens]);
  useEffect(() => {
    (document.getElementById('root')!).style.background = colorBgLayout;
  }, []);

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
