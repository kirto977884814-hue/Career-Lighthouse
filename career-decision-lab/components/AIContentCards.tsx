/**
 * AI生成内容展示组件
 * 用于显示个性化建议和总结
 */

'use client';

import React from 'react';
import { Loader2, Sparkles, AlertCircle } from 'lucide-react';

interface AIContentDisplayProps {
  content: string | null;
  isLoading: boolean;
  error: string | null;
  fallback?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function AIContentDisplay({
  content,
  isLoading,
  error,
  fallback,
  icon = <Sparkles className="w-5 h-5" />,
  className = ''
}: AIContentDisplayProps) {
  if (isLoading) {
    return (
      <div className={`flex items-center gap-3 text-gray-600 dark:text-gray-400 ${className}`}>
        <Loader2 className="w-5 h-5 animate-spin" />
        <span>AI正在为你生成个性化建议...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-start gap-3 text-amber-600 dark:text-amber-400 ${className}`}>
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium">生成遇到问题</p>
          <p className="text-sm opacity-80">{error}</p>
        </div>
      </div>
    );
  }

  if (content) {
    return (
      <div className={`prose prose-sm dark:prose-invert max-w-none ${className}`}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5 text-blue-500">
            {icon}
          </div>
          <div className="flex-1">
            <div className="whitespace-pre-wrap">{content}</div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback content when AI is not available
  if (fallback) {
    return <>{fallback}</>;
  }

  return null;
}

/**
 * 个性化总结卡片
 */
export function PersonalizedSummaryCard({
  summary,
  isLoading,
  error
}: {
  summary: string | null;
  isLoading: boolean;
  error: string | null;
}) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
      <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
        <Sparkles className="w-5 h-5" />
        AI个性化分析
      </h3>

      <AIContentDisplay
        content={summary}
        isLoading={isLoading}
        error={error}
        fallback={
          <div className="text-gray-700 dark:text-gray-300">
            <p className="mb-2">测试已完成！通过这次评估，你可以更清晰地认识自己的能力和潜力。</p>
            <p>建议你根据自己的实际情况，参考下方的具体建议，制定适合自己的行动计划。</p>
          </div>
        }
      />
    </div>
  );
}

/**
 * 个性化建议卡片
 */
export function PersonalizedAdviceCard({
  advice,
  isLoading,
  error
}: {
  advice: string | null;
  isLoading: boolean;
  error: string | null;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-purple-500" />
        AI个性化建议
      </h3>

      <AIContentDisplay
        content={advice}
        isLoading={isLoading}
        error={error}
        fallback={
          <div className="text-gray-700 dark:text-gray-300">
            <p className="mb-2">基于你的评估结果，我们建议：</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>尝试相关方向的实习或项目，亲身体验</li>
              <li>与该行业的学长学姐交流，了解真实情况</li>
              <li>关注行业动态和招聘信息，拓宽视野</li>
              <li>参加相关讲座或活动，拓展认知边界</li>
            </ol>
          </div>
        }
      />
    </div>
  );
}

/**
 * 反思引导卡片
 */
export function ReflectionPromptCard({
  prompt,
  isLoading,
  error
}: {
  prompt: string | null;
  isLoading: boolean;
  error: string | null;
}) {
  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-6 border border-amber-200 dark:border-amber-800">
      <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-3 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        自我反思
      </h3>

      <AIContentDisplay
        content={prompt}
        isLoading={isLoading}
        error={error}
        fallback={
          <div className="text-gray-700 dark:text-gray-300">
            <p>你可以思考：</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>这个推荐方向符合你内心的期待吗？</li>
              <li>你在哪些方面还没发挥出潜力？</li>
              <li>接下来一个月，你愿意尝试什么小行动来探索这个方向？</li>
            </ul>
          </div>
        }
      />
    </div>
  );
}
