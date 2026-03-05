/**
 * v5.0 问卷题目设计
 * 总计47题，分为5个部分：
 * 1. 基础信息调查（6题）
 * 2. 核心动机探索（4题）
 * 3. 六维度能力评估（30题，每维度5题×6维度）
 * 4. 深度情境题（5题）
 * 5. 反思环节（2题）
 */

import {
  BasicInfoQuestion,
  MotivationQuestion,
  DimensionQuestion,
  ScenarioQuestion,
  ReflectionQuestion,
  Dimension
} from '@/types';

// ============================================================================
// 第一部分：基础信息调查（6题）
// ============================================================================

export const BASIC_INFO_QUESTIONS: BasicInfoQuestion[] = [
  {
    id: 'basic_grade',
    type: 'grade',
    text: '你目前是',
    required: true,
    options: [
      { value: '大一', label: '大一' },
      { value: '大二', label: '大二' },
      { value: '大三', label: '大三' },
      { value: '大四', label: '大四' },
      { value: '研一', label: '研一' },
      { value: '研二', label: '研二' },
      { value: '研三', label: '研三' },
      { value: '已毕业', label: '已毕业' }
    ]
  },
  {
    id: 'basic_major',
    type: 'major',
    text: '你的专业是',
    required: true,
    options: [] // 用户手动输入
  },
  {
    id: 'basic_majorInterest',
    type: 'majorInterest',
    text: '你对自己专业的感兴趣程度',
    required: true,
    options: [
      { value: 'very', label: '非常喜欢，愿意深入钻研' },
      { value: 'neutral', label: '一般，没什么感觉' },
      { value: 'not', label: '不喜欢，想换方向' }
    ]
  },
  {
    id: 'basic_targetIndustry',
    type: 'targetIndustry',
    text: '你最想从事的工作类型（请选择最符合的一项）',
    required: true,
    options: [
      { value: 'academic', label: '学术科研', emoji: '🔬' },
      { value: 'stable', label: '公务员/事业单位', emoji: '🏛️' },
      { value: 'tech', label: '程序员/工程师', emoji: '💻' },
      { value: 'professional', label: '医生/律师/会计师', emoji: '⚖️' },
      { value: 'sales', label: '销售/市场', emoji: '📈' },
      { value: 'creative', label: '新媒体/设计/内容创作', emoji: '🎨' },
      { value: 'education', label: '教师/培训师', emoji: '👨‍🏫' },
      { value: 'management', label: '管理岗/管培生', emoji: '💼' },
      { value: 'other_tech', label: '其他技术类', emoji: '⚙️' },
      { value: 'other_service', label: '其他服务类', emoji: '🤝' },
      { value: 'unsure', label: '还没想好', emoji: '🤔' },
      { value: 'further_study', label: '继续深造', emoji: '📚' },
      { value: 'family_business', label: '继承家业', emoji: '🏢' }
    ]
  },
  {
    id: 'basic_planPostgraduate',
    type: 'planPostgraduate',
    text: '你目前是否计划考研？',
    required: true,
    options: [
      { value: 'yes', label: '是，正在准备' },
      { value: 'maybe', label: '还在考虑中' },
      { value: 'no', label: '不考研' }
    ]
  },
  {
    id: 'basic_currentConfusion',
    type: 'currentConfusion',
    text: '你当前最大的困惑是什么？（选填，不超过100字）',
    required: false,
    options: [] // 用户手动输入
  }
];

// 考研原因追问（仅当planPostgraduate=yes时显示）
export const POSTGRADUATE_REASON_OPTIONS = [
  { value: 'academic_interest', label: '真正热爱学术研究' },
  { value: 'degree_upgrade', label: '提升学历，更好就业' },
  { value: 'delay_employment', label: '暂时不想工作' },
  { value: 'following_crowd', label: '大家都在考研' },
  { value: 'parent_pressure', label: '父母要求' },
  { value: 'uncertain', label: '不知道做什么，先考考试试' }
];

// ============================================================================
// 第二部分：核心动机探索（4题）
// ============================================================================

