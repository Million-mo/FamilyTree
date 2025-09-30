import React from 'react';
import { List, Card, Avatar, Tag, Button, Space, Empty, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, ManOutlined, WomanOutlined } from '@ant-design/icons';
import type { Member } from '@/types';

interface MemberListProps {
  members: Member[];
  onEdit: (member: Member) => void;
  onSelect: (member: Member) => void;
  onDelete?: (member: Member) => void;
}

export const MemberList: React.FC<MemberListProps> = ({
  members,
  onEdit,
  onSelect,
  onDelete
}) => {
  if (members.length === 0) {
    return (
      <Card>
        <Empty
          description="暂无成员数据"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    );
  }

  return (
    <Card title="成员列表">
      <List
        itemLayout="horizontal"
        dataSource={members}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `第 ${range[0]}-${range[1]} 项，共 ${total} 项`,
        }}
        renderItem={(member) => (
          <List.Item
            actions={[
              <Button
                key="edit"
                type="link"
                icon={<EditOutlined />}
                onClick={() => onEdit(member)}
              >
                编辑
              </Button>,
              onDelete && (
                <Popconfirm
                  key="delete"
                  title="确认删除"
                  description={`确定要删除成员"${member.name}"吗？此操作不可恢复。`}
                  onConfirm={() => onDelete(member)}
                  okText="确定"
                  cancelText="取消"
                  okType="danger"
                >
                  <Button
                    type="link"
                    danger
                    icon={<DeleteOutlined />}
                  >
                    删除
                  </Button>
                </Popconfirm>
              )
            ].filter(Boolean)}
            onClick={() => onSelect(member)}
            className="cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  size={48}
                  src={member.photo}
                  icon={member.gender === 'male' ? <ManOutlined /> : <WomanOutlined />}
                  className={member.gender === 'male' ? 'bg-blue-500' : 'bg-pink-500'}
                />
              }
              title={
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">{member.name}</span>
                  {member.generationName && (
                    <Tag color="gold">
                      {member.generationName}字辈
                    </Tag>
                  )}
                </div>
              }
              description={
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Tag color={member.gender === 'male' ? 'blue' : 'magenta'}>
                      {member.gender === 'male' ? '男' : '女'}
                    </Tag>
                    <Tag color="default">
                      第{member.generation}代
                    </Tag>
                    {!member.deathDate && (
                      <Tag color="green">在世</Tag>
                    )}
                  </div>
                  
                  {member.birthDate && (
                    <div className="text-gray-500 text-sm">
                      生于 {member.birthDate.toLocaleDateString('zh-CN')}
                      {member.deathDate && 
                        ` - ${member.deathDate.toLocaleDateString('zh-CN')}`
                      }
                    </div>
                  )}
                  
                  {member.occupation && (
                    <div className="text-gray-600 text-sm">
                      职业: {member.occupation}
                    </div>
                  )}
                  
                  {member.description && (
                    <div className="text-gray-600 text-sm line-clamp-2">
                      {member.description}
                    </div>
                  )}
                </div>
              }
            />
            
            <div className="text-right">
              <Space direction="vertical" align="end">
                {member.children && member.children.length > 0 && (
                  <Tag color="orange">
                    {member.children.length}个子女
                  </Tag>
                )}
                {member.spouse && member.spouse.length > 0 && (
                  <Tag color="purple">
                    已婚
                  </Tag>
                )}
              </Space>
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
};