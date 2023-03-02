import { BgColorsOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { ConfigProvider, Layout, theme } from 'antd';
import React, { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import LayoutSider from './component/sider';
import LayoutFooter from "./component/footer";

const { Header, Content } = Layout;
const themeKey = 'isDarkTheme';

export default function DashboardLayout() {
  const {
    token: { colorBgContainer, colorBgLayout },
  } = theme.useToken();
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  const changeTheme = useCallback(() => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    localStorage.setItem(themeKey, `${newTheme}`);
  }, [isDarkTheme, setIsDarkTheme]);

  useEffect(()=>{
    const rootDiv = document.getElementById('root');
    if (rootDiv!==null) {
      rootDiv.style.backgroundColor = colorBgLayout;
    }
  }, [colorBgLayout]);
  useEffect(() => {
    const storeTheme = localStorage.getItem(themeKey);
    setIsDarkTheme(storeTheme !== 'false');
  }, []);

  return (
    <ConfigProvider theme={{
      algorithm: isDarkTheme ? theme.darkAlgorithm : theme.defaultAlgorithm
    }}>
      <Layout hasSider>
        <LayoutSider collapsed={collapsed}/>
        <Layout className="site-layout" style={{ marginLeft: collapsed ? 80 : 250 }}>
          <Header style={{ padding: 0, background: colorBgContainer }}>
            <div className="flex justify-between items-center h-full w-full m-auto">
              {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: `px-6 text-lg cursor-pointer transition ease-in-out delay-150 drop-shadow-none hover:drop-shadow-xl`,
                onClick: () => setCollapsed(!collapsed),
              })}
              {/* <BgColorsOutlined
                className="px-6 text-lg cursor-pointer transition ease-in-out delay-150 drop-shadow-none hover:drop-shadow-xl"
                onClick={() => changeTheme()}
              /> */}
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
    </ConfigProvider>
  );
};

const texts = {
  themeLabel: 'Cambiar colores',
};
