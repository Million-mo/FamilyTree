// 导出所有状态管理hooks
export { useUserStore } from './userStore';
export { useFamilyTreeStore } from './familyTreeStore';
export { useUIStore } from './uiStore';

// 导入stores
import { useUserStore } from './userStore';
import { useFamilyTreeStore } from './familyTreeStore';
import { useUIStore } from './uiStore';

// 创建重置所有状态的工具函数
export const resetAllStores = () => {
  const { logout } = useUserStore.getState();
  const { clearData } = useFamilyTreeStore.getState();
  const { clearAllNotifications } = useUIStore.getState();
  
  logout();
  clearData();
  clearAllNotifications();
};