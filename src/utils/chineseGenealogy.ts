// 中国传统族谱特性工具函数

// 中国传统称谓映射表
export const CHINESE_RELATIONSHIPS = {
  // 父系称谓
  father: '父亲',
  mother: '母亲',
  grandfather_paternal: '祖父',
  grandmother_paternal: '祖母',
  great_grandfather_paternal: '曾祖父',
  great_grandmother_paternal: '曾祖母',
  
  // 母系称谓  
  grandfather_maternal: '外祖父',
  grandmother_maternal: '外祖母',
  
  // 配偶称谓
  husband: '丈夫',
  wife: '妻子',
  
  // 子女称谓
  son: '儿子',
  daughter: '女儿',
  grandson_son: '孙子',
  granddaughter_son: '孙女',
  grandson_daughter: '外孙',
  granddaughter_daughter: '外孙女',
  
  // 兄弟姐妹称谓
  elder_brother: '哥哥',
  younger_brother: '弟弟',
  elder_sister: '姐姐',
  younger_sister: '妹妹',
  
  // 叔伯姑舅称谓
  father_elder_brother: '伯父',
  father_younger_brother: '叔父',
  father_sister: '姑母',
  mother_brother: '舅父',
  mother_sister: '姨母',
};

// 辈分排序函数
export const sortByGeneration = (members: any[]) => {
  return members.sort((a, b) => a.generation - b.generation);
};

// 根据辈分获取称谓前缀
export const getGenerationPrefix = (generation: number): string => {
  const prefixes = ['', '太', '曾', '祖', '父', '本', '子', '孙', '曾孙', '玄孙'];
  return prefixes[generation] || `第${generation}代`;
};

// 生成字辈序列
export const generateGenerationNames = (poem: string): string[] => {
  return poem.split('').filter(char => char.trim());
};

// 计算两个成员之间的关系
export const calculateRelationship = (
  person1: any, 
  person2: any, 
  members: any[]
): string => {
  if (person1.id === person2.id) return '本人';
  
  const generationDiff = person1.generation - person2.generation;
  
  // 同辈关系
  if (generationDiff === 0) {
    if (person1.parents && person2.parents && 
        person1.parents.some((p: string) => person2.parents.includes(p))) {
      return person1.gender === person2.gender ? 
        (person1.birthDate && person2.birthDate && person1.birthDate > person2.birthDate ? 
          (person1.gender === 'male' ? '弟弟' : '妹妹') : 
          (person1.gender === 'male' ? '哥哥' : '姐姐')) :
        '兄弟姐妹';
    }
    return '同辈';
  }
  
  // 长辈关系
  if (generationDiff < 0) {
    const absDiff = Math.abs(generationDiff);
    if (absDiff === 1) return person2.gender === 'male' ? '父亲' : '母亲';
    if (absDiff === 2) return person2.gender === 'male' ? '祖父' : '祖母';
    if (absDiff === 3) return person2.gender === 'male' ? '曾祖父' : '曾祖母';
    return `第${absDiff}代长辈`;
  }
  
  // 晚辈关系
  if (generationDiff > 0) {
    if (generationDiff === 1) return person2.gender === 'male' ? '儿子' : '女儿';
    if (generationDiff === 2) return person2.gender === 'male' ? '孙子' : '孙女';
    if (generationDiff === 3) return person2.gender === 'male' ? '曾孙' : '曾孙女';
    return `第${generationDiff}代后代`;
  }
  
  return '家族成员';
};

// 传统堂号列表
export const TRADITIONAL_HALL_NAMES = [
  '太原堂', '陇西堂', '扶风堂', '河东堂', '颍川堂',
  '清河堂', '东海堂', '琅琊堂', '渤海堂', '中山堂',
  '京兆堂', '天水堂', '武威堂', '安定堂', '范阳堂'
];

// 传统字辈诗句示例
export const GENERATION_POEMS = [
  '德志明华，世代传承',
  '忠孝仁义，礼智信廉',
  '文武双全，学而时习',
  '诗书传家，礼仪兴邦',
  '仁义礼智，信孝悌忠'
];

// 农历节日映射
export const LUNAR_FESTIVALS = {
  '春节': '正月初一',
  '元宵节': '正月十五',
  '清明节': '三月初三',
  '端午节': '五月初五',
  '七夕节': '七月初七',
  '中秋节': '八月十五',
  '重阳节': '九月初九',
  '腊八节': '腊月初八',
  '除夕': '腊月三十'
};

// 根据姓氏获取常见堂号
export const getHallNameBySurname = (surname: string): string => {
  const hallMap: Record<string, string> = {
    '王': '太原堂',
    '李': '陇西堂',
    '张': '清河堂', 
    '刘': '彭城堂',
    '陈': '颍川堂',
    '杨': '弘农堂',
    '赵': '天水堂',
    '黄': '江夏堂',
    '周': '汝南堂',
    '吴': '延陵堂',
    '徐': '东海堂',
    '孙': '富春堂',
    '胡': '安定堂',
    '朱': '沛国堂',
    '高': '渤海堂',
    '林': '西河堂',
    '何': '庐江堂',
    '郭': '太原堂',
    '马': '扶风堂',
    '罗': '豫章堂'
  };
  
  return hallMap[surname] || '世德堂';
};

// 验证字辈是否合法
export const validateGenerationName = (name: string, poem: string): boolean => {
  return poem.includes(name) && name.length === 1;
};

// 生成族谱统计信息
export const generateFamilyStatistics = (members: any[]) => {
  const stats = {
    totalMembers: members.length,
    maleMembers: members.filter(m => m.gender === 'male').length,
    femaleMembers: members.filter(m => m.gender === 'female').length,
    aliveMembers: members.filter(m => !m.deathDate).length,
    generations: Math.max(...members.map(m => m.generation), 0),
    averageAge: 0,
    oldestMember: null as any,
    youngestMember: null as any,
    generationDistribution: {} as Record<number, number>
  };
  
  // 计算年龄相关统计
  const membersWithAge = members.filter(m => m.birthDate).map(m => {
    const endDate = m.deathDate || new Date();
    const age = Math.floor((endDate.getTime() - m.birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    return { ...m, age };
  });
  
  if (membersWithAge.length > 0) {
    stats.averageAge = Math.round(
      membersWithAge.reduce((sum, m) => sum + m.age, 0) / membersWithAge.length
    );
    
    stats.oldestMember = membersWithAge.reduce((oldest, current) => 
      current.age > oldest.age ? current : oldest
    );
    
    stats.youngestMember = membersWithAge.reduce((youngest, current) =>
      current.age < youngest.age ? current : youngest
    );
  }
  
  // 计算辈分分布
  members.forEach(member => {
    stats.generationDistribution[member.generation] = 
      (stats.generationDistribution[member.generation] || 0) + 1;
  });
  
  return stats;
};