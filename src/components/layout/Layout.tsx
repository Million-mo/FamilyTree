import React from 'react';
import { Layout as AntLayout } from 'antd';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MainContent } from './MainContent';
import { useUIStore } from '@/store';

const { Content } = AntLayout;

export const Layout: React.FC = () => {
  const { sidebarCollapsed } = useUIStore();

  return (
    <AntLayout className="min-h-screen">
      <Header />
      <AntLayout>
        <Sidebar collapsed={sidebarCollapsed} />
        <AntLayout className="bg-gray-50">
          <Content className="m-6 p-6 bg-white rounded-lg shadow-sm">
            <MainContent />
          </Content>
        </AntLayout>
      </AntLayout>
    </AntLayout>
  );
};