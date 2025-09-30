import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Space } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, IdcardOutlined } from '@ant-design/icons';
import { useUserStore, useUIStore } from '@/store';
import { useNavigate, Link } from 'react-router-dom';
import type { RegisterData } from '@/types';

const { Title, Paragraph } = Typography;

export const RegisterPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { register } = useUserStore();
  const { addNotification } = useUIStore();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values: RegisterData) => {
    setLoading(true);
    
    try {
      await register(values);
      
      addNotification({
        type: 'success',
        title: '注册成功',
        message: `欢迎您，${values.username}！`,
        read: false
      });
      
      navigate('/');
    } catch (error) {
      message.error('注册失败，请检查信息后重试');
    } finally {
      setLoading(false);
    }
  };

  // 验证密码确认
  const validateConfirmPassword = (_: any, value: string) => {
    if (!value || form.getFieldValue('password') === value) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('两次输入的密码不一致'));
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
            用户注册
          </Title>
          <Paragraph className="text-gray-600">
            创建您的族谱管理账户
          </Paragraph>
        </div>

        {/* 注册表单 */}
        <Card className="shadow-lg border-0">
          <Form
            form={form}
            name="register"
            onFinish={onFinish}
            size="large"
            layout="vertical"
            scrollToFirstError
          >
            <Form.Item
              label="用户名"
              name="username"
              rules={[
                { required: true, message: '请输入用户名' },
                { min: 2, max: 20, message: '用户名长度为2-20个字符' },
                { pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/, message: '用户名只能包含字母、数字、下划线和中文' }
              ]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="请输入用户名" 
                className="border-gray-300"
              />
            </Form.Item>

            <Form.Item
              label="邮箱"
              name="email"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' }
              ]}
            >
              <Input 
                prefix={<MailOutlined />} 
                placeholder="请输入邮箱地址" 
                className="border-gray-300"
              />
            </Form.Item>

            <Form.Item
              label="真实姓名"
              name="realName"
              rules={[
                { min: 2, max: 10, message: '姓名长度为2-10个字符' }
              ]}
            >
              <Input 
                prefix={<IdcardOutlined />} 
                placeholder="请输入真实姓名（可选）" 
                className="border-gray-300"
              />
            </Form.Item>

            <Form.Item
              label="手机号"
              name="phone"
              rules={[
                { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' }
              ]}
            >
              <Input 
                prefix={<PhoneOutlined />} 
                placeholder="请输入手机号（可选）" 
                className="border-gray-300"
              />
            </Form.Item>

            <Form.Item
              label="密码"
              name="password"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, max: 20, message: '密码长度为6-20个字符' },
                { pattern: /^(?=.*[a-zA-Z])(?=.*\d)/, message: '密码必须包含字母和数字' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="请输入密码"
                className="border-gray-300"
              />
            </Form.Item>

            <Form.Item
              label="确认密码"
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: '请确认密码' },
                { validator: validateConfirmPassword }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="请再次输入密码"
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
                注册
              </Button>
            </Form.Item>
          </Form>

          {/* 登录链接 */}
          <div className="text-center mt-4">
            <Space>
              <span className="text-gray-600">已有账户？</span>
              <Link to="/login" className="text-chinese-red hover:text-red-700">
                立即登录
              </Link>
            </Space>
          </div>

          {/* 注册说明 */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <Title level={5} className="text-blue-700 mb-2">
              注册说明
            </Title>
            <Paragraph className="text-blue-600 text-sm mb-0">
              • 用户名用于登录，支持中文、英文、数字和下划线<br/>
              • 密码必须包含字母和数字，长度6-20位<br/>
              • 注册成功后可以创建和管理家族族谱
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