export const MOTIVATION_QUESTIONS: MotivationQuestion[] = [
  {
    id: 'mot_real_choice',
    type: 'targetIndustry',
    text: '如果不受任何限制（家庭压力、经济压力、社会评价），你最想从事什么工作？',
    required: true,
    options: [
      { value: 'academic', label: '学术研究' },
      { value: 'stable', label: '公务员/事业单位' },
      { value: 'tech', label: '技术开发' },
      { value: 'professional', label: '专业服务（医生/律师等）' },
      { value: 'sales', label: '销售/市场' },
      { value: 'creative', label: '创意/内容工作' },
      { value: 'education', label: '教育/培训' },
      { value: 'management', label: '管理工作' }
    ]
  },
  {
    id: 'mot_core_values',
    type: 'coreValues',
    text: '请按重要性对你选择工作的3个最重要因素进行排序',
    required: true,
    options: [
      { value: 'stable_income', label: '收入稳定', description: '不用担心失业' },
      { value: 'high_income', label: '高收入潜力', description: '愿意冒风险换取高回报' },
      { value: 'work_life_balance', label: '工作生活平衡', description: '不希望过度加班' },
      { value: 'social_impact', label: '社会价值', description: '帮助他人/社会' },
      { value: 'autonomy', label: '自由度', description: '不想被规则束缚' },
      { value: 'growth', label: '成长空间', description: '持续学习和进步' },
      { value: 'interest', label: '兴趣匹配', description: '做自己喜欢的事' },
      { value: 'recognition', label: '社会认可度', description: '受人尊敬的地位' }
    ]
  },
  {
    id: 'mot_willing_change',
    type: 'willingToChangeMajor',
    text: '如果发现一个更适合你的方向，但需要重新开始（换专业/降低起薪等），你愿意吗？',
    required: true,
    options: [
      { value: 'very_willing', label: '非常愿意，长远发展更重要' },
      { value: 'somewhat_willing', label: '可以考虑，但要有明显优势' },
      { value: 'neutral', label: '不确定' },
      { value: 'reluctant', label: '不太愿意，成本太高' },
      { value: 'unwilling', label: '完全不愿意，不想折腾' }
    ]
  },
  {
    id: 'mot_self_awareness',
    type: 'selfPerceivedPotential',
    text: '你认为自己的核心优势是什么？（请选择最符合的一项）',
    required: true,
    options: [
      { value: 'logical_thinking', label: '逻辑思维强，擅长分析复杂问题' },
      { value: 'communication', label: '沟通能力强，善于与人打交道' },
      { value: 'creativity', label: '创意丰富，喜欢新鲜事物' },
      { value: 'execution', label: '执行力强，能把事做成' },
      { value: 'empathy', label: '共情能力强，能理解他人' },
      { value: 'systematic', label: '系统化思维，擅长规划和组织' },
      { value: 'uncertain', label: '不太确定' }
    ]
  }
];

// ============================================================================
// 第三部分：六维度能力评估（30题）
// 每个维度5题，每题包含"现实行为"和"真实意愿"两个版本
// ============================================================================

/**
 * 维度题目生成函数
 * 为每个维度创建5组题目，每组包含reality和ideal两个版本
 */
function createDimensionQuestions(
  dimension: Dimension,
  questions: {
    category: 'behavior' | 'willingness' | 'depth' | 'growth' | 'values';
    realityText: string;
    idealText: string;
    reverse?: boolean;
  }[]
): DimensionQuestion[] {
  const result: DimensionQuestion[] = [];

  questions.forEach((q, index) => {
    const dimensionPrefix = dimension;
    const categorySuffix = ['behavior', 'willingness', 'depth', 'growth', 'values'][index];

    // 现实行为题
    result.push({
      id: `${dimensionPrefix}_real_${categorySuffix}`,
      dimension,
      type: 'reality',
      category: q.category,
      text: q.realityText,
      reverse: q.reverse
    });

    // 真实意愿题
    result.push({
      id: `${dimensionPrefix}_ideal_${categorySuffix}`,
      dimension,
      type: 'ideal',
      category: q.category,
      text: q.idealText,
      reverse: q.reverse
    });
  });

  return result;
}

