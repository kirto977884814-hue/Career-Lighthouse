import { CareerPath, CareerPathInfo, DimensionScores } from '@/types';

// 8种职业路径的特征向量 [S, A, R, E, X, C]
// 设计原则：
// 1. 权重范围 [-5, 5]，负值表示"排斥/不适合"
// 2. 每条路径有明确的高权重维度（≥4）和低/负权重维度（≤2）
// 3. 增加路径间的区分度，避免权重集中在相似区间
// 4. 控制正向总和，避免某条路径对所有用户都得高分
export const PATH_VECTORS: Record<CareerPath, number[]> = {
  stable: [3, 2, -5, 2, 3, 2],              // 稳定体制型：强排斥风险
  deepSpecialist: [2, 5, -2, -4, 2, -2],    // 专业深耕型：超强调抽象，排斥结构/表达/共情
  techApplication: [5, 5, 2, -4, 5, -4],    // 技术应用型：强调结构和逻辑，强排斥共情
  productStrategy: [5, 4, 1, 5, 3, -3],     // 产品策略型：强调结构/抽象/表达，排斥风险和共情
  growthOperation: [1, 2, 5, 4, 5, -2],     // 增长运营型：强调风险/执行/表达，排斥结构和抽象
  contentExpression: [-3, -3, 3, 5, 3, 5],  // 内容表达型：强调表达/共情，排斥结构/逻辑
  educationSupport: [2, 1, -4, 5, 3, 5],    // 教育助人型：强调共情/表达，排斥风险/抽象
  entrepreneurship: [4, 3, 5, 4, 5, -3]     // 创业探索型：强调风险/执行/结构/表达，排斥共情
};

// 路径名称映射
export const PATH_NAMES: Record<CareerPath, string> = {
  stable: '稳定体制型',
  deepSpecialist: '专业深耕型',
  techApplication: '技术应用型',
  productStrategy: '产品策略型',
  growthOperation: '增长运营型',
  contentExpression: '内容表达型',
  educationSupport: '教育助人型',
  entrepreneurship: '创业探索型'
};

// 路径详细解释 - v3.0升级版（去标签化，强调能力结构）
export const PATH_DESCRIPTIONS: Record<CareerPath, Omit<CareerPathInfo, 'id'>> = {
  stable: {
    name: '稳定体制型',
    description: '该路径强调稳定性与规则适配能力,适用于对不确定性敏感度较高的人群。',
    matchReason: '你的风险承受度相对较低,同时执行能力较为稳定。这种能力结构更适合路径清晰、规则明确的环境。',
    currentFitReason: '在职业早期阶段,这类路径的优势在于:试错成本较低、能建立长期职业安全感、路径明确,成长节奏可预测。',
    difficultyReminder: '过度追求稳定可能降低探索空间,建议保留一定成长弹性。',
    requiredSkills: ['持续专注能力', '长期目标管理能力', '信息筛选与复习系统化能力']
  },
  deepSpecialist: {
    name: '专业深耕型',
    description: '强调长期专业积累与抽象能力。',
    matchReason: '你的抽象能力维度较高,同时结构能力稳定。这更适合构建长期知识壁垒。',
    currentFitReason: '在职业早期阶段,这类路径的优势在于:能建立不可替代能力、专业深度带来长期议价权。',
    difficultyReminder: '回报周期较长,需要长期耐心。',
    requiredSkills: ['深度专注能力', '长期规划能力', '专业持续输出能力']
  },
  techApplication: {
    name: '技术应用型',
    description: '强调逻辑能力与系统实现能力。',
    matchReason: '你的结构化能力与抽象能力同时较高。这类能力结构更适合技术实现与系统构建。',
    currentFitReason: '在职业早期阶段,这类路径的优势在于:能快速积累可量化成果、市场需求稳定。',
    difficultyReminder: '技术更新快,需要持续学习。',
    requiredSkills: ['技术深度', '项目实践能力', '系统架构理解能力']
  },
  productStrategy: {
    name: '产品策略型',
    description: '强调系统设计、跨领域整合与表达能力。',
    matchReason: '你的结构能力突出,同时表达能力处于可用区间。这种组合更利于参与决策与产品构建。',
    currentFitReason: '在职业早期阶段,这类路径的优势在于:能建立综合能力结构、具备向管理或创业延展空间。',
    difficultyReminder: '对项目经验与实践能力要求较高。',
    requiredSkills: ['用户洞察能力', '商业理解能力', '项目实操经验']
  },
  growthOperation: {
    name: '增长运营型',
    description: '强调执行与结果导向能力。',
    matchReason: '你的执行能力与风险承受度较高。这更适合节奏较快的市场环境。',
    currentFitReason: '在职业早期阶段,这类路径的优势在于:能快速获得实战经验、成长节奏明显。',
    difficultyReminder: '压力较大,需要保持心理韧性。',
    requiredSkills: ['数据分析能力', '用户增长思维', '抗压与复盘能力']
  },
  contentExpression: {
    name: '内容表达型',
    description: '强调表达能力与情绪感知能力。',
    matchReason: '你的表达倾向与共情能力较强。这更适合持续输出与内容构建。',
    currentFitReason: '在职业早期阶段,这类路径的优势在于:能建立个人影响力、表达能力可迁移至多个领域。',
    difficultyReminder: '收入波动性较大。',
    requiredSkills: ['持续创作能力', '内容定位能力', '数据复盘能力']
  },
  educationSupport: {
    name: '教育助人型',
    description: '强调共情与长期陪伴能力。',
    matchReason: '你的共情能力与表达能力较为突出。这类能力结构适合长期支持型角色。',
    currentFitReason: '在职业早期阶段,这类路径的优势在于:易获得价值感、职业稳定性较高。',
    difficultyReminder: '成长节奏相对平缓。',
    requiredSkills: ['专业认证或理论基础', '长期关系维护能力', '结构化表达能力']
  },
  entrepreneurship: {
    name: '创业探索型',
    description: '强调风险承担与执行能力。',
    matchReason: '你的风险承受与执行能力较高。这类结构更适合高不确定性路径。',
    currentFitReason: '在职业早期阶段,这类路径的优势在于:发展空间大、可突破既有路径。',
    difficultyReminder: '失败概率高,需要心理韧性。',
    requiredSkills: ['商业模式理解', '资源整合能力', '风险管理能力']
  }
};

