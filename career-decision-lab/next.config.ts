import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 只在 GitHub Pages 时启用 basePath
  // Vercel 和 Netlify 不需要
  ...(process.env.DEPLOY_TARGET === 'github-pages' ? {
    output: 'export',
    basePath: '/Career-Decision-Lab',
    assetPrefix: '/Career-Decision-Lab',
    trailingSlash: true,
  } : process.env.DEPLOY_TARGET === 'netlify' ? {
    output: 'export',
    trailingSlash: true,
  } : {}),

  images: {
    unoptimized: true,
  },
};

export default nextConfig;
