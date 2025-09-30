import { create } from 'zustand';
import type { Notification, ModalState } from '@/types';

interface UIState {
  // 侧边栏状态
  sidebarCollapsed: boolean;
  
  // 加载状态
  loading: boolean;
  
  // 通知状态
  notifications: Notification[];
  
  // 弹窗状态
  modal: ModalState;
  
  // 主题设置
  theme: 'light' | 'dark';
  
  // 语言设置
  locale: 'zh-CN' | 'en-US';
  
  // 全屏状态
  isFullscreen: boolean;
  
  // Actions
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setLoading: (loading: boolean) => void;
  
  // 通知管理
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  
  // 弹窗管理
  openModal: (type: ModalState['type'], data?: any) => void;
  closeModal: () => void;
  setModalData: (data: any) => void;
  
  // 主题和语言
  setTheme: (theme: 'light' | 'dark') => void;
  setLocale: (locale: 'zh-CN' | 'en-US') => void;
  
  // 全屏控制
  toggleFullscreen: () => void;
  setFullscreen: (isFullscreen: boolean) => void;
}

// 生成唯一ID的工具函数
const generateNotificationId = () => `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const useUIStore = create<UIState>((set, get) => ({
  // 初始状态
  sidebarCollapsed: false,
  loading: false,
  notifications: [],
  modal: {
    isOpen: false,
    type: undefined,
    data: undefined,
  },
  theme: 'light',
  locale: 'zh-CN',
  isFullscreen: false,

  // 侧边栏 Actions
  toggleSidebar: () => {
    set(state => ({
      sidebarCollapsed: !state.sidebarCollapsed
    }));
  },

  setSidebarCollapsed: (collapsed: boolean) => {
    set({ sidebarCollapsed: collapsed });
  },

  setLoading: (loading: boolean) => {
    set({ loading });
  },

  // 通知管理 Actions
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: generateNotificationId(),
      timestamp: new Date(),
      read: false,
    };

    set(state => ({
      notifications: [newNotification, ...state.notifications]
    }));

    // 自动移除成功类型的通知（5秒后）
    if (notification.type === 'success') {
      setTimeout(() => {
        get().removeNotification(newNotification.id);
      }, 5000);
    }
  },

  removeNotification: (id: string) => {
    set(state => ({
      notifications: state.notifications.filter(notification => notification.id !== id)
    }));
  },

  markNotificationAsRead: (id: string) => {
    set(state => ({
      notifications: state.notifications.map(notification =>
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    }));
  },

  clearAllNotifications: () => {
    set({ notifications: [] });
  },

  // 弹窗管理 Actions
  openModal: (type: ModalState['type'], data?: any) => {
    set({
      modal: {
        isOpen: true,
        type,
        data,
      }
    });
  },

  closeModal: () => {
    set({
      modal: {
        isOpen: false,
        type: undefined,
        data: undefined,
      }
    });
  },

  setModalData: (data: any) => {
    set(state => ({
      modal: {
        ...state.modal,
        data,
      }
    }));
  },

  // 主题和语言设置
  setTheme: (theme: 'light' | 'dark') => {
    set({ theme });
    
    // 更新文档类名以应用主题
    if (typeof document !== 'undefined') {
      document.documentElement.className = theme;
    }
  },

  setLocale: (locale: 'zh-CN' | 'en-US') => {
    set({ locale });
  },

  // 全屏控制
  toggleFullscreen: () => {
    if (typeof document === 'undefined') return;

    const { isFullscreen } = get();
    
    if (!isFullscreen) {
      // 进入全屏
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      }
    } else {
      // 退出全屏
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    
    set({ isFullscreen: !isFullscreen });
  },

  setFullscreen: (isFullscreen: boolean) => {
    set({ isFullscreen });
  },
}));

// 监听浏览器全屏变化事件
if (typeof document !== 'undefined') {
  document.addEventListener('fullscreenchange', () => {
    const isFullscreen = !!document.fullscreenElement;
    useUIStore.getState().setFullscreen(isFullscreen);
  });
}