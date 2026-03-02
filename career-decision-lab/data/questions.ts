import { Question } from '@/types';

// 所有问卷题目 (36题, 每个维度6题) - v3.0升级版：情境化行为决策题
export const QUESTIONS: Question[] = [
  // 结构化能力 (S) - 6题
  {
    id: 'S01',
    dimension: 'S',
    text: '当接到一个没有明确说明的任务时，我会先自己梳理出执行步骤。'
  },
  {
    id: 'S02',
    dimension: 'S',
    text: '在讨论问题时，我更关注"问题结构"而不是结论本身。'
  },
  {
    id: 'S03',
    dimension: 'S',
    text: '如果信息混乱，我会主动分类整理再继续。'
  },
  {
    id: 'S04',
    dimension: 'S',
    text: '面对多个选项时，我习惯画出逻辑对比再做决定。'
  },
  {
    id: 'S05',
    dimension: 'S',
    text: '即使时间紧迫，我也希望先理清思路再行动。',
    reverse: true
  },
  {
    id: 'S06',
    dimension: 'S',
    text: '如果没有清晰结构，我会觉得难以推进任务。'
  },

  // 抽象逻辑能力 (A) - 6题
  {
    id: 'A01',
    dimension: 'A',
    text: '当别人讲一个案例时，我会思考背后的通用规律。'
  },
  {
    id: 'A02',
    dimension: 'A',
    text: '我习惯从具体问题中总结出更一般的逻辑。'
  },
  {
    id: 'A03',
    dimension: 'A',
    text: '面对一个复杂概念，我愿意花时间理解其原理。'
  },
  {
    id: 'A04',
    dimension: 'A',
    text: '阅读理论内容时，我会关注推理过程而非结果。'
  },
  {
    id: 'A05',
    dimension: 'A',
    text: '在分析问题时，我会尝试找到"底层原因"。'
  },
  {
    id: 'A06',
    dimension: 'A',
    text: '当别人只给结论时，我会想知道推导逻辑。'
  },

  // 风险承受度 (R) - 6题
  {
    id: 'R01',
    dimension: 'R',
    text: '如果一份机会不稳定但成长快，我愿意尝试。'
  },
  {
    id: 'R02',
    dimension: 'R',
    text: '面对职业不确定性，我更倾向主动探索而不是等待稳定。'
  },
  {
    id: 'R03',
    dimension: 'R',
    text: '如果失败概率存在，我仍愿意承担尝试成本。'
  },
  {
    id: 'R04',
    dimension: 'R',
    text: '我不排斥未来多次调整职业方向。'
  },
  {
    id: 'R05',
    dimension: 'R',
    text: '我更希望一次选择就稳定下来，不再改变。',
    reverse: true
  },
  {
    id: 'R06',
    dimension: 'R',
    text: '面对高回报但高波动的路径，我不会立刻回避。'
  },

  // 表达倾向 (E) - 6题
  {
    id: 'E01',
    dimension: 'E',
    text: '在团队讨论时，我通常会主动表达看法。'
  },
  {
    id: 'E02',
    dimension: 'E',
    text: '当我理解一个问题后，我愿意向他人讲解。'
  },
  {
    id: 'E03',
    dimension: 'E',
    text: '我不排斥公开表达自己的观点。'
  },
  {
    id: 'E04',
    dimension: 'E',
    text: '当别人有误解时，我会主动澄清说明。'
  },
  {
    id: 'E05',
    dimension: 'E',
    text: '如果没有人点名，我通常不会主动发言。',
    reverse: true
  },
  {
    id: 'E06',
    dimension: 'E',
    text: '我愿意通过文字或内容形式持续输出想法。'
  },

  // 执行抗压能力 (X) - 6题
  {
    id: 'X01',
    dimension: 'X',
    text: '当任务压力大时，我仍能保持行动节奏。'
  },
  {
    id: 'X02',
    dimension: 'X',
    text: '即使计划不完美，我也愿意先开始执行。'
  },
  {
    id: 'X03',
    dimension: 'X',
    text: '面对高强度工作，我可以持续投入一段时间。'
  },
  {
    id: 'X04',
    dimension: 'X',
    text: '当目标明确时，我更关注达成结果。'
  },
  {
    id: 'X05',
    dimension: 'X',
    text: '即使工作重复，我也能稳定完成。'
  },
  {
    id: 'X06',
    dimension: 'X',
    text: '在时间紧迫的情况下，我不会轻易放弃任务。'
  },

  // 共情能力 (C) - 6题
  {
    id: 'C01',
    dimension: 'C',
    text: '当同伴情绪低落时，我能察觉到变化。'
  },
  {
    id: 'C02',
    dimension: 'C',
    text: '在表达观点时，我会考虑对方的感受。'
  },
  {
    id: 'C03',
    dimension: 'C',
    text: '如果别人遇到困难，我愿意给予支持。'
  },
  {
    id: 'C04',
    dimension: 'C',
    text: '我对人际关系变化较为敏感。'
  },
  {
    id: 'C05',
    dimension: 'C',
    text: '在沟通中，我会注意语气是否合适。'
  },
  {
    id: 'C06',
    dimension: 'C',
    text: '我愿意长期陪伴他人成长。'
  }
];

// Likert量表选项 - v3.0更新文案
export const LIKERT_OPTIONS = [
  { value: 1, label: '非常不像我' },
  { value: 2, label: '不太像我' },
  { value: 3, label: '一般' },
  { value: 4, label: '比较像我' },
  { value: 5, label: '非常像我' }
];

// 冲突型强制选择题 - v3.1新增
export interface ConflictQuestion {
  id: string;
  text: string;
  options: {
    id: string;
    text: string;
    dimension: keyof DimensionScores; // 使用Dimension的key
    bonus: number; // 加分值，建议0.5或1
  }[];
}

import { DimensionScores } from '@/types';

export const CONFLICT_QUESTIONS: ConflictQuestion[] = [
  {
    id: 'conflict_1',
    text: '当面对一个模糊任务时，你更可能：',
    options: [
      {
        id: 'A',
        text: '先搭建清晰框架再行动',
        dimension: 'S',
        bonus: 0.5
      },
      {
        id: 'B',
        text: '直接开始尝试，在过程中调整',
        dimension: 'X',
        bonus: 0.5
      }
    ]
  },
  {
    id: 'conflict_2',
    text: '如果必须选择：',
    options: [
      {
        id: 'A',
        text: '稳定但成长慢的路径',
        dimension: 'R',
        bonus: -0.5 // 降低风险承受度
      },
      {
        id: 'B',
        text: '有风险但成长快的路径',
        dimension: 'R',
        bonus: 0.5
      }
    ]
  },
  {
    id: 'conflict_3',
    text: '在一个团队项目中，你更愿意承担：',
    options: [
      {
        id: 'A',
        text: '对外表达与沟通',
        dimension: 'E',
        bonus: 0.5
      },
      {
        id: 'B',
        text: '深度思考与逻辑分析',
        dimension: 'A',
        bonus: 0.5
      }
    ]
  },
  {
    id: 'conflict_4',
    text: '当出现冲突时，你更倾向：',
    options: [
      {
        id: 'A',
        text: '优先考虑关系与感受',
        dimension: 'C',
        bonus: 0.5
      },
      {
        id: 'B',
        text: '优先达成目标结果',
        dimension: 'X',
        bonus: 0.5
      }
    ]
  }
];