// 维度题目内容定义
export const DIMENSION_QUESTIONS: DimensionQuestion[] = [
  // ========== 结构化能力 (S) ==========
  ...createDimensionQuestions('S', [
    {
      category: 'behavior',
      realityText: '在开始写课程论文前，我会先列好详细的大纲和各部分的字数分配。',
      idealText: '我希望能先列好详细的大纲和计划，而不是想到哪写到哪。',
      reverse: false
    },
    {
      category: 'willingness',
      realityText: '面对期末复习，我会把所有知识点按重要程度分类，制定阶梯式复习计划。',
      idealText: '我希望能系统化地规划复习，而不是盲目地翻书看题。',
      reverse: false
    },
    {
      category: 'depth',
      realityText: '当接到一个新的小组作业时，我会主动梳理出任务分工和时间节点。',
      idealText: '我希望能成为团队中擅长规划和组织分工的人。',
      reverse: false
    },
    {
      category: 'growth',
      realityText: '在学习一门新课时，我会先整理出课程的知识框架图，再填充细节。',
      idealText: '我希望能培养出"先建立框架，再填充细节"的学习习惯。',
      reverse: false
    },
    {
      category: 'values',
      realityText: '面对没有标准答案的开放性作业，我会感到不知道从何入手。',
      idealText: '我更喜欢有明确要求和标准的工作，而不是完全开放的任务。',
      reverse: true
    }
  ]),

  // ========== 抽象逻辑能力 (A) ==========
  ...createDimensionQuestions('A', [
    {
      category: 'behavior',
      realityText: '当老师讲解一个案例时，我会尝试提炼出背后的通用规律或模型。',
      idealText: '我希望能快速抓住问题背后的逻辑和规律。',
      reverse: false
    },
    {
      category: 'willingness',
      realityText: '在学习一个新概念时，我会花时间理解其背后的原理而不是直接记忆结论。',
      idealText: '我希望能深入理解事物的本质原理，而不是只记住表面结论。',
      reverse: false
    },
    {
      category: 'depth',
      realityText: '面对课本上的理论推导过程，我会仔细阅读每一步的逻辑关系。',
      idealText: '我希望能理解复杂理论背后的逻辑链条。',
      reverse: false
    },
    {
      category: 'growth',
      realityText: '在复习时，我更关注知识点之间的逻辑关系而不是孤立地记忆每个知识点。',
      idealText: '我希望能培养出"看到全局逻辑"的思考能力。',
      reverse: false
    },
    {
      category: 'values',
      realityText: '相比于深入理解原理，我更希望快速上手能用的工具。',
      idealText: '我更在乎"能快速上手使用"，而不是"深入理解底层原理"。',
      reverse: true
    }
  ]),

  // ========== 风险承受度 (R) ==========
  ...createDimensionQuestions('R', [
    {
      category: 'behavior',
      realityText: '如果有一个创业团队的实习机会（不稳定但成长快），我愿意尝试。',
      idealText: '我希望能接受一些不确定性，换取更大的成长空间。',
      reverse: false
    },
    {
      category: 'willingness',
      realityText: '面对多个不确定的职业方向，我更倾向于通过实习尝试而不是等待确定答案。',
      idealText: '我希望自己能勇于尝试不同的方向，而不是等到"完全确定"才行动。',
      reverse: false
    },
    {
      category: 'depth',
      realityText: '我不介意大学期间多次调整自己的职业规划方向。',
      idealText: '我希望能接受"职业规划是不断调整的过程"，而不是一次性定终身。',
      reverse: false
    },
    {
      category: 'growth',
      realityText: '在选择选修课时，我更愿意选有挑战性但可能拿低分的课程，而不是稳妥的"水课"。',
      idealText: '我希望能接受"有挑战性但风险较高"的选择，而不是追求绝对稳妥。',
      reverse: false
    },
    {
      category: 'values',
      realityText: '我更希望一次性就确定好职业方向，而不是反复尝试和调整。',
      idealText: '我更看重"快速确定方向"，而不是"不断探索可能性"。',
      reverse: true
    }
  ]),

  // ========== 表达倾向 (E) ==========
  ...createDimensionQuestions('E', [
    {
      category: 'behavior',
      realityText: '在课堂讨论中，我会主动表达自己的观点。',
      idealText: '我希望能成为在讨论中积极表达观点的人。',
      reverse: false
    },
    {
      category: 'willingness',
      realityText: '在小组项目中，我更愿意负责最终的汇报展示。',
      idealText: '我希望能承担更多需要公开表达的任务。',
      reverse: false
    },
    {
      category: 'depth',
      realityText: '当与同学发生意见分歧时，我会尝试说服对方接受我的观点。',
      idealText: '我希望能更擅长通过沟通来影响和说服他人。',
      reverse: false
    },
    {
      category: 'growth',
      realityText: '面对陌生人的社交场合，我通常能主动开启对话。',
      idealText: '我希望能提升自己的社交主动性，更擅长与陌生人交流。',
      reverse: false
    },
    {
      category: 'values',
      realityText: '我更倾向于通过书面文字表达，而不是口头沟通。',
      idealText: '我更喜欢"静默思考+书面表达"，而不是"面对面沟通"。',
      reverse: true
    }
  ]),

  // ========== 执行抗压能力 (X) ==========
  ...createDimensionQuestions('X', [
    {
      category: 'behavior',
      realityText: '面对deadline临近的情况，我能保持高效工作状态。',
      idealText: '我希望能培养出在压力下依然保持高效的能力。',
      reverse: false
    },
    {
      category: 'willingness',
      realityText: '当任务量大时，我会主动加班或牺牲休息时间来完成。',
      idealText: '我希望能接受"为了达成目标而高强度工作"的状态。',
      reverse: false
    },
    {
      category: 'depth',
      realityText: '面对一项复杂且耗时的任务，我能坚持到底不放弃。',
      idealText: '我希望能培养出"即使枯燥也能坚持到底"的意志力。',
      reverse: false
    },
    {
      category: 'growth',
      realityText: '在多次失败后，我依然能继续尝试而不是放弃。',
      idealText: '我希望能培养出"越挫越勇"的抗压能力。',
      reverse: false
    },
    {
      category: 'values',
      realityText: '我更看重工作过程中的体验，而不是最终完成结果。',
      idealText: '相比"必须完成任务"，我更在乎"过程中的感受和体验"。',
      reverse: true
    }
  ]),

  // ========== 共情能力 (C) ==========
  ...createDimensionQuestions('C', [
    {
      category: 'behavior',
      realityText: '当同学遇到困难时，我会主动提供帮助。',
      idealText: '我希望能成为能够敏锐察觉他人需要并主动帮助的人。',
      reverse: false
    },
    {
      category: 'willingness',
      realityText: '在团队合作中，我会考虑其他成员的感受和想法。',
      idealText: '我希望能更在意团队成员的情绪和感受，而不只是关注任务本身。',
      reverse: false
    },
    {
      category: 'depth',
      realityText: '当朋友情绪低落时，我能理解并给予合适的安慰。',
      idealText: '我希望能培养出"准确理解他人情绪"的能力。',
      reverse: false
    },
    {
      category: 'growth',
      realityText: '即使不同意某人的观点，我也能尊重并倾听对方的想法。',
      idealText: '我希望能培养出"即使有分歧也能共情"的能力。',
      reverse: false
    },
    {
      category: 'values',
      realityText: '在团队决策时，我更倾向于直接指出问题，而不是顾及大家的情绪。',
      idealText: '相比"维护团队和谐"，我更在乎"直接指出问题提高效率"。',
      reverse: true
    }
  ])
];

