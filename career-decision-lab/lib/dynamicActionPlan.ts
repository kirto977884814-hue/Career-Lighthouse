/**
 * 动态行动计划生成器
 * 根据用户信息（年级、是否考研、困惑）生成定制化的4周行动计划
 */

import { UserInfo, CareerPath, WeeklyAction, DimensionScores } from '@/types';
import { ACTION_PLANS } from '@/data/actionPlans';

/**
 * 生成个性化4周行动计划
 */
export function generatePersonalizedActionPlan(
  userInfo: UserInfo,
  recommendedPath: CareerPath,
  dimensionScores: DimensionScores
): WeeklyAction[] {
  const { grade, planPostgraduate, currentConfusion } = userInfo;

  // 基础计划（从 ACTION_PLANS 获取）
  const basePlan = ACTION_PLANS[recommendedPath];

  // 根据用户情况定制计划
  const customizedPlan = customizeWeek1(basePlan, userInfo, dimensionScores);
  const enhancedPlan = addConfusionBasedTasks(customizedPlan, currentConfusion || '');

  return enhancedPlan;
}

/**
 * 定制第1周计划（根据年级和考研计划）
 */
function customizeWeek1(
  basePlan: WeeklyAction[],
  userInfo: UserInfo,
  scores: DimensionScores
): WeeklyAction[] {
  const { grade, planPostgraduate } = userInfo;
  const newPlan = [...basePlan];

  // 定制第1周任务
  const week1Tasks: string[] = [];

  // 根据年级添加任务
  if (['大一', '大二'].includes(grade)) {
    // 低年级任务
    week1Tasks.push(
      '评估当前GPA与目标差距',
      '列出下学期要重点提升的2-3门课程',
      planPostgraduate ? '了解目标院校的录取要求' : '了解行业对实习生的基本要求',
      scores.S < 3.5 ? '建立每日学习计划，培养结构化习惯' : '寻找适合自己能力水平的项目或竞赛'
    );
  } else if (['大三', '大四'].includes(grade)) {
    // 高年级任务
    week1Tasks.push(
      planPostgraduate
        ? '制定考研复习时间表（每日3-5小时）'
        : '更新简历，突出项目经验',
      planPostgraduate
        ? '购买考研复习资料，建立学习环境'
        : '在招聘网站搜索目标岗位，分析JD要求',
      planPostgraduate
        ? '确定目标院校和专业'
        : '准备3个项目案例的STAR法则描述',
      scores.E < 3 ? '准备自我介绍的演讲稿' : '整理过往作品集'
    );
  } else if (['研一', '研二', '研三'].includes(grade)) {
    // 研究生任务
    week1Tasks.push(
      '与导师沟通，明确研究方向和预期成果',
      '制定本学期的学术目标（论文/项目）',
      '了解师兄师姐的就业去向作为参考',
      scores.A < 3.5 ? '加强文献阅读量' : '开始构思论文创新点'
    );
  } else {
    // 已毕业
    week1Tasks.push(
      '梳理已有的工作经验和技能',
      '明确下一阶段的职业目标（1-3年）',
      '识别当前能力的短板',
      '建立行业人脉网络'
    );
  }

  // 根据考研计划额外调整
  if (planPostgraduate && ['大三', '大四'].includes(grade)) {
    week1Tasks.push(
      '关注目标院校的最新招生信息',
      '加入考研交流群获取备考资源'
    );
  }

  // 替换第1周任务
  newPlan[0] = {
    ...newPlan[0],
    title: generateWeek1Title(grade, planPostgraduate),
    tasks: week1Tasks
  };

  return newPlan;
}

/**
 * 生成第1周标题
 */
function generateWeek1Title(grade: string, planPostgraduate: boolean): string {
  if (planPostgraduate) {
    if (['大一', '大二'].includes(grade)) return '方向确认（考研准备版）';
    if (['大三', '大四'].includes(grade)) return '备考启动（冲刺版）';
    if (['研一', '研二', '研三'].includes(grade)) return '学术规划';
    return '方向确认';
  } else {
    if (['大一', '大二'].includes(grade)) return '方向确认（就业准备版）';
    if (['大三', '大四'].includes(grade)) return '求职冲刺';
    if (['研一', '研二', '研三'].includes(grade)) return '职业规划';
    return '方向确认';
  }
}

/**
 * 根据困惑添加针对性任务
 */
