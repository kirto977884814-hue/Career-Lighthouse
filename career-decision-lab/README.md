# 职业灯塔 v5.0 (Career Lighthouse)

**一个基于AI和科学算法的大学生职业测评系统**

---

## 🎯 产品定位

> **"职业灯塔 - 有温度的科学指引"**

不是冰冷的测试，而是：
- ✅ 发现被环境压抑的潜力
- ✅ 提供AI生成的个性化建议
- ✅ 给出具体可操作的行动方案
- ✅ 引导自我反思和成长

**目标用户**：大三/大四学生、想转专业的学生、对职业方向迷茫的大学生

---

## ✨ 核心特性

### 1. 🔬 科学算法（v5.0重大升级）

#### 现实 vs 意愿加权算法
**问题**：工科生压抑表达倾向
**解决**：E = E_real × 30% + E_ideal × 70%
**效果**：发现被环境压抑的真实潜力

#### 一票否决机制
**问题**：所有路径匹配度太接近（85-92%）
**解决**：定义强排斥维度，触发后大幅降权
**效果**：明显区分适合和不适合的路径

#### 决策风格分析
**问题**：问卷太抽象
**解决**：5个深度情境题，观察真实决策过程
**效果**：自动提取决策风格（保守/灵活/冒险/务实）

#### 自我认知度评估
**问题**：不知道用户对自己的了解程度
**解决**：通过现实vs意愿差距来衡量
**效果**：
- 清晰（差距≤1）
- 一般（差距1-2.5）
- 模糊（差距>2.5）

### 2. 🤖 AI 智能生成

集成智谱AI GLM-4-Flash 模型：

- **个性化总结**：困境解答 + 核心发现
- **个性化建议**：3-5条具体可行的行动建议
- **反思引导**：2-3个启发性的自我探索问题
- **成本**：约 ¥0.0025/次（极低成本）
- **智能降级**：API不可用时自动使用预设内容

### 3. 📋 完整问卷（47题）

#### Section 1: 基础信息（6题）
- 年级、专业、专业兴趣度
- 最想从事的工作（13个选项，带emoji）
- 考研计划 + 原因追问
- 当前困惑（选填）

#### Section 2: 核心动机（4题）
- 现实选择 vs 理想选择（发现压抑）
- 核心价值观排序（8选3）
- 跨专业发展意愿
- 自我认知的核心优势

#### Section 3: 能力评估（30题）
每个维度5组对比题：
- **现实行为题**：你实际是怎么做的
- **真实意愿题**：你内心希望怎么做

6个维度：S(结构化)、A(抽象逻辑)、R(风险承受)、E(表达)、X(执行抗压)、C(共情)

#### Section 4: 深度情境（5题）
- 求职场景：国企 vs 创业公司
- 学术场景：独立课题 vs 团队合作
- 压力场景：deadline vs 社交机会
- 团队场景：低效成员处理
- 职业规划：行业不确定性

#### Section 5: 自我反思（2题）
- 新发现/新认识
- 具体行动计划

**总时间**：8-12分钟

### 4. 📊 8条真实职业路径

基于真实数据重新定义：

| 路径 | 占比 | 特征向量 |
|------|------|----------|
| 学术深造型 | 5-10% | [2, 7, -7, -5, 3, 3] |
| 稳定体制型 | 25-30% | [7, -3, -8, -5, 6, -2] |
| 技术研发型 | 15% | [8, 7, -2, -6, 5, -7] |
| 专业服务型 | 5% | [6, 5, -6, 3, 4, 2] |
| 市场销售型 | 5% | [-5, -4, 7, 6, 6, -6] |
| 内容创意型 | 2% | [-7, -3, 6, 7, 3, 5] |
| 教育咨询型 | 3% | [3, 4, -7, 6, 2, 8] |
| 综合管理型 | 5% | [5, 4, 2, 5, 5, 3] |

每条路径包含：
- 六维度特征向量
- 理想决策风格
- 匹配的核心动机
- 一票否决规则（2-4条）
- 学历要求说明

### 5. 🎨 5层输出结构

#### 第1层：AI个性化分析 🧠
- 困境解答（如有）
- 核心发现总结
- AI生成的个性化内容

#### 第2层：路径匹配结果 🎯
- 主推荐路径（匹配度+特征）
- 可演化路径（如有）
- 不优先路径（暂不推荐）
- 核心特征标签

#### 第3层：能力结构分析 📊
- 六维度雷达图
- 自我认知度展示
- 各维度现实vs意愿差距
- 认知度等级标注

#### 第4层：行动计划 💡
- AI个性化建议（3-5条）
- 30天行动清单（4周）
- 每周具体任务

#### 第5层：反思引导 🤔
- AI生成引导问题
- 促使深度思考
- 指向后续行动

---

## 🛠️ 技术栈

- **框架**: Next.js 15.1.7 (App Router)
- **语言**: TypeScript (100%类型覆盖)
- **样式**: Tailwind CSS v4
- **图表**: Recharts
- **图标**: Lucide React
- **AI**: 智谱AI GLM-4-Flash
- **状态管理**: React Hooks
- **存储**: LocalStorage

