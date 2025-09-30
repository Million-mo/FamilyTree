import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Divider } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useUserStore, useUIStore } from '@/store';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

export const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useUserStore();
  const { addNotification } = useUIStore();
  const navigate = useNavigate();

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    
    try {
      await login(values);
      
      addNotification({
        type: 'success',
        title: '登录成功',
        message: `欢迎回来，${values.username}！`,
        read: false
      });
      
      navigate('/');
    } catch (error) {
      message.error('登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  // 演示账号登录
  const handleDemoLogin = async () => {
    setLoading(true);
    
    try {
      await login({ username: '演示用户', password: 'demo123' });
      
      addNotification({
        type: 'success',
        title: '演示登录成功',
        message: '欢迎使用族谱管理系统！',
        read: false
      });
      
      navigate('/');
    } catch (error) {
      message.error('演示登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo和标题 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-chinese-red rounded-full mb-4">
            <span className="text-white text-2xl font-bold">族</span>
          </div>
          <Title level={2} className="chinese-red">
            中国家庭族谱
          </Title>
          <Paragraph className="text-gray-600">
            数字化管理您的家族历史
          </Paragraph>
        </div>

        {/* 登录表单 */}
        <Card className="shadow-lg border-0">
          <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            size="large"
            layout="vertical"
          >
            <Form.Item
              label="用户名"
              name="username"
              rules={[
                { required: true, message: '请输入用户名' },
                { min: 2, message: '用户名至少2个字符' }
              ]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="请输入用户名" 
                className="border-gray-300"
              />
            </Form.Item>

            <Form.Item
              label="密码"
              name="password"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, message: '密码至少6个字符' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="请输入密码"
                className="border-gray-300"
              />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                block
                className="h-12 text-lg font-medium"
              >
                登录
              </Button>
            </Form.Item>
          </Form>

          <Divider>或者</Divider>

          <Button 
            type="default"
            onClick={handleDemoLogin}
            loading={loading}
            block
            className="h-12 text-lg"
          >
            使用演示账号登录
          </Button>

          {/* 演示说明 */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <Title level={5} className="text-blue-700 mb-2">
              演示账号说明
            </Title>
            <Paragraph className="text-blue-600 text-sm mb-0">
              点击"使用演示账号登录"可以直接体验系统功能，无需注册。
              演示数据包含完整的王氏族谱信息供您测试使用。
            </Paragraph>
          </div>
        </Card>

        {/* 版权信息 */}
        <div className="text-center mt-8">
          <Paragraph className="text-gray-500 text-sm">
            © 2024 中国家庭族谱可视化工具 | 传承家族文化
          </Paragraph>
        </div>
      </div>
    </div>
  );
};