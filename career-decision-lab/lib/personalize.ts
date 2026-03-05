/**
 * 个性化智能模块
 * 基于用户信息生成个性化建议
 */

import { UserInfo, CareerPath, DimensionScores } from '@/types';
import { PATH_DESCRIPTIONS } from '@/data/paths';

// 困惑分类
export type ConfusionCategory =
  | 'career_direction'      // 职业方向选择
  | 'skill_development'     // 技能提升
  | 'further_study'         // 考研/深造
  | 'job_hunting'          // 求职准备
  | 'stability_vs_risk'    // 稳定 vs 风险
  | 'management'     // 创业
  | 'interest_ability'     // 兴趣 vs 能力
  | 'general_confusion';   // 普遍困惑

// 个性化建议类型
export interface PersonalizedAdvice {
  category: ConfusionCategory;
  summary: string;
  detailedSuggestions: string[];
  relevantPaths: CareerPath[];
  priorityActions: string[];
}

// 关键词匹配规则
const CONFUSION_KEYWORDS: Record<ConfusionCategory, string[]> = {
  career_direction: ['方向', '选择', '迷茫', '不知道选', '技术还是产品', '前端还是后端', '开发还是设计'],
  skill_development: ['技能', '学习', '提升', '怎么学', '要学什么', '能力', '加强'],
  further_study: ['考研', '深造', '读研', '研究生', '学术', '导师', '科研'],
  job_hunting: ['工作', '就业', '求职', '面试', '简历', '实习', 'offer', '招聘'],
  stability_vs_risk: ['稳定', '公务员', '体制', '国企', '创业', '风险', '安全感'],
  management: ['创业', '自己做', '老板', '创业', '公司', '管理', '领导'],
  interest_ability: ['兴趣', '喜欢', '不喜欢', '想做', '能力', '擅长'],
  general_confusion: ['困惑', '迷茫', '不知道', '怎么办', '焦虑', '不确定']
};

/**
 * 使用 NLP 技术解析用户困惑
 */
export function analyzeUserConfusion(confusionText: string): ConfusionCategory[] {
  if (!confusionText || confusionText.trim().length === 0) {
    return ['general_confusion'];
  }

  const text = confusionText.toLowerCase();
  const detectedCategories: ConfusionCategory[] = [];

  // 关键词匹配（带权重）
  const categoryScores: Record<ConfusionCategory, number> = {
    career_direction: 0,
    skill_development: 0,
    further_study: 0,
    job_hunting: 0,
    stability_vs_risk: 0,
    management: 0,
    interest_ability: 0,
    general_confusion: 0
  };

  // 计算每个类别的匹配分数
  Object.entries(CONFUSION_KEYWORDS).forEach(([category, keywords]) => {
    keywords.forEach(keyword => {
      if (text.includes(keyword)) {
        categoryScores[category as ConfusionCategory] += 1;
      }
    });
  });

  // 找出得分最高的类别
  const maxScore = Math.max(...Object.values(categoryScores));

  if (maxScore > 0) {
    Object.entries(categoryScores).forEach(([category, score]) => {
      if (score === maxScore) {
        detectedCategories.push(category as ConfusionCategory);
      }
    });
  }

  // 如果没有匹配到，返回通用困惑
  if (detectedCategories.length === 0) {
    return ['general_confusion'];
  }

  return detectedCategories;
}

/**
 * 生成个性化摘要
 */
export function generatePersonalizedSummary(userInfo: UserInfo): string {
  const { grade, major, planPostgraduate } = userInfo;

  // 年级分组
  const isLowerGrade = ['大一', '大二'].includes(grade);
  const isHigherGrade = ['大三', '大四'].includes(grade);
  const isGraduate = ['研一', '研二', '研三'].includes(grade);

  // 生成摘要
  let summary = `你是 ${grade} • ${major} 的学生。`;

  // 考研建议
  if (planPostgraduate) {
    if (isLowerGrade) {
      summary += '\n\n💡 既然你计划考研，建议在打好专业基础的同时，多参加科研项目或竞赛，为未来的研究生学习做好准备。';
    } else if (isHigherGrade) {
      summary += '\n\n💡 大三/大四阶段考研准备关键期，建议平衡好复习、实习和项目经验，两手准备更加稳妥。';
    } else if (isGraduate) {
      summary += '\n\n💡 作为在读研究生，建议重点关注科研能力与职业发展的衔接，提前规划毕业去向。';
    }
  } else {
    if (isLowerGrade) {
      summary += '\n\n💡 既然你计划直接就业，建议从现在开始积累项目经验，多参加实习，提前了解行业需求。';
    } else if (isHigherGrade) {
      summary += '\n\n💡 大三/大四是求职黄金期，建议重点优化简历、准备面试，争取优质实习机会。';
    } else if (isGraduate) {
      summary += '\n\n💡 作为研究生，建议将学术研究与职业发展结合，寻找能发挥你专业优势的岗位。';
    }
  }

  return summary;
}

/**
 * 根据困惑生成针对性建议
 */
export function generateConfusionBasedAdvice(
  confusionText: string,
  dimensionScores: DimensionScores,
  recommendedPath: CareerPath
): PersonalizedAdvice {
  const categories = analyzeUserConfusion(confusionText);
  const primaryCategory = categories[0];

  return {
    category: primaryCategory,
    summary: getCategorySummary(primaryCategory),
    detailedSuggestions: getDetailedSuggestions(primaryCategory, dimensionScores),
    relevantPaths: getRelevantPaths(primaryCategory),
    priorityActions: getPriorityActions(primaryCategory, dimensionScores, recommendedPath)
  };
}

/**
 * 获取类别摘要
 */
