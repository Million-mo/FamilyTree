import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useFamilyTreeStore } from '@/store';
import type { Member } from '@/types';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

interface MemberFormProps {
  member?: Member | null;
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const MemberForm: React.FC<MemberFormProps> = ({
  member,
  visible,
  onClose,
  onSuccess
}) => {
  const [form] = Form.useForm();
  const { addMember, updateMember } = useFamilyTreeStore();

  useEffect(() => {
    if (visible && member) {
      form.setFieldsValue({
        ...member,
        birthDate: member.birthDate ? dayjs(member.birthDate) : null,
        deathDate: member.deathDate ? dayjs(member.deathDate) : null,
      });
    } else if (visible) {
      form.resetFields();
    }
  }, [visible, member, form]);

  const handleSubmit = async (values: any) => {
    try {
      const memberData = {
        ...values,
        birthDate: values.birthDate ? values.birthDate.toDate() : undefined,
        deathDate: values.deathDate ? values.deathDate.toDate() : undefined,
      };

      if (member) {
        await updateMember(member.id, memberData);
      } else {
        await addMember(memberData);
      }

      message.success(`成员${member ? '更新' : '添加'}成功`);
      onSuccess();
    } catch (error) {
      message.error(`${member ? '更新' : '添加'}成员失败`);
    }
  };

  const handleUpload = (info: any) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 上传成功`);
      form.setFieldsValue({ photo: info.file.response?.url });
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败`);
    }
  };

  return (
    <Modal
      title={member ? '编辑成员信息' : '添加新成员'}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          gender: 'male',
          generation: 1,
        }}
      >
        <Form.Item
          label="姓名"
          name="name"
          rules={[
            { required: true, message: '请输入姓名' },
            { min: 2, message: '姓名至少2个字符' }
          ]}
        >
          <Input placeholder="请输入姓名" />
        </Form.Item>

        <Form.Item
          label="性别"
          name="gender"
          rules={[{ required: true, message: '请选择性别' }]}
        >
          <Select placeholder="请选择性别">
            <Option value="male">男</Option>
            <Option value="female">女</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="辈分"
          name="generation"
          rules={[{ required: true, message: '请输入辈分' }]}
        >
          <Select placeholder="请选择辈分">
            {Array.from({ length: 10 }, (_, i) => i + 1).map(gen => (
              <Option key={gen} value={gen}>第{gen}代</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="字辈"
          name="generationName"
        >
          <Input placeholder="请输入字辈（如：德、志、明等）" />
        </Form.Item>

        <Form.Item
          label="出生日期"
          name="birthDate"
        >
          <DatePicker
            placeholder="请选择出生日期"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          label="去世日期"
          name="deathDate"
        >
          <DatePicker
            placeholder="请选择去世日期（在世成员无需填写）"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          label="出生地"
          name="birthPlace"
        >
          <Input placeholder="请输入出生地" />
        </Form.Item>

        <Form.Item
          label="职业"
          name="occupation"
        >
          <Input placeholder="请输入职业" />
        </Form.Item>

        <Form.Item
          label="主要成就"
          name="achievements"
        >
          <TextArea
            rows={3}
            placeholder="请输入主要成就和贡献"
          />
        </Form.Item>

        <Form.Item
          label="个人简介"
          name="description"
        >
          <TextArea
            rows={4}
            placeholder="请输入个人简介、生平事迹等"
          />
        </Form.Item>

        <Form.Item
          label="照片"
          name="photo"
        >
          <Upload
            name="photo"
            listType="picture"
            maxCount={1}
            onChange={handleUpload}
            beforeUpload={() => {
              message.info('照片上传功能暂未实现，仅作演示');
              return false;
            }}
          >
            <Button icon={<UploadOutlined />}>上传照片</Button>
          </Upload>
        </Form.Item>

        <Form.Item className="mb-0">
          <div className="flex justify-end space-x-2">
            <Button onClick={onClose}>
              取消
            </Button>
            <Button type="primary" htmlType="submit">
              {member ? '更新' : '添加'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};