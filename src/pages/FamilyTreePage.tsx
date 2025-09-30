import React, { useEffect } from 'react';
import { Typography, Space } from 'antd';
import { FamilyTreeView } from '@/components/family-tree/FamilyTreeView';
import { useFamilyTreeStore } from '@/store';

const { Title } = Typography;

export const FamilyTreePage: React.FC = () => {
  const { loadTree, currentTree } = useFamilyTreeStore();

  useEffect(() => {
    if (!currentTree) {
      loadTree();
    }
  }, [currentTree, loadTree]);

  return (
    <div className="h-full">
      <Space direction="vertical" size="large" className="w-full">
        <div>
          <Title level={2}>族谱视图</Title>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border" style={{ height: 'calc(100vh - 200px)' }}>
          <FamilyTreeView />
        </div>
      </Space>
    </div>
  );
};