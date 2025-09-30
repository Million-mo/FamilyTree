import React from 'react';
import { Typography, Card, Space } from 'antd';

const { Title, Paragraph } = Typography;

export const SettingsPage: React.FC = () => {
  return (
    <div>
      <Title level={2}>系统设置</Title>
      
      <Space direction="vertical" size="large" className="w-full">
        <Card title="个人设置">
          <Paragraph>个人设置功能正在开发中...</Paragraph>
        </Card>
        
        <Card title="族谱设置">
          <Paragraph>族谱设置功能正在开发中...</Paragraph>
        </Card>
        
        <Card title="系统配置">
          <Paragraph>系统配置功能正在开发中...</Paragraph>
        </Card>
      </Space>
    </div>
  );
};