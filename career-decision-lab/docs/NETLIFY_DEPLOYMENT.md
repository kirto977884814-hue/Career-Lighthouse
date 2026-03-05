# 🚀 Netlify 部署完整指南

## 📋 部署步骤

### 第一步：准备代码

#### 1. 确认 `.gitignore` 配置

检查 `.gitignore` 文件包含：
```gitignore
.env
.env.local
.env.*.local
```

**目的**：确保你的API Key不会被提交到Git仓库 ✅（已完成）

#### 2. 提交代码到Git

```bash
# 查看当前状态
git status

# 添加所有新文件
git add .

# 提交
git commit -m "feat: career compass v5.0 with AI integration

- Implemented v5.0 algorithm with reality vs ideal scoring
- Added 47-question questionnaire (5 sections)
- Integrated Zhipu AI GLM-4-Flash API
- Created 5-layer results display
- Added personalized AI-generated content
- Support for 8 realistic career paths

🤖 Generated with Claude Code
https://claude.com/claude-code

Co-Authored-By: Claude <noreply@anthropic.com>"

# 推送到GitHub
git push origin main
```

---

### 第二步：连接 Netlify

#### 方式1：通过 Netlify 网站（推荐）

1. **登录 Netlify**
   - 访问：https://app.netlify.com/
   - 使用GitHub账号登录

2. **创建新站点**
   - 点击 **"Add new site"** → **"Import an existing project"**
   - 选择 **"Deploy with Git"**

3. **连接GitHub仓库**
   - 点击 **"GitHub"** 图标
   - 授权 Netlify 访问你的GitHub
   - 选择你的仓库：`career-decision-lab`
   - 点击 **"Import"**

4. **配置构建设置**

   Netlify 会自动检测到这是一个 Next.js 项目，但我们需要确认：

   - **Build command**: `npm run build`
   - **Publish directory**: `out`
   - **Branch to deploy**: `main`

   点击 **"Deploy site"**

5. **等待部署完成**
   - 首次部署大约需要2-3分钟
   - 看到 **"Published"** 状态就完成了 ✅

#### 方式2：通过 Netlify CLI（高级）

```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 登录
netlify login

# 初始化站点
netlify init

# 部署
netlify deploy --prod
```

---

### 第三步：配置环境变量（重要！）

#### 1. 进入环境变量设置

- 在 Netlify 项目页面
- 点击 **"Site settings"**
- 选择左侧菜单 **"Environment variables"**

#### 2. 添加 GLM_API_KEY

- 点击 **"Add environment variable"**
- 填写：
  - **Key**: `GLM_API_KEY`
  - **Value**: `0238212af53d4943ad5dbef2c2771d17.aEjPTarTtajrpiHr`
- 点击 **"Save"**

#### 3. 确认配置

你应该看到：
```
Environment variables
┌─────────────────────────────────────┐
│ GLM_API_KEY                          │
│ 0238212af53d4943ad5d...rTtajrpiHr    │
└─────────────────────────────────────┘
```

#### 4. 重新部署

环境变量更改后需要重新部署：

- 方式A：自动触发
  - Netlify会自动检测到环境变量变化
  - 通常在1-2分钟内自动重新部署

- 方式B：手动触发
  - 点击 **"Deploys"**
  - 点击 **"Trigger deploy"**
  - 选择 **"main"** 分支
  - 点击 **"Trigger deploy"**

---

### 第四步：验证部署

#### 1. 访问你的网站

Netlify 会给你一个随机域名，例如：
```
https://amazing-johnson-123456.netlify.app
```

#### 2. 测试API

访问：
```
https://你的域名.netlify.app/api/ai/generate
```

**预期返回**：
```json
{
  "available": true,
  "message": "GLM API is configured and ready"
}
```

#### 3. 完整测试流程

1. **首页**
   ```
   https://你的域名.netlify.app/
   ```

2. **填写基础信息**
   - 点击"开始测试"
   - 填写信息页面

3. **完成问卷**
   ```
   https://你的域名.netlify.app/questionnaire-v5
   ```
   - 完成5个section的47题
   - 预计8-12分钟

4. **查看结果**
   - 自动跳转到结果页面
   - 查看AI生成的个性化内容
   - 验证所有功能正常

---

## 🎯 自定义域名（可选）

### 第一步：购买域名

- 推荐平台：
  - 阿里云：https://wanwang.aliyun.com/
  - 腾讯云：https://dnspod.cloud.tencent.com/
  - Namecheap：https://www.namecheap.com

### 第二步：在 Netlify 添加域名

1. 进入 **"Domain settings"**
2. 点击 **"Add custom domain"**
3. 输入你的域名，例如：`career-compass.com`
4. 点击 **"Verify DNS configuration"**

### 第三步：配置DNS

在域名购买商处添加DNS记录：

```
类型: CNAME
名称: @
值: 你的-netlify-domain.netlify.app
```

