'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Share2,
  Download,
  ChevronDown,
  ChevronUp,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Copy,
  Check
} from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Cell } from 'recharts';
import { generateTestResult, generateGapAnalysis } from '@/lib/calculator';
import { saveResult } from '@/lib/storage';
import { TestResult, DIMENSION_NAMES } from '@/types';
import { ACTION_PLANS } from '@/data/actionPlans';
import { PATH_DESCRIPTIONS } from '@/data/paths';
import { PATH_DETAILS } from '@/data/pathDetails';

function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [result, setResult] = useState<TestResult | null>(null);
  const [showModelExplanation, setShowModelExplanation] = useState(false);
  const [expandedWeeks, setExpandedWeeks] = useState<number[]>([]);
  const [showCopied, setShowCopied] = useState(false);

  useEffect(() => {
    try {
      const dataParam = searchParams.get('data');
      if (!dataParam) {
        router.push('/');
        return;
      }

      const { userInfo, answers, conflictAnswers } = JSON.parse(decodeURIComponent(dataParam));
      const testResult = generateTestResult(userInfo, answers, conflictAnswers);

      // Save to localStorage
      saveResult(testResult);

      setResult(testResult);
    } catch (error) {
      console.error('Failed to parse results:', error);
      router.push('/');
    }
  }, [searchParams, router]);

  const handleShare = async () => {
    if (!result) return;

    const shareText = `
我完成了"职业决策实验室"测试！

📊 我的最佳职业路径：${PATH_DESCRIPTIONS[result.primaryPath.pathId].name}

🎯 匹配度：${result.primaryPath.matchPercent}%

${result.evolvablePath ? `📈 潜在演化路径：${PATH_DESCRIPTIONS[result.evolvablePath.pathId].name}` : ''}

想了解自己的职业方向吗？快来测试吧！
`.trim();

    // 检查是否支持原生分享 API (主要是移动设备)
    if (navigator.share && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: '职业决策实验室 - 测试结果',
          text: shareText,
        });
      } catch (error) {
        // 用户取消分享或分享失败，回退到复制
        console.log('Native share failed, falling back to clipboard:', error);
        fallbackToClipboard(shareText);
      }
    } else {
      // 桌面浏览器直接使用复制到剪贴板
      fallbackToClipboard(shareText);
    }
  };

  const fallbackToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      // 最后的备用方案：使用传统方法
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy using fallback method:', err);
        alert('复制失败，请手动复制以下内容：\n\n' + text);
      }
      document.body.removeChild(textArea);
    }
  };

  const toggleWeek = (weekNum: number) => {
    setExpandedWeeks(prev =>
      prev.includes(weekNum)
        ? prev.filter(w => w !== weekNum)
        : [...prev, weekNum]
    );
  };

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">正在生成结果...</p>
        </div>
      </div>
    );
  }

  const primaryPathInfo = PATH_DESCRIPTIONS[result.primaryPath.pathId];
  const evolvablePathInfo = result.evolvablePath ? PATH_DESCRIPTIONS[result.evolvablePath.pathId] : null;

  // Prepare radar chart data
  const radarData = Object.entries(result.dimensionScores).map(([key, value]) => ({
    dimension: DIMENSION_NAMES[key as keyof typeof DIMENSION_NAMES],
    value: value,
    fullMark: 5
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <Link
              href="/"
              className="inline-flex items-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回首页
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
              测试结果
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              基于你的回答，我们为你生成了个性化的职业建议
            </p>
          </div>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
            title={navigator.share && typeof navigator.share === 'function' ? '分享测试结果' : '复制到剪贴板'}
          >
            {showCopied ? (
              <>
                <Check className="w-4 h-4" />
                已复制到剪贴板
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                {navigator.share && typeof navigator.share === 'function' ? '分享' : '复制结果'}
              </>
            )}
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Radar Chart - Ability Structure */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              你的能力结构分布
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              以下为你当前能力向量的分布情况。本系统基于6个核心维度进行建模,能力结构决定阶段性路径匹配,而非职业标签。
            </p>
            <ResponsiveContainer width="100%" aspect={1}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#94a3b8" />
                <PolarAngleAxis dataKey="dimension" tick={{ fill: '#64748b', fontSize: 12 }} />
                <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fill: '#94a3b8' }} />
                <Radar
                  name="能力得分"
                  dataKey="value"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-4 text-center">
              建议关注维度之间的差异,而非单一高分
            </p>
          </div>

          {/* Primary Path */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-6 rounded-xl border-2 border-blue-200 dark:border-blue-700">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                当前阶段更具优势的路径类型
              </h2>
            </div>

            <div className="mb-4">
              <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-2">
                {primaryPathInfo.name}
              </h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {primaryPathInfo.description}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">匹配度</span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {result.primaryPath.matchPercent}%
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${result.primaryPath.matchPercent}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">为什么适合</p>
                  <p className="text-slate-600 dark:text-slate-400">{primaryPathInfo.matchReason}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">需要注意</p>
                  <p className="text-slate-600 dark:text-slate-400">{primaryPathInfo.difficultyReminder}</p>
                </div>
              </div>
            </div>

            {/* 新增：能力差距分析 */}
            {(() => {
              const gaps = generateGapAnalysis(result.primaryPath.pathId, result.dimensionScores);
              if (gaps.length > 0) {
                return (
                  <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                    <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">能力差距提示</h4>
                    <ul className="space-y-1">
                      {gaps.map((gap, index) => (
                        <li key={index} className="text-sm text-amber-800 dark:text-amber-200 flex items-start gap-2">
                          <span className="text-amber-600 dark:text-amber-400 mt-0.5">•</span>
                          <span>{gap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              }
              return null;
            })()}

            {/* 新增：现实岗位映射 */}
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">现实岗位映射</h4>
              <div className="flex flex-wrap gap-2">
                {PATH_DETAILS[result.primaryPath.pathId].realJobs.map((job, index) => (
                  <span
                    key={index}
                    className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-sm rounded-full"
                  >
                    {job}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Evolvable Path */}
        {evolvablePathInfo && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                潜在可演化方向
              </h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              除当前阶段路径外,你的能力结构在以下方向具备延展潜力。这不是转行建议,而是能力扩展路径。
            </p>

            <div className="md:flex md:items-start md:gap-6">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-bold text-green-700 dark:text-green-300 mb-2">
                  {evolvablePathInfo.name}
                </h3>
                <div className="inline-block bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium px-3 py-1 rounded-full">
                  潜在匹配度: {result.evolvablePath!.matchPercent}%
                </div>
              </div>

              <div className="flex-1">
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {primaryPathInfo.currentFitReason}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  💡 随着能力提升和经验积累，你未来可能更适合这个方向
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 30-Day Action Plan */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              30天结构化行动计划
            </h2>
          </div>

          <p className="text-slate-600 dark:text-slate-400 mb-6">
            方向只有在行动中才能验证。以下为基于当前路径生成的实践建议。
          </p>

          <div className="space-y-4">
            {result.actionPlan.map((week) => {
              const isExpanded = expandedWeeks.includes(week.week);
              return (
                <div
                  key={week.week}
                  className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleWeek(week.week)}
                    className="w-full px-4 py-3 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full flex items-center justify-center font-bold text-sm">
                        {week.week}
                      </div>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        第{week.week}周：{week.title}
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="p-4 bg-white dark:bg-slate-800">
                      <ul className="space-y-2">
                        {week.tasks.map((task, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-slate-700 dark:text-slate-300">
                              {task}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Model Explanation */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setShowModelExplanation(!showModelExplanation)}
            className="w-full flex items-center justify-between text-left"
          >
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              模型说明
            </h2>
            {showModelExplanation ? (
              <ChevronUp className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            )}
          </button>

          {showModelExplanation && (
            <div className="mt-4 space-y-4 text-sm text-slate-700 dark:text-slate-300">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">评估维度</h3>
                <ul className="space-y-1">
                  {Object.entries(DIMENSION_NAMES).map(([key, name]) => (
                    <li key={key} className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded flex items-center justify-center text-xs font-bold">
                        {key}
                      </span>
                      <span>{name}: {result.dimensionScores[key as keyof typeof result.dimensionScores].toFixed(1)}分</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">匹配算法</h3>
                <p>
                  本系统采用6维能力向量 + 加权矩阵模型。输出结果为阶段性路径建议，而非职业标签。建议在能力提升后重新测试。
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">冲突取舍题</h3>
                <p>
                  本系统包含4道关键取舍题，用于增强维度区分度。职业决策本质上是能力与偏好的取舍，而非单维度评分。
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">局限性说明</h3>
                <ul className="space-y-1 list-disc list-inside text-slate-600 dark:text-slate-400">
                  <li>本评估仅基于当前状态，人会随成长而变化</li>
                  <li>建议作为参考，而非绝对决策依据</li>
                  <li>职业选择还需考虑兴趣、价值观、外部环境等因素</li>
                  <li>建议结合职业咨询师的深度分析</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            重新测试
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">正在生成结果...</p>
        </div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}
