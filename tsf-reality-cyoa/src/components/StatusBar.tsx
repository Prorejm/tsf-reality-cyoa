import React from 'react';
import { cn } from '@/lib/utils';
import { useGame } from '@/game/engine/GameContext';
import type { TimePeriod } from '@/game/engine/types';
import { Sun, SunDim, Moon, Stars } from 'lucide-react';

// ─── 时段图标映射 ───────────────────────────────────────────────────

const periodConfig: Record<TimePeriod, { icon: React.ReactNode; label: string }> = {
  morning: { icon: <Sun className="w-4 h-4 text-amber-400" />, label: '早晨' },
  afternoon: { icon: <SunDim className="w-4 h-4 text-orange-400" />, label: '午后' },
  evening: { icon: <Moon className="w-4 h-4 text-indigo-300" />, label: '黄昏' },
  night: { icon: <Stars className="w-4 h-4 text-blue-200" />, label: '深夜' },
};

// ─── 进度条子组件 ───────────────────────────────────────────────────

interface ProgressBarProps {
  value: number;
  maxValue?: number;
  colorClass: string;
  pulseWhenAbove?: number;
  gradientFrom: string;
  gradientTo: string;
  label: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  maxValue = 100,
  colorClass,
  pulseWhenAbove,
  gradientFrom,
  gradientTo,
  label,
}) => {
  const pct = Math.min((value / maxValue) * 100, 100);
  const shouldPulse = pulseWhenAbove !== undefined && value > pulseWhenAbove;

  return (
    <div className="flex items-center gap-2 min-w-0">
      <span className={cn('status-value w-8 text-right tabular-nums', colorClass)}>
        {value}
      </span>
      <div
        className={cn(
          'relative flex-1 h-2 min-w-[60px] rounded-full overflow-hidden',
          'bg-white/5 border border-white/5',
          shouldPulse && 'animate-erosion-pulse',
        )}
      >
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${gradientFrom}, ${gradientTo})`,
          }}
        />
      </div>
      <span className="status-label hidden sm:inline">{label}</span>
    </div>
  );
};

// ─── Period 标签映射 ────────────────────────────────────────────────

const periodLabels: Record<TimePeriod, string> = {
  morning: '早晨',
  afternoon: '午后',
  evening: '黄昏',
  night: '深夜',
};

// ─── Component ──────────────────────────────────────────────────────

export const StatusBar: React.FC = () => {
  const { state } = useGame();
  const {
    currentDay,
    currentPeriod,
    erosionLevel,
    awarenessLevel,
    currentScene,
  } = state;

  const period = periodConfig[currentPeriod];

  return (
    <header
      className={cn(
        'status-bar w-full',
        'fixed top-0 left-0 right-0 z-40',
        'rounded-none border-x-0 border-t-0',
        'backdrop-blur-lg',
      )}
    >
      {/* 左侧：日期与时段 */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-sm font-title text-white/90 tracking-wider">
          第 <span className="text-amber-400 font-bold">{currentDay}</span> 天
        </span>
        <div className="flex items-center gap-1.5 text-xs text-gray-300">
          {period.icon}
          <span className="hidden sm:inline">{period.label}</span>
        </div>
      </div>

      {/* 分隔线 */}
      <div className="h-6 w-px bg-white/5 shrink-0" />

      {/* 认知度进度条 */}
      <ProgressBar
        value={awarenessLevel}
        colorClass="text-awareness-400"
        gradientFrom="rgba(96,165,250,0.6)"
        gradientTo="rgba(59,130,246,0.9)"
        label="認知度"
      />

      {/* 侵蚀率进度条 */}
      <ProgressBar
        value={erosionLevel}
        colorClass="text-erosion-400"
        pulseWhenAbove={60}
        gradientFrom="rgba(244,114,182,0.6)"
        gradientTo="rgba(236,72,153,0.9)"
        label="侵蝕率"
      />

      {/* 右侧：场景名称 */}
      <div
        className={cn(
          'hidden md:flex items-center gap-1.5 ml-auto shrink-0',
          'text-xs text-gray-400 truncate max-w-[140px]',
        )}
        title={currentScene}
      >
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-white/20" />
        {currentScene}
      </div>
    </header>
  );
};

export default StatusBar;
