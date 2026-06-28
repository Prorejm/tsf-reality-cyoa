import React from 'react';
import { cn } from '@/lib/utils';
import { useGame } from '@/game/engine/GameContext';

// ─── Props ──────────────────────────────────────────────────────────

interface ErosionMeterProps {
  /** 当前侵蚀值（0~100），默认从 GameState 读取 */
  erosionLevel?: number;
  /** 最大侵蚀值，默认 100 */
  maxErosion?: number;
}

// ─── 阶段配置 ───────────────────────────────────────────────────────

interface StageConfig {
  /** 阶段阈值（最小值） */
  threshold: number;
  /** 阶段标签 */
  label: string;
  /** 阶段描述 */
  description: string;
  /** 进度条颜色（起始） */
  barFrom: string;
  /** 进度条颜色（结束） */
  barTo: string;
  /** 文字颜色 */
  textClass: string;
}

const STAGES: StageConfig[] = [
  {
    threshold: 0,
    label: '违和感',
    description: '偶尔感到不协调，但一切仍在常识框架内。',
    barFrom: '#22c55e',
    barTo: '#4ade80',
    textClass: 'text-green-400',
  },
  {
    threshold: 25,
    label: '侵蚀',
    description: '现实开始出现裂痕，异常正在渗入日常生活。',
    barFrom: '#eab308',
    barTo: '#facc15',
    textClass: 'text-yellow-400',
  },
  {
    threshold: 50,
    label: '同化',
    description: '「新常识」正在覆盖你的认知，你的一部分已不再属于人类。',
    barFrom: '#f97316',
    barTo: '#fb923c',
    textClass: 'text-orange-400',
  },
  {
    threshold: 75,
    label: '丧失',
    description: '你正在溶解于异界之中……旧日的自我即将彻底消失。',
    barFrom: '#dc2626',
    barTo: '#ef4444',
    textClass: 'text-rose-400',
  },
];

// ─── 阶段检测 ───────────────────────────────────────────────────────

function getCurrentStage(value: number): StageConfig {
  let stage = STAGES[0];
  for (const s of STAGES) {
    if (value >= s.threshold) stage = s;
  }
  return stage;
}

// ─── Component ──────────────────────────────────────────────────────

export const ErosionMeter: React.FC<ErosionMeterProps> = ({
  erosionLevel: externalErosion,
  maxErosion = 100,
}) => {
  const { state } = useGame();
  const level = externalErosion ?? state.erosionLevel ?? 0;

  const pct = Math.min((level / maxErosion) * 100, 100);
  const currentStage = getCurrentStage(level);
  const isHighErosion = level >= 60;

  return (
    <div className="w-full space-y-2">
      {/* 标题行 */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500 uppercase tracking-wider">
          侵蝕率
        </span>
        <span
          className={cn(
            'text-xs font-mono tabular-nums',
            currentStage.textClass,
          )}
        >
          {level} / {maxErosion}
        </span>
      </div>

      {/* 阶段性进度条 */}
      <div
        className={cn(
          'relative h-3 rounded-full overflow-hidden',
          'bg-white/5 border border-white/5',
          isHighErosion && 'animate-erosion-pulse',
        )}
      >
        {/* 背景色块区域标记 */}
        {STAGES.map((stage, idx) => {
          const startPct = (stage.threshold / maxErosion) * 100;
          const endPct =
            idx < STAGES.length - 1
              ? (STAGES[idx + 1].threshold / maxErosion) * 100
              : 100;

          return (
            <div
              key={stage.label}
              className="absolute top-0 h-full"
              style={{
                left: `${startPct}%`,
                width: `${endPct - startPct}%`,
                background:
                  pct > startPct
                    ? `linear-gradient(90deg, ${stage.barFrom}, ${stage.barTo})`
                    : 'rgba(255,255,255,0.03)',
                opacity: pct > startPct ? 1 : 0.3,
                transition: 'all 0.7s ease-out',
              }}
            />
          );
        })}

        {/* 阈值分隔线 */}
        {STAGES.slice(1).map((stage) => {
          const pos = (stage.threshold / maxErosion) * 100;
          return (
            <div
              key={`divider-${stage.label}`}
              className="absolute top-0 h-full w-px bg-white/10"
              style={{ left: `${pos}%` }}
            />
          );
        })}

        {/* 当前值指示器 */}
        <div
          className="absolute top-0 h-full transition-all duration-700 ease-out"
          style={{
            left: `${pct}%`,
            width: '4px',
            marginLeft: '-2px',
            background: 'white',
            boxShadow: `0 0 6px ${currentStage.barTo}`,
          }}
        />
      </div>

      {/* 阶段标签 */}
      <div className="flex items-center justify-between">
        <span
          className={cn(
            'text-sm font-semibold tracking-wide',
            currentStage.textClass,
          )}
        >
          {currentStage.label}
        </span>

        {/* 侵蚀值高度警告 */}
        {isHighErosion && (
          <span
            className={cn(
              'text-[10px] uppercase tracking-widest',
              'text-rose-400/80 animate-pulse',
            )}
          >
            ⚠ 危險
          </span>
        )}
      </div>

      {/* 阶段描述文本 */}
      <p
        className={cn(
          'text-xs leading-relaxed text-gray-400/70',
          'transition-opacity duration-300',
        )}
      >
        {currentStage.description}
      </p>
    </div>
  );
};

export default ErosionMeter;
