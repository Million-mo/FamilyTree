import React, { useEffect } from 'react';
import { Card, Row, Col, Statistic, Button, Typography, Space, Progress } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  ApartmentOutlined,
  ClockCircleOutlined,
  PlusOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useFamilyTreeStore, useUIStore } from '@/store';

const { Title, Paragraph } = Typography;

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { 
    currentTree, 
    members, 
    loadTree
  } = useFamilyTreeStore();
  
  const { addNotification } = useUIStore();

  // 加载默认族谱数据
  useEffect(() => {
    if (!currentTree) {
      loadTree();
    }
  }, [currentTree, loadTree]);

  // 统计数据
  const totalMembers = members.length;
  const maleMembers = members.filter(m => m.gender === 'male').length;
  const femaleMembers = members.filter(m => m.gender === 'female').length;
  const aliveMembers = members.filter(m => !m.deathDate).length;
  const generations = Math.max(...members.map(m => m.generation), 0);

  // 最近活动模拟数据
  const recentActivities = [
    { id: 1, action: '添加成员', name: '王小明', time: '2小时前' },
    { id: 2, action: '更新信息', name: '李母亲', time: '1天前' },
    { id: 3, action: '建立关系', name: '王父亲 - 王小明', time: '3天前' },
  ];

  // 快速操作
  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'add-member':
        navigate('/members');
        addNotification({
          type: 'info',
          title: '跳转到成员管理',
          message: '在此页面可以添加新的家族成员',
          read: false
        });
        break;
      case 'view-tree':
        navigate('/tree');
        break;
      case 'edit-tree':
        navigate('/editor');
        break;
      default:
        addNotification({
          type: 'info',
          title: '功能开发中',
          message: '该功能正在开发中，敬请期待',
          read: false
        });
    }
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <Title level={2} className="mb-2">
          欢迎回到族谱管理系统
        </Title>
        <Paragraph className="text-gray-600">
          {currentTree ? `当前查看：${currentTree.name}` : '管理和浏览您的家族族谱信息'}
        </Paragraph>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="家族成员总数"
              value={totalMembers}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#CC0000' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="在世成员"
              value={aliveMembers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="传承世代"
              value={generations}
              prefix={<ApartmentOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="最后更新"
              value="今天"
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 性别分布和快速操作 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="性别分布" className="h-full">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span>男性成员</span>
                  <span>{maleMembers}人</span>
                </div>
                <Progress 
                  percent={totalMembers ? Math.round((maleMembers / totalMembers) * 100) : 0}
                  strokeColor="#1890ff"
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span>女性成员</span>
                  <span>{femaleMembers}人</span>
                </div>
                <Progress 
                  percent={totalMembers ? Math.round((femaleMembers / totalMembers) * 100) : 0}
                  strokeColor="#eb2f96"
                />
              </div>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card title="快速操作" className="h-full">
            <Space direction="vertical" size="middle" className="w-full">
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                block
                onClick={() => handleQuickAction('add-member')}
              >
                添加家族成员
              </Button>
              
              <Button 
                icon={<EyeOutlined />} 
                block
                onClick={() => handleQuickAction('view-tree')}
              >
                查看族谱图
              </Button>
              
              <Button 
                icon={<ApartmentOutlined />} 
                block
                onClick={() => handleQuickAction('edit-tree')}
              >
                编辑族谱结构
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 最近活动和族谱信息 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="最近活动" className="h-full">
            <div className="space-y-3">
              {recentActivities.map(activity => (
                <div key={activity.id} className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{activity.action}</span>
                    <span className="text-gray-600 ml-2">{activity.name}</span>
                  </div>
                  <span className="text-gray-400 text-sm">{activity.time}</span>
                </div>
              ))}
            </div>
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card title="族谱信息" className="h-full">
            {currentTree ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">姓氏：</span>
                  <span className="font-medium">{currentTree.metadata?.familySurname || '未设置'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">堂号：</span>
                  <span className="font-medium">{currentTree.metadata?.hallName || '未设置'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">祖籍：</span>
                  <span className="font-medium">{currentTree.metadata?.ancestralPlace || '未设置'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">字辈：</span>
                  <span className="font-medium">{currentTree.metadata?.generationPoem || '未设置'}</span>
                </div>
              </div>
            ) : (
              <Paragraph className="text-gray-500">正在加载族谱信息...</Paragraph>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};