### 第四步：启用HTTPS

Netlify 会自动为你的域名生成SSL证书，自动启用HTTPS。

---

## 🔍 常见问题排查

### 问题1：部署后页面404

**原因**：静态导出路径问题

**解决**：
1. 确认 `next.config.ts` 配置正确：
   ```typescript
   const nextConfig = {
     output: 'export',
     images: {
       unoptimized: true
     }
   };
   ```

2. 检查 `package.json` 的构建命令：
   ```json
   {
     "scripts": {
       "build": "next build"
     }
   }
   ```

3. 重新部署

### 问题2：API返回503错误

**原因**：环境变量未配置

**解决**：
1. 检查 **Site settings** → **Environment variables**
2. 确认 `GLM_API_KEY` 已添加
3. 值必须是完整的：`0238212af53d4943ad5dbef2c2771d17.aEjPTarTtajrpiHr`
4. 保存后重新部署

### 问题3：AI内容生成失败

**检查步骤**：
1. 访问 `/api/ai/generate` 检查API状态
2. 查看浏览器控制台（F12）是否有错误
3. 如果显示 "API not configured"，说明环境变量未设置
4. 系统会自动使用Fallback内容，不影响其他功能

### 问题4：页面样式错乱

**原因**：Tailwind CSS未正确加载

**解决**：
1. 检查 `app/globals.css` 是否正确导入Tailwind
2. 清除浏览器缓存：`Ctrl + Shift + R`
3. 检查Netlify构建日志是否有错误

---

## 📊 Netlify 免费额度

### 免费计划包含：
- ✅ **带宽**：100GB/月
- ✅ **构建时间**：300分钟/月
- ✅ **站点数量**：无限
- ✅ **自定义域名**：无限
- ✅ **HTTPS**：免费SSL证书
- ✅ **CDN**：全球加速

### 预估使用量：
- 每次测试：~2-3MB（包含图片、样式等）
- **100GB = 约 30,000-50,000 次测试/月**
- 对于个人项目完全够用 ✅

---

## 🎉 部署完成后

### 你的网站已上线！

**公开URL**：
```
https://你的站点名.netlify.app
```

**访问路径**：
- 首页：`/`
- 问卷：`/questionnaire-v5`
- 结果：`/results-v5`
- API：`/api/ai/generate`

### 功能验证清单：

- [ ] 首页正常显示
- [ ] 问卷页面可以访问
- [ ] 可以完成问卷填写
- [ ] 结果页面正常显示
- [ ] API状态检查通过
- [ ] AI生成内容正常（或有Fallback）
- [ ] 雷达图正常显示
- [ ] 移动端显示正常

---

## 🔄 更新部署

### 当你修改代码后：

```bash
# 1. 提交更改
git add .
git commit -m "fix: update something"
git push origin main
```

**Netlify 会自动**：
1. 检测到新的push
2. 自动拉取代码
3. 自动构建
4. 自动部署
5. 通常2-3分钟完成

### 如果需要手动触发：

在 Netlify 后台：
- **Deploys** → **Trigger deploy** → **"Trigger deploy"**

---

## 📱 Netlify 移动端APP

下载 Netlify APP（可选）：
- **iOS**: App Store 搜索 "Netlify"
- **Android**: Google Play 搜索 "Netlify"

功能：
- 📊 查看部署状态
- 🔔 接收部署通知
- 🚀 手动触发部署
- 📈 查看访问统计

---

## 💡 最佳实践

### 1. 持续部署（推荐）

- `main` 分支：自动部署到生产环境
- 开发分支：可以预览部署

### 2. 部署前检查清单

- [ ] 本地运行 `npm run build` 成功
- [ ] 本地运行 `npm start` 测试功能
- [ ] 确认 `.env` 文件在 `.gitignore`
- [ ] 提交信息清晰
- [ ] 推送到正确的分支

### 3. 监控和日志

Netlify 提供：
- **部署日志**：每次构建的详细日志
- **函数日志**：API调用日志
- **访问统计**：站点访问数据

在 **"Deploys"** 页面可以查看所有部署历史。

---

## 🎊 完成部署后

### 你的职业灯塔 v5.0 已经上线！

**分享链接**：
```
https://你的站点名.netlify.app
```

**推荐语**：
> "我刚刚完成了一个职业测评系统，使用AI和科学算法帮助大学生发现职业方向。快来测试吧！"

**下一步**：
1. 分享给朋友测试
2. 收集反馈
3. 持续优化

---

## 📞 需要帮助？

### Netlify 文档
- 官方文档：https://docs.netlify.com/
- 环境变量：https://docs.netlify.com/site-deploys/environment-variables
- 域名设置：https://docs.netlify.com/domains-https/custom-domains

### 常见问题
- Netlify Forums: https://answers.netlify.com/
- Twitter: @Netlify

---

**准备好部署了吗？让我们开始吧！** 🚀
