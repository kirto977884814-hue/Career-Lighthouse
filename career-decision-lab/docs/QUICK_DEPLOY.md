# 🚀 超级简化版 Netlify 部署指南

## 最简单的3步部署法

### 步骤1：推送代码（2分钟）

```bash
# 在项目目录执行
git add .
git commit -m "feat: v5.0 complete"
git push origin main
```

### 步骤2：连接 Netlify（3分钟）

1. 打开 https://app.netlify.com/
2. 用 GitHub 登录
3. 点击 "Add new site" → "Deploy with Git"
4. 选择你的仓库 `career-decision-lab`
5. 点击 "Import" → "Deploy site"
6. 等待2-3分钟...

### 步骤3：配置 API（1分钟）

部署完成后：
1. 在 Netlify 页面点击 "Site settings"
2. 点击 "Environment variables"
3. 点击 "Add environment variable"
4. 填写：
   - Key: `GLM_API_KEY`
   - Value: `0238212af53d4943ad5dbef2c2771d17.aEjPTarTtajrpiHr`
5. 点击 "Save"

**完成！** 🎉

---

## ✅ 验证部署

Netlify 会给你一个URL，例如：
```
https://wonderful-duck-123456.netlify.app
```

访问这个URL，你应该看到首页！

---

## 🔍 测试 API

访问：
```
https://你的URL.netlify.app/api/ai/generate
```

应该返回：
```json
{
  "available": true,
  "message": "GLM API is configured and ready"
}
```

---

## 📱 完整测试

1. 填写基础信息
2. 完成47题问卷
3. 查看AI生成的个性化结果

**全部完成！** 🎊

---

## 💡 重要提示

⚠️ **环境变量必须配置**，否则：
- AI 功能不可用
- 但系统会自动使用预设内容
- 核心功能仍然正常

✅ **如果不配置 API Key**：
- 系统仍然可以正常使用
- 只是内容不是 AI 生成的个性化版本
- 对于测试和演示完全没问题

---

## 🎯 下一步

部署成功后，你可以：

1. **分享给朋友**
   - 复制你的 Netlify URL
   - 发送给朋友测试

2. **绑定自定义域名**（可选）
   - 在 Netlify 中添加你的域名
   - 配置 DNS 记录

3. **持续更新**
   - 修改代码后直接 `git push`
   - Netlify 会自动重新部署

---

**就这么简单！** 🚀

详细的部署指南请参考：
- 📄 [完整部署指南](NETLIFY_DEPLOYMENT.md)
- ✅ [部署检查清单](DEPLOYMENT_CHECKLIST.md)