function getCategorySummary(category: ConfusionCategory): string {
  const summaries: Record<ConfusionCategory, string> = {
    career_direction: '你正在思考不同的职业方向，这是一个很重要的问题。',
    skill_development: '你关注如何提升自己的能力，这个自我驱动很棒。',
    further_study: '考研是一个需要慎重考虑的重要决定。',
    job_hunting: '求职准备是一个系统性的工程，需要提前规划。',
    stability_vs_risk: '你在思考稳定与风险之间的平衡，这关系到人生选择。',
    management: '创业需要勇气，也需要充分的准备。',
    interest_ability: '兴趣和能力的匹配是职业满意度的关键。',
    general_confusion: '困惑是正常的，让我们一步步来分析。'
  };

  return summaries[category];
}

/**
 * 获取详细建议
 */
function getDetailedSuggestions(
  category: ConfusionCategory,
  scores: DimensionScores
): string[] {
  // 根据能力和困惑类别生成建议
  const suggestions: Record<ConfusionCategory, string[]> = {
    career_direction: [
      scores.A > 3.5 ? '你的抽象逻辑能力较强，适合技术深度发展的路径。' : '建议培养抽象思维，这对职业发展很重要。',
      scores.E > 3.5 ? '表达倾向突出，可以考虑需要沟通协调的岗位。' : '建议多锻炼表达能力，这对任何岗位都有帮助。',
      '建议通过实习和项目经验来验证不同方向的适配度。'
    ],
    skill_development: [
      '制定学习计划时，建议先弥补核心能力短板。',
      '理论学习与实践项目相结合，效果会更好。',
      '可以寻找导师或前辈，获得更有针对性的指导。'
    ],
    further_study: [
      scores.A > 4 ? '你的学术潜力不错，可以考虑研究型方向。' : '建议加强理论基础，为研究生学习做准备。',
      '提前了解目标院校的研究方向和导师情况。',
      '研究生阶段更注重自主学习能力，建议现在开始培养。'
    ],
    job_hunting: [
      '建议从现在开始建立自己的技能树和项目作品集。',
      '关注行业动态，了解目标公司的岗位要求。',
      '多参加模拟面试，提前积累面试经验。'
    ],
    stability_vs_risk: [
      scores.R > 3 ? '你的风险承受度较高，可以尝试更具挑战性的路径。' : '建议先从稳定的平台起步，积累经验后再考虑转型。',
      '没有绝对的好与坏，关键是要符合自己的价值观。',
      '可以在早期多尝试，找到最适合自己的节奏。'
    ],
    management: [
      '创业前建议先在相关领域积累经验，降低试错成本。',
      scores.X > 3.5 ? '你的执行抗压能力不错，这是创业者的必备素质。' : '建议在创业前多锻炼抗压能力。',
      '寻找合适的合伙人比单打独斗更容易成功。'
    ],
    interest_ability: [
      '能力和兴趣的平衡需要时间探索，不要急于下定论。',
      '建议先从自己擅长的领域入手，再逐步转向兴趣方向。',
      '有时候兴趣是可以培养的，不要完全排斥不熟悉的领域。'
    ],
    general_confusion: [
      '困惑是成长的一部分，说明你在认真思考未来。',
      '建议从小目标开始，通过行动来验证方向。',
      '和学长学姐或职业规划师交流，可以获得新的视角。'
    ]
  };

  return suggestions[category];
}

/**
 * 获取相关职业路径
 */
function getRelevantPaths(category: ConfusionCategory): CareerPath[] {
  const pathMap: Record<ConfusionCategory, CareerPath[]> = {
    career_direction: ['tech', 'professional', 'academic'],
    skill_development: ['academic', 'tech'],
    further_study: ['academic', 'stable'],
    job_hunting: ['sales', 'tech', 'professional'],
    stability_vs_risk: ['stable', 'management'],
    management: ['management', 'professional'],
    interest_ability: ['creative', 'education'],
    general_confusion: []
  };

  return pathMap[category];
}

/**
 * 获取优先行动建议
 */
function getPriorityActions(
  category: ConfusionCategory,
  scores: DimensionScores,
  recommendedPath: CareerPath
): string[] {
  const actions: string[] = [];

  // 基于困惑类别的行动
  switch (category) {
    case 'career_direction':
      actions.push(
        '列出3-5个感兴趣的方向',
        '每个方向找2-3个业内人士了解真实工作内容',
        '选择一个方向尝试1-2个月的小项目验证'
      );
      break;
    case 'skill_development':
      actions.push(
        '评估当前技能与目标岗位的差距',
        '制定3个月的技能提升计划',
        '每周固定10-15小时用于学习新技能'
      );
      break;
    case 'further_study':
      actions.push(
        '确定目标院校和专业',
        '评估录取概率与备考时间',
        '制定详细的复习时间表'
      );
      break;
    case 'job_hunting':
      actions.push(
        '优化简历，突出相关项目经验',
        '准备3个项目案例，能清晰讲解技术细节',
        '每周投递5-10份简历，并记录面试反馈'
      );
      break;
    case 'stability_vs_risk':
      actions.push(
        '列出自己对稳定性和风险承受的底线',
        '了解不同路径的真实工作状态',
        '和选择不同路径的前辈深入交流'
      );
      break;
    case 'management':
      actions.push(
        '找到真实的市场痛点，而不是假想的需求',
        '在现有工作/学习环境中小规模验证想法',
        '积累行业人脉和资源'
      );
      break;
    case 'interest_ability':
      actions.push(
        '列出自己最享受的3件事和最擅长的3件事',
        '寻找两者的交集',
        '尝试将兴趣转化为可展示的作品'
      );
      break;
    case 'general_confusion':
      actions.push(
        '从身边小事开始建立决策框架',
        '记录每天的决策过程和结果',
        '定期复盘，总结经验教训'
      );
      break;
  }

  return actions;
}
