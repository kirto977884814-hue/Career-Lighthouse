# ✅ Netlify 部署前检查清单

## 📋 准备阶段

### 1. 代码检查

- [ ] **本地构建成功**
  ```bash
  npm run build
  ```
  应该看到：`✓ Compiled successfully`

- [ ] **本地测试通过**
  ```bash
  npm run dev
  ```
  访问 `http://localhost:3000` 确认功能正常

- [ ] **API测试通过**
  ```bash
  npx tsx test-glm-api.ts
  ```
  应该看到3个测试全部成功

### 2. Git 仓库检查

- [ ] **远程仓库已配置**
  ```bash
  git remote -v
  ```
  应该显示：`origin https://github.com/你的用户名/career-decision-lab.git`

- [ ] **所有更改已提交**
  ```bash
  git status
  ```
  应该显示：`nothing to commit, working tree clean`

- [ ] **.env 文件已排除**
  ```bash
  git ls-files | grep .env
  ```
  应该返回空（说明 .env 不在Git追踪中）

### 3. 环境变量确认

- [ ] **API Key 可用**
  ```bash
  cat .env
  ```
  应该看到：`GLM_API_KEY=0238212af53d4943ad5dbef2c2771d17.aEjPTarTtajrpiHr`

- [ ] **.gitignore 正确配置**
  ```bash
  cat .gitignore | grep .env
  ```
  应该包含：`.env*`

---

## 🚀 部署步骤

### 步骤1：推送代码到 GitHub

```bash
# 方式A：使用部署脚本（推荐）
chmod +x deploy-to-netlify.sh
./deploy-to-netlify.sh

# 方式B：手动执行
git add .
git commit -m "feat: v5.0 with AI integration"
git push origin main
```

**预期输出**：
```
Enumerating objects: XXX, done.
Counting objects: XXX, done.
...
To https://github.com/你的用户名/career-decision-lab.git
   xxxxx..xxxxx  main -> main
```

### 步骤2：在 Netlify 创建站点

1. **访问 Netlify**
   - 打开：https://app.netlify.com/
   - 使用 GitHub 账号登录

2. **创建新站点**
   - 点击：**"Add new site"** → **"Import an existing project"**
   - 点击：**"Deploy with Git"**

3. **连接 GitHub**
   - 点击 **"GitHub"**
   - 授权 Netlify 访问你的 GitHub
   - 选择仓库：`career-decision-lab`

4. **配置构建设置**
   - Build command: `npm run build`
   - Publish directory: `out`
   - Branch: `main`

5. **开始部署**
   - 点击 **"Deploy site"**
   - 等待2-3分钟

### 步骤3：配置环境变量

部署完成后：

1. **进入站点设置**
   - 在 Netlify 项目页面
   - 点击 **"Site settings"**

2. **添加环境变量**
   - 点击：**"Environment variables"**
   - 点击：**"Add environment variable"**
   - 填写：
     - **Key**: `GLM_API_KEY`
     - **Value**: `0238212af53d4943ad5dbef2c2771d17.aEjPTarTtajrpiHr`
   - 点击：**"Save"**

3. **重新部署**
   - Netlify 会自动检测到环境变量变化
   - 等待自动重新部署（1-2分钟）
   - 或手动触发：**"Deploys"** → **"Trigger deploy"**

---

## ✅ 部署验证

### 1. 访问你的网站

Netlify 会给你一个URL，例如：
```
https://amazing-johnson-123456.netlify.app
```

### 2. 功能测试

#### 测试1：首页
```
✅ 访问：https://你的域名.netlify.app/
✅ 页面正常显示
✅ "开始测试"按钮可点击
```

#### 测试2：API状态
```
✅ 访问：https://你的域名.netlify.app/api/ai/generate
✅ 返回：
{
  "available": true,
  "message": "GLM API is configured and ready"
}
```

#### 测试3：完整流程
```
1. ✅ 填写基础信息
2. ✅ 完成47题问卷
3. ✅ 查看结果页面
4. ✅ AI生成内容正常显示
```

### 3. 移动端测试

- [ ] 在手机浏览器打开网站
- [ ] 检查页面布局是否正常
- [ ] 检查按钮是否可点击
- [ ] 检查内容是否完整

---

## 🎯 自定义域名（可选）

### 如果你有自己的域名：

#### 步骤1：在 Netlify 添加域名

1. **进入域名设置**
   - **"Site settings"** → **"Domain management"**

2. **添加自定义域名**
   - 点击 **"Add custom domain"**
   - 输入你的域名，例如：`career-compass.com`
   - 点击 **"Add domain"**

#### 步骤2：配置DNS

在域名购买商（如阿里云、腾讯云）添加DNS记录：

```
类型: CNAME
名称: @
值: 你的-netlify域名.netlify.app
```

#### 步骤3：等待DNS生效

- 通常需要10-30分钟
- Netlify 会自动生成SSL证书
- 完成后可以通过 `https://career-compass.com` 访问

---

## 🔄 更新部署

### 当你修改代码后：

```bash
# 1. 提交更改
git add .
git commit -m "fix: 修复某个问题"
git push origin main

# 2. 等待自动部署（2-3分钟）

# 3. 或手动触发
# 在 Netlify 后台：Deploys → Trigger deploy
```

---

## 📊 监控和维护

### 查看部署日志

1. 进入 Netlify 项目页面
2. 点击 **"Deploys"**
3. 点击任意一次部署查看：
   - 构建日志
   - 错误信息
   - 部署时间

### 查看访问统计

1. 点击 **"Analytics"**
2. 可以查看：
   - 访问量
   - 访客数
   - 热门页面

### 设置通知

1. 点击 **"Site settings"** → **"Notifications"**
2. 可以设置：
   - 部署失败通知
   - 部署成功通知
   - 表单提交通知

---

## 🆘 常见问题

### Q1: 部署后显示 404 错误

**A**: 可能是静态导出配置问题

**解决方法**：
1. 检查 `next.config.ts`：
   ```typescript
   const nextConfig = {
     output: 'export',
     images: {
       unoptimized: true
     }
   };
   ```

2. 重新部署

### Q2: API 返回 "not configured"

**A**: 环境变量未正确配置

**解决方法**：
1. 检查 **Site settings** → **Environment variables**
2. 确认 `GLM_API_KEY` 存在且值正确
3. 保存后重新部署

### Q3: AI 内容生成失败

**A**: API 调用失败，但系统会自动降级

**说明**：
- 系统会使用预设的 Fallback 内容
- 核心功能不受影响
- 用户体验基本正常

### Q4: 页面样式错乱

**A**: 清除浏览器缓存

**解决方法**：
- Windows: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`
- 或使用隐私模式测试

---

## 🎉 部署成功！

### 你现在拥有一个在线的职业测评系统！

**分享链接**：
```
https://你的站点名.netlify.app
```

**建议**：
1. 分享给朋友测试
2. 收集用户反馈
3. 持续优化改进

**祝你的项目成功！** 🚀