// ============================================================================
// 第四部分：深度情境题（5题）
// 通过真实场景观察用户的决策风格
// ============================================================================

export const SCENARIO_QUESTIONS: ScenarioQuestion[] = [
  {
    id: 'scenario_1',
    text: '你同时收到了两个offer：一个是稳定的国企工作（月薪5000，福利好），一个是创业公司的核心岗位（月薪10000，但公司可能倒闭）。你会选择？',
    context: '毕业后求职场景，权衡稳定性和风险收益',
    options: [
      {
        id: 'A',
        text: '选择国企，稳定更重要',
        styleImplications: { conservative: 3, pragmatic: 2 }
      },
      {
        id: 'B',
        text: '选择创业公司，高风险高回报',
        styleImplications: { adventurous: 3, pragmatic: 2 }
      },
      {
        id: 'C',
        text: '综合考虑，看看是否有折中方案',
        styleImplications: { flexible: 2, pragmatic: 1 }
      },
      {
        id: 'D',
        text: '向有经验的人请教后再决定',
        styleImplications: { conservative: 1, flexible: 2 }
      }
    ]
  },
  {
    id: 'scenario_2',
    text: '你的导师给了你一个研究课题，但你发现这个方向可能很难出成果。另一个同学邀请你加入他已有的研究项目，成果更有保障。你会怎么做？',
    context: '学术场景，权衡独立性和成功率',
    options: [
      {
        id: 'A',
        text: '坚持自己的课题，相信能做出成果',
        styleImplications: { adventurous: 3, pragmatic: 1 }
      },
      {
        id: 'B',
        text: '加入同学的课题，成功率更重要',
        styleImplications: { pragmatic: 3, conservative: 1 }
      },
      {
        id: 'C',
        text: '尝试同时做两个课题',
        styleImplications: { adventurous: 2, pragmatic: 2 }
      },
      {
        id: 'D',
        text: '和导师讨论后再决定',
        styleImplications: { flexible: 2, conservative: 1 }
      }
    ]
  },
  {
    id: 'scenario_3',
    text: '你在团队项目中负责技术部分，但项目进展不顺，需要在deadline前两天通宵赶工。你的室友邀请你参加一个重要的社交活动（可能带来实习机会）。你会怎么做？',
    context: '多任务压力场景，权衡任务执行和社交机会',
    options: [
      {
        id: 'A',
        text: '优先完成项目，活动可以下次再参加',
        styleImplications: { pragmatic: 3, conservative: 1 }
      },
      {
        id: 'B',
        text: '参加活动，项目可以和队友商量调整',
        styleImplications: { flexible: 2, adventurous: 2 }
      },
      {
        id: 'C',
        text: '尝试两边都兼顾，压缩睡眠时间',
        styleImplications: { pragmatic: 2, adventurous: 2 }
      },
      {
        id: 'D',
        text: '评估活动的实际价值后再决定',
        styleImplications: { pragmatic: 2, flexible: 1 }
      }
    ]
  },
  {
    id: 'scenario_4',
    text: '你发现团队成员中有人表现不佳，影响了整体进度。但你知道他最近家里有困难。你会怎么做？',
    context: '团队协作场景，权衡任务执行和人际关系',
    options: [
      {
        id: 'A',
        text: '直接指出问题，要求他改进',
        styleImplications: { pragmatic: 3, conservative: 1 }
      },
      {
        id: 'B',
        text: '主动分担他的工作，理解他的困难',
        styleImplications: { flexible: 2, pragmatic: 1 }
      },
      {
        id: 'C',
        text: '私下了解情况，一起找解决方案',
        styleImplications: { flexible: 3, pragmatic: 2 }
      },
      {
        id: 'D',
        text: '向老师或负责人反映情况',
        styleImplications: { conservative: 2, pragmatic: 1 }
      }
    ]
  },
  {
    id: 'scenario_5',
    text: '你计划毕业后去某行业工作，但最近该行业出现了不确定因素（如政策变化）。家人建议你考公，但你并不喜欢体制内工作。你会怎么做？',
    context: '职业规划场景，权衡理想和现实',
    options: [
      {
        id: 'A',
        text: '坚持原计划，相信行业会好转',
        styleImplications: { adventurous: 3, pragmatic: 1 }
      },
      {
        id: 'B',
        text: '听家人建议，考公更稳妥',
        styleImplications: { conservative: 3, pragmatic: 2 }
      },
      {
        id: 'C',
        text: '先考研延后决定',
        styleImplications: { flexible: 2, conservative: 2 }
      },
      {
        id: 'D',
        text: '深入了解行业变化后，调整但不变方向',
        styleImplications: { flexible: 3, pragmatic: 2 }
      }
    ]
  }
];

