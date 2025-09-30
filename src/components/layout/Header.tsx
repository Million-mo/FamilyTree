import React from 'react';
import { Layout, Button, Avatar, Dropdown, Space, Badge, Typography } from 'antd';
import { 
  MenuFoldOutlined, 
  MenuUnfoldOutlined, 
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useUIStore, useUserStore } from '@/store';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

export const Header: React.FC = () => {
  const { 
    sidebarCollapsed, 
    toggleSidebar, 
    notifications, 
    isFullscreen, 
    toggleFullscreen,
    addNotification 
  } = useUIStore();
  
  const { user, logout } = useUserStore();

  // 未读通知数量
  const unreadCount = notifications.filter(n => !n.read).length;

  // 用户下拉菜单
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
      onClick: () => {
        addNotification({
          type: 'info',
          title: '功能开发中',
          message: '个人资料功能正在开发中',
          read: false
        });
      }
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '系统设置',
      onClick: () => {
        addNotification({
          type: 'info',
          title: '功能开发中',
          message: '系统设置功能正在开发中',
          read: false
        });
      }
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: () => {
        logout();
        addNotification({
          type: 'success',
          title: '退出成功',
          message: '您已成功退出系统',
          read: false
        });
      }
    },
  ];

  // 通知按钮点击
  const handleNotificationClick = () => {
    addNotification({
      type: 'info',
      title: '通知中心',
      message: '通知中心功能正在开发中',
      read: false
    });
  };

  return (
    <AntHeader className="bg-chinese-red px-6 flex items-center justify-between shadow-md">
      {/* 左侧：Logo和菜单按钮 */}
      <div className="flex items-center space-x-4">
        <Button
          type="text"
          icon={sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggleSidebar}
          className="text-white hover:text-white hover:bg-red-700"
        />
        
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-chinese-gold rounded-full flex items-center justify-center">
            <Text className="text-chinese-red font-bold text-lg">族</Text>
          </div>
          <Text className="text-white text-xl font-bold hidden md:block">
            中国家庭族谱
          </Text>
        </div>
      </div>

      {/* 右侧：操作按钮和用户信息 */}
      <div className="flex items-center space-x-4">
        {/* 全屏按钮 */}
        <Button
          type="text"
          icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
          onClick={toggleFullscreen}
          className="text-white hover:text-white hover:bg-red-700"
          title={isFullscreen ? '退出全屏' : '进入全屏'}
        />

        {/* 通知按钮 */}
        <Badge count={unreadCount} size="small">
          <Button
            type="text"
            icon={<BellOutlined />}
            onClick={handleNotificationClick}
            className="text-white hover:text-white hover:bg-red-700"
            title="通知"
          />
        </Badge>

        {/* 用户信息 */}
        {user ? (
          <Dropdown 
            menu={{ items: userMenuItems }} 
            placement="bottomRight"
            trigger={['click']}
          >
            <Space className="cursor-pointer hover:bg-red-700 px-3 py-2 rounded transition-colors">
              <Avatar 
                src={user.avatar} 
                icon={<UserOutlined />}
                size="small"
              />
              <Text className="text-white hidden md:block">
                {user.username}
              </Text>
            </Space>
          </Dropdown>
        ) : (
          <Button 
            type="default" 
            className="text-white border-white hover:text-chinese-red hover:bg-white"
          >
            登录
          </Button>
        )}
      </div>
    </AntHeader>
  );
};