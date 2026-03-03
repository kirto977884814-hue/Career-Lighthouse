import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // 启用静态导出
  images: {
    unoptimized: true, // GitHub Pages 不支持 Next.js Image Optimization
  },
  // 配置基础路径 - GitHub Pages 需要
  basePath: '/Career-Decision-Lab',
  assetPrefix: '/Career-Decision-Lab',
  // 禁用 trailing slash 重定向
  trailingSlash: true,
};

export default nextConfig;