// ============================================================================
// 第五部分：反思环节（2题）
// ============================================================================

export const REFLECTION_QUESTIONS: ReflectionQuestion[] = [
  {
    id: 'reflect_realization',
    type: 'realization',
    text: '通过这次问卷，你有什么新的发现或认识？（比如：发现了自己之前没意识到的潜力/倾向）',
    placeholder: '请简述你的新发现...',
    multiline: true
  },
  {
    id: 'reflect_action',
    type: 'action',
    text: '基于这些发现，你接下来打算做什么？（1-2个具体行动）',
    placeholder: '例如：尝试XXX方向的实习 / 找XXX专业的学长聊聊 / 学习XXX技能...',
    multiline: true
  }
];

// ============================================================================
// Likert量表选项
// ============================================================================

export const LIKERT_OPTIONS = [
  { value: 1, label: '非常不像我' },
  { value: 2, label: '不太像我' },
  { value: 3, label: '一般' },
  { value: 4, label: '比较像我' },
  { value: 5, label: '非常像我' }
];

// ============================================================================
// 问卷元数据
// ============================================================================

export const QUESTIONNAIRE_META = {
  totalQuestions: 47,
  sections: [
    {
      id: 'basic',
      title: '基础信息调查',
      description: '了解你的基本情况',
      questionCount: 6,
      estimatedTime: '1分钟'
    },
    {
      id: 'motivation',
      title: '核心动机探索',
      description: '探索你的真实意愿和价值观',
      questionCount: 4,
      estimatedTime: '2分钟'
    },
    {
      id: 'dimensions',
      title: '六维度能力评估',
      description: '评估你在六个维度的现状和潜力',
      questionCount: 30,
      estimatedTime: '4-5分钟'
    },
    {
      id: 'scenarios',
      title: '深度情境分析',
      description: '通过真实场景观察你的决策风格',
      questionCount: 5,
      estimatedTime: '2-3分钟'
    },
    {
      id: 'reflection',
      title: '自我反思',
      description: '总结你的发现和行动计划',
      questionCount: 2,
      estimatedTime: '1分钟'
    }
  ],
  totalEstimatedTime: '8-12分钟'
};
