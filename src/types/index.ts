// 成员性别类型
export type Gender = 'male' | 'female';

// 关系类型
export type RelationType = 'parent' | 'spouse' | 'child' | 'sibling';

// 布局模式
export type LayoutMode = 'tree' | 'list' | 'timeline';

// 视图模式
export type ViewMode = 'simple' | 'detailed' | 'card';

// 成员信息接口
export interface Member {
  id: string;
  name: string;
  gender: Gender;
  birthDate?: Date;
  deathDate?: Date;
  generation: number; // 辈分
  photo?: string;
  description?: string;
  spouse?: string[]; // 配偶ID数组
  children?: string[]; // 子女ID数组
  parents?: string[]; // 父母ID数组
  birthPlace?: string; // 出生地
  occupation?: string; // 职业
  achievements?: string; // 主要成就
  generationName?: string; // 辈分字（字辈）
}

// 关系数据接口
export interface Relationship {
  id: string;
  type: RelationType;
  fromMember: string;
  toMember: string;
  metadata?: {
    marriageDate?: Date;
    divorceDate?: Date;
    adoptionDate?: Date;
    note?: string;
  };
}

// 族谱节点接口（用于可视化）
export interface FamilyNode {
  id: string;
  name: string;
  gender: Gender;
  birthDate?: Date;
  deathDate?: Date;
  generation: number;
  photo?: string;
  description?: string;
  spouse?: string[];
  children?: FamilyNode[];
  parents?: string[];
  birthPlace?: string;
  occupation?: string;
  achievements?: string;
  generationName?: string;
  x?: number;
  y?: number;
  parent?: FamilyNode;
  depth?: number;
  isExpanded?: boolean;
}

// 族谱数据接口
export interface FamilyTree {
  id: string;
  name: string; // 族谱名称
  description?: string;
  rootMember: string; // 根节点成员ID
  members: Member[];
  relationships: Relationship[];
  createdAt: Date;
  updatedAt: Date;
  metadata?: {
    familySurname: string; // 姓氏
    hallName?: string; // 堂号
    ancestralPlace?: string; // 祖籍
    generationPoem?: string; // 字辈诗
    familyMotto?: string; // 家训
  };
}

// 筛选选项接口
export interface FilterOptions {
  generation?: number;
  gender?: Gender;
  isAlive?: boolean;
  hasChildren?: boolean;
  searchKeyword?: string;
}

// 用户信息接口
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  familyTrees: string[]; // 可访问的族谱ID
  role: 'admin' | 'editor' | 'viewer';
}

// 登录数据接口
export interface LoginData {
  username: string;
  password: string;
}

// 注册数据接口
export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  realName?: string;
  phone?: string;
}

// 用户资料接口
export interface UserProfile {
  username?: string;
  email?: string;
  avatar?: string;
}

// 通知接口
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

// 弹窗状态接口
export interface ModalState {
  isOpen: boolean;
  type?: 'member-form' | 'relationship-form' | 'confirm' | 'info';
  data?: any;
}

// API响应接口
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// 分页数据接口
export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// 中国传统称谓接口
export interface ChineseRelationship {
  relationship: string; // 称谓
  reciprocal: string; // 对称称谓
  generation: number; // 相对辈分差
  gender?: Gender; // 性别限制
  region?: string; // 地区差异
}