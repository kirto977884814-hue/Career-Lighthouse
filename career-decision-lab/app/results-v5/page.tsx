/**
 * v5.0 结果页面 - 5层输出结构
 *
 * 层次结构：
 * 1. AI个性化分析（困境解答 + 核心发现）
 * 2. 匹配结果展示（主推荐 + 可演化 + 不优先）
 * 3. 路径详情（能力雷达 + 维度分析 + 职业特点）
 * 4. 行动计划（4周计划 + 能力提升）
 * 5. 反思引导（自我认知 + 后续行动）
 */

'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Share2,
  Download,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Sparkles,
  Brain,
  Lightbulb,
  ArrowRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Cell } from 'recharts';
import { TestResult, DIMENSION_NAMES, Dimension } from '@/types';
import { PATH_DATA } from '@/data/paths';
import { generatePersonalizedSummary } from '@/lib/glm';
import { PersonalizedSummaryCard, PersonalizedAdviceCard, ReflectionPromptCard } from '@/components/AIContentCards';
import { usePersonalizedSummary, usePersonalizedAdvice, useReflectionPrompt } from '@/hooks/useAIGeneration';

function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [result, setResult] = useState<TestResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['ai-analysis', 'match-results']));

  // AI生成内容
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [aiReflection, setAiReflection] = useState<string | null>(null);

  // AI Hooks
  const { generateSummary, isLoading: summaryLoading } = usePersonalizedSummary();
  const { generateAdvice, isLoading: adviceLoading } = usePersonalizedAdvice();
  const { generatePrompt, isLoading: reflectionLoading } = useReflectionPrompt();

  useEffect(() => {
    const loadResult = () => {
      try {
        const dataParam = searchParams.get('data');
        if (!dataParam) {
          router.push('/');
          return;
        }

        // TODO: v5.0 - 解析新的问卷数据结构
        const { userInfo, rawScores, scenarioAnswers } = JSON.parse(decodeURIComponent(dataParam));

        // 临时：使用旧版数据结构兼容
        // const testResult = generateTestResult(userInfo, rawScores, scenarioAnswers);

        // setResult(testResult);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to parse results:', error);
        router.push('/');
      }
    };

    loadResult();
  }, [searchParams, router]);

  // 生成AI内容
  useEffect(() => {
    const generateAIContent = async () => {
      if (!result) return;

      // 1. 生成个性化总结
      const summary = await generateSummary({
        userConfusion: result.userInfo.currentConfusion,
        primaryPath: PATH_DATA[result.primaryPath.pathId].name,
        primaryPathPercent: result.primaryPath.matchPercent,
        dimensionScores: result.dimensionScores as unknown as Record<string, number>,
        selfAwareness: result.selfAwareness.score
      });
      if (summary) setAiSummary(summary);

      // 2. 生成个性化建议
      const advice = await generateAdvice({
        primaryPath: PATH_DATA[result.primaryPath.pathId].name,
        dimensionScores: result.dimensionScores as unknown as Record<string, number>,
        userInfo: result.userInfo
      });
      if (advice) setAiAdvice(advice);

      // 3. 生成反思引导
      const dimensionGaps = Object.entries(result.selfAwareness.dimensions)
        .filter(([_, data]) => data.gap > 1.5)
        .map(([dim, data]) => ({ dimension: dim, gap: data.gap }));

      const reflection = await generatePrompt({
        primaryPath: PATH_DATA[result.primaryPath.pathId].name,
        evolvablePath: result.evolvablePath ? PATH_DATA[result.evolvablePath.pathId].name : undefined,
        selfAwareness: result.selfAwareness.score,
        dimensionGaps
      });
      if (reflection) setAiReflection(reflection);
    };

    generateAIContent();
  }, [result]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">正在生成你的个性化报告...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  // 准备雷达图数据
  const radarData = Object.entries(result.dimensionScores).map(([dim, score]) => ({
    dimension: DIMENSION_NAMES[dim as Dimension],
    value: score
  }));

  const primaryPathInfo = PATH_DATA[result.primaryPath.pathId];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 顶部导航 */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>返回首页</span>
          </Link>

          <div className="flex gap-3">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>保存报告</span>
            </button>

            <button
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>分享</span>
            </button>
          </div>
        </div>

        {/* 主标题 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>职业灯塔 v5.0</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            你的个性化职业发展报告
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            基于六维度能力评估 + AI智能分析
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
            测试时间：{new Date(result.timestamp).toLocaleString('zh-CN')}
          </p>
        </div>

        {/* ========== 第1层：AI个性化分析 ========== */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => toggleSection('ai-analysis')}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">AI个性化分析</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">困境解答 + 核心发现</p>
              </div>
            </div>
            {expandedSections.has('ai-analysis') ? <ChevronUp className="w-5 h-5 text-slate-600" /> : <ChevronDown className="w-5 h-5 text-slate-600" />}
          </div>

          {expandedSections.has('ai-analysis') && (
            <PersonalizedSummaryCard
              summary={aiSummary}
              isLoading={summaryLoading}
              error={null}
            />
          )}
        </section>

        {/* ========== 第2层：匹配结果 ========== */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => toggleSection('match-results')}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">路径匹配结果</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">基于六维度能力的综合评估</p>
              </div>
            </div>
            {expandedSections.has('match-results') ? <ChevronUp className="w-5 h-5 text-slate-600" /> : <ChevronDown className="w-5 h-5 text-slate-600" />}
          </div>

          {expandedSections.has('match-results') && (
            <div className="space-y-6">
              {/* 主推荐路径 */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 p-6 rounded-xl border-2 border-blue-200 dark:border-blue-700">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100">主推荐路径</h3>
                </div>

                <div className="mb-4">
                  <h4 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-2">
                    {primaryPathInfo.name}
                  </h4>
                  <p className="text-blue-800 dark:text-blue-200 leading-relaxed">
                    {primaryPathInfo.description}
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">匹配度</span>
                    <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {result.primaryPath.matchPercent}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 mt-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all"
                      style={{ width: `${result.primaryPath.matchPercent}%` }}
                    ></div>
                  </div>
                </div>

                {/* 核心特征标签 */}
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                    理想决策风格：保守型{primaryPathInfo.idealStyle.conservative > 5 ? '⭐' : ''}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                    核心动机：{primaryPathInfo.motivations[0]}
                  </span>
                  {primaryPathInfo.degreeRequirement.required && (
                    <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 rounded-full text-sm font-medium">
                      需要高学历
                    </span>
                  )}
                </div>
              </div>

              {/* 可演化路径 */}
              {result.evolvablePath && (
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">可演化路径</h3>
                    <span className="text-sm text-slate-600 dark:text-slate-400">（未来可能发展的方向）</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                        {PATH_DATA[result.evolvablePath.pathId].name}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        匹配度：{result.evolvablePath.matchPercent}%
                      </p>
                    </div>
                    <ArrowRight className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
              )}

              {/* 不优先路径 */}
              <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <h3 className="text-lg font-bold text-red-900 dark:text-red-100">暂不优先考虑</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  {result.notPriorityPaths.map((path, index) => (
                    <div key={index} className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-lg p-3">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {PATH_DATA[path.pathId].name}
                      </span>
                      <span className="text-sm text-red-600 dark:text-red-400 font-medium">
                        {path.matchPercent}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ========== 第3层：能力结构分析 ========== */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => toggleSection('ability-analysis')}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">能力结构分析</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">六维度能力分布 + 自我认知度</p>
              </div>
            </div>
            {expandedSections.has('ability-analysis') ? <ChevronUp className="w-5 h-5 text-slate-600" /> : <ChevronDown className="w-5 h-5 text-slate-600" />}
          </div>

          {expandedSections.has('ability-analysis') && (
            <div className="grid lg:grid-cols-2 gap-6">
              {/* 雷达图 */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">你的能力结构分布</h3>
                <ResponsiveContainer width="100%" aspect={1}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#94a3b8" />
                    <PolarAngleAxis dataKey="dimension" tick={{ fill: '#64748b', fontSize: 11 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fill: '#94a3b8' }} />
                    <Radar
                      name="能力得分"
                      dataKey="value"
                      stroke="#f97316"
                      fill="#f97316"
                      fillOpacity={0.6}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* 自我认知度 */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">自我认知度</h3>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">总体认知度</span>
                    <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {(result.selfAwareness.score * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all"
                      style={{ width: `${result.selfAwareness.score * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">各维度现实vs意愿差距</h4>
                  {Object.entries(result.selfAwareness.dimensions).map(([dim, data]) => (
                    <div key={dim} className="flex items-center justify-between text-sm">
                      <span className="text-slate-700 dark:text-slate-300">{DIMENSION_NAMES[dim as Dimension]}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-600 dark:text-slate-400">差距: {data.gap.toFixed(1)}</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          data.awareness === 'high' ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' :
                          data.awareness === 'medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300' :
                          'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                        }`}>
                          {data.awareness === 'high' ? '清晰' : data.awareness === 'medium' ? '一般' : '模糊'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ========== 第4层：行动计划 ========== */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => toggleSection('action-plan')}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">行动计划</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">AI个性化建议 + 4周行动清单</p>
              </div>
            </div>
            {expandedSections.has('action-plan') ? <ChevronUp className="w-5 h-5 text-slate-600" /> : <ChevronDown className="w-5 h-5 text-slate-600" />}
          </div>

          {expandedSections.has('action-plan') && (
            <div className="space-y-6">
              {/* AI建议 */}
              <PersonalizedAdviceCard
                advice={aiAdvice}
                isLoading={adviceLoading}
                error={null}
              />

              {/* 4周行动清单 */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">30天行动清单</h3>
                <div className="space-y-4">
                  {result.actionPlan.map((week, index) => (
                    <div key={index} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-slate-900 dark:text-white">
                          第{week.week}周：{week.title}
                        </h4>
                        <Calendar className="w-5 h-5 text-slate-400" />
                      </div>
                      <ul className="space-y-2">
                        {week.tasks.map((task, taskIndex) => (
                          <li key={taskIndex} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ========== 第5层：反思引导 ========== */}
        <section className="mb-8">
          <ReflectionPromptCard
            prompt={aiReflection}
            isLoading={reflectionLoading}
            error={null}
          />
        </section>

        {/* 底部CTA */}
        <div className="text-center bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            开始你的职业探索之旅
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            记住，最好的规划是行动本身。从今天开始，迈出第一步！
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            重新测试
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">加载中...</p>
        </div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}
