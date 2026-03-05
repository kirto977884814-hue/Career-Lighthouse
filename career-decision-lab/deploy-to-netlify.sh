#!/bin/bash

# Netlify 快速部署脚本
# 使用方法：chmod +x deploy-to-netlify.sh && ./deploy-to-netlify.sh

echo "🚀 开始部署职业灯塔 v5.0 到 Netlify..."
echo ""

# 检查 Git 状态
if [ ! -d ".git" ]; then
  echo "❌ 这不是一个Git仓库，请先初始化："
  echo "   git init"
  echo "   git add ."
  echo "   git commit -m 'Initial commit'"
  exit 1
fi

# 检查是否有未提交的更改
if ! git diff-index --quiet HEAD --; then
  echo "📝 检测到未提交的更改，正在提交..."

  # 添加所有文件
  git add .

  # 提交
  git commit -m "feat: career compass v5.0 with AI integration

- Implemented v5.0 algorithm with reality vs ideal scoring (30%+70%)
- Added 47-question questionnaire with 5 sections
- Integrated Zhipu AI GLM-4-Flash API for personalized content
- Created 5-layer results display structure
- Added decision style analysis and self-awareness assessment
- Support for 8 realistic career paths based on actual data
- Intelligent fallback mechanism for API failures

🤖 Generated with Claude Code
https://claude.com/claude-code

Co-Authored-By: Claude <noreply@anthropic.com>"

  echo "✅ 提交完成"
else
  echo "✅ 所有更改已提交"
fi

echo ""
echo "📤 推送到 GitHub..."

# 推送到远程仓库
git push origin main

if [ $? -eq 0 ]; then
  echo "✅ 推送成功！"
  echo ""
  echo "🎯 下一步："
  echo "   1. 访问 https://app.netlify.com/"
  echo "   2. 登录并选择 'Add new site' → 'Import an existing project'"
  echo "   3. 连接你的GitHub仓库"
  echo "   4. 在 Site settings → Environment variables 添加："
  echo "      Key: GLM_API_KEY"
  echo "      Value: 0238212af53d4943ad5dbef2c2771d17.aEjPTarTtajrpiHr"
  echo "   5. 等待自动部署完成"
  echo ""
  echo "🎉 部署完成后，你会收到一个URL，例如："
  echo "   https://amazing-johnson-123456.netlify.app"
else
  echo "❌ 推送失败，请检查："
  echo "   1. 是否已配置远程仓库：git remote -v"
  echo "   2. 是否有GitHub访问权限"
  echo "   3. 网络连接是否正常"
  exit 1
fi
