import {
  Dimension,
  DimensionScores,
  RawScores,
  DecisionStyle,
  SelfAwareness,
  CareerPath,
  PathMatchResult,
  TestResult,
  UserInfo,
  ScenarioAnswer,
  CareerPathData,
  VetoRule
} from '@/types';
import { PATH_DATA } from '@/data/paths';
import { ACTION_PLANS } from '@/data/actionPlans';
import { generatePersonalizedActionPlan, addAbilityBasedTasks } from '@/lib/dynamicActionPlan';

// ============================================================================
// v5.0 核心算法：现实vs意愿 + 决策风格 + 核心动机 + 一票否决
// ============================================================================

/**
 * 计算加权维度得分（现实30% + 意愿70%）
 * 这是v5.0的核心创新：发现被环境压抑的潜力
 */
export function calculateWeightedScores(rawScores: RawScores): DimensionScores {
  const dimensions: Dimension[] = ['S', 'A', 'R', 'E', 'X', 'C'];
  const result: Partial<DimensionScores> = {};

  dimensions.forEach(dim => {
    const realScore = rawScores[`${dim}_real` as keyof RawScores];
    const idealScore = rawScores[`${dim}_ideal` as keyof RawScores];

    // 加权公式：现实30% + 意愿70%
    // 理由：当前行为可能被环境压抑（如工科生压抑表达倾向），真实意愿更能反映潜力
    const weighted = realScore * 0.3 + idealScore * 0.7;

    result[dim] = Math.round(weighted * 10) / 10;
  });

  return result as DimensionScores;
}

/**
 * 计算自我认知度
 * 通过现实与意愿的差距来衡量用户对自己的了解程度
 */
export function calculateSelfAwareness(rawScores: RawScores): SelfAwareness {
  const dimensions: Dimension[] = ['S', 'A', 'R', 'E', 'X', 'C'];
  const dimensionsData: SelfAwareness['dimensions'] = {} as SelfAwareness['dimensions'];

  let totalGap = 0;

  dimensions.forEach(dim => {
    const realScore = rawScores[`${dim}_real` as keyof RawScores];
    const idealScore = rawScores[`${dim}_ideal` as keyof RawScores];
    const gap = Math.abs(realScore - idealScore);

    totalGap += gap;

    // 认知度分级
    let awareness: 'low' | 'medium' | 'high';
    if (gap <= 1) {
      awareness = 'high';      // 现实与意愿一致，认知度高
    } else if (gap <= 2.5) {
      awareness = 'medium';    // 有一定差距，认知度中等
    } else {
      awareness = 'low';       // 差距很大，可能还没发现潜力
    }

    dimensionsData[dim] = { gap, awareness };
  });

  // 总体认知度：平均差距越小，认知度越高
  const avgGap = totalGap / dimensions.length;
  const overallScore = Math.max(0, 1 - avgGap / 5);  // 转换到[0,1]

  return {
    score: Math.round(overallScore * 100) / 100,
    dimensions: dimensionsData
  };
}

/**
 * 从深度情境题中提取决策风格
 * 分析用户在真实场景中的决策倾向
 */
export function calculateDecisionStyle(scenarioAnswers: ScenarioAnswer[]): DecisionStyle {
  // 初始化各风格得分
  const scores = {
    conservative: 0,
    flexible: 0,
    adventurous: 0,
    pragmatic: 0
  };

  // 根据情境题答案累加得分
  // 这里需要根据具体的情境题设计来实现
  // 暂时返回默认值，后续在问卷设计中完善
  scenarioAnswers.forEach(answer => {
    // TODO: 根据scenarioId和choice来分配得分
    // 例如：选择"稳定工作"会增加conservative得分
    // 选择"创业机会"会增加adventurous得分
  });

  return scores;
}

/**
 * 计算单个维度的匹配度
 */
function calculateDimensionMatch(
  userScore: number,
  pathRequired: number
): number {
  const gap = Math.abs(userScore - pathRequired);

  // 差距为0时得1分，差距为8时得0分
  return Math.max(0, 1 - gap / 8);
}

