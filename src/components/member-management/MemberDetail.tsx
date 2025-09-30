import React from 'react';
import { Card, Descriptions, Avatar, Tag, Button, Space, Divider, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, ManOutlined, WomanOutlined } from '@ant-design/icons';
import type { Member } from '@/types';

interface MemberDetailProps {
  member: Member;
  onEdit: (member: Member) => void;
  onDelete?: (member: Member) => void;
}

export const MemberDetail: React.FC<MemberDetailProps> = ({
  member,
  onEdit,
  onDelete
}) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAge = () => {
    if (!member.birthDate) return null;
    const endDate = member.deathDate || new Date();
    return Math.floor((endDate.getTime() - member.birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  };

  return (
    <Card
      title="成员详情"
      extra={
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => onEdit(member)}
          >
            编辑
          </Button>
          {onDelete && (
            <Popconfirm
              title="确认删除"
              description={`确定要删除成员"${member.name}"吗？此操作不可恢复。`}
              onConfirm={() => onDelete(member)}
              okText="确定"
              cancelText="取消"
              okType="danger"
            >
              <Button
                danger
                icon={<DeleteOutlined />}
              >
                删除
              </Button>
            </Popconfirm>
          )}
        </Space>
      }
    >
      <div className="text-center mb-4">
        <Avatar
          size={80}
          src={member.photo}
          icon={member.gender === 'male' ? <ManOutlined /> : <WomanOutlined />}
          className={`mb-3 ${member.gender === 'male' ? 'bg-blue-500' : 'bg-pink-500'}`}
        />
        <h3 className="text-xl font-bold text-chinese-red">{member.name}</h3>
        
        <Space wrap>
          <Tag color={member.gender === 'male' ? 'blue' : 'magenta'}>
            {member.gender === 'male' ? '男' : '女'}
          </Tag>
          
          {member.generationName && (
            <Tag color="gold">{member.generationName}字辈</Tag>
          )}
          
          <Tag color="default">第{member.generation}代</Tag>
          
          {!member.deathDate && (
            <Tag color="green">在世</Tag>
          )}
        </Space>
      </div>

      <Descriptions
        column={1}
        size="small"
        bordered
      >
        {member.birthDate && (
          <Descriptions.Item label="出生日期">
            {formatDate(member.birthDate)}
            {getAge() && ` (${getAge()}岁)`}
          </Descriptions.Item>
        )}
        
        {member.deathDate && (
          <Descriptions.Item label="去世日期">
            {formatDate(member.deathDate)}
          </Descriptions.Item>
        )}
        
        {member.birthPlace && (
          <Descriptions.Item label="出生地">
            {member.birthPlace}
          </Descriptions.Item>
        )}
        
        {member.occupation && (
          <Descriptions.Item label="职业">
            {member.occupation}
          </Descriptions.Item>
        )}
        
        {member.achievements && (
          <Descriptions.Item label="主要成就">
            {member.achievements}
          </Descriptions.Item>
        )}
        
        {member.description && (
          <Descriptions.Item label="个人简介">
            {member.description}
          </Descriptions.Item>
        )}
      </Descriptions>

      <Divider />

      <div>
        <h4 className="font-semibold mb-2">家庭关系</h4>
        
        {member.parents && member.parents.length > 0 && (
          <div className="mb-2">
            <span className="text-gray-600">父母: </span>
            <span>{member.parents.length}人</span>
          </div>
        )}
        
        {member.spouse && member.spouse.length > 0 && (
          <div className="mb-2">
            <span className="text-gray-600">配偶: </span>
            <span>{member.spouse.length}人</span>
          </div>
        )}
        
        {member.children && member.children.length > 0 && (
          <div className="mb-2">
            <span className="text-gray-600">子女: </span>
            <span>{member.children.length}人</span>
          </div>
        )}
        
        {(!member.parents || member.parents.length === 0) &&
         (!member.spouse || member.spouse.length === 0) &&
         (!member.children || member.children.length === 0) && (
          <div className="text-gray-500 text-sm">暂无家庭关系信息</div>
        )}
      </div>
    </Card>
  );
};