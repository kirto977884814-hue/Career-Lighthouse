/**
 * React Hook: useAIGeneration
 * 用于调用AI生成个性化建议
 */

import { useState, useCallback } from 'react';

interface GenerationParams {
  type: 'summary' | 'advice' | 'reflection';
  params: any;
}

interface UseAIGenerationReturn {
  generate: (params: GenerationParams) => Promise<string | null>;
  isLoading: boolean;
  error: string | null;
  isAvailable: boolean;
}

export function useAIGeneration(): UseAIGenerationReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean>(false);

  const generate = useCallback(async ({ type, params }: GenerationParams): Promise<string | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type, params })
      });

      const data = await response.json();

      if (!response.ok) {
        // API不可用或出错
        if (data.available === false) {
          setIsAvailable(false);
          console.warn('GLM API not configured, using fallback');
          // 返回null，让调用者使用fallback
          return null;
        }
        throw new Error(data.message || 'Generation failed');
      }

      setIsAvailable(true);
      return data.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('AI generation failed:', errorMessage);

      // 如果是API未配置错误，返回null让调用者使用fallback
      if (errorMessage.includes('not configured')) {
        return null;
      }

      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    generate,
    isLoading,
    error,
    isAvailable
  };
}

/**
 * 生成个性化总结（困境解答 + 核心发现）
 */
export function usePersonalizedSummary() {
  const { generate, isLoading, error, isAvailable } = useAIGeneration();

  const generateSummary = useCallback(async (params: {
    userConfusion?: string;
    primaryPath: string;
    primaryPathPercent: number;
    dimensionScores: Record<string, number>;
    selfAwareness: number;
  }): Promise<string | null> => {
    return await generate({
      type: 'summary',
      params
    });
  }, [generate]);

  return {
    generateSummary,
    isLoading,
    error,
    isAvailable
  };
}

/**
 * 生成个性化具体建议
 */
export function usePersonalizedAdvice() {
  const { generate, isLoading, error, isAvailable } = useAIGeneration();

  const generateAdvice = useCallback(async (params: {
    primaryPath: string;
    dimensionScores: Record<string, number>;
    userInfo: {
      grade: string;
      major: string;
      planPostgraduate?: boolean;
      majorInterest?: string;
    };
  }): Promise<string | null> => {
    return await generate({
      type: 'advice',
      params
    });
  }, [generate]);

  return {
    generateAdvice,
    isLoading,
    error,
    isAvailable
  };
}

/**
 * 生成反思引导
 */
export function useReflectionPrompt() {
  const { generate, isLoading, error, isAvailable } = useAIGeneration();

  const generatePrompt = useCallback(async (params: {
    primaryPath: string;
    evolvablePath?: string;
    selfAwareness: number;
    dimensionGaps: Array<{ dimension: string; gap: number }>;
  }): Promise<string | null> => {
    return await generate({
      type: 'reflection',
      params
    });
  }, [generate]);

  return {
    generatePrompt,
    isLoading,
    error,
    isAvailable
  };
}
