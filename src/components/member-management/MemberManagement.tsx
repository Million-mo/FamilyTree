import React, { useState } from 'react';
import { Card, Row, Col, Input, Button, Select, Space, Tabs } from 'antd';
import { PlusOutlined, SearchOutlined, FilterOutlined, ApartmentOutlined } from '@ant-design/icons';
import { MemberList } from './MemberList';
import { MemberDetail } from './MemberDetail';
import { MemberForm } from './MemberForm';
// import { RelationshipManager } from './RelationshipManager';
import { useFamilyTreeStore, useUIStore } from '@/store';
import type { FilterOptions, Member } from '@/types';

const { Option } = Select;
const { TabPane } = Tabs;

export const MemberManagement: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [activeTab, setActiveTab] = useState('members');
  
  const {
    members,
    selectedNode,
    filterOptions,
    searchKeyword,
    setFilterOptions,
    setSearchKeyword,
    getFilteredMembers,
    deleteMember
  } = useFamilyTreeStore();
  
  const { addNotification } = useUIStore();

  // 处理搜索
  const handleSearch = (value: string) => {
    setSearchKeyword(value);
  };

  // 处理筛选
  const handleFilter = (key: keyof FilterOptions, value: any) => {
    setFilterOptions({
      ...filterOptions,
      [key]: value
    });
  };

  // 清除筛选
  const clearFilters = () => {
    setFilterOptions({});
    setSearchKeyword('');
  };

  // 添加成员
  const handleAddMember = () => {
    setEditingMember(null);
    setShowForm(true);
  };

  // 编辑成员
  const handleEditMember = (member: Member) => {
    setEditingMember(member);
    setShowForm(true);
  };

  // 关闭表单
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingMember(null);
  };

  // 表单提交成功
  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingMember(null);
    addNotification({
      type: 'success',
      title: editingMember ? '更新成功' : '添加成功',
      message: `成员信息已${editingMember ? '更新' : '添加'}`,
      read: false
    });
  };

  // 删除成员
  const handleDeleteMember = async (member: Member) => {
    try {
      await deleteMember(member.id);
      addNotification({
        type: 'success',
        title: '删除成功',
        message: `成员"${member.name}"已被删除`,
        read: false
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: '删除失败',
        message: error instanceof Error ? error.message : '删除成员时发生错误',
        read: false
      });
    }
  };

  const filteredMembers = getFilteredMembers();

  return (
    <div className="space-y-6">
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="成员管理" key="members">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">成员管理</h3>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAddMember}
                >
                  添加成员
                </Button>
              </div>
              
              <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                  <Input
                    placeholder="搜索成员姓名、职业、描述..."
                    prefix={<SearchOutlined />}
                    value={searchKeyword}
                    onChange={(e) => handleSearch(e.target.value)}
                    allowClear
                  />
                </Col>
                
                <Col xs={12} md={4}>
                  <Select
                    placeholder="性别筛选"
                    value={filterOptions.gender}
                    onChange={(value) => handleFilter('gender', value)}
                    allowClear
                    style={{ width: '100%' }}
                  >
                    <Option value="male">男性</Option>
                    <Option value="female">女性</Option>
                  </Select>
                </Col>
                
                <Col xs={12} md={4}>
                  <Select
                    placeholder="生存状态"
                    value={filterOptions.isAlive}
                    onChange={(value) => handleFilter('isAlive', value)}
                    allowClear
                    style={{ width: '100%' }}
                  >
                    <Option value={true}>在世</Option>
                    <Option value={false}>已故</Option>
                  </Select>
                </Col>
                
                <Col xs={12} md={4}>
                  <Select
                    placeholder="辈分筛选"
                    value={filterOptions.generation}
                    onChange={(value) => handleFilter('generation', value)}
                    allowClear
                    style={{ width: '100%' }}
                  >
                    {Array.from(new Set(members.map(m => m.generation)))
                      .sort((a, b) => a - b)
                      .map(gen => (
                        <Option key={gen} value={gen}>第{gen}代</Option>
                      ))}
                  </Select>
                </Col>
                
                <Col xs={12} md={4}>
                  <Space>
                    <Button
                      icon={<FilterOutlined />}
                      onClick={clearFilters}
                    >
                      清除筛选
                    </Button>
                  </Space>
                </Col>
              </Row>
              
              <div className="text-sm text-gray-500">
                共找到 {filteredMembers.length} 个成员
                {Object.keys(filterOptions).length > 0 || searchKeyword && 
                  ` (已筛选，总计 ${members.length} 个成员)`
                }
              </div>
            </div>
          </TabPane>
          
          <TabPane 
            tab={
              <span>
                <ApartmentOutlined />
                关系管理
              </span>
            } 
            key="relationships"
          >
            {/* <RelationshipManager /> */}
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">关系管理功能开发中...</p>
              <p className="text-sm text-gray-400">
                目前可以在添加/编辑成员时设置家庭关系
              </p>
            </div>
          </TabPane>
        </Tabs>
      </Card>

      {/* 主要内容区域 */}
      {activeTab === 'members' && (
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={selectedNode ? 16 : 24}>
            <MemberList
              members={filteredMembers}
              onEdit={handleEditMember}
              onDelete={handleDeleteMember}
              onSelect={(member) => {
                // 这里可以添加选择成员的逻辑
              }}
            />
          </Col>
          
          {selectedNode && (
            <Col xs={24} lg={8}>
              <MemberDetail 
                member={{
                  id: selectedNode.id,
                  name: selectedNode.name,
                  gender: selectedNode.gender,
                  birthDate: selectedNode.birthDate,
                  deathDate: selectedNode.deathDate,
                  generation: selectedNode.generation,
                  photo: selectedNode.photo,
                  description: selectedNode.description,
                  spouse: selectedNode.spouse,
                  children: selectedNode.parents, // 转换为string[]
                  parents: selectedNode.parents,
                  birthPlace: selectedNode.birthPlace,
                  occupation: selectedNode.occupation,
                  achievements: selectedNode.achievements,
                  generationName: selectedNode.generationName
                }}
                onEdit={handleEditMember}
                onDelete={handleDeleteMember}
              />
            </Col>
          )}
        </Row>
      )}

      {/* 成员表单弹窗 */}
      {showForm && (
        <MemberForm
          member={editingMember}
          visible={showForm}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};