/**
 * 灯塔图标组件
 *
 * 职业灯塔品牌的标志性图标
 * 展示灯塔从底部升起，光束照亮方向的意象
 */

'use client';

import { cn } from '@/lib/utils';

interface LighthouseIconProps {
  /**
   * 图标尺寸
   */
  size?: number;

  /**
   * 是否显示光束动画
   */
  animated?: boolean;

  /**
   * 额外的CSS类名
   */
  className?: string;
}

export default function LighthouseIcon({
  size = 128,
  animated = false,
  className
}: LighthouseIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        animated && 'animate-pulse-slow',
        className
      )}
      role="img"
      aria-label="职业灯塔图标"
    >
      {/* 定义渐变 */}
      <defs>
        {/* 光束渐变 */}
        <linearGradient id="beamGradient" x1="64" y1="40" x2="128" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
        </linearGradient>

        {/* 建筑渐变 */}
        <linearGradient id="buildingGradient" x1="40" y1="80" x2="88" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="100%" stopColor="#1e40af" />
        </linearGradient>
      </defs>

      {/* 灯塔主体 - 塔身 */}
      <path
        d="M 52 90 L 52 70 L 48 60 L 48 50 L 80 50 L 80 60 L 76 70 L 76 90 Z"
        fill="url(#buildingGradient)"
      />

      {/* 灯塔基座 */}
      <rect x="44" y="88" width="40" height="8" rx="2" fill="#1e3a8a" />
      <rect x="40" y="94" width="48" height="6" rx="2" fill="#172554" />

      {/* 灯塔顶部 - 灯室 */}
      <rect x="50" y="46" width="28" height="8" rx="1" fill="#1e3a8a" />
      <rect x="52" y="44" width="24" height="4" rx="1" fill="#172554" />

      {/* 光源 - 金黄色灯光 */}
      <circle cx="64" cy="48" r="6" fill="#fbbf24" className={animated && 'animate-pulse'} />
      <circle cx="64" cy="48" r="4" fill="#fcd34d" />

      {/* 光束 - 向右上方照射 */}
      <path
        d="M 68 46 L 128 10 L 128 30 L 68 66 Z"
        fill="url(#beamGradient)"
        className={animated && 'animate-beam-sweep'}
      />

      {/* 灯塔窗户细节 */}
      <rect x="56" y="60" width="4" height="6" fill="#fbbf24" opacity="0.8" />
      <rect x="68" y="60" width="4" height="6" fill="#fbbf24" opacity="0.8" />

      {/* 灯塔条纹装饰 */}
      <rect x="52" y="72" width="24" height="2" fill="#fbbf24" opacity="0.3" />
      <rect x="54" y="80" width="20" height="2" fill="#fbbf24" opacity="0.3" />
    </svg>
  );
}

/**
 * 小尺寸灯塔图标（用于卡片、按钮等）
 */
export function LighthouseIconSmall({ className }: { className?: string }) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="灯塔图标"
    >
      <defs>
        <linearGradient id="beamGradientSmall" x1="64" y1="40" x2="128" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="buildingGradientSmall" x1="40" y1="80" x2="88" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="100%" stopColor="#1e40af" />
        </linearGradient>
      </defs>

      <path
        d="M 52 90 L 52 70 L 48 60 L 48 50 L 80 50 L 80 60 L 76 70 L 76 90 Z"
        fill="url(#buildingGradientSmall)"
      />
      <rect x="44" y="88" width="40" height="8" rx="2" fill="#1e3a8a" />
      <rect x="40" y="94" width="48" height="6" rx="2" fill="#172554" />

      <rect x="50" y="46" width="28" height="8" rx="1" fill="#1e3a8a" />
      <rect x="52" y="44" width="24" height="4" rx="1" fill="#172554" />

      <circle cx="64" cy="48" r="6" fill="#fbbf24" />
      <circle cx="64" cy="48" r="4" fill="#fcd34d" />

      <path
        d="M 68 46 L 128 10 L 128 30 L 68 66 Z"
        fill="url(#beamGradientSmall)"
      />

      <rect x="56" y="60" width="4" height="6" fill="#fbbf24" opacity="0.8" />
      <rect x="68" y="60" width="4" height="6" fill="#fbbf24" opacity="0.8" />

      <rect x="52" y="72" width="24" height="2" fill="#fbbf24" opacity="0.3" />
      <rect x="54" y="80" width="20" height="2" fill="#fbbf24" opacity="0.3" />
    </svg>
  );
}
