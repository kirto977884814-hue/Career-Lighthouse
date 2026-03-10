import { CareerPath, CareerPathData } from '@/types';

/**
 * 8种职业路径完整数据
 * v5.0 重构版：基于真实职业选择（考研、考公、技术等）
 *
 * 设计原则：
 * 1. 权重范围 [-8, 8]，扩大区分度
 * 2. 每条路径至少2个强排斥维度（≤ -6）或1个极强排斥维度（≤ -7）
 * 3. 基于真实数据：40%考研、30%考公、其余分布在技术/市场/专业服务/创意/教育
 * 4. 明确"一票否决"维度：不满足即大幅降低匹配度
 * 5. 增加决策风格和核心动机匹配
 */
export const PATH_DATA: Record<CareerPath, CareerPathData> = {
  /**
   * 学术深造型（5-10%）
   * 适合真正热爱学术研究、理论推导的学生
   */
  academic: {
    id: 'academic',
    name: '学术深造型',
    description: '适合准备考研、读博或从事科研工作的学生。需要深入理解理论、长期专注学术研究，对不确定性容忍度较低。',

    // 六维度特征向量 [S, A, R, E, X, C]
    dimensions: [2, 7, -7, -5, 3, 3],

    // 理想决策风格
    idealStyle: {
      conservative: 8,      // 极度保守，追求确定性
      flexible: 2,          // 不喜欢变化
      adventurous: 1,       // 极度排斥冒险
      pragmatic: 4          // 中等务实
    },

    // 匹配的核心动机
    motivations: [
      '追求真理和知识',
      '深度思考',
      '专业精通',
      '长期投入'
    ],

    // 一票否决规则
    vetoRules: [
      {
        dimension: 'R',
        threshold: 4,
        penalty: 0.4,
        description: '学术研究需要长期投入，风险承受度过高不适合'
      },
      {
        dimension: 'E',
        threshold: 5,
        penalty: 0.2,
        description: '学术研究更注重理论写作而非口头表达'
      }
    ],

    // 学历要求
    degreeRequirement: {
      required: true,
      recommended: true,
      reason: '学术深造必须硕士及以上学历，博士最佳'
    }
  },

  /**
   * 稳定体制型（25-30%）
   * 适合目标考公、考编、进入国企或事业单位的学生
   */
  stable: {
    id: 'stable',
    name: '稳定体制型',
    description: '适合目标考公、考编、进入国企或事业单位的学生。强调执行力、规则意识和稳定性，对风险极度敏感。',

    dimensions: [7, -3, -8, -5, 6, -2],

    idealStyle: {
      conservative: 9,      // 极度保守
      flexible: 2,          // 排斥变化
      adventurous: 0,       // 完全不冒险
      pragmatic: 7          // 高度务实
    },

    motivations: [
      '稳定和安全',
      '社会地位',
      '服务社会',
      '规则明确'
    ],

    vetoRules: [
      {
        dimension: 'R',
        threshold: 5,
        penalty: 0.5,
        description: '体制内工作极度排斥风险，高风险承受度不适应'
      },
      {
        dimension: 'E',
        threshold: 6,
        penalty: 0.2,
        description: '体制内更注重公文写作而非口头表达'
      },
      {
        dimension: 'A',
        threshold: 6,
        penalty: 0.15,
        description: '体制内工作更强调执行而非抽象思考'
      }
    ],

    degreeRequirement: {
      required: false,
      recommended: true,
      reason: '本科可考部分岗位，但硕士学历竞争优势明显'
    }
  },

  /**
   * 技术研发型（15%）
   * 适合程序员、工程师、数据分析师等技术岗位
   */
  tech: {
    id: 'tech',
    name: '技术研发型',
    description: '适合程序员、工程师、数据分析师等技术岗位。强调逻辑思维、系统构建能力，对人际沟通要求相对较低。',

    dimensions: [8, 7, -2, -6, 5, -7],

    idealStyle: {
      conservative: 5,      // 中等保守
      flexible: 6,          // 技术需要适应新工具
      adventurous: 3,       // 技术创新需要一定冒险精神
      pragmatic: 8          // 极度务实，结果导向
    },

    motivations: [
      '解决复杂问题',
      '技术精通',
      '创造工具',
      '持续学习'
    ],

    vetoRules: [
      {
        dimension: 'E',
        threshold: 5,
        penalty: 0.3,
        description: '技术工作更注重代码而非口头沟通'
      },
      {
        dimension: 'C',
        threshold: 5,
        penalty: 0.3,
        description: '技术工作强调逻辑而非共情'
      },
      {
        dimension: 'S',
        threshold: 3,
        penalty: 0.2,
        description: '技术工作需要强结构化思维'
      },
      {
        dimension: 'A',
        threshold: 3,
        penalty: 0.2,
        description: '技术工作需要强抽象逻辑能力'
      }
    ],

    degreeRequirement: {
      required: false,
      recommended: true,
      reason: '本科可就业，但硕士学历对晋升和薪资有帮助'
    }
  },

  /**
   * 专业服务型（5%）
   * 适合医生、律师、会计师、咨询师等专业服务岗位
   */
  professional: {
    id: 'professional',
    name: '专业服务型',
    description: '适合医生、律师、会计师、咨询师等专业服务岗位。需要专业资格证书，强调逻辑分析和结构化思维。',

    dimensions: [6, 5, -6, 3, 4, 2],

    idealStyle: {
      conservative: 7,      // 保守，遵守专业规范
      flexible: 4,          // 需要适应不同案例
      adventurous: 2,       // 排斥高风险
      pragmatic: 6          // 务实
    },

    motivations: [
      '专业权威',
      '帮助他人',
      '知识应用',
      '社会认可'
    ],

    vetoRules: [
      {
        dimension: 'R',
        threshold: 5,
        penalty: 0.3,
        description: '专业服务强调风险控制和规范'
      },
      {
        dimension: 'S',
        threshold: 3,
        penalty: 0.2,
        description: '专业服务需要强结构化思维'
      }
    ],

    degreeRequirement: {
      required: true,
      recommended: true,
      reason: '专业服务通常需要硕士及以上学历（如医学博士、法学硕士）'
    }
  },

  /**
   * 市场销售型（5%）
   * 适合销售、市场、商务拓展等岗位
   */
  sales: {
    id: 'sales',
    name: '市场销售型',
    description: '适合销售、市场、商务拓展等岗位。强调结果导向、抗压能力和表达沟通，收入波动大但上限高。',

    dimensions: [-5, -4, 7, 6, 6, -6],

    idealStyle: {
      conservative: 2,      // 不保守
      flexible: 8,          // 极度灵活，适应市场
      adventurous: 7,       // 喜欢冒险和挑战
      pragmatic: 9          // 极度务实，只看结果
    },

    motivations: [
      '高收入潜力',
      '成就感',
      '人际互动',
      '竞争挑战'
    ],

    vetoRules: [
      {
        dimension: 'S',
        threshold: 6,
        penalty: 0.3,
        description: '销售工作排斥过度结构化'
      },
      {
        dimension: 'A',
        threshold: 6,
        penalty: 0.2,
        description: '销售更注重实践而非抽象理论'
      },
      {
        dimension: 'C',
        threshold: 6,
        penalty: 0.2,
        description: '销售需要结果导向，过度共情影响决策'
      }
    ],

    degreeRequirement: {
      required: false,
      recommended: false,
      reason: '销售岗位更看重能力和业绩，学历非必需'
    }
  },

  /**
   * 内容创意型（2%）
   * 适合新媒体运营、文案策划、设计、自媒体等岗位
   */
  creative: {
    id: 'creative',
    name: '内容创意型',
    description: '适合新媒体运营、文案策划、设计、自媒体等岗位。强调创意和表达，对结构和规则要求低。',

    dimensions: [-7, -3, 6, 7, 3, 5],

    idealStyle: {
      conservative: 1,      // 极度不保守
      flexible: 9,          // 极度灵活
      adventurous: 8,       // 喜欢冒险和尝试
      pragmatic: 5          // 中等务实
    },

    motivations: [
      '创意表达',
      '个人影响力',
      '自由灵活',
      '美学追求'
    ],

    vetoRules: [
      {
        dimension: 'S',
        threshold: 6,
        penalty: 0.4,
        description: '创意工作排斥过度结构化和规则'
      },
      {
        dimension: 'A',
        threshold: 6,
        penalty: 0.2,
        description: '创意更注重直觉而非抽象逻辑'
      }
    ],

    degreeRequirement: {
      required: false,
      recommended: false,
      reason: '创意行业更看重作品和个人能力，学历非必需'
    }
  },

  /**
   * 教育咨询型（3%）
   * 适合教师、培训师、HR、心理咨询师等岗位
   */
  education: {
    id: 'education',
    name: '教育咨询型',
    description: '适合教师、培训师、HR、心理咨询师等岗位。强调共情能力和助人意愿，工作相对稳定。',

    dimensions: [3, 4, -7, 6, 2, 8],

    idealStyle: {
      conservative: 6,      // 保守
      flexible: 5,          // 中等灵活
      adventurous: 2,       // 排斥冒险
      pragmatic: 5          // 中等务实
    },

    motivations: [
      '帮助他人',
      '知识传播',
      '社会影响',
      '稳定收入'
    ],

    vetoRules: [
      {
        dimension: 'R',
        threshold: 5,
        penalty: 0.4,
        description: '教育工作强调稳定，排斥风险'
      },
      {
        dimension: 'C',
        threshold: 3,
        penalty: 0.2,
        description: '教育工作需要极强共情能力'
      }
    ],

    degreeRequirement: {
      required: false,
      recommended: true,
      reason: '本科可就业，但硕士学历对高校和高级培训机构有帮助'
    }
  },

  /**
   * 综合管理型（5%）
   * 适合管培生、项目管理、综合运营等岗位
   */
  management: {
    id: 'management',
    name: '综合管理型',
    description: '适合管培生、项目管理、综合运营等岗位。需要综合能力，未来可向管理层发展。',

    dimensions: [5, 4, 2, 5, 5, 3],

    idealStyle: {
      conservative: 5,      // 中等
      flexible: 7,          // 灵活
      adventurous: 5,       // 中等
      pragmatic: 7          // 务实
    },

    motivations: [
      '领导力',
      '综合发展',
      '战略视野',
      '组织协调'
    ],

    vetoRules: [
      // 管理型没有强排斥维度，均衡发展即可
    ],

    degreeRequirement: {
      required: false,
      recommended: true,
      reason: '本科可进入，但MBA等硕士学位对晋升管理层有帮助'
    }
  }
};