---

## 🚀 快速开始

### 本地开发

```bash
# 1. 进入项目目录
cd career-decision-lab

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env
# 编辑 .env，添加 GLM_API_KEY（可选）

# 4. 启动开发服务器
npm run dev

# 5. 访问应用
# 打开浏览器访问 http://localhost:3000
```

### 访问新页面

**新问卷页面**：`http://localhost:3000/questionnaire-v5`
**新结果页面**：`http://localhost:3000/results-v5`
**API状态检查**：`http://localhost:3000/api/ai/generate`

### 测试API

```bash
npx tsx test-glm-api.ts
```

---

## 📦 部署

### 推荐平台

**Netlify** 或 **Vercel**（支持环境变量）

### 快速部署到 Netlify

#### 3步完成部署：

1. **推送代码**
   ```bash
   git add .
   git commit -m "feat: v5.0 complete"
   git push origin main
   ```

2. **连接 Netlify**
   - 访问 https://app.netlify.com/
   - 用GitHub登录
   - "Add new site" → "Deploy with Git"
   - 选择你的仓库
   - 等待部署完成（2-3分钟）

3. **配置环境变量**
   - 在 Netlify 后台：Site settings → Environment variables
   - 添加：`GLM_API_KEY` = `你的API_Key`
   - 保存后重新部署

**完成！** 🎉

**详细指南**：
- 📄 [完整部署指南](docs/NETLIFY_DEPLOYMENT.md)
- ✅ [部署检查清单](docs/DEPLOYMENT_CHECKLIST.md)
- ⚡ [快速部署指南](docs/QUICK_DEPLOY.md)

---

## 📚 文档

### 项目状态
- 📊 [项目状态总结](PROJECT_STATUS.md) - **当前开发状态、功能清单和下一步行动**

### 核心文档

- 📄 [重构总结](docs/V5_REFACTORING_SUMMARY.md) - v5.0 完整重构总结
- 📄 [API集成文档](docs/GLM_API_INTEGRATION.md) - GLM API 集成说明
- 📄 [部署指南](docs/DEPLOYMENT_GUIDE.md) - 上线指南

### 部署文档

- 🚀 [Netlify部署](docs/NETLIFY_DEPLOYMENT.md)
- ✅ [部署检查清单](docs/DEPLOYMENT_CHECKLIST.md)
- ⚡ [快速部署](docs/QUICK_DEPLOY.md)

---

## 📂 项目结构

```
career-decision-lab/
├── app/                          # Next.js App Router页面
│   ├── page.tsx                  # 首页（欢迎页）
│   ├── info/                     # 基础信息采集
│   ├── questionnaire-v5/         # ✨ 新问卷页面
│   ├── results-v5/               # ✨ 新结果页面
│   └── api/ai/generate/         # ✨ AI API路由
│
├── types/                        # TypeScript类型定义
│   └── index.ts                  # ✨ v5.0类型系统
│
├── lib/                         # 核心算法
│   ├── calculator.ts             # ✨ v5.0核心算法
│   ├── glm.ts                    # ✨ GLM API客户端
│   └── ...
│
├── data/                        # 数据文件
│   ├── paths.ts                  # ✨ 8条职业路径
│   ├── questionsV5.ts            # ✨ 47道问卷题目
│   └── ...
│
├── hooks/                       # React Hooks
│   └── useAIGeneration.ts        # ✨ AI Hooks
│
├── components/                  # UI组件
│   └── AIContentCards.tsx       # ✨ AI UI组件
│
├── docs/                        # 文档
│   ├── V5_REFACTORING_SUMMARY.md
│   ├── GLM_API_INTEGRATION.md
│   ├── NETLIFY_DEPLOYMENT.md
│   ├── DEPLOYMENT_GUIDE.md
│   ├── DEPLOYMENT_CHECKLIST.md
│   └── QUICK_DEPLOY.md
│
├── test-glm-api.ts             # ✨ API测试脚本
├── deploy-to-netlify.sh         # ✨ 部署脚本
├── .env                         # ✨ 环境变量（已配置）
└── .env.example                 # ✨ 环境变量模板
```

---

## 🔧 配置说明

### 环境变量

在项目根目录创建 `.env` 文件：

```env
# GLM (智谱AI) API配置
GLM_API_KEY=your_glm_api_key_here
```

**获取API Key**：访问 https://open.bigmodel.cn/ 注册并创建API Key

**注意**：
- ⚠️ 不要将 `.env` 文件提交到Git（已在 `.gitignore` 中）
- ✅ 部署时需要在部署平台配置环境变量
- ✅ 本地开发时会自动读取

---

## 🎯 核心功能

### 1. 科学评估
- 六维度能力评估模型
- 现实vs意愿加权算法
- 决策风格分析
- 自我认知度评估

### 2. AI智能生成
- 困境解答
- 核心发现总结
- 个性化行动建议
- 反思引导问题

### 3. 匹配算法
- 六维度匹配（60%）
- 决策风格匹配（25%）
- 核心动机匹配（10%）
- 自我认知度（5%）
- 一票否决机制

