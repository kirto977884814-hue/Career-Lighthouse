'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  Target,
  ClipboardCheck,
  Sparkles,
  Brain,
  TrendingUp,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Lightbulb as Lighthouse
} from 'lucide-react';
import LighthouseIcon from '@/components/LighthouseIcon';
import QuestionnaireTip from '@/components/QuestionnaireTip';

export default function WelcomePage() {
  const [brandStoryExpanded, setBrandStoryExpanded] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-8">
          {/* 灯塔图标 */}
          <div className="flex justify-center mb-8">
            <LighthouseIcon size={160} animated={true} className="drop-shadow-2xl" />
          </div>

          {/* 主标题 */}
          <h1 className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-300 mb-4">
            职业灯塔
          </h1>

          {/* 主Slogan */}
          <p className="text-3xl md:text-4xl font-semibold text-amber-100 mb-6">
            照亮你的方向
          </p>

          {/* 情感Slogan */}
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-4">
            在迷茫的黑夜里，我们用科学为你点亮灯塔
          </p>

          {/* 副Slogan */}
          <p className="text-lg text-blue-200 max-w-2xl mx-auto leading-relaxed">
            基于六维能力分析和AI技术，科学匹配最适合你的职业方向
          </p>
        </div>

        {/* 品牌故事（可折叠） */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="bg-slate-800/50 backdrop-blur border-2 border-amber-500/30 rounded-2xl overflow-hidden">
            <button
              onClick={() => setBrandStoryExpanded(!brandStoryExpanded)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-700/30 transition-colors"
            >
              <span className="text-xl font-bold text-amber-300 flex items-center gap-2">
                <Lightbulb className="w-6 h-6" />
                为什么叫"职业灯塔"？
              </span>
              {brandStoryExpanded ? (
                <ChevronUp className="w-5 h-5 text-amber-300" />
              ) : (
                <ChevronDown className="w-5 h-5 text-amber-300" />
              )}
            </button>

            {brandStoryExpanded && (
              <div className="px-6 pb-6 pt-2 text-slate-200 leading-relaxed space-y-4 animate-slide-down">
                <p>
                  因为在职业选择的黑夜里，
                  <br />
                  很多大学生像迷失方向的船。
                </p>

                <p>
                  我们不想做冷冰冰的测评工具，
                  <br />
                  而是想做一座温暖的灯塔。
                </p>

                <p>
                  用科学的方法（六维能力评估+AI分析），
                  <br />
                  点亮一束光，
                  <br />
                  照亮你不知道的才能，
                  <br />
                  照亮你最适合的方向。
                </p>

                <div className="pt-4 border-t border-amber-500/30">
                  <p className="text-amber-300 font-semibold">
                    职业灯塔：科学是底座（硬核分析），光是温度（温暖指引）。
                  </p>
                  <p className="text-right text-amber-400 font-bold mt-2">
                    照亮你的方向。
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 核心特性 - 统一配色 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 border border-blue-500/30 p-6 rounded-xl backdrop-blur">
            <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-white">
              🔦 灯塔扫描
            </h3>
            <p className="text-blue-100 text-sm leading-relaxed">
              AI智能分析，生成个性化总结、建议和反思引导
            </p>
          </div>

          <div className="bg-gradient-to-br from-amber-900/50 to-amber-800/50 border border-amber-500/30 p-6 rounded-xl backdrop-blur">
            <div className="w-14 h-14 bg-amber-600 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="w-7 h-7 text-slate-900" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-white">
              📈 意愿优先算法
            </h3>
            <p className="text-amber-100 text-sm leading-relaxed">
              现实30%+意愿70%加权，发现被环境压抑的潜力
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 border border-blue-500/30 p-6 rounded-xl backdrop-blur">
            <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
              <ClipboardCheck className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-white">
              📋 深度问卷
            </h3>
            <p className="text-blue-100 text-sm leading-relaxed">
              47题5section设计，现实vs意愿对比，场景化评估
            </p>
          </div>

          <div className="bg-gradient-to-br from-amber-900/50 to-amber-800/50 border border-amber-500/30 p-6 rounded-xl backdrop-blur">
            <div className="w-14 h-14 bg-amber-600 rounded-xl flex items-center justify-center mb-4">
              <Lightbulb className="w-7 h-7 text-slate-900" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-white">
              💡 照亮方向
            </h3>
            <p className="text-amber-100 text-sm leading-relaxed">
              5层输出结构，从AI分析到行动计划的完整指引
            </p>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-slate-800/50 backdrop-blur p-8 rounded-xl border border-blue-500/20 mb-12">
          <h2 className="text-3xl font-bold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-400">
            测试流程
          </h2>
          <div className="grid md:grid-cols-5 gap-6">
            <div className="text-center group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
                1
              </div>
              <h4 className="font-semibold mb-1 text-white">填写基础信息</h4>
              <p className="text-sm text-blue-200">年级、专业、当前困惑</p>
            </div>
            <div className="text-center group">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
                2
              </div>
              <h4 className="font-semibold mb-1 text-white">核心动机探索</h4>
              <p className="text-sm text-amber-200">4题，深度驱动因素</p>
            </div>
            <div className="text-center group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
                3
              </div>
              <h4 className="font-semibold mb-1 text-white">能力结构评估</h4>
              <p className="text-sm text-blue-200">30题，现实vs意愿对比</p>
            </div>
            <div className="text-center group">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
                4
              </div>
              <h4 className="font-semibold mb-1 text-white">深度情境测试</h4>
              <p className="text-sm text-amber-200">5题，观察真实决策</p>
            </div>
            <div className="text-center group">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-amber-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
                5
              </div>
              <h4 className="font-semibold mb-1 text-white">获得个性化建议</h4>
              <p className="text-sm text-blue-200">AI生成专属报告</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-6">
          <Link
            href="/questionnaire-v5"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-slate-900 font-bold px-10 py-5 rounded-2xl transition-all shadow-xl hover:shadow-2xl hover:scale-105 text-xl"
          >
            <LighthouseIcon className="w-6 h-6" />
            开始测试
            <ArrowRight className="w-6 h-6" />
          </Link>
          <p className="text-blue-200 font-medium">
            预计用时 8-12 分钟 • 共47题 • 5个Section
          </p>

          {/* 温馨提示 */}
          <div className="max-w-2xl mx-auto">
            <QuestionnaireTip variant="simple" animated={false} />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/history"
              className="inline-flex items-center gap-2 text-blue-100 hover:text-white font-medium px-6 py-3 rounded-xl transition-colors border-2 border-blue-400/30 hover:border-blue-400"
            >
              <BarChart3 className="w-5 h-5" />
              查看过往测试结果
            </Link>
            <Link
              href="/questionnaire"
              className="inline-flex items-center gap-2 text-blue-300 hover:text-blue-100 font-medium px-6 py-3 rounded-xl transition-colors border border-blue-400/20 hover:bg-blue-800/30"
            >
              使用旧版测试
              <span className="text-xs bg-blue-800/50 px-2 py-1 rounded">v4.0</span>
            </Link>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-16 p-8 bg-gradient-to-r from-blue-900/50 to-amber-900/30 border-2 border-amber-500/30 rounded-2xl backdrop-blur">
          <h3 className="font-bold text-xl text-amber-300 mb-4 flex items-center gap-2">
            <Sparkles className="w-6 h-6" />
            🔦 核心特性
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-100">
            <div className="space-y-2">
              <p className="font-semibold text-amber-200">🎯 科学算法</p>
              <ul className="list-disc list-inside space-y-1 ml-2 text-blue-100">
                <li>现实30% + 意愿70%加权评分</li>
                <li>发现被环境压抑的真实潜力</li>
                <li>一票否决机制，避免不适合的路径</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-amber-200">🤖 AI智能生成</p>
              <ul className="list-disc list-inside space-y-1 ml-2 text-blue-100">
                <li>个性化总结：解答你的困惑</li>
                <li>行动建议：3-5条具体可行建议</li>
                <li>反思引导：启发自我认知</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-amber-200">📊 真实数据</p>
              <ul className="list-disc list-inside space-y-1 ml-2 text-blue-100">
                <li>8条基于统计数据的职业路径</li>
                <li>涵盖学术、稳定、技术等方向</li>
                <li>匹配真实就业市场分布</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-amber-200">🔒 隐私保护</p>
              <ul className="list-disc list-inside space-y-1 ml-2 text-blue-100">
                <li>所有数据仅保存在本地浏览器</li>
                <li>不上传到任何服务器</li>
                <li>API调用仅用于内容生成</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
