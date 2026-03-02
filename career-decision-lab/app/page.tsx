import Link from 'next/link';
import { ArrowRight, BarChart3, Target, ClipboardCheck } from 'lucide-react';

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl mb-4">
            <BarChart3 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
            职业决策实验室
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Career Decision Lab
          </p>
          <p className="text-lg text-slate-700 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            通过科学评估，发现最适合你的职业方向
            <br />
            获得阶段性建议与具体行动清单
          </p>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
              <ClipboardCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-slate-900 dark:text-white">
              科学评估
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              36道情境题 + 4道冲突题，6个维度，系统分析你的能力结构
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-slate-900 dark:text-white">
              精准匹配
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              8种职业路径，找到最适合你的方向
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-slate-900 dark:text-white">
              行动指引
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              30天具体行动计划，从想法到实践
            </p>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 mb-12">
          <h2 className="text-2xl font-bold text-center mb-8 text-slate-900 dark:text-white">
            测试流程
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                1
              </div>
              <h4 className="font-semibold mb-1 text-slate-900 dark:text-white">填写基础信息</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">年级、专业、困惑</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                2
              </div>
              <h4 className="font-semibold mb-1 text-slate-900 dark:text-white">完成能力测评</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">36道情境题 + 4道关键取舍题</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                3
              </div>
              <h4 className="font-semibold mb-1 text-slate-900 dark:text-white">获得职业建议</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">主路径+演化路径</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                4
              </div>
              <h4 className="font-semibold mb-1 text-slate-900 dark:text-white">执行行动清单</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">4周具体计划</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-4">
          <Link
            href="/info"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-colors shadow-lg hover:shadow-xl text-lg"
          >
            开始测试
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="mt-4 text-sm text-slate-500">
            预计用时 5-8 分钟
          </p>

          <div className="pt-4">
            <Link
              href="/history"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium px-6 py-2 rounded-lg transition-colors border border-blue-200 hover:border-blue-300"
            >
              查看过往测试结果
            </Link>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-16 p-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
          <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
            本产品说明
          </h3>
          <ul className="text-sm text-amber-800 dark:text-amber-200 space-y-1 list-disc list-inside">
            <li>本工具仅提供阶段性建议，不替代专业职业规划咨询</li>
            <li>测试结果基于你当前状态，会随着成长而变化</li>
            <li>所有数据仅保存在本地浏览器中</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
