import { Dimension, DimensionScores, CareerPath, PathMatchResult, TestResult, UserInfo } from '@/types';
import { PATH_VECTORS, PATH_NAMES, PATH_DESCRIPTIONS, calculatePathMatch, calculateMatchPercent } from '@/data/paths';
import { ACTION_PLANS } from '@/data/actionPlans';
import { QUESTIONS, CONFLICT_QUESTIONS } from '@/data/questions';
import { PATH_DETAILS } from '@/data/pathDetails';

// 计算维度平均分 (支持反向题)
export function calculateDimensionScores(answers: Record<string, number>): DimensionScores {
  const scores: Record<string, number[]> = {
    S: [], A: [], R: [], E: [], X: [], C: []
  };

  // 收集每个维度的所有答案，并处理反向题
  Object.entries(answers).forEach(([questionId, score]) => {
    const dimension = questionId.charAt(0) as Dimension;
    if (scores[dimension]) {
      // 查找对应的题目配置
      const question = QUESTIONS.find(q => q.id === questionId);

      // 如果是反向题，转换分数 (6 - 原分数)
      const finalScore = question?.reverse ? (6 - score) : score;

      scores[dimension].push(finalScore);
    }
  });

  // 计算平均值
  const result: DimensionScores = {
    S: 0, A: 0, R: 0, E: 0, X: 0, C: 0
  };

  Object.entries(scores).forEach(([dim, values]) => {
    const sum = values.reduce((a, b) => a + b, 0);
    result[dim as Dimension] = Math.round((sum / values.length) * 10) / 10; // 保留一位小数
  });

  return result;
}

// 获取所有路径的匹配结果并排序
export function getAllPathMatches(userScores: DimensionScores): PathMatchResult[] {
  const paths = Object.keys(PATH_VECTORS) as CareerPath[];

  const results: PathMatchResult[] = paths.map(pathId => {
    const vector = PATH_VECTORS[pathId];
    const score = calculatePathMatch(userScores, vector);
    const matchPercent = calculateMatchPercent(score);

    return {
      pathId,
      score,
      matchPercent
    };
  });

  // 按分数降序排序
  return results.sort((a, b) => b.score - a.score);
}

// 生成完整测试结果 (支持冲突题)
export function generateTestResult(
  userInfo: UserInfo,
  answers: Record<string, number>,
  conflictAnswers?: Record<string, string> // 新增冲突题答案参数
): TestResult {
  // 1. 计算维度得分
  let dimensionScores = calculateDimensionScores(answers);

  // 2. 如果有冲突题答案，应用冲突题加分
  if (conflictAnswers) {
    CONFLICT_QUESTIONS.forEach(conflictQ => {
      const selectedOptionId = conflictAnswers[conflictQ.id];
      const selectedOption = conflictQ.options.find(opt => opt.id === selectedOptionId);

      if (selectedOption) {
        const dim = selectedOption.dimension;
        dimensionScores[dim] += selectedOption.bonus;
      }
    });

    // 确保分数在合理范围内 [0, 5]
    Object.keys(dimensionScores).forEach(dim => {
      dimensionScores[dim as keyof DimensionScores] = Math.max(0, Math.min(5, dimensionScores[dim as keyof DimensionScores]));
    });
  }

  // 3. 获取所有路径匹配结果
  const pathMatches = getAllPathMatches(dimensionScores);

  // 4. 主路径(得分最高)
  const primaryPath = pathMatches[0];

  // 5. 可演化路径(得分第二)
  const evolvablePath = pathMatches[1];

  // 6. 不优先路径(得分最低的两个)
  const notPriorityPaths = pathMatches.slice(-2);

  // 7. 30天行动清单
  const actionPlan = ACTION_PLANS[primaryPath.pathId];

  return {
    id: `test_${Date.now()}`,
    timestamp: Date.now(),
    userInfo,
    dimensionScores,
    primaryPath,
    evolvablePath,
    notPriorityPaths,
    actionPlan
  };
}

// 生成能力描述文字
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
    return `你的能力结构呈现出"${dimNames[top1]}+${dimNames[top2]}"双强的特征,这意味着你兼具这两种能力优势。`;
  } else if (scores[top1] >= 4) {
    return `你的能力结构呈现出"${dimNames[top1]}"能力突出的特征,这是你的核心优势。`;
  } else {
    return `你的能力结构相对均衡,各项能力发展较为平均。`;
  }
}

// 生成动态差距分析
export function generateGapAnalysis(pathId: CareerPath, userScores: DimensionScores): string[] {
  const pathDetail = PATH_DETAILS[pathId];
  const gaps: string[] = [];

  pathDetail.gapAnalysis.forEach(gap => {
    const score = userScores[gap.dimension];
    if (score < gap.threshold) {
      gaps.push(gap.advice);
    }
  });

  return gaps;
}
