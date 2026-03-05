'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Share2, ChevronDown, ChevronUp, Target, TrendingUp, AlertCircle, CheckCircle2, Calendar, Copy, Check } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Cell } from 'recharts';
import { TestResult, DIMENSION_NAMES } from '@/types';
import { PATH_DESCRIPTIONS } from '@/data/paths';
import { PATH_DETAILS } from '@/data/pathDetails';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { buildPathExplanation } from '@/lib/explain';
import { compareTopPaths } from '@/lib/compare';
// import { generateGapAnalysis } from '@/lib/calculator'; // TODO: v5.0 重构中暂时移除
import { PersonalizedSummaryCard } from '@/components/PersonalizedSummaryCard';

function HistoryResultContent() {
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
        router.push('/history');
        return;
      }

      const testResult = JSON.parse(decodeURIComponent(dataParam)) as TestResult;
      setResult(testResult);
    } catch (error) {
      console.error('Failed to parse result:', error);
      router.push('/history');
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">加载中...</p>
        </div>
      </div>
    );
  }

  const primaryPathInfo = PATH_DESCRIPTIONS[result.primaryPath.pathId];
  const evolvablePathInfo = result.evolvablePath ? PATH_DESCRIPTIONS[result.evolvablePath.pathId] : null;

  const radarData = Object.entries(result.dimensionScores).map(([key, value]) => ({
    dimension: DIMENSION_NAMES[key as keyof typeof DIMENSION_NAMES],
    value: value,
    fullMark: 5
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <Link
              href="/history"
              className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回历史记录
            </Link>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              测试结果详情
            </h1>
            <p className="text-slate-600 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formatDistanceToNow(new Date(result.timestamp), { addSuffix: true, locale: zhCN })}
              <span>•</span>
              {result.userInfo.grade} • {result.userInfo.major}
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

        {/* 个性化摘要卡片 */}
        {result.userInfo && (
          <PersonalizedSummaryCard
            userInfo={result.userInfo}
            dimensionScores={result.dimensionScores}
            recommendedPath={result.primaryPath.pathId}
          />
        )}

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Radar Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              你的能力结构分布
            </h2>
            <p className="text-sm text-slate-600 mb-4">
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
            <p className="text-sm text-slate-600 mt-4 text-center">
              建议关注维度之间的差异,而非单一高分
            </p>
          </div>

          {/* Primary Path */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border-2 border-blue-200">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-slate-900">
                当前阶段更具优势的路径类型
              </h2>
            </div>

            <div className="mb-4">
              <h3 className="text-2xl font-bold text-blue-700 mb-2">
                {primaryPathInfo.name}
              </h3>
              <p className="text-slate-700 leading-relaxed">
                {primaryPathInfo.description}
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">匹配度</span>
                <span className="text-2xl font-bold text-blue-600">
                  {result.primaryPath.matchPercent}%
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${result.primaryPath.matchPercent}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-900">为什么适合</p>
                  <p className="text-slate-600">{primaryPathInfo.matchReason}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-900">需要注意</p>
                  <p className="text-slate-600">{primaryPathInfo.difficultyReminder}</p>
                </div>
              </div>
            </div>

            {/* TODO: v5.0 重构中暂时移除 - 能力差距分析 */}
            {/* {(() => {
              const gaps = generateGapAnalysis(result.primaryPath.pathId, result.dimensionScores);
              if (gaps.length > 0) {
                return (
                  <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <h4 className="font-semibold text-amber-900 mb-2">能力差距提示</h4>
                    <ul className="space-y-1">
                      {gaps.map((gap, index) => (
                        <li key={index} className="text-sm text-amber-800 flex items-start gap-2">
                          <span className="text-amber-600 mt-0.5">•</span>
                          <span>{gap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              }
              return null;
            })()} */}

            {/* 新增：现实岗位映射 */}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">现实岗位映射</h4>
              <div className="flex flex-wrap gap-2">
                {PATH_DETAILS[result.primaryPath.pathId].realJobs.map((job, index) => (
                  <span
                    key={index}
                    className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                  >
                    {job}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 新增模块1：能力拆解表 */}
        {(() => {
          const explanation = buildPathExplanation({
            path: result.primaryPath.pathId,
            userScores: result.dimensionScores
          });

          return (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                能力匹配拆解表
              </h2>
              <p className="text-sm text-slate-600 mb-4">
                以下是该路径对你的6维能力要求与你当前水平的详细对比
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-semibold text-slate-900">维度</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-900">路径要求</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-900">你的水平</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-900">状态</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-900">解读</th>
                    </tr>
                  </thead>
                  <tbody>
                    {explanation.breakdown.map((item) => {
                      const statusColors = {
                        '优势': 'bg-green-100 text-green-700',
                        '可用': 'bg-blue-100 text-blue-700',
                        '差距': 'bg-red-100 text-red-700',
                        '非核心': 'bg-slate-100 text-slate-700'
                      };
                      const weightLabels = {
                        5: '核心 - 高要求',
                        4: '核心 - 较高要求',
                        3: '一般要求',
                        2: '次要要求',
                        1: '次要要求',
                        0: '非核心'
                      };
                      return (
                        <tr key={item.key} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-4 font-medium text-slate-900">{item.name}</td>
                          <td className="py-3 px-4 text-center text-slate-600">
                            {weightLabels[item.requiredWeight as keyof typeof weightLabels]}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="text-slate-900 font-medium">{item.you}</span>
                            <span className="text-slate-500 ml-1">({item.youLevel})</span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusColors[item.status as keyof typeof statusColors]}`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-600 text-xs">{item.note}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })()}

        {/* 新增模块2：差距优先级分析 */}
        {(() => {
          const explanation = buildPathExplanation({
            path: result.primaryPath.pathId,
            userScores: result.dimensionScores
          });

          if (explanation.topGaps.length === 0) {
            return null;
          }

          return (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl border-2 border-amber-200 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-6 h-6 text-amber-600" />
                <h2 className="text-xl font-bold text-slate-900">
                  优先补强能力（Top {explanation.topGaps.length}）
                </h2>
              </div>

              <p className="text-sm text-slate-600 mb-6">
                以下维度是该路径的核心要求，但你当前水平有待提升。建议优先补强这些维度。
              </p>

              <div className="space-y-4">
                {explanation.topGaps.map((gap, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-amber-200">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                        <span className="text-amber-700 font-bold text-sm">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 mb-2">{gap.name}</h3>
                        <p className="text-sm text-slate-600 mb-3">{gap.why}</p>

                        <div className="bg-slate-50 rounded-lg p-3">
                          <p className="text-xs font-medium text-slate-700 mb-2">提升建议：</p>
                          <ul className="space-y-1">
                            {gap.improve.map((suggestion, idx) => (
                              <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                                <span className="text-amber-600">•</span>
                                <span>{suggestion}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* 新增模块3：Top1 vs Top2 对比 */}
        {result.evolvablePath && (() => {
          const comparison = compareTopPaths(
            result.dimensionScores,
            result.primaryPath.pathId,
            result.evolvablePath.pathId
          );

          return (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                为什么当前推荐「{PATH_DESCRIPTIONS[result.primaryPath.pathId].name}」而非「{PATH_DESCRIPTIONS[result.evolvablePath.pathId].name}」
              </h2>

              <p className="text-slate-700 leading-relaxed mb-6">
                {comparison.text}
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                {comparison.keyDiffs.map((diff, index) => (
                  <div key={index} className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-900">{diff.dimName}</span>
                      <span className={`text-sm px-2 py-1 rounded ${
                        diff.more === result.primaryPath.pathId
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {diff.more === result.primaryPath.pathId
                          ? PATH_DESCRIPTIONS[result.primaryPath.pathId].name
                          : PATH_DESCRIPTIONS[result.evolvablePath!.pathId].name}
                        {' '}更看重
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex-1">
                        <span className="text-slate-600">权重差：</span>
                        <span className="font-medium text-slate-900 ml-1">
                          {Math.abs(diff.weightDiff)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <span className="text-slate-600">你的分数：</span>
                        <span className="font-medium text-slate-900 ml-1">
                          {diff.you}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Evolvable Path */}
        {evolvablePathInfo && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-bold text-slate-900">
                潜在可演化方向
              </h2>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              除当前阶段路径外,你的能力结构在以下方向具备延展潜力。这不是转行建议,而是能力扩展路径。
            </p>

            <div className="md:flex md:items-start md:gap-6">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-bold text-green-700 mb-2">
                  {evolvablePathInfo.name}
                </h3>
                <div className="inline-block bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full">
                  潜在匹配度: {result.evolvablePath!.matchPercent}%
                </div>
              </div>

              <div className="flex-1">
                <p className="text-slate-700 leading-relaxed">
                  {primaryPathInfo.currentFitReason}
                </p>
                <p className="text-sm text-slate-600 mt-2">
                  💡 随着能力提升和经验积累，你未来可能更适合这个方向
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Plan */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-bold text-slate-900">
              30天结构化行动计划
            </h2>
          </div>

          <p className="text-slate-600 mb-6">
            方向只有在行动中才能验证。以下为基于当前路径生成的实践建议。
          </p>

          <div className="space-y-4">
            {result.actionPlan.map((week) => {
              const isExpanded = expandedWeeks.includes(week.week);
              return (
                <div
                  key={week.week}
                  className="border border-slate-200 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleWeek(week.week)}
                    className="w-full px-4 py-3 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold text-sm">
                        {week.week}
                      </div>
                      <span className="font-semibold text-slate-900">
                        第{week.week}周：{week.title}
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-600" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="p-4 bg-white">
                      <ul className="space-y-2">
                        {week.tasks.map((task, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-slate-700">
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
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
          <button
            onClick={() => setShowModelExplanation(!showModelExplanation)}
            className="w-full flex items-center justify-between text-left"
          >
            <h2 className="text-xl font-bold text-slate-900">
              模型说明
            </h2>
            {showModelExplanation ? (
              <ChevronUp className="w-5 h-5 text-slate-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-600" />
            )}
          </button>

          {showModelExplanation && (
            <div className="mt-4 space-y-4 text-sm text-slate-700">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">评估维度</h3>
                <ul className="space-y-1">
                  {Object.entries(DIMENSION_NAMES).map(([key, name]) => (
                    <li key={key} className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded flex items-center justify-center text-xs font-bold">
                        {key}
                      </span>
                      <span>{name}: {result.dimensionScores[key as keyof typeof result.dimensionScores].toFixed(1)}分</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-2">匹配算法</h3>
                <p>
                  本系统采用6维能力向量 + 余弦相似度模型，计算能力结构相似度而非能力加权和。输出结果为阶段性路径建议，而非职业标签。建议在能力提升后重新测试。
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-2">冲突取舍题</h3>
                <p>
                  本系统包含4道关键取舍题，用于增强维度区分度。职业决策本质上是能力与偏好的取舍，而非单维度评分。
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-2">局限性说明</h3>
                <ul className="space-y-1 list-disc list-inside text-slate-600">
                  <li>本评估仅基于当前状态，人会随成长而变化</li>
                  <li>建议作为参考，而非绝对决策依据</li>
                  <li>职业选择还需考虑兴趣、价值观、外部环境等因素</li>
                  <li>建议结合职业咨询师的深度分析</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            重新测试
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function HistoryResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">加载中...</p>
        </div>
      </div>
    }>
      <HistoryResultContent />
    </Suspense>
  );
}
