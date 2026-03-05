import { CareerPath } from '@/types';

// 路径详细数据结构 - v4.0重构版
export interface PathDetailData {
  pathId: CareerPath;
  name: string;
  coreAbilities: string[];
  fitReason: string;
  gapAnalysis: {
    dimension: keyof DimensionScores;
    threshold: number;
    advice: string;
  }[];
  riskNotice: string[];
  realJobs: string[];
}

import { DimensionScores } from '@/types';

export const PATH_DETAILS: Record<CareerPath, PathDetailData> = {
  stable: {
    pathId: 'stable',
    name: '稳定体制型',
    coreAbilities: [
      '风险承受低',
      '执行稳定',
      '结构能力中等',
      '共情能力中等'
    ],
    fitReason: '你更偏好可预期环境与长期稳定路径。',
    gapAnalysis: [
      {
        dimension: 'E',
        threshold: 2.5,
        advice: '若表达能力较弱，需提升人际沟通能力。'
      },
      {
        dimension: 'S',
        threshold: 2.5,
        advice: '若结构能力较弱，建议加强系统化工作方法。'
      }
    ],
    riskNotice: [
      '成长节奏相对较慢',
      '收入上限可能受限',
      '过度追求稳定可能降低探索空间'
    ],
    realJobs: [
      '公务员',
      '事业单位',
      '教师',
      '国企职能岗'
    ]
  },

  academic: {
    pathId: 'academic',
    name: '专业深耕型',
    coreAbilities: [
      '抽象逻辑能力高',
      '结构化能力高',
      '风险承受中低',
      '执行能力中等'
    ],
    fitReason: '你适合长期积累专业能力，建立不可替代的专业壁垒。',
    gapAnalysis: [
      {
        dimension: 'X',
        threshold: 2.5,
        advice: '若执行能力低，易停留在思考阶段，建议加强实践落地能力。'
      },
      {
        dimension: 'S',
        threshold: 3.0,
        advice: '若结构能力不足，需要建立知识体系框架。'
      }
    ],
    riskNotice: [
      '回报周期较长',
      '需要长期耐心',
      '前期收入可能不高'
    ],
    realJobs: [
      '研究岗',
      '数据分析',
      '算法工程师',
      '咨询顾问'
    ]
  },

  tech: {
    pathId: 'tech',
    name: '技术应用型',
    coreAbilities: [
      '抽象逻辑能力高',
      '执行抗压能力高',
      '结构化能力中高',
      '风险承受中等'
    ],
    fitReason: '你适合把逻辑能力转化为系统实现，快速构建可用产品。',
    gapAnalysis: [
      {
        dimension: 'E',
        threshold: 2.5,
        advice: '若表达能力较弱，需加强跨团队沟通协作。'
      },
      {
        dimension: 'R',
        threshold: 2.0,
        advice: '若风险承受过低，可能限制技术探索范围。'
      }
    ],
    riskNotice: [
      '技术更新速度快',
      '竞争激烈',
      '需要持续学习'
    ],
    realJobs: [
      'AI应用工程师',
      '前端/后端开发',
      '技术产品经理',
      '系统架构师'
    ]
  },

  professional: {
    pathId: 'professional',
    name: '产品策略型',
    coreAbilities: [
      '结构化能力高',
      '表达能力高',
      '抽象逻辑能力中高',
      '风险承受中等'
    ],
    fitReason: '你具备系统设计与跨团队协调潜质，适合参与产品决策。',
    gapAnalysis: [
      {
        dimension: 'R',
        threshold: 2.5,
        advice: '若风险承受度低，决策可能偏保守。'
      },
      {
        dimension: 'X',
        threshold: 3.0,
        advice: '若执行能力不足，需要加强项目落地能力。'
      }
    ],
    riskNotice: [
      '岗位门槛较高',
      '需要项目经验',
      '决策责任重'
    ],
    realJobs: [
      '产品助理',
      '初级产品经理',
      '用户研究',
      '商业分析'
    ]
  },

  sales: {
    pathId: 'sales',
    name: '增长运营型',
    coreAbilities: [
      '执行抗压能力高',
      '风险承受中高',
      '表达能力中等',
      '结构化能力中等'
    ],
    fitReason: '你适合在市场变化中快速行动，通过数据驱动增长。',
    gapAnalysis: [
      {
        dimension: 'A',
        threshold: 2.5,
        advice: '若抽象逻辑能力较弱，需要加强数据分析能力。'
      },
      {
        dimension: 'E',
        threshold: 3.0,
        advice: '若表达能力不足，需提升跨部门协作效率。'
      }
    ],
    riskNotice: [
      '工作压力大',
      '绩效导向强',
      '结果导向明显'
    ],
    realJobs: [
      '增长运营',
      '商业化运营',
      '电商运营',
      '用户增长'
    ]
  },

  creative: {
    pathId: 'creative',
    name: '内容表达型',
    coreAbilities: [
      '表达能力高',
      '共情能力中高',
      '结构化能力中等',
      '风险承受中等'
    ],
    fitReason: '你更适合通过内容影响他人，建立个人品牌与影响力。',
    gapAnalysis: [
      {
        dimension: 'X',
        threshold: 2.5,
        advice: '若执行能力不足，内容产出可能不稳定。'
      },
      {
        dimension: 'A',
        threshold: 3.0,
        advice: '若逻辑能力较弱，内容深度可能受限。'
      }
    ],
    riskNotice: [
      '收入波动较大',
      '依赖平台算法',
      '需要长期积累'
    ],
    realJobs: [
      '内容运营',
      '新媒体编辑',
      '自媒体创作者',
      '品牌策划'
    ]
  },

  education: {
    pathId: 'education',
    name: '教育助人型',
    coreAbilities: [
      '共情能力高',
      '表达能力中等',
      '执行抗压能力中等',
      '结构化能力中等'
    ],
    fitReason: '你更适合长期陪伴型职业，通过支持他人获得价值感。',
    gapAnalysis: [
      {
        dimension: 'A',
        threshold: 2.5,
        advice: '若抽象逻辑能力不足，需要加强理论体系构建。'
      },
      {
        dimension: 'X',
        threshold: 2.5,
        advice: '若执行能力较弱，辅导计划可能难以落地。'
      }
    ],
    riskNotice: [
      '成长节奏相对平缓',
      '收入稳定但空间有限',
      '情感投入较大'
    ],
    realJobs: [
      '教师',
      '咨询顾问',
      '心理辅导',
      '用户研究'
    ]
  },

  management: {
    pathId: 'management',
    name: '创业探索型',
    coreAbilities: [
      '风险承受高',
      '执行抗压能力高',
      '结构化能力中等',
      '表达能力中高'
    ],
    fitReason: '你适合在高不确定性环境中探索，承担风险换取突破空间。',
    gapAnalysis: [
      {
        dimension: 'S',
        threshold: 3.0,
        advice: '若结构化能力不足，需要系统性规划能力。'
      },
      {
        dimension: 'A',
        threshold: 2.5,
        advice: '若抽象逻辑能力较弱，商业模式设计可能受限。'
      }
    ],
    riskNotice: [
      '失败概率较高',
      '心理压力大',
      '收入不稳定',
      '需要强大的心理韧性'
    ],
    realJobs: [
      '创业团队核心成员',
      '初创公司产品',
      '项目负责人',
      '独立创业者'
    ]
  }
};