// 导出兼容旧版本的数据结构（保持向后兼容）
export const PATH_VECTORS: Record<CareerPath, number[]> = {
  academic: PATH_DATA.academic.dimensions,
  stable: PATH_DATA.stable.dimensions,
  tech: PATH_DATA.tech.dimensions,
  professional: PATH_DATA.professional.dimensions,
  sales: PATH_DATA.sales.dimensions,
  creative: PATH_DATA.creative.dimensions,
  education: PATH_DATA.education.dimensions,
  management: PATH_DATA.management.dimensions
};

export const PATH_NAMES: Record<CareerPath, string> = {
  academic: PATH_DATA.academic.name,
  stable: PATH_DATA.stable.name,
  tech: PATH_DATA.tech.name,
  professional: PATH_DATA.professional.name,
  sales: PATH_DATA.sales.name,
  creative: PATH_DATA.creative.name,
  education: PATH_DATA.education.name,
  management: PATH_DATA.management.name
};

export const PATH_DESCRIPTIONS: Record<CareerPath, any> = {
  academic: PATH_DATA.academic,
  stable: PATH_DATA.stable,
  tech: PATH_DATA.tech,
  professional: PATH_DATA.professional,
  sales: PATH_DATA.sales,
  creative: PATH_DATA.creative,
  education: PATH_DATA.education,
  management: PATH_DATA.management
};

/**
 * 计算用户与路径的匹配度（向后兼容函数）
 * v5.0 版本：新算法在 calculator.ts 中实现
 * @deprecated 请使用 calculator.ts 中的 calculatePathMatch
 */
export function calculatePathMatch(
  userScores: any,
  pathVector: number[]
): number {
  // 这个函数已被 calculator.ts 中的新算法替代
  // 保留这里是为了向后兼容
  console.warn('calculatePathMatch is deprecated, use calculator.ts instead');
  return 0.5;
}

/**
 * 计算匹配度百分比（向后兼容函数）
 * @deprecated 请使用 calculator.ts 中的新算法
 */
export function calculateMatchPercent(score: number): number {
  return Math.round(score * 100);
}
