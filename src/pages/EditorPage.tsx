import React from 'react';
import { Typography } from 'antd';
import { TreeEditor } from '@/components/tree-editor/TreeEditor';

const { Title } = Typography;

export const EditorPage: React.FC = () => {
  return (
    <div>
      <Title level={2}>族谱编辑器</Title>
      <TreeEditor />
    </div>
  );
};