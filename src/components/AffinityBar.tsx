import React from 'react';
import { cn } from '@/lib/utils';
import { Heart, Star } from 'lucide-react';

// ─── Props ──────────────────────────────────────────────────────────

interface AffinityBarProps {
  /** 当前好感度数值 */
  current: number;
  /** 最大好感度数值 */
  max: number;
  /** 当前等级（0-based） */
  level: number;
  /** 最大等级 */
  maxLevel: number;
}

// ─── 等级标签（中文） ───────────────────────────────────────────────

const LEVEL_LABELS_CN = [
  '陌生人',
  '认识',
  '友好',
  '信任',
  '亲密',
  '羁绊',
];

// ─── 等级对应的心形数量 ─────────────────────────────────────────────

function getLevelHearts(level: number, maxLevel: number): number {
  // 最多显示 5 颗心
  const totalHearts = Math.min(maxLevel + 1, 5);
  return Math.min(level + 1, totalHearts);
}

// ─── 解锁阈值标记 ───────────────────────────────────────────────────

function getThresholds(maxLevel: number, maxValue: number): number[] {
  if (maxLevel <= 0) return [];
  const step = maxValue / (maxLevel + 1);
  return Array.from({ length: maxLevel }, (_, i) => Math.round(step * (i + 1)));
}

// ─── Component ──────────────────────────────────────────────────────

export const AffinityBar: React.FC<AffinityBarProps> = ({
  current,
  max,
  level,
  maxLevel,
}) => {
  const pct = max > 0 ? Math.min((current / max) * 100, 100) : 0;
  const heartCount = getLevelHearts(level, maxLevel);
  const thresholds = getThresholds(maxLevel, max);
  const currentLabel = LEVEL_LABELS_CN[level] ?? `Lv.${level}`;

  return (
    <div className="w-full space-y-2">
      {/* 标题行 */}
      <div className="flex items-center justify-between">
        {/* 心形等级指示器 */}
        <div className="flex items-center gap-0.5">
          {Array.from({ length: Math.min(maxLevel + 1, 5) }).map((_, i) => (
            <Heart
              key={i}
              className={cn(
                'w-3 h-3 transition-all duration-300',
                i < heartCount
                  ? 'fill-rose-400 text-rose-400 drop-shadow-[0_0_3px_rgba(244,63,94,0.5)]'
                  : 'fill-none text-gray-600',
              )}
            />
          ))}
        </div>

        {/* 数值 */}
        <span className="text-xs font-mono tabular-nums text-gray-400">
          {current} / {max}
        </span>
      </div>

      {/* 进度条 */}
      <div className="relative h-2 rounded-full overflow-hidden bg-white/5 border border-white/5">
        {/* 已填充部分 */}
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, rgba(244,63,94,0.4), rgba(244,63,94,0.8))`,
            boxShadow: `0 0 6px rgba(244,63,94,${0.3 + pct / 200})`,
          }}
        />

        {/* 解锁阈值标记 */}
        {thresholds.map((t, i) => (
          <div
            key={i}
            className={cn(
              'absolute top-0 h-full w-0.5 transition-colors duration-300',
              current >= t ? 'bg-rose-300/60' : 'bg-white/10',
            )}
            style={{ left: `${(t / max) * 100}%` }}
          />
        ))}
      </div>

      {/* 等级信息 */}
      <div className="flex items-center justify-between">
        <span
          className={cn(
            'text-xs font-semibold',
            level >= 4
              ? 'text-rose-300'
              : level >= 2
              ? 'text-rose-400'
              : 'text-gray-400',
          )}
        >
          {currentLabel}
        </span>

        {/* 星级/等级标记 */}
        <div className="flex items-center gap-1">
          <Star
            className={cn(
              'w-2.5 h-2.5',
              level >= maxLevel ? 'text-amber-400' : 'text-gray-600',
            )}
          />
          <span className="text-[10px] font-mono text-gray-500">
            Lv.{level + 1}/{maxLevel + 1}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AffinityBar;
