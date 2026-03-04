#!/bin/bash
set -e  # 遇到错误立即退出

echo "=== 开始构建 ==="
echo "Node 版本: $(node --version)"
echo "NPM 版本: $(npm --version)"
echo "工作目录: $(pwd)"
echo "环境变量 DEPLOY_TARGET: $DEPLOY_TARGET"
echo ""

echo "=== 安装依赖 ==="
npm ci --legacy-peer-deps

echo ""
echo "=== 运行构建 ==="
npm run build

echo ""
echo "=== 构建完成 ==="
ls -la out/
