import React from 'react';
import { Card, Avatar, Tag, Typography, Tooltip } from 'antd';
import { UserOutlined, ManOutlined, WomanOutlined } from '@ant-design/icons';
import type { FamilyNode, ViewMode } from '@/types';

const { Text } = Typography;

interface NodeComponentProps {
  node: FamilyNode;
  viewMode: ViewMode;
  isSelected?: boolean;
  onClick?: (node: FamilyNode) => void;
}

export const NodeComponent: React.FC<NodeComponentProps> = ({
  node,
  viewMode,
  isSelected = false,
  onClick
}) => {
  const handleClick = () => {
    onClick?.(node);
  };

  // 计算年龄
  const getAge = () => {
    if (!node.birthDate) return null;
    const endDate = node.deathDate || new Date();
    return Math.floor((endDate.getTime() - node.birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  };

  // 格式化日期
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (viewMode === 'simple') {
    return (
      <div
        className={`family-node inline-flex items-center justify-center w-16 h-16 rounded-full cursor-pointer transition-all ${
          node.gender === 'male' ? 'bg-blue-500' : 'bg-pink-500'
        } ${isSelected ? 'ring-4 ring-yellow-400' : ''}`}
        onClick={handleClick}
      >
        <Text className="text-white font-bold text-sm">
          {node.name.length > 2 ? node.name.substring(0, 2) : node.name}
        </Text>
      </div>
    );
  }

  if (viewMode === 'card') {
    return (
      <Card
        size="small"
        className={`family-node w-48 cursor-pointer transition-all ${
          isSelected ? 'border-yellow-400 shadow-lg' : 'border-gray-300'
        }`}
        onClick={handleClick}
      >
        <div className="flex items-center space-x-3">
          <Avatar
            size={40}
            src={node.photo}
            icon={node.gender === 'male' ? <ManOutlined /> : <WomanOutlined />}
            className={node.gender === 'male' ? 'bg-blue-500' : 'bg-pink-500'}
          />
          
          <div className="flex-1">
            <div className="font-bold text-sm">{node.name}</div>
            <div className="text-xs text-gray-500">
              {node.generationName && `${node.generationName}字辈`}
              {node.generation && ` · 第${node.generation}代`}
            </div>
            
            {(node.birthDate || node.deathDate) && (
              <div className="text-xs text-gray-400 mt-1">
                {node.birthDate && formatDate(node.birthDate)}
                {node.deathDate && ` - ${formatDate(node.deathDate)}`}
                {!node.deathDate && node.birthDate && ` (${getAge()}岁)`}
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-2 flex flex-wrap gap-1">
          <Tag color={node.gender === 'male' ? 'blue' : 'magenta'}>
            {node.gender === 'male' ? '男' : '女'}
          </Tag>
          
          {!node.deathDate && (
            <Tag color="green">在世</Tag>
          )}
          
          {node.children && node.children.length > 0 && (
            <Tag color="orange">{node.children.length}个子女</Tag>
          )}
        </div>
      </Card>
    );
  }

  // detailed 模式
  return (
    <Tooltip
      title={
        <div>
          <div><strong>{node.name}</strong></div>
          {node.description && <div>{node.description}</div>}
          {node.occupation && <div>职业: {node.occupation}</div>}
          {node.birthPlace && <div>出生地: {node.birthPlace}</div>}
        </div>
      }
    >
      <div
        className={`family-node chinese-border p-3 bg-white cursor-pointer transition-all ${
          isSelected ? 'ring-2 ring-yellow-400 shadow-lg' : 'shadow-sm'
        }`}
        onClick={handleClick}
        style={{ minWidth: '120px' }}
      >
        <div className="text-center">
          <Avatar
            size={32}
            src={node.photo}
            icon={<UserOutlined />}
            className={`mb-2 ${node.gender === 'male' ? 'bg-blue-500' : 'bg-pink-500'}`}
          />
          
          <div className="font-bold text-sm text-chinese-red mb-1">
            {node.name}
          </div>
          
          {node.generationName && (
            <div className="text-xs text-gray-600 mb-1">
              {node.generationName}字辈
            </div>
          )}
          
          <div className="flex justify-center space-x-1">
            <Tag color={node.gender === 'male' ? 'blue' : 'magenta'}>
              {node.gender === 'male' ? '男' : '女'}
            </Tag>
          </div>
          
          {node.birthDate && (
            <div className="text-xs text-gray-500 mt-1">
              {formatDate(node.birthDate)}
              {!node.deathDate && ` (${getAge()}岁)`}
            </div>
          )}
          
          {node.deathDate && (
            <div className="text-xs text-gray-500">
              - {formatDate(node.deathDate)}
            </div>
          )}
        </div>
      </div>
    </Tooltip>
  );
};