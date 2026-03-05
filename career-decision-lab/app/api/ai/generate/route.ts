/**
 * Next.js API Route: /api/ai/generate
 * 处理AI生成个性化建议的请求
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  generatePersonalizedSummary,
  generatePersonalizedAdvice,
  generateReflectionPrompt,
  isGLMAPIAvailable
} from '@/lib/glm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, params } = body;

    // 检查API是否可用
    if (!isGLMAPIAvailable()) {
      return NextResponse.json(
        {
          error: 'GLM API not configured',
          message: '请配置GLM_API_KEY环境变量',
          available: false
        },
        { status: 503 }
      );
    }

    let result: string;

    switch (type) {
      case 'summary':
        result = await generatePersonalizedSummary(params);
        break;

      case 'advice':
        result = await generatePersonalizedAdvice(params);
        break;

      case 'reflection':
        result = await generateReflectionPrompt(params);
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid type', message: `Unknown generation type: ${type}` },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('API route error:', error);

    return NextResponse.json(
      {
        error: 'Generation failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        available: isGLMAPIAvailable()
      },
      { status: 500 }
    );
  }
}

// GET请求：检查API是否可用
export async function GET() {
  return NextResponse.json({
    available: isGLMAPIAvailable(),
    message: isGLMAPIAvailable()
      ? 'GLM API is configured and ready'
      : 'GLM_API_KEY not found in environment variables'
  });
}
