import React, { useEffect, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useGame } from '@/game/engine/GameContext';

// ─── Props ──────────────────────────────────────────────────────────

interface DayTransitionProps {
  /** 新的天数 */
  day: number;
  /** 特殊日期名称（如 "月圆之夜"） */
  specialDate?: string;
  /** 切换完成回调 */
  onComplete?: () => void;
}

// ─── 特殊日期样式配置 ───────────────────────────────────────────────

const SPECIAL_DATE_COLORS: Record<string, { text: string; glow: string; icon: string }> = {
  '月圆之夜': {
    text: 'text-amber-200',
    glow: 'rgba(251,191,36,0.4)',
    icon: '🌕',
  },
  '血月': {
    text: 'text-red-300',
    glow: 'rgba(239,68,68,0.4)',
    icon: '🔴',
  },
  '异界之门': {
    text: 'text-purple-300',
    glow: 'rgba(168,85,247,0.4)',
    icon: '🌀',
  },
};

// ─── 根据日期生成叙事摘要 ───────────────────────────────────────────

function getDayNarrative(day: number, specialDate?: string): string {
  if (specialDate) {
    return `特殊的日子降临了……${specialDate}的到来改变了小镇的"常识"。空气中弥漫着不寻常的气息。`;
  }
  if (day <= 1) {
    return '一切从这一天开始。你还没有意识到，你熟知的"现实"即将被改写。';
  }
  if (day <= 3) {
    return '日常仍在继续，但细微的违和感开始浮现。某些事物正在悄然改变。';
  }
  if (day <= 7) {
    return '你开始注意到世界的裂痕。真相与常识之间的边界变得越来越模糊。';
  }
  if (day <= 14) {
    return '侵蚀正在加速。周围的"常识"变得越来越奇怪，而你对异常的感知也越来越清晰。';
  }
  if (day <= 21) {
    return '现实的面纱正在剥落。你已无法确定，究竟哪一边才是真正的"世界"。';
  }
  return '终局临近。你所知道的一切都将被重新定义。';
}

// ─── Component ──────────────────────────────────────────────────────

export const DayTransition: React.FC<DayTransitionProps> = ({
  day,
  specialDate,
  onComplete,
}) => {
  const { state } = useGame();
  const erosionLevel = state.erosionLevel ?? 0;

  const [phase, setPhase] = useState<'enter' | 'display' | 'exit' | 'done'>('enter');

  const narrative = getDayNarrative(day, specialDate);
  const specialConfig = specialDate
    ? SPECIAL_DATE_COLORS[specialDate] ?? {
        text: 'text-amber-200',
        glow: 'rgba(251,191,36,0.4)',
        icon: '✦',
      }
    : null;

  // 动画生命周期
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('display'), 200);
    const t2 = setTimeout(() => setPhase('exit'), 2500);
    const t3 = setTimeout(() => {
      setPhase('done');
      onComplete?.();
    }, 3200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  // 点击快速跳过
  const handleDismiss = useCallback(() => {
    setPhase('exit');
    setTimeout(() => {
      setPhase('done');
      onComplete?.();
    }, 300);
  }, [onComplete]);

  if (phase === 'done') return null;

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center"
      onClick={handleDismiss}
    >
      {/* 全屏覆盖 */}
      <div
        className={cn(
          'absolute inset-0 transition-opacity duration-700',
          'bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950',
          phase === 'enter' && 'opacity-0',
          phase === 'display' && 'opacity-100',
          phase === 'exit' && 'opacity-0',
        )}
      />

      {/* 侵蚀值影响背景色彩 */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          background:
            erosionLevel > 50
              ? `radial-gradient(ellipse at center, rgba(236,72,153,${erosionLevel / 300}), transparent 70%)`
              : 'none',
          opacity: phase === 'display' ? 0.3 : 0,
        }}
      />

      {/* 内容 */}
      <div
        className={cn(
          'relative z-10 text-center space-y-6 px-6',
          'transition-all duration-700',
          phase === 'enter' && 'opacity-0 translate-y-8 scale-95',
          phase === 'display' && 'opacity-100 translate-y-0 scale-100',
          phase === 'exit' && 'opacity-0 translate-y-[-20px] scale-95 blur-sm',
        )}
      >
        {/* 第 X 天 */}
        <div className="space-y-2">
          <p
            className={cn(
              'text-xs tracking-[0.4em] uppercase',
              'text-gray-500',
            )}
          >
            — Day —
          </p>
          <h1
            className={cn(
              'text-5xl sm:text-7xl font-title font-bold tracking-wider',
              specialConfig ? specialConfig.text : 'text-white',
            )}
            style={
              specialConfig
                ? { textShadow: `0 0 30px ${specialConfig.glow}` }
                : {}
            }
          >
            {specialConfig && (
              <span className="mr-3">{specialConfig.icon}</span>
            )}
            第{day}天
          </h1>
        </div>

        {/* 特殊日期横幅 */}
        {specialDate && (
          <div
            className={cn(
              'inline-block px-6 py-2 rounded-full',
              'border border-amber-500/30',
              'bg-amber-900/20 backdrop-blur-sm',
            )}
          >
            <span
              className={cn(
                'text-sm font-semibold tracking-wider',
                specialConfig?.text ?? 'text-amber-200',
              )}
            >
              {specialDate}
            </span>
          </div>
        )}

        {/* 叙事摘要 */}
        <p
          className={cn(
            'max-w-md mx-auto text-sm leading-relaxed',
            'text-gray-400/80',
          )}
        >
          {narrative}
        </p>

        {/* 跳过提示 */}
        <p className="text-[10px] text-gray-600">
          点击任意处跳过
        </p>
      </div>
    </div>
  );
};

export default DayTransition;
