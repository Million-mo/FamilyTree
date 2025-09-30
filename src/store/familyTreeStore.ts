import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { 
  FamilyTree, 
  FamilyNode, 
  Member, 
  FilterOptions, 
  LayoutMode, 
  ViewMode,
  Relationship 
} from '@/types';

interface FamilyTreeState {
  // 数据状态
  currentTree: FamilyTree | null;
  treeData: FamilyNode[];
  selectedNode: FamilyNode | null;
  members: Member[];
  relationships: Relationship[];
  
  // 视图状态
  viewMode: ViewMode;
  layoutMode: LayoutMode;
  filterOptions: FilterOptions;
  searchKeyword: string;
  
  // UI状态
  loading: boolean;
  error: string | null;
  
  // Actions - 数据管理
  loadTree: (treeId?: string) => Promise<void>;
  setCurrentTree: (tree: FamilyTree) => void;
  updateNode: (nodeId: string, data: Partial<FamilyNode>) => void;
  addMember: (memberData: Omit<Member, 'id'>) => Promise<string>;
  updateMember: (memberId: string, data: Partial<Member>) => Promise<void>;
  deleteMember: (memberId: string) => Promise<void>;
  
  // Actions - 关系管理
  addRelationship: (relationship: Omit<Relationship, 'id'>) => Promise<string>;
  updateRelationship: (relationshipId: string, data: Partial<Relationship>) => Promise<void>;
  deleteRelationship: (relationshipId: string) => Promise<void>;
  
  // Actions - 视图控制
  setSelectedNode: (node: FamilyNode | null) => void;
  setViewMode: (mode: ViewMode) => void;
  setLayoutMode: (mode: LayoutMode) => void;
  setFilterOptions: (options: FilterOptions) => void;
  setSearchKeyword: (keyword: string) => void;
  
  // Actions - 状态管理
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearData: () => void;
  
  // Computed
  getFilteredMembers: () => Member[];
  getMemberById: (memberId: string) => Member | undefined;
  getNodeById: (nodeId: string) => FamilyNode | undefined;
  getChildrenNodes: (parentId: string) => FamilyNode[];
  getMemberRelationships: (memberId: string) => Relationship[];
}

// 生成唯一ID的工具函数
const generateId = () => Math.random().toString(36).substr(2, 9);

// Member转FamilyNode的工具函数
const memberToFamilyNode = (member: Member): FamilyNode => ({
  id: member.id,
  name: member.name,
  gender: member.gender,
  birthDate: member.birthDate,
  deathDate: member.deathDate,
  generation: member.generation,
  photo: member.photo,
  description: member.description,
  spouse: member.spouse,
  children: undefined, // FamilyNode 的 children 是 FamilyNode[]，稍后构建
  parents: member.parents,
  birthPlace: member.birthPlace,
  occupation: member.occupation,
  achievements: member.achievements,
  generationName: member.generationName,
  isExpanded: true
});

