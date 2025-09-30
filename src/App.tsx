import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { Layout } from './components/layout/Layout';
import { useUIStore } from './store';
import './assets/styles/index.css';

// 中国红主题配置
const themeConfig = {
  token: {
    colorPrimary: '#CC0000',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#f5222d',
    colorInfo: '#1890ff',
    borderRadius: 8,
    fontFamily: 'Noto Sans SC, PingFang SC, Microsoft YaHei, sans-serif',
  },
  components: {
    Layout: {
      headerBg: '#CC0000',
      siderBg: '#ffffff',
      bodyBg: '#fafafa',
    },
    Menu: {
      itemSelectedBg: '#FFE6E6',
      itemSelectedColor: '#CC0000',
      itemHoverBg: '#FFF2F2',
    },
    Button: {
      primaryColor: '#ffffff',
      primaryBg: '#CC0000',
    },
  },
};

const App: React.FC = () => {
  const { theme } = useUIStore();

  return (
    <ConfigProvider
      locale={zhCN}
      theme={themeConfig}
    >
      <BrowserRouter>
        <div className={`app ${theme}`}>
          <Layout />
        </div>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;