/**
 * 计算六维度整体匹配度（占60%权重）
 */
function calculateDimensionsMatch(
  userScores: DimensionScores,
  pathDimensions: [number, number, number, number, number, number]
): number {
  const dimensions: Dimension[] = ['S', 'A', 'R', 'E', 'X', 'C'];
  let totalMatch = 0;

  dimensions.forEach((dim, index) => {
    const userScore = userScores[dim];
    const pathRequired = pathDimensions[index];

    // 对于负值（排斥维度），需要特殊处理
    if (pathRequired < 0) {
      // pathRequired是负数，例如-8表示"风险承受度越低越好"
      // 期望的用户得分 = 8 + pathRequired
      const expectedLow = 8 + pathRequired;  // -8 → 0, -6 → 2
      const gap = Math.abs(userScore - expectedLow);
      const matchScore = Math.max(0, 1 - gap / 8);
      totalMatch += matchScore;
    } else {
      // 正常维度
      totalMatch += calculateDimensionMatch(userScore, pathRequired);
    }
  });

  return totalMatch / dimensions.length;
}

/**
 * 计算决策风格匹配度（占25%权重）
 */
function calculateStyleMatch(
  userStyle: DecisionStyle,
  pathIdealStyle: DecisionStyle
): number {
  const styles = ['conservative', 'flexible', 'adventurous', 'pragmatic'] as const;

  let totalMatch = 0;
  styles.forEach(style => {
    const userScore = userStyle[style];
    const pathIdeal = pathIdealStyle[style];

    // 决策风格的匹配度（差距越小越好）
    const gap = Math.abs(userScore - pathIdeal);
    const matchScore = Math.max(0, 1 - gap / 10);
    totalMatch += matchScore;
  });

  return totalMatch / styles.length;
}

/**
 * 计算核心动机匹配度（占10%权重）
 */
function calculateMotivationMatch(
  userMotivations: string[],
  pathMotivations: string[]
): number {
  if (!userMotivations || userMotivations.length === 0) {
    return 0.5;  // 默认中等匹配
  }

  // 计算用户动机与路径动机的重叠度
  const overlap = userMotivations.filter(m => pathMotivations.includes(m)).length;
  const matchRate = overlap / Math.max(userMotivations.length, pathMotivations.length);

  return matchRate;
}

/**
 * 应用一票否决规则
 * 如果用户触发了路径的强排斥维度，则大幅降低匹配度
 */
function applyVetoRules(
  baseScore: number,
  userScores: DimensionScores,
  vetoRules: VetoRule[]
): number {
  let penalty = 0;

  vetoRules.forEach(rule => {
    const userScore = userScores[rule.dimension];

    if (userScore >= rule.threshold) {
      penalty += rule.penalty;
    }
  });

  return Math.max(0, baseScore - penalty);
}

/**
 * 计算用户与路径的综合匹配度
 *
 * 算法：
 * 1. 六维度匹配（60%）
 * 2. 决策风格匹配（25%）
 * 3. 核心动机匹配（10%）
 * 4. 自我认知度加分（5%）
 * 5. 应用一票否决规则
 */
export function calculatePathMatch(
  userScores: DimensionScores,
  userStyle: DecisionStyle,
  userMotivations: string[],
  selfAwareness: SelfAwareness,
  pathData: CareerPathData
): number {
  // 1. 六维度匹配（60%）
  const dimensionsMatch = calculateDimensionsMatch(userScores, pathData.dimensions);

  // 2. 决策风格匹配（25%）
  const styleMatch = calculateStyleMatch(userStyle, pathData.idealStyle);

  // 3. 核心动机匹配（10%）
  const motivationMatch = calculateMotivationMatch(userMotivations, pathData.motivations);

  // 4. 自我认知度加分（5%）
  // 认知度越高，说明用户越了解自己，结果越可信
  const awarenessBonus = selfAwareness.score * 0.05;

  // 综合得分
  let finalScore = dimensionsMatch * 0.6
                + styleMatch * 0.25
                + motivationMatch * 0.1
                + awarenessBonus;

  // 5. 应用一票否决规则
  finalScore = applyVetoRules(finalScore, userScores, pathData.vetoRules);

  // 6. 增加区分度：使用平方根函数拉大差距
  finalScore = Math.sqrt(finalScore);

  return finalScore;
}

