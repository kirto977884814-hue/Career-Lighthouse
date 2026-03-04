# Cloudflare Pages 部署脚本

# 1. 安装 Wrangler CLI（如果还没安装）
npm install -g wrangler

# 2. 登录 Cloudflare
wrangler login

# 3. 构建项目
npm run build

# 4. 部署到 Cloudflare Pages
# 注意：要从项目根目录（career-decision-lab/）执行
wrangler pages deploy out --project-name=career-decision-lab

# 如果需要自定义域名：
# wrangler pages deploy out --project-name=career-decision-lab --branch=main