// 计算用户与路径的匹配度（混合算法）
// v5.1 改进版：结合余弦相似度和核心维度匹配，解决"全正向量"问题
export function calculatePathMatch(
  userScores: DimensionScores,
  pathVector: number[]
): number {
  const dimensions: (keyof DimensionScores)[] = ['S', 'A', 'R', 'E', 'X', 'C'];

  // ===== 第1部分：余弦相似度（占40%）=====
  // 衡量整体方向的相似性
  const dot = dimensions.reduce((sum, dim, index) => {
    return sum + (userScores[dim] * pathVector[index]);
  }, 0);

  const normUser = Math.sqrt(
    dimensions.reduce((sum, dim) => sum + userScores[dim] ** 2, 0)
  );
  const normPath = Math.sqrt(
    pathVector.reduce((sum, val) => sum + val ** 2, 0)
  );

  const cosineSim = dot / (normUser * normPath);

  // ===== 第2部分：核心维度匹配度（占60%）=====
  // 只关注权重≥4的核心维度，衡量用户是否满足这些关键要求
  let coreMatch = 0;
  let coreCount = 0;

  dimensions.forEach((dim, index) => {
    const required = pathVector[index];
    if (Math.abs(required) >= 4) { // 核心维度（包括强排斥维度）
      const userScore = userScores[dim];

      if (required > 0) {
        // 正向要求：用户分数越高越好
        // 计算差距：用户分数与期望的接近程度
        const gap = Math.abs(userScore - required);
        const matchScore = Math.max(0, 1 - gap / 5); // 差距为0时得1分，差距为5时得0分
        coreMatch += matchScore;
      } else {
        // 负向要求（排斥）：用户分数越低越好
        // required是负数，例如-5表示"风险承受度越低越好"
        const expectedLow = 5 + required; // -5 → 0, -3 → 2
        const gap = Math.abs(userScore - expectedLow);
        const matchScore = Math.max(0, 1 - gap / 5);
        coreMatch += matchScore;
      }

      coreCount++;
    }
  });

  const coreScore = coreCount > 0 ? coreMatch / coreCount : 0.5;

  // ===== 综合得分 =====
  // 余弦相似度范围 [-1, 1] → 转换到 [0, 1]
  const normalizedCosine = (cosineSim + 1) / 2;

  // 混合：余弦相似度40% + 核心维度匹配60%
  const finalScore = normalizedCosine * 0.4 + coreScore * 0.6;

  return finalScore;
}

// 计算匹配度百分比
export function calculateMatchPercent(score: number): number {
  // calculatePathMatch现在返回 [0, 1] 范围的混合得分
  // 直接转换为百分比
  return Math.round(score * 100);
}
