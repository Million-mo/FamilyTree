import React from 'react';
import { Card, Alert, Button, Space } from 'antd';
import { EditOutlined, SaveOutlined, UndoOutlined } from '@ant-design/icons';
import { useUIStore } from '@/store';

export const TreeEditor: React.FC = () => {
  const { addNotification } = useUIStore();

  const handleNotification = (title: string, message: string) => {
    addNotification({
      type: 'info',
      title,
      message,
      read: false
    });
  };

  return (
    <div className="space-y-6">
      <Alert
        message="族谱编辑器开发中"
        description="此功能正在开发中，将支持拖拽编辑、关系建立、批量操作等高级功能。"
        type="info"
        showIcon
      />

      <Card title="编辑工具栏">
        <Space>
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => handleNotification('编辑模式', '进入编辑模式功能开发中')}
          >
            编辑模式
          </Button>
          <Button 
            icon={<SaveOutlined />}
            onClick={() => handleNotification('保存', '保存功能开发中')}
          >
            保存更改
          </Button>
          <Button 
            icon={<UndoOutlined />}
            onClick={() => handleNotification('撤销', '撤销功能开发中')}
          >
            撤销操作
          </Button>
        </Space>
      </Card>

      <Card title="编辑区域">
        <div className="h-96 bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">拖拽编辑区域 - 开发中</p>
        </div>
      </Card>
    </div>
  );
};