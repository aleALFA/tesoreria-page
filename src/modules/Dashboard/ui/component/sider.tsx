import {
  BarChartOutlined,
  DollarCircleOutlined,
  LogoutOutlined,
  TeamOutlined,
  // UploadOutlined,
  // UserOutlined,
} from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import React, { useCallback, useMemo, useState } from 'react';
import type { MenuProps } from 'antd';
import { Layout, Menu } from 'antd';

import { dashboardPaths, paths } from '../../../../config/router';
import { ItemType } from 'antd/es/menu/hooks/useItems';

interface LayoutSiderProps {
  collapsed: boolean
}
export default function LayoutSider({ collapsed }: LayoutSiderProps) {
  const navigate = useNavigate();

  const [current, setCurrent] = useState('dashboard');

  const items: MenuProps['items'] = useMemo(() => {
    const items = [];

    items.push({
      key: 'dashboard',
      icon: React.createElement(BarChartOutlined),
      label: texts.dashboard,
      onClick: () => { navigate(dashboardPaths.index); },
    });
    items.push({
      key: 'brother',
      icon: React.createElement(TeamOutlined),
      label: texts.brother,
      children: [
        {
          key: 'brotherList',
          label: texts.brotherList,
          onClick: () => { navigate(dashboardPaths.brother.list); },
        },
        {
          key: 'brotherAdd',
          label: texts.brotherAdd,
          onClick: () => { navigate(dashboardPaths.brother.add); },
        },
      ],
    });
    items.push({
      key: 'payment',
      icon: React.createElement(DollarCircleOutlined),
      label: texts.payment,
      children: [
        {
          key: 'paymentListByBro',
          label: texts.paymentListByBro,
          onClick: () => { navigate(dashboardPaths.payment.listByBrother); },
        },
        {
          key: 'paymentAdd',
          label: texts.paymentAdd,
          onClick: () => { navigate(dashboardPaths.payment.add); },
        },
      ],
    });
    items.push({
      key: 'logout',
      icon: React.createElement(LogoutOutlined),
      label: texts.logout,
      onClick: () => { navigate(paths.index); },
    });

    return items;
  }, [navigate]);

  const onClick = useCallback((e: ItemType) => {
    setCurrent((e?.key ?? '') as string);
  },[setCurrent]);

  return (
    <Layout.Sider
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
      }}
      collapsed={collapsed}
      trigger={null}
      collapsible
      width={250}
    >
      <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }}>
        <h1 className="m-0 text-center" style={{ lineHeight: '32px' }}>Dantón 97</h1>
      </div>
      <Menu
        defaultSelectedKeys={[current]}
        onClick={onClick}
        items={items}
        mode="inline"
        theme="dark"
      />
    </Layout.Sider>
  );
}

const texts = {
  logout: 'Salir',
  dashboard: 'Dashboard',
  brother: 'Hermanos',
  brotherList: 'Listado de Hermanos',
  brotherAdd: 'Agregar Hermano/Profano',
  payment: 'Pagos',
  paymentListByBro: 'Pagos por Hermano',
  paymentAdd: 'Agregar Pago',
}