/**
 * LighthouseLoading Component
 *
 * A branded loading component featuring the lighthouse theme with:
 * - Animated lighthouse icon with beam sweep
 * - Scanning animation
 * - Optional skeleton screens
 * - Progress indicators
 */

'use client';

import LighthouseIcon from './LighthouseIcon';

interface LighthouseLoadingProps {
  /**
   * Optional progress value (0-100)
   * If provided, shows a progress bar
   */
  progress?: number;

  /**
   * Optional custom message
   * Defaults to "灯塔正在扫描你的能力..."
   */
  message?: string;

  /**
   * Size of the lighthouse icon
   * @default 128
   */
  size?: number;

  /**
   * Whether to show skeleton screens
   * @default false
   */
  showSkeleton?: boolean;

  /**
   * Optional className for custom styling
   */
  className?: string;
}

export function LighthouseLoading({
  progress,
  message = "灯塔正在扫描你的能力...",
  size = 128,
  showSkeleton = false,
  className
}: LighthouseLoadingProps) {
  return (
    <div className={`flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 px-4 ${className || ''}`}>
      {/* Animated Lighthouse Icon */}
      <div className="mb-8">
        <LighthouseIcon size={size} animated={true} className="drop-shadow-2xl" />
      </div>

      {/* Scanning Message */}
      <div className="text-center mb-6">
        <p className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-300 mb-2">
          {message}
        </p>
        <p className="text-sm text-blue-200">职业灯塔正在分析你的能力维度...</p>
      </div>

      {/* Progress Bar (if progress provided) */}
      {progress !== undefined && (
        <div className="w-full max-w-md mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-blue-200">扫描进度</span>
            <span className="text-sm font-bold text-amber-300">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden border border-amber-500/30">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {/* Skeleton Screens (optional) */}
      {showSkeleton && (
        <div className="w-full max-w-2xl space-y-4">
          {/* Card Skeleton 1 */}
          <div className="bg-slate-800/50 backdrop-blur border border-amber-500/20 rounded-xl p-6 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 animate-pulse" />
              <div className="flex-1">
                <div className="h-4 bg-amber-500/20 rounded w-1/3 mb-2" />
                <div className="h-3 bg-blue-500/20 rounded w-1/2" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-slate-700/50 rounded w-full" />
              <div className="h-3 bg-slate-700/50 rounded w-5/6" />
              <div className="h-3 bg-slate-700/50 rounded w-4/6" />
            </div>
          </div>

          {/* Card Skeleton 2 */}
          <div className="bg-slate-800/50 backdrop-blur border border-amber-500/20 rounded-xl p-6 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 animate-pulse" />
              <div className="flex-1">
                <div className="h-4 bg-blue-500/20 rounded w-1/4 mb-2" />
                <div className="h-3 bg-blue-500/20 rounded w-2/5" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-24 bg-slate-700/50 rounded-lg" />
              <div className="h-24 bg-slate-700/50 rounded-lg" />
            </div>
          </div>
        </div>
      )}

      {/* Loading dots animation */}
      <div className="flex items-center gap-2 mt-6">
        <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}

/**
 * Lightweight version for inline loading
 */
export function LighthouseLoadingInline({
  message = "加载中...",
  size = 64
}: {
  message?: string;
  size?: number;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <LighthouseIcon size={size} animated={true} className="mb-4" />
      <p className="text-sm text-blue-200">{message}</p>
    </div>
  );
}

export default LighthouseLoading;