function addConfusionBasedTasks(
  plan: WeeklyAction[],
  confusion: string
): WeeklyAction[] {
  if (!confusion || confusion.trim().length === 0) {
    return plan;
  }

  const confusionLower = confusion.toLowerCase();
  const newPlan = [...plan];

  // 困惑关键词映射到任务
  const confusionTaskMap: Record<string, string[]> = {
    // 方向困惑
    '方向': [
      '列出3-5个感兴趣的职业方向',
      '每个方向找1-2个业内前辈了解真实工作状态',
      '选择1个方向尝试2周的mini-project验证'
    ],
    // 考研
    '考研': [
      '评估考研必要性（对职业发展的真实帮助）',
      '了解目标院校历年分数线和报录比',
      '评估备考时间与精力是否充足'
    ],
    // 就业/工作
    '就业': [
      '建立求职追踪表格（投递、面试、offer）',
      '准备3个版本的简历（针对不同岗位类型）',
      '每周至少投递5份简历并记录反馈'
    ],
    '工作': [
      '建立求职追踪表格（投递、面试、offer）',
      '准备3个版本的简历（针对不同岗位类型）',
      '每周至少投递5份简历并记录反馈'
    ],
    // 技能
    '技能': [
      '识别目标岗位的硬技能要求（编程语言/工具等）',
      '制定技能学习计划（理论+实践）',
      '每两周完成一个小项目验证学习效果'
    ],
    // 实习
    '实习': [
      '整理过往项目经验，准备作品集',
      '在招聘网站筛选10-15家目标公司',
      '联系学长学姐了解内推机会'
    ],
    // 创业
    '创业': [
      '找到1-2个真实存在的社会痛点',
      '访谈10个潜在用户验证痛点',
      '画产品原型图并找人反馈'
    ],
    // 稳定
    '稳定': [
      '了解公务员/事业单位的考试科目和时间',
      '做一套真题评估当前水平',
      '制定3-6个月的系统复习计划'
    ],
    // 产品/技术
    '产品': [
      '对比产品岗和技术岗的工作内容差异',
      '思考自己更擅长解决问题还是说服他人',
      '尝试同时参与产品和技术的项目，体验差异'
    ],
    '技术': [
      '对比产品岗和技术岗的工作内容差异',
      '思考自己更擅长解决问题还是说服他人',
      '尝试同时参与产品和技术的项目，体验差异'
    ]
  };

  // 匹配困惑关键词并添加任务
  let hasCustomTask = false;
  const additionalTasks: string[] = [];

  Object.entries(confusionTaskMap).forEach(([keyword, tasks]) => {
    if (confusionLower.includes(keyword)) {
      additionalTasks.push(...tasks);
      hasCustomTask = true;
    }
  });

  // 如果匹配到困惑，在第2周添加针对性任务
  if (hasCustomTask && additionalTasks.length > 0) {
    newPlan[1] = {
      ...newPlan[1],
      title: '针对困惑的专项探索',
      tasks: [...newPlan[1].tasks, ...additionalTasks.slice(0, 3)] // 最多添加3个任务
    };
  }

  return newPlan;
}

/**
 * 根据能力得分添加个性化任务
 */
export function addAbilityBasedTasks(
  plan: WeeklyAction[],
  scores: DimensionScores
): WeeklyAction[] {
  const newPlan = plan.map(week => ({ ...week, tasks: [...week.tasks] }));
  const abilityTasks: string[] = [];

  // 结构化能力（S）
  if (scores.S < 3) {
    abilityTasks.push('建立每日任务清单，培养计划习惯');
  }

  // 抽象逻辑能力（A）
  if (scores.A < 3) {
    abilityTasks.push('每周阅读1篇技术博客并写读后感');
  }

  // 风险承受度（R）
  if (scores.R < 3) {
    abilityTasks.push('尝试1件稍微超出舒适区的小事');
  }

  // 表达倾向（E）
  if (scores.E < 3) {
    abilityTasks.push('每周在团队或公开场合发言至少1次');
  }

  // 执行抗压能力（X）
  if (scores.X < 3) {
    abilityTasks.push('设定1个有挑战性的deadline并完成');
  }

  // 共情能力（C）
  if (scores.C < 3) {
    abilityTasks.push('主动倾听1位朋友或同事的困扰');
  }

  // 将能力提升任务添加到第3周
  if (abilityTasks.length > 0) {
    newPlan[2] = {
      ...newPlan[2],
      tasks: [...newPlan[2].tasks, ...abilityTasks.slice(0, 2)]
    };
  }

  return newPlan;
}

/**
 * 生成年级特定的优先级标签
 */
export function generateGradePriorityTag(grade: string): string {
  const priorityMap: Record<string, string> = {
    '大一': '⭐ 探索期：多尝试，不急于定方向',
    '大二': '⭐⭐ 定向期：锁定1-2个方向深入',
    '大三': '⭐⭐⭐ 冲刺期：为考研/就业全力准备',
    '大四': '⭐⭐⭐ 决战期：完成最后一跃',
    '研一': '⭐⭐ 适应期：平衡学术与职业规划',
    '研二': '⭐⭐⭐ 深耕期：确定研究方向/求职方向',
    '研三': '⭐⭐⭐⭐ 收获期：完成论文，找到满意工作',
    '已毕业': '⭐ 转型期：规划职业发展新阶段'
  };

  return priorityMap[grade] || '⭐ 成长期';
}
