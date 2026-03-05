/**
 * GLM (智谱AI) API 集成
 * 用于生成个性化职业建议
 */

export interface GLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GLMRequest {
  model: string;
  messages: GLMMessage[];
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
}

export interface GLMResponse {
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface GLMError {
  error: {
    message: string;
    type: string;
    code?: string;
  };
}

/**
 * 调用GLM API
 */
export async function callGLMAPI(
  messages: GLMMessage[],
  options?: {
    temperature?: number;
    maxTokens?: number;
  }
): Promise<string> {
  const apiKey = process.env.GLM_API_KEY;

  if (!apiKey) {
    console.warn('GLM_API_KEY not found, returning mock response');
    return getMockResponse(messages);
  }

  const requestBody: GLMRequest = {
    model: 'glm-4-flash', // 使用快速响应模型
    messages,
    temperature: options?.temperature || 0.7,
    top_p: 0.9,
    max_tokens: options?.maxTokens || 2000
  };

  try {
    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData: GLMError = await response.json();
      throw new Error(`GLM API error: ${errorData.error.message}`);
    }

    const data: GLMResponse = await response.json();

    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content;
    }

    throw new Error('No response from GLM API');
  } catch (error) {
    console.error('GLM API call failed:', error);

    // 如果API调用失败，返回模拟响应
    return getMockResponse(messages);
  }
}

/**
 * 生成个性化困境解答和总结
 */
export async function generatePersonalizedSummary(params: {
  userConfusion?: string;
  primaryPath: string;
  primaryPathPercent: number;
  dimensionScores: Record<string, number>;
  selfAwareness: number;
}): Promise<string> {
  const { userConfusion, primaryPath, primaryPathPercent, dimensionScores, selfAwareness } = params;

  const messages: GLMMessage[] = [
    {
      role: 'system',
      content: `你是一位专业的职业规划顾问，擅长帮助大学生发现自身潜力和明确职业方向。

你的任务：
1. 如果用户有困惑，用温暖、专业的语言解答（不超过150字）
2. 总结本次测试的核心发现（不超过150字）
3. 语言要简洁、有温度、有启发性
4. 不要使用"首先"、"其次"、"最后"等套话`
    },
    {
      role: 'user',
      content: `用户情况：
${userConfusion ? `当前困惑：${userConfusion}` : '用户未填写困惑'}

测试结果：
- 主推荐路径：${primaryPath}（匹配度${primaryPathPercent}%）
- 能力得分：S=${dimensionScores.S}, A=${dimensionScores.A}, R=${dimensionScores.R}, E=${dimensionScores.E}, X=${dimensionScores.X}, C=${dimensionScores.C}
- 自我认知度：${(selfAwareness * 100).toFixed(0)}%

请提供：
1. 困境解答（如有）
2. 核心发现总结`
    }
  ];

  return await callGLMAPI(messages, { maxTokens: 800 });
}

/**
 * 生成个性化具体建议
 */
export async function generatePersonalizedAdvice(params: {
  primaryPath: string;
  dimensionScores: Record<string, number>;
  userInfo: {
    grade: string;
    major: string;
    planPostgraduate?: boolean;
    majorInterest?: string;
  };
}): Promise<string> {
  const { primaryPath, dimensionScores, userInfo } = params;

  const messages: GLMMessage[] = [
    {
      role: 'system',
      content: `你是一位资深的职业规划顾问，专门为大学生提供职业发展建议。

你的任务：
1. 基于${primaryPath}方向，给出3-5条具体可行的建议
2. 建议要符合用户的年级和专业背景
3. 每条建议要具体、可操作（例如："尝试XX方向的实习"，而不是"积累经验"）
4. 控制在200字以内`
    },
    {
      role: 'user',
      content: `用户背景：
- 年级：${userInfo.grade}
- 专业：${userInfo.major}
- 专业兴趣度：${userInfo.majorInterest || '未填写'}
- 考研计划：${userInfo.planPostgraduate ? '是' : '否'}

能力评估：
- S(结构化): ${dimensionScores.S}
- A(抽象逻辑): ${dimensionScores.A}
- R(风险承受): ${dimensionScores.R}
- E(表达): ${dimensionScores.E}
- X(执行抗压): ${dimensionScores.X}
- C(共情): ${dimensionScores.C}

推荐方向：${primaryPath}

请给出3-5条具体建议。`
    }
  ];

  return await callGLMAPI(messages, { maxTokens: 600 });
}

/**
 * 生成自我反思引导
 */
export async function generateReflectionPrompt(params: {
  primaryPath: string;
  evolvablePath?: string;
  selfAwareness: number;
  dimensionGaps: Array<{ dimension: string; gap: number }>;
}): Promise<string> {
  const { primaryPath, evolvablePath, selfAwareness, dimensionGaps } = params;

  const messages: GLMMessage[] = [
    {
      role: 'system',
      content: `你是一位擅长引导自我认知的职业教练。

你的任务：
1. 帮助用户通过测试结果发现自我
2. 提出2-3个引导性问题，促使用户思考
3. 语言要温和、有启发性，不要说教
4. 控制在150字以内`
    },
    {
      role: 'user',
      content: `用户测试结果：
- 主推荐路径：${primaryPath}
${evolvablePath ? `- 可演化路径：${evolvablePath}` : ''}
- 自我认知度：${(selfAwareness * 100).toFixed(0)}%
- 现实与意愿差距较大的维度：${dimensionGaps.map(g => g.dimension).join(', ') || '无'}

请提出引导性问题，帮助用户更好地认识自己。`
    }
  ];

  return await callGLMAPI(messages, { maxTokens: 500 });
}

/**
 * Mock响应（当API未配置或调用失败时使用）
 */
function getMockResponse(messages: GLMMessage[]): string {
  const lastUserMessage = messages.filter(m => m.role === 'user').pop();

  if (!lastUserMessage) {
    return '测试已完成，建议你根据自己的实际情况，制定具体的行动计划。';
  }

  const content = lastUserMessage.content.toLowerCase();

  // 根据用户消息内容返回相应的mock响应
  if (content.includes('困惑') || content.includes('迷茫')) {
    return '你的困惑很多大学生都有，这很正常。关键是通过这次测试，你开始认真思考自己的未来了。记住，职业规划不是一次性的决定，而是一个持续探索的过程。';
  }

  if (content.includes('建议') || content.includes('具体')) {
    return '建议你：1) 尝试相关方向的实习，亲身体验；2) 与该行业的学长学姐交流，了解真实情况；3) 关注行业动态和招聘信息；4) 参加相关讲座或活动，拓展认知。';
  }

  if (content.includes('引导') || content.includes('思考')) {
    return '你可以思考：1) 这个推荐方向符合你内心的期待吗？2) 你在哪些方面还没发挥出潜力？3) 接下来一个月，你愿意尝试什么小行动来探索这个方向？';
  }

  return '测试已完成。建议你结合自己的实际情况，制定适合自己的行动计划。记住，最好的规划是行动本身。';
}

/**
 * 检查GLM API是否可用
 */
export function isGLMAPIAvailable(): boolean {
  return !!process.env.GLM_API_KEY;
}
