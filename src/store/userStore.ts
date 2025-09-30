import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, LoginData, RegisterData, UserProfile } from '@/types';

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  permissions: string[];
  loading: boolean;
  
  // Actions
  login: (credentials: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: UserProfile) => Promise<void>;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      permissions: [],
      loading: false,

      login: async (credentials: LoginData) => {
        set({ loading: true });
        try {
          // TODO: 实际的API调用
          // const response = await api.login(credentials);
          
          // 模拟登录
          const mockUser: User = {
            id: '1',
            username: credentials.username,
            email: `${credentials.username}@example.com`,
            familyTrees: ['tree1'],
            role: 'admin',
          };
          
          set({
            user: mockUser,
            isAuthenticated: true,
            permissions: ['read', 'write', 'admin'],
            loading: false,
          });
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      register: async (data: RegisterData) => {
        set({ loading: true });
        try {
          // TODO: 实际的API调用
          // const response = await api.register(data);
          
          // 模拟注册
          const newUser: User = {
            id: Date.now().toString(),
            username: data.username,
            email: data.email,
            familyTrees: [],
            role: 'editor',
          };
          
          set({
            user: newUser,
            isAuthenticated: true,
            permissions: ['read', 'write'],
            loading: false,
          });
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          permissions: [],
        });
      },

      updateProfile: async (data: UserProfile) => {
        const { user } = get();
        if (!user) return;

        set({ loading: true });
        try {
          // TODO: 实际的API调用
          // const updatedUser = await api.updateProfile(data);
          
          const updatedUser = { ...user, ...data };
          set({
            user: updatedUser,
            loading: false,
          });
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      setUser: (user: User) => {
        set({
          user,
          isAuthenticated: true,
          permissions: user.role === 'admin' ? ['read', 'write', 'admin'] : ['read'],
        });
      },

      setLoading: (loading: boolean) => {
        set({ loading });
      },
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        permissions: state.permissions,
      }),
    }
  )
);