export const useFamilyTreeStore = create<FamilyTreeState>()(
  subscribeWithSelector((set, get) => ({
    // 初始状态
    currentTree: null,
    treeData: [],
    selectedNode: null,
    members: [],
    relationships: [],
    viewMode: 'detailed',
    layoutMode: 'tree',
    filterOptions: {},
    searchKeyword: '',
    loading: false,
    error: null,

    // 数据管理 Actions
    loadTree: async (treeId?: string) => {
      set({ loading: true, error: null });
      
      try {
        // TODO: 实际的API调用
        // const tree = await api.getFamilyTree(treeId);
        
        // 模拟数据
        const mockTree: FamilyTree = {
          id: treeId || 'tree1',
          name: '王氏族谱',
          rootMember: 'member1',
          members: [
            {
              id: 'member1',
              name: '王祖父',
              gender: 'male',
              generation: 1,
              birthDate: new Date('1930-01-01'),
              generationName: '德',
              children: ['member2', 'member3']
            },
            {
              id: 'member2',
              name: '王父亲',
              gender: 'male',
              generation: 2,
              birthDate: new Date('1955-03-15'),
              generationName: '志',
              parents: ['member1'],
              children: ['member4'],
              spouse: ['member5']
            },
            {
              id: 'member3',
              name: '王叔叔',
              gender: 'male',
              generation: 2,
              birthDate: new Date('1958-07-20'),
              generationName: '志',
              parents: ['member1']
            },
            {
              id: 'member4',
              name: '王小明',
              gender: 'male',
              generation: 3,
              birthDate: new Date('1985-08-10'),
              generationName: '明',
              parents: ['member2', 'member5']
            },
            {
              id: 'member5',
              name: '李母亲',
              gender: 'female',
              generation: 2,
              birthDate: new Date('1957-12-05'),
              spouse: ['member2'],
              children: ['member4']
            }
          ],
          relationships: [
            {
              id: 'rel1',
              type: 'parent',
              fromMember: 'member1',
              toMember: 'member2'
            },
            {
              id: 'rel2',
              type: 'parent',
              fromMember: 'member1',
              toMember: 'member3'
            },
            {
              id: 'rel3',
              type: 'spouse',
              fromMember: 'member2',
              toMember: 'member5'
            },
            {
              id: 'rel4',
              type: 'parent',
              fromMember: 'member2',
              toMember: 'member4'
            },
            {
              id: 'rel5',
              type: 'parent',
              fromMember: 'member5',
              toMember: 'member4'
            }
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
          metadata: {
            familySurname: '王',
            hallName: '太原堂',
            ancestralPlace: '山西太原',
            generationPoem: '德志明华，世代传承',
            familyMotto: '诚信为本，勤俭持家'
          }
        };

        const treeNodes: FamilyNode[] = mockTree.members.map(member => ({
          id: member.id,
          name: member.name,
          gender: member.gender,
          birthDate: member.birthDate,
          deathDate: member.deathDate,
          generation: member.generation,
          photo: member.photo,
          description: member.description,
          spouse: member.spouse,
          children: undefined, // FamilyNode 的 children 是 FamilyNode[]，稍后构建
          parents: member.parents,
          birthPlace: member.birthPlace,
          occupation: member.occupation,
          achievements: member.achievements,
          generationName: member.generationName,
          isExpanded: true
        }));

        set({
          currentTree: mockTree,
          members: mockTree.members,
          relationships: mockTree.relationships,
          treeData: treeNodes,
          loading: false
        });
      } catch (error) {
        set({
          loading: false,
          error: error instanceof Error ? error.message : '加载族谱失败'
        });
      }
    },

    setCurrentTree: (tree: FamilyTree) => {
      set({ currentTree: tree });
    },

    updateNode: (nodeId: string, data: Partial<FamilyNode>) => {
      set(state => ({
        treeData: state.treeData.map(node =>
          node.id === nodeId ? { ...node, ...data } : node
        )
      }));
    },

    addMember: async (memberData: Omit<Member, 'id'>) => {
      const newId = generateId();
      const newMember: Member = {
        ...memberData,
        id: newId
      };

      set(state => ({
        members: [...state.members, newMember],
        treeData: [...state.treeData, memberToFamilyNode(newMember)]
      }));

      return newId;
    },

    updateMember: async (memberId: string, data: Partial<Member>) => {
      set(state => ({
        members: state.members.map(member =>
          member.id === memberId ? { ...member, ...data } : member
        ),
        treeData: state.treeData.map(node =>
          node.id === memberId ? { 
            ...node, 
            name: data.name || node.name,
            gender: data.gender || node.gender,
            birthDate: data.birthDate !== undefined ? data.birthDate : node.birthDate,
            deathDate: data.deathDate !== undefined ? data.deathDate : node.deathDate,
            generation: data.generation || node.generation,
            photo: data.photo !== undefined ? data.photo : node.photo,
            description: data.description !== undefined ? data.description : node.description,
            generationName: data.generationName !== undefined ? data.generationName : node.generationName
          } : node
        )
      }));
    },

    deleteMember: async (memberId: string) => {
      set(state => ({
        members: state.members.filter(member => member.id !== memberId),
        treeData: state.treeData.filter(node => node.id !== memberId),
        relationships: state.relationships.filter(rel =>
          rel.fromMember !== memberId && rel.toMember !== memberId
        ),
        selectedNode: state.selectedNode?.id === memberId ? null : state.selectedNode
      }));
    },

    // 关系管理 Actions
    addRelationship: async (relationshipData: Omit<Relationship, 'id'>) => {
      const newId = generateId();
      const newRelationship: Relationship = {
        ...relationshipData,
        id: newId
      };

      set(state => ({
        relationships: [...state.relationships, newRelationship]
      }));

      return newId;
    },

    updateRelationship: async (relationshipId: string, data: Partial<Relationship>) => {
      set(state => ({
        relationships: state.relationships.map(rel =>
          rel.id === relationshipId ? { ...rel, ...data } : rel
        )
      }));
    },

    deleteRelationship: async (relationshipId: string) => {
      set(state => ({
        relationships: state.relationships.filter(rel => rel.id !== relationshipId)
      }));
    },

    // 视图控制 Actions
    setSelectedNode: (node: FamilyNode | null) => {
      set({ selectedNode: node });
    },

    setViewMode: (mode: ViewMode) => {
      set({ viewMode: mode });
    },

    setLayoutMode: (mode: LayoutMode) => {
      set({ layoutMode: mode });
    },

    setFilterOptions: (options: FilterOptions) => {
      set({ filterOptions: options });
    },

    setSearchKeyword: (keyword: string) => {
      set({ searchKeyword: keyword });
    },

    // 状态管理 Actions
    setLoading: (loading: boolean) => {
      set({ loading });
    },

    setError: (error: string | null) => {
      set({ error });
    },

    clearData: () => {
      set({
        currentTree: null,
        treeData: [],
        selectedNode: null,
        members: [],
        relationships: [],
        filterOptions: {},
        searchKeyword: '',
        error: null
      });
    },

    // Computed 方法
    getFilteredMembers: () => {
      const { members, filterOptions, searchKeyword } = get();
      
      let filtered = [...members];
      
      if (filterOptions.generation !== undefined) {
        filtered = filtered.filter(member => member.generation === filterOptions.generation);
      }
      
      if (filterOptions.gender) {
        filtered = filtered.filter(member => member.gender === filterOptions.gender);
      }
      
      if (filterOptions.isAlive !== undefined) {
        filtered = filtered.filter(member => 
          filterOptions.isAlive ? !member.deathDate : !!member.deathDate
        );
      }
      
      if (filterOptions.hasChildren !== undefined) {
        filtered = filtered.filter(member => 
          filterOptions.hasChildren ? 
          (member.children && member.children.length > 0) : 
          (!member.children || member.children.length === 0)
        );
      }
      
      if (searchKeyword.trim()) {
        const keyword = searchKeyword.toLowerCase();
        filtered = filtered.filter(member =>
          member.name.toLowerCase().includes(keyword) ||
          member.description?.toLowerCase().includes(keyword) ||
          member.occupation?.toLowerCase().includes(keyword)
        );
      }
      
      return filtered;
    },

    getMemberById: (memberId: string) => {
      const { members } = get();
      return members.find(member => member.id === memberId);
    },

    getNodeById: (nodeId: string) => {
      const { treeData } = get();
      return treeData.find(node => node.id === nodeId);
    },

    getChildrenNodes: (parentId: string) => {
      const { treeData } = get();
      return treeData.filter(node => 
        node.parents && node.parents.includes(parentId)
      );
    },

    getMemberRelationships: (memberId: string) => {
      const { relationships } = get();
      return relationships.filter(rel =>
        rel.fromMember === memberId || rel.toMember === memberId
      );
    }
  }))
);