/**
 * 获取所有路径的匹配结果并排序
 */
export function getAllPathMatches(
  dimensionScores: DimensionScores,
  decisionStyle: DecisionStyle,
  userMotivations: string[],
  selfAwareness: SelfAwareness
): PathMatchResult[] {
  const paths = Object.keys(PATH_DATA) as CareerPath[];

  const results: PathMatchResult[] = paths.map(pathId => {
    const pathData = PATH_DATA[pathId];
    const score = calculatePathMatch(
      dimensionScores,
      decisionStyle,
      userMotivations,
      selfAwareness,
      pathData
    );
    const matchPercent = Math.round(score * 100);

    return {
      pathId,
      score,
      matchPercent
    };
  });

  // 按分数降序排序
  return results.sort((a, b) => b.score - a.score);
}

/**
 * 生成完整测试结果（v5.0重构版）
 */
export function generateTestResult(
  userInfo: UserInfo,
  rawScores: RawScores,
  scenarioAnswers: ScenarioAnswer[]
): TestResult {
  // 1. 计算加权维度得分（现实30% + 意愿70%）
  const dimensionScores = calculateWeightedScores(rawScores);

  // 2. 计算自我认知度
  const selfAwareness = calculateSelfAwareness(rawScores);

  // 3. 计算决策风格
  const decisionStyle = calculateDecisionStyle(scenarioAnswers);

  // 4. 获取所有路径匹配结果
  const pathMatches = getAllPathMatches(
    dimensionScores,
    decisionStyle,
    userInfo.coreMotivations || [],
    selfAwareness
  );

  // 5. 主路径（得分最高）
  const primaryPath = pathMatches[0];

  // 6. 可演化路径（得分第二，且与前一名差距<20%）
  let evolvablePath: PathMatchResult | undefined;
  if (pathMatches.length > 1) {
    const scoreGap = pathMatches[0].score - pathMatches[1].score;
    if (scoreGap < pathMatches[0].score * 0.2) {
      evolvablePath = pathMatches[1];
    }
  }

  // 7. 不优先路径（得分最低的两个）
  const notPriorityPaths = pathMatches.slice(-2);

  // 8. 生成个性化30天行动清单
  let personalizedActionPlan = generatePersonalizedActionPlan(
    userInfo,
    primaryPath.pathId,
    dimensionScores
  );

  // 9. 根据能力得分添加额外提升任务
  personalizedActionPlan = addAbilityBasedTasks(
    personalizedActionPlan,
    dimensionScores
  );

  return {
    id: `test_${Date.now()}`,
    timestamp: Date.now(),
    userInfo,
    rawScores,
    dimensionScores,
    decisionStyle,
    selfAwareness,
    primaryPath,
    evolvablePath,
    notPriorityPaths,
    actionPlan: personalizedActionPlan
  };
}

/**
 * 生成能力描述文字（辅助函数）
 */
export function generateAbilityDescription(scores: DimensionScores): string {
  const { S, A, R, E, X, C } = scores;

  // 找出最高的两个维度
  const sortedDims = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2)
    .map(([dim]) => dim) as Dimension[];

  const dimNames: Record<Dimension, string> = {
    S: '结构化',
    A: '抽象逻辑',
    R: '风险承受',
    E: '表达',
    X: '执行抗压',
    C: '共情'
  };

  const top1 = sortedDims[0];
  const top2 = sortedDims[1];

  if (scores[top1] >= 4 && scores[top2] >= 4) {
    return `你的能力结构呈现出"${dimNames[top1]}+${dimNames[top2]}"双强的特征，这意味着你兼具这两种能力优势。`;
  } else if (scores[top1] >= 4) {
    return `你的能力结构呈现出"${dimNames[top1]}"能力突出的特征，这是你的核心优势。`;
  } else {
    return `你的能力结构相对均衡，各项能力发展较为平均。`;
  }
}
