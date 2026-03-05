// 核心维度类型
export type Dimension = 'S' | 'A' | 'R' | 'E' | 'X' | 'C';

// 维度名称映射
export const DIMENSION_NAMES: Record<Dimension, string> = {
  S: '结构化能力',
  A: '抽象逻辑能力',
  R: '风险承受度',
  E: '表达倾向',
  X: '执行抗压能力',
  C: '共情能力'
};

// 问卷题目类型
export interface Question {
  id: string;
  dimension: Dimension;
  text: string;
  reverse?: boolean;
}

// ========== v5.0 新问卷类型 ==========

// 基础信息题目
export interface BasicInfoQuestion {
  id: string;
  type: 'grade' | 'major' | 'majorInterest' | 'targetIndustry' | 'planPostgraduate' | 'postgraduateReason' | 'willingToDoPhD' | 'currentConfusion';
  text: string;
  required: boolean;
  options?: { value: string; label: string; emoji?: string }[];
}

// 核心动机探索题目
export interface MotivationQuestion {
  id: string;
  type: 'targetIndustry' | 'coreValues' | 'willingToChangeMajor' | 'selfPerceivedPotential';
  text: string;
  required: boolean;
  options?: { value: string; label: string; description?: string }[];
}

// 维度评估题目（每维度5题：现实行为 + 真实意愿）
export interface DimensionQuestion {
  id: string;
  dimension: Dimension;
  type: 'reality' | 'ideal';  // reality=现实行为, ideal=真实意愿
  category: 'behavior' | 'willingness' | 'depth' | 'growth' | 'values';
  text: string;
  reverse?: boolean;
}

// 深度情境题
export interface ScenarioQuestion {
  id: string;
  text: string;
  context: string;  // 情境背景描述
  options: {
    id: string;
    text: string;
    styleImplications: {
      conservative?: number;
      flexible?: number;
      adventurous?: number;
      pragmatic?: number;
    };
  }[];
}

// 反思题
export interface ReflectionQuestion {
  id: string;
  type: 'realization' | 'action';
  text: string;
  placeholder: string;
  multiline?: boolean;
}

// 用户基础信息
export interface UserInfo {
  grade: string;
  major: string;
  majorInterest?: 'very' | 'neutral' | 'not';  // 对本专业的兴趣程度
  targetIndustry?: string;                      // 最想从事的工作（13个选项之一）
  planPostgraduate: boolean;
  postgraduateReason?: string;                  // 考研原因（如果planPostgraduate=true）
  willingToDoPhD?: boolean;                     // 是否愿意读博
  currentConfusion?: string;                    // 当前困惑（可选）
  coreMotivations?: string[];                   // 核心价值观排序（前3位）
  willingToChangeMajor?: boolean;               // 是否愿意跨专业发展
  selfPerceivedPotential?: string;              // 自我认知的潜力方向
}

// 维度得分（现实行为 + 真实意愿的加权结果）
export interface DimensionScores {
  S: number;
  A: number;
  R: number;
  E: number;
  X: number;
  C: number;
}

// 原始得分（分离现实和意愿）
export interface RawScores {
  // 现实行为得分
  S_real: number;
  A_real: number;
  R_real: number;
  E_real: number;
  X_real: number;
  C_real: number;

  // 真实意愿得分
  S_ideal: number;
  A_ideal: number;
  R_ideal: number;
  E_ideal: number;
  X_ideal: number;
  C_ideal: number;
}

// 决策风格
export interface DecisionStyle {
  conservative: number;  // 保守型：追求确定性和规则
  flexible: number;      // 灵活型：适应变化，平衡风险
  adventurous: number;   // 冒险型：主动拥抱不确定性
  pragmatic: number;     // 务实型：结果导向，效率优先
}

// 深度情境题答案
export interface ScenarioAnswer {
  scenarioId: string;
  choice: string;
  reasoning?: string;
}

// 自我认知度
export interface SelfAwareness {
  score: number;           // 总体认知度 [0, 1]
  dimensions: {
    [key in Dimension]: {
      gap: number;         // 现实与意愿的差距
      awareness: 'low' | 'medium' | 'high';
    };
  };
}

// 职业路径类型
export type CareerPath =
  | 'academic'           // 学术研究方向
  | 'stable'              // 稳定体制方向
  | 'tech'                // 技术方向
  | 'professional'        // 专业服务方向
  | 'sales'               // 市场销售方向
  | 'education'           // 教育咨询方向
  | 'creative'            // 内容创意方向
  | 'management';         // 综合管理方向

// 一票否决规则
export interface VetoRule {
  dimension: Dimension;
  threshold: number;      // 用户得分阈值
  penalty: number;        // 惩罚比例 [0, 1]
  description: string;    // 触发原因说明
}

// 学历要求
export interface DegreeRequirement {
  required: boolean;      // 是否必须特定学历
  recommended: boolean;   // 是否推荐
  reason: string;         // 原因说明
}

// 职业路径完整数据
export interface CareerPathData {
  id: CareerPath;
  name: string;
  description: string;

  // 六维度理想特征向量 [S, A, R, E, X, C]
  dimensions: [number, number, number, number, number, number];

  // 理想决策风格
  idealStyle: {
    conservative: number;
    flexible: number;
    adventurous: number;
    pragmatic: number;
  };

  // 匹配的核心动机
  motivations: string[];

  // 一票否决规则
  vetoRules: VetoRule[];

  // 学历要求
  degreeRequirement: DegreeRequirement;
}

// 职业路径信息
export interface CareerPathInfo {
  id: CareerPath;
  name: string;
  description: string;
  matchReason: string;
  currentFitReason: string;
  difficultyReminder: string;
  requiredSkills: string[];
}

// 路径匹配结果
export interface PathMatchResult {
  pathId: CareerPath;
  score: number;
  matchPercent: number;
}

// 完整测试结果
export interface TestResult {
  id: string;
  timestamp: number;

  // 用户信息
  userInfo: UserInfo;

  // 评估数据
  rawScores: RawScores;              // 原始得分（现实+意愿）
  dimensionScores: DimensionScores;  // 加权后的最终得分
  decisionStyle: DecisionStyle;      // 决策风格
  selfAwareness: SelfAwareness;      // 自我认知度

  // 路径匹配结果
  primaryPath: PathMatchResult;      // 主推荐路径
  evolvablePath?: PathMatchResult;   // 可演化路径
  notPriorityPaths: PathMatchResult[];  // 非优先路径

  // 行动计划
  actionPlan: WeeklyAction[];

  // AI生成的个性化内容
  personalizedSummary?: string;      // 困境解答 + 总结合并
  personalizedAdvice?: string;       // 具体建议
}

// 30天行动清单
export interface WeeklyAction {
  week: number;
  title: string;
  tasks: string[];
  completed?: boolean;
}

// 本地存储键
export const STORAGE_KEYS = {
  PROGRESS: 'career_test_progress',
  RESULTS: 'career_test_results'
} as const;

// 测试进度
export interface TestProgress {
  currentSection?: 'basic' | 'motivation' | 'dimensions' | 'scenarios' | 'reflection';
  currentQuestion: number;
  answers: Record<string, number>;

  // 分section保存答案（v5.0新增）
  basicInfo?: Partial<UserInfo>;
  dimensionAnswers?: {
    dimension: Dimension;
    realityAnswers: number[];   // 现实行为题答案
    idealAnswers: number[];     // 真实意愿题答案
  }[];
  scenarioAnswers?: ScenarioAnswer[];
  reflectionAnswers?: Record<string, string>;

  // 向后兼容（旧版本）
  userInfo?: UserInfo;
}
