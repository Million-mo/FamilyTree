import React from 'react';
import { Typography } from 'antd';
import { MemberManagement } from '@/components/member-management/MemberManagement';

const { Title } = Typography;

export const MembersPage: React.FC = () => {
  return (
    <div>
      <Title level={2}>成员管理</Title>
      <MemberManagement />
    </div>
  );
};