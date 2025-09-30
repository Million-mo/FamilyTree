import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  ApartmentOutlined,
  UserOutlined,
  EditOutlined,
  SettingOutlined,
  TeamOutlined,
  HistoryOutlined,
  FileTextOutlined
} from '@ant-design/icons';

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // 菜单项配置
  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: '仪表板',
    },
    {
      key: '/tree',
      icon: <ApartmentOutlined />,
      label: '族谱视图',
    },
    {
      key: '/members',
      icon: <UserOutlined />,
      label: '成员管理',
    },
    {
      key: '/editor',
      icon: <EditOutlined />,
      label: '族谱编辑',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'tools',
      icon: <SettingOutlined />,
      label: '工具功能',
      children: [
        {
          key: '/genealogy',
          icon: <TeamOutlined />,
          label: '族谱管理',
        },
        {
          key: '/timeline',
          icon: <HistoryOutlined />,
          label: '家族时间线',
        },
        {
          key: '/reports',
          icon: <FileTextOutlined />,
          label: '统计报告',
        },
      ],
    },
    {
      type: 'divider' as const,
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: '系统设置',
    },
  ];

  // 处理菜单点击
  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  // 获取当前选中的菜单项
  const selectedKeys = [location.pathname];
  
  // 获取当前展开的菜单项
  const getOpenKeys = () => {
    const path = location.pathname;
    if (path.startsWith('/genealogy') || path.startsWith('/timeline') || path.startsWith('/reports')) {
      return ['tools'];
    }
    return [];
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={250}
      className="shadow-lg"
      theme="light"
    >
      <div className="h-full bg-white">
        <Menu
          mode="inline"
          selectedKeys={selectedKeys}
          defaultOpenKeys={getOpenKeys()}
          onClick={handleMenuClick}
          items={menuItems}
          className="border-r-0 h-full"
          style={{
            fontSize: '14px',
          }}
        />
      </div>
    </Sider>
  );
};