### 4. 数据持久化
- LocalStorage 保存进度
- 自动保存答案
- 支持继续测试
- 保存历史记录

---

## 🧪 测试

### API测试

```bash
npx tsx test-glm-api.ts
```

**预期输出**：
- ✅ 生成个性化总结
- ✅ 生成个性化建议
- ✅ 生成反思引导
- 💰 成本：约 ¥0.0025

### 构建测试

```bash
npm run build
```

**预期输出**：
```
✓ Compiled successfully
```

---

## 📊 算法详解

### 匹配算法（v5.0）

```typescript
// 1. 计算加权得分
dimensionScore = reality × 30% + ideal × 70%

// 2. 计算路径匹配度
matchScore =
  dimensionsMatch × 60% +      // 六维度匹配
  styleMatch × 25% +          // 决策风格匹配
  motivationMatch × 10% +      // 核心动机匹配
  awarenessBonus × 5%          // 自我认知度

// 3. 应用一票否决
if (triggerVetoRules) {
  matchScore -= penalty
}

// 4. 增加区分度
finalScore = sqrt(matchScore)
```

### 自我认知度

```typescript
// 1. 计算差距
gap = abs(reality - ideal)

// 2. 评级
awareness =
  gap <= 1 ? 'high' :      // 清晰
  gap <= 2.5 ? 'medium' :  // 一般
  'low'                   // 模糊
```

---

## 🔐 数据安全

- ✅ 所有数据仅保存在用户浏览器本地
- ✅ 不上传到任何服务器
- ✅ 不收集用户隐私信息
- ✅ API Key仅存储在服务端环境变量
- ✅ 支持清除本地数据

---

## 📱 浏览器兼容性

- ✅ Chrome (推荐)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ 移动端浏览器

---

## 🎨 设计理念

### 产品定位
**"职业灯塔 - 有温度的科学指引"**

### 核心价值
1. **科学性**：六维度能力模型
2. **个性化**：AI生成专属内容
3. **可操作**：具体行动建议
4. **有温度**：关注用户感受和困惑

### 设计原则
- **真实**：基于真实职业数据
- **实用**：给出可执行的建议
- **温暖**：理解用户的困惑
- **启发**：引导自我探索

---

## 📈 更新日志

### v5.0 (2025-03-05) - 重大更新 ✨

#### 核心算法重构
- ✨ 现实vs意愿加权算法（30%+70%）
- ✨ 一票否决机制
- ✨ 决策风格分析
- ✨ 自我认知度评估
- ✨ 混合评分系统

#### 问卷全面升级
- ✨ 从40题扩展到47题
- ✨ 5个section结构化设计
- ✨ 现实行为vs真实意愿对比
- ✨ 5个深度情境题
- ✨ 完整的反思环节

#### AI智能集成
- ✨ 集成智谱AI GLM-4-Flash
- ✨ 3种AI生成功能
- ✨ 智能Mock降级机制
- ✨ 成本可控（¥0.0025/次）

#### 职业路径重定义
- ✨ 基于真实数据重新定义8条路径
- ✨ 每条路径包含完整特征数据
- ✨ 明确学历要求
- ✨ 一票否决规则

#### UI/UX升级
- ✨ 5层输出结构
- ✨ AI个性化分析
- ✨ 完整的能力展示
- ✨ 折叠面板设计
- ✨ 深色模式支持

### v4.0 及更早版本
详见 Git commit history

---

## 🎯 路线图

### 短期（已完成）
- [x] 核心算法重构
- [x] 问卷设计升级
- [x] AI功能集成
- [x] 结果页面重构

### 中期（可选）
- [ ] 用户反馈收集
- [ ] 算法参数优化
- [ ] 更多职业路径
- [ ] 移动端APP

### 长期（愿景）
- [ ] 大数据分析
- [ ] 职业数据库
- [ ] 社区功能
- [ ] 企业版

---

## 🤝 贡献指南

欢迎贡献代码、报告问题或提出建议！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

---

## 👨‍💻 作者

**开发团队**：Claude Code + 人类用户协作

**核心技术**：
- 算法设计：人类用户 + Claude
- 代码实现：Claude Code
- 测试验证：人类用户 + Claude

**特别感谢**：
- 智谱AI (GLM-4-Flash)
- Next.js 团队
- 开源社区

---

## 📞 联系方式

- **问题反馈**：GitHub Issues
- **功能建议**：GitHub Discussions
- **商务合作**：待定

---

## ⚠️ 免责声明

本工具仅提供参考建议，不替代专业职业规划咨询。

**注意**：
- 测试结果基于当前状态，会随着成长而变化
- 建议结合多个来源的信息做决策
- 最终决策需要用户自己负责

---

## 🎊 状态

**当前版本**：v5.0
**发布日期**：2025-03-05
**状态**：✅ 核心功能完成，可投入使用

---

**职业灯塔 v5.0 - 照亮你的职业方向！** 🚀⭐

---

<div align="center">

**[在线试用](https://你的部署地址.netlify.app)** • **[查看文档](docs/)** • **[GitHub](https://github.com/你的仓库)**

Made with ❤️ by Claude Code + You

</div>
