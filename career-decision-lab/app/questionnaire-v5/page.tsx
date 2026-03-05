/**
 * v5.0 问卷页面 - 支持47题的5个section结构
 *
 * 结构：
 * 1. 基础信息调查（6题）
 * 2. 核心动机探索（4题）
 * 3. 六维度能力评估（30题）
 * 4. 深度情境分析（5题）
 * 5. 自我反思（2题）
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Target,
  CheckCircle2,
  Brain,
  Sparkles,
  Lightbulb,
  ChevronRight
} from 'lucide-react';
import {
  BASIC_INFO_QUESTIONS,
  MOTIVATION_QUESTIONS,
  DIMENSION_QUESTIONS,
  SCENARIO_QUESTIONS,
  REFLECTION_QUESTIONS,
  LIKERT_OPTIONS,
  QUESTIONNAIRE_META
} from '@/data/questionsV5';
import { loadProgress, saveProgress, clearProgress } from '@/lib/storage';
import { TestProgress, UserInfo, RawScores, ScenarioAnswer } from '@/types';

type QuestionnaireSection = 'basic' | 'motivation' | 'dimensions' | 'scenarios' | 'reflection';
type SectionStatus = 'pending' | 'active' | 'completed';

export default function QuestionnaireV5Page() {
  const router = useRouter();

  // 状态管理
  const [currentSection, setCurrentSection] = useState<QuestionnaireSection>('basic');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [basicInfo, setBasicInfo] = useState<Partial<UserInfo>>({});
  const [motivationAnswers, setMotivationAnswers] = useState<Record<string, string | string[]>>({});
  const [dimensionAnswers, setDimensionAnswers] = useState<Record<string, { reality: number; ideal: number }>>({});
  const [scenarioAnswers, setScenarioAnswers] = useState<Record<string, string>>({});
  const [reflectionAnswers, setReflectionAnswers] = useState<Record<string, string>>({});

  // 加载进度
  useEffect(() => {
    const progress = loadProgress() as TestProgress & {
      basicInfo?: Partial<UserInfo>;
      dimensionAnswers?: Record<string, { reality: number; ideal: number }>;
      scenarioAnswers?: Record<string, string>;
      reflectionAnswers?: Record<string, string>;
    };

    if (progress) {
      if (progress.basicInfo) {
        setBasicInfo(progress.basicInfo);
        // 如果有基础信息，从动机section开始
        setCurrentSection('motivation');
      }
      // 可以加载更多进度...
    }
  }, []);

  // Section配置
  const sections: { id: QuestionnaireSection; title: string; icon: React.ReactNode; questionCount: number }[] = [
    {
      id: 'basic',
      title: '基础信息',
      icon: <Target className="w-5 h-5" />,
      questionCount: BASIC_INFO_QUESTIONS.length
    },
    {
      id: 'motivation',
      title: '核心动机',
      icon: <Brain className="w-5 h-5" />,
      questionCount: MOTIVATION_QUESTIONS.length
    },
    {
      id: 'dimensions',
      title: '能力评估',
      icon: <Sparkles className="w-5 h-5" />,
      questionCount: DIMENSION_QUESTIONS.length / 2 // 每个维度2题（现实+意愿）
    },
    {
      id: 'scenarios',
      title: '情境分析',
      icon: <Lightbulb className="w-5 h-5" />,
      questionCount: SCENARIO_QUESTIONS.length
    },
    {
      id: 'reflection',
      title: '自我反思',
      icon: <CheckCircle2 className="w-5 h-5" />,
      questionCount: REFLECTION_QUESTIONS.length
    }
  ];

  // 获取当前section的状态
  const getSectionStatus = (sectionId: QuestionnaireSection): SectionStatus => {
    if (sectionId === currentSection) return 'active';
    const currentIndex = sections.findIndex(s => s.id === sectionId);
    const activeIndex = sections.findIndex(s => s.id === currentSection);
    return currentIndex < activeIndex ? 'completed' : 'pending';
  };

  // 保存进度
  const saveCurrentProgress = () => {
    saveProgress({
      currentSection,
      currentQuestion: currentQuestionIndex,
      answers: {},
      basicInfo,
      userInfo: basicInfo as UserInfo
    } as any);
  };

  // 提交问卷
  const handleSubmit = () => {
    clearProgress();

    // 构建RawScores
    const rawScores: RawScores = {
      S_real: 0, S_ideal: 0,
      A_real: 0, A_ideal: 0,
      R_real: 0, R_ideal: 0,
      E_real: 0, E_ideal: 0,
      X_real: 0, X_ideal: 0,
      C_real: 0, C_ideal: 0
    };

    // 计算每个维度的现实和意愿得分
    Object.entries(dimensionAnswers).forEach(([questionId, scores]) => {
      const dimension = questionId.charAt(0) as keyof RawScores;
      const type = questionId.includes('_real_') ? 'real' : 'ideal';

      if (type === 'real') {
        const key = `${dimension}_real` as keyof RawScores;
        rawScores[key] = (rawScores[key] || 0) + scores.reality;
      } else {
        const key = `${dimension}_ideal` as keyof RawScores;
        rawScores[key] = (rawScores[key] || 0) + scores.ideal;
      }
    });

    // 平均每个维度的得分（每个维度5题）
    (['S', 'A', 'R', 'E', 'X', 'C'] as const).forEach(dim => {
      rawScores[`${dim}_real` as keyof RawScores] /= 5;
      rawScores[`${dim}_ideal` as keyof RawScores] /= 5;
    });

    // 构建scenario answers数组
    const scenarioAnswersArray: ScenarioAnswer[] = Object.entries(scenarioAnswers).map(
      ([scenarioId, choice]) => ({
        scenarioId,
        choice
      })
    );

    // 导航到结果页面
    router.push(`/results-v5?data=${encodeURIComponent(JSON.stringify({
      userInfo: basicInfo,
      rawScores,
      scenarioAnswers: scenarioAnswersArray
    }))}`);
  };

  // 渲染基础信息section
  const renderBasicInfo = () => {
    const question = BASIC_INFO_QUESTIONS[currentQuestionIndex];

    return (
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="mb-6">
          <div className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-full mb-4">
            {currentQuestionIndex + 1} / {BASIC_INFO_QUESTIONS.length}
          </div>
          <h2 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-white leading-relaxed">
            {question.text}
          </h2>
          {!question.required && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">（选填）</p>
          )}
        </div>

        {/* 选项 */}
        {question.options ? (
          <div className="space-y-3">
            {question.options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  const newInfo = { ...basicInfo, [question.type]: option.value };
                  setBasicInfo(newInfo);
                  saveCurrentProgress();

                  // 自动跳转下一题
                  setTimeout(() => {
                    if (currentQuestionIndex < BASIC_INFO_QUESTIONS.length - 1) {
                      setCurrentQuestionIndex(currentQuestionIndex + 1);
                    } else {
                      setCurrentSection('motivation');
                      setCurrentQuestionIndex(0);
                    }
                  }, 300);
                }}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  (basicInfo as any)[question.type] === option.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  {option.emoji && <span className="text-2xl">{option.emoji}</span>}
                  <span className="font-medium text-slate-900 dark:text-white">{option.label}</span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <input
            type="text"
            className="w-full p-4 border-2 border-slate-200 dark:border-slate-700 rounded-lg focus:border-blue-500 focus:outline-none dark:bg-slate-900 dark:text-white"
            placeholder={question.text}
            onChange={(e) => {
              setBasicInfo({ ...basicInfo, [question.type]: e.target.value });
            }}
            onBlur={saveCurrentProgress}
          />
        )}

        {/* 下一步按钮 */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => {
              if (currentQuestionIndex < BASIC_INFO_QUESTIONS.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
              } else {
                setCurrentSection('motivation');
                setCurrentQuestionIndex(0);
              }
            }}
            disabled={question.required && !(basicInfo as any)[question.type]}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            下一步
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  // 渲染核心动机section
  const renderMotivation = () => {
    const question = MOTIVATION_QUESTIONS[currentQuestionIndex];

    return (
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="mb-6">
          <div className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium rounded-full mb-4">
            {currentQuestionIndex + 1} / {MOTIVATION_QUESTIONS.length}
          </div>
          <h2 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-white leading-relaxed">
            {question.text}
          </h2>
          {question.required && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">*必填</p>
          )}
        </div>

        {/* 选项 */}
        {question.options && (
          <div className="space-y-3">
            {question.options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  let newValue: string | string[];
                  if (question.type === 'coreValues') {
                    // 核心价值观多选排序
                    const current = (motivationAnswers[question.id] || []) as string[];
                    if (current.includes(option.value)) {
                      newValue = current.filter(v => v !== option.value);
                    } else if (current.length < 3) {
                      newValue = [...current, option.value];
                    } else {
                      return; // 最多选3个
                    }
                  } else {
                    newValue = option.value;
                  }
                  setMotivationAnswers({ ...motivationAnswers, [question.id]: newValue });
                  saveCurrentProgress();
                }}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  Array.isArray(motivationAnswers[question.id])
                    ? (motivationAnswers[question.id] as string[]).includes(option.value)
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-slate-200 dark:border-slate-700'
                    : motivationAnswers[question.id] === option.value
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-slate-200 dark:border-slate-700'
                } hover:border-purple-300 dark:hover:border-purple-600`}
              >
                <div className="flex items-start gap-3">
                  <span className="font-medium text-slate-900 dark:text-white">{option.label}</span>
                  {option.description && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{option.description}</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* 下一步按钮 */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => {
              if (currentQuestionIndex < MOTIVATION_QUESTIONS.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
              } else {
                setCurrentSection('dimensions');
                setCurrentQuestionIndex(0);
              }
            }}
            disabled={question.required && !motivationAnswers[question.id]}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            下一步
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  // 渲染维度评估section
  const renderDimensions = () => {
    // 每次显示一个维度的一对题（现实+意愿）
    const dimensions: Array<{ key: string; name: string }> = [
      { key: 'S', name: '结构化能力' },
      { key: 'A', name: '抽象逻辑能力' },
      { key: 'R', name: '风险承受度' },
      { key: 'E', name: '表达倾向' },
      { key: 'X', name: '执行抗压能力' },
      { key: 'C', name: '共情能力' }
    ];

    const currentDimension = dimensions[Math.floor(currentQuestionIndex / 2)];
    const isRealityQuestion = currentQuestionIndex % 2 === 0;

    // 找到当前维度的所有题目
    const dimensionQuestions = DIMENSION_QUESTIONS.filter(q => q.dimension === currentDimension.key);

    return (
      <div className="space-y-6">
        {/* 现实行为题 */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="inline-block px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-sm font-medium rounded-full">
                {currentDimension.key} 维度
              </div>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                ({Math.floor(currentQuestionIndex / 2) + 1} / 6)
              </span>
            </div>

            {/* 现实行为题 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-3">
                现实行为
              </h3>
              {dimensionQuestions.filter(q => q.type === 'reality').slice(0, 1).map((q) => (
                <div key={q.id} className="mb-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <p className="text-slate-900 dark:text-white">{q.text}</p>
                </div>
              ))}
            </div>

            {/* 真实意愿题 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-3">
                真实意愿
              </h3>
              {dimensionQuestions.filter(q => q.type === 'ideal').slice(0, 1).map((q) => (
                <div key={q.id} className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-slate-900 dark:text-white">{q.text}</p>
                </div>
              ))}
            </div>

            {/* Likert选项 */}
            <div className="space-y-2">
              {LIKERT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    const questionId = isRealityQuestion
                      ? `${currentDimension.key}_real_behavior`
                      : `${currentDimension.key}_ideal_behavior`;

                    // 更新答案
                    if (isRealityQuestion) {
                      setDimensionAnswers({
                        ...dimensionAnswers,
                        [questionId]: {
                          ...(dimensionAnswers[questionId] || { reality: 0, ideal: 0 }),
                          reality: option.value
                        }
                      });
                    } else {
                      setDimensionAnswers({
                        ...dimensionAnswers,
                        [questionId]: {
                          ...(dimensionAnswers[questionId] || { reality: 0, ideal: 0 }),
                          ideal: option.value
                        }
                      });
                    }

                    saveCurrentProgress();

                    // 自动跳转到下一题
                    setTimeout(() => {
                      if (currentQuestionIndex < DIMENSION_QUESTIONS.length - 1) {
                        setCurrentQuestionIndex(currentQuestionIndex + 1);
                      } else {
                        setCurrentSection('scenarios');
                        setCurrentQuestionIndex(0);
                      }
                    }, 200);
                  }}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                    (isRealityQuestion
                      ? dimensionAnswers[`${currentDimension.key}_real_behavior`]?.reality
                      : dimensionAnswers[`${currentDimension.key}_ideal_behavior`]?.ideal
                    ) === option.value
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-600'
                  }`}
                >
                  <span className="font-medium text-slate-900 dark:text-white">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 渲染情境题section
  const renderScenarios = () => {
    const question = SCENARIO_QUESTIONS[currentQuestionIndex];

    return (
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="mb-6">
          <div className="inline-block px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-medium rounded-full mb-4">
            {currentQuestionIndex + 1} / {SCENARIO_QUESTIONS.length}
          </div>
          <h2 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-white leading-relaxed mb-4">
            {question.text}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            {question.context}
          </p>
        </div>

        {/* 选项 */}
        <div className="space-y-3">
          {question.options.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                setScenarioAnswers({ ...scenarioAnswers, [question.id]: option.id });
                saveCurrentProgress();

                // 自动跳转下一题
                setTimeout(() => {
                  if (currentQuestionIndex < SCENARIO_QUESTIONS.length - 1) {
                    setCurrentQuestionIndex(currentQuestionIndex + 1);
                  } else {
                    setCurrentSection('reflection');
                    setCurrentQuestionIndex(0);
                  }
                }, 300);
              }}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                scenarioAnswers[question.id] === option.id
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600'
              }`}
            >
              <p className="font-medium text-slate-900 dark:text-white">{option.text}</p>
            </button>
          ))}
        </div>
      </div>
    );
  };

  // 渲染反思section
  const renderReflection = () => {
    const question = REFLECTION_QUESTIONS[currentQuestionIndex];

    return (
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="mb-6">
          <div className="inline-block px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm font-medium rounded-full mb-4">
            {currentQuestionIndex + 1} / {REFLECTION_QUESTIONS.length}
          </div>
          <h2 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-white leading-relaxed mb-4">
            {question.text}
          </h2>
        </div>

        {/* 文本输入框 */}
        <textarea
          className="w-full p-4 border-2 border-slate-200 dark:border-slate-700 rounded-lg focus:border-amber-500 focus:outline-none dark:bg-slate-900 dark:text-white resize-none"
          rows={question.multiline ? 6 : 3}
          placeholder={question.placeholder}
          onChange={(e) => {
            setReflectionAnswers({ ...reflectionAnswers, [question.id]: e.target.value });
          }}
          onBlur={saveCurrentProgress}
        />

        {/* 下一步按钮 */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => {
              if (currentQuestionIndex < REFLECTION_QUESTIONS.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
              } else {
                handleSubmit();
              }
            }}
            className="flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            {currentQuestionIndex < REFLECTION_QUESTIONS.length - 1 ? '下一步' : '提交测试'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  // 主渲染
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* 顶部导航 */}
        <div className="mb-8">
          <button
            onClick={() => {
              if (currentSection === 'basic' && currentQuestionIndex === 0) {
                router.push('/');
              } else if (currentQuestionIndex > 0) {
                setCurrentQuestionIndex(currentQuestionIndex - 1);
              } else {
                // 返回上一个section
                const currentIndex = sections.findIndex(s => s.id === currentSection);
                if (currentIndex > 0) {
                  setCurrentSection(sections[currentIndex - 1].id);
                  setCurrentQuestionIndex(0);
                }
              }
            }}
            className="inline-flex items-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回
          </button>

          {/* Section进度条 */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                测试进度
              </span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {sections.findIndex(s => s.id === currentSection) + 1} / {sections.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {sections.map((section, index) => {
                const status = getSectionStatus(section.id);
                return (
                  <div
                    key={section.id}
                    className={`flex-1 h-2 rounded-full transition-all ${
                      status === 'completed' ? 'bg-blue-600' :
                      status === 'active' ? 'bg-blue-500' :
                      'bg-slate-200 dark:bg-slate-700'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* 当前Section标题 */}
          <div className="flex items-center gap-3 mb-2">
            {sections.find(s => s.id === currentSection)?.icon}
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
              {sections.find(s => s.id === currentSection)?.title}
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            {QUESTIONNAIRE_META.sections.find(s => s.id === currentSection)?.description}
          </p>
        </div>

        {/* 问题内容 */}
        {currentSection === 'basic' && renderBasicInfo()}
        {currentSection === 'motivation' && renderMotivation()}
        {currentSection === 'dimensions' && renderDimensions()}
        {currentSection === 'scenarios' && renderScenarios()}
        {currentSection === 'reflection' && renderReflection()}
      </div>
    </div>
  );
}
