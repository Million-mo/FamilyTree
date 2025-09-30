import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// 确保在DOM加载完成后渲染应用
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);