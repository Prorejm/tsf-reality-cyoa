import React, { useEffect, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

// ─── Props ──────────────────────────────────────────────────────────

interface RealityBreakProps {
  /** 扭曲强度 */
  intensity?: 'mild' | 'moderate' | 'severe';
  /** 动画完成回调 */
  onComplete?: () => void;
}

// ─── 强度配置 ───────────────────────────────────────────────────────

const intensityConfig = {
  mild: {
    duration: 1500,
    shakeAmount: 2,
    noiseOpacity: 0.15,
    colorShift: 'hue-rotate(45deg)',
    text: '現実が歪む……',
    overlayClass: 'bg-gradient-to-b from-transparent via-purple-900/10 to-transparent',
  },
  moderate: {
    duration: 2500,
    shakeAmount: 4,
    noiseOpacity: 0.25,
    colorShift: 'hue-rotate(120deg) saturate(1.5)',
    text: '現実が歪む……',
    overlayClass: 'bg-gradient-to-b from-transparent via-purple-800/20 to-transparent',
  },
  severe: {
    duration: 3500,
    shakeAmount: 7,
    noiseOpacity: 0.4,
    colorShift: 'hue-rotate(180deg) saturate(2) contrast(1.3)',
    text: '現実が歪む……',
    overlayClass: 'bg-gradient-to-b from-transparent via-fuchsia-900/30 to-transparent',
  },
};

// ─── 静态噪点生成 ───────────────────────────────────────────────────

function generateNoiseSvg(opacity: number): string {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='${opacity}'/%3E%3C/svg%3E`;
}

// ─── Component ──────────────────────────────────────────────────────

export const RealityBreak: React.FC<RealityBreakProps> = ({
  intensity = 'moderate',
  onComplete,
}) => {
  const config = intensityConfig[intensity];
  const [phase, setPhase] = useState<'enter' | 'active' | 'exit' | 'done'>('enter');

  // 动画生命周期
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('active'), 50);
    const t2 = setTimeout(() => setPhase('exit'), config.duration * 0.7);
    const t3 = setTimeout(() => {
      setPhase('done');
      onComplete?.();
    }, config.duration);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [config.duration, onComplete]);

  // 键盘/点击提前结束
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
      className="fixed inset-0 z-[100]"
      onClick={handleDismiss}
    >
      {/* 全屏覆盖层 */}
      <div
        className={cn(
          'reality-break-overlay',
          'flex items-center justify-center',
          'transition-all duration-500',
          phase === 'enter' && 'opacity-0',
          phase === 'active' && 'opacity-100',
          phase === 'exit' && 'opacity-0 scale-110',
        )}
      >
        {/* 屏幕震动 */}
        <div
          className={cn(
            'absolute inset-0',
            'transition-transform duration-75',
            phase === 'active' && 'animate-reality-break',
          )}
          style={{
            filter: phase === 'active' ? config.colorShift : 'none',
          }}
        >
          {/* 颜色扭曲覆盖 */}
          <div
            className={cn(
              'absolute inset-0 mix-blend-overlay',
              config.overlayClass,
            )}
          />

          {/* 静态噪点 */}
          <div
            className="absolute inset-0 mix-blend-screen pointer-events-none"
            style={{
              backgroundImage: `url('${generateNoiseSvg(config.noiseOpacity)}')`,
              backgroundSize: '200px 200px',
              opacity: phase === 'active' ? 1 : 0,
              transition: 'opacity 0.3s',
            }}
          />

          {/* 扫描线 */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
            }}
          />
        </div>

        {/* 叙事文本 */}
        <div
          className={cn(
            'relative z-10 text-center',
            'transition-all duration-500',
            phase === 'enter' && 'opacity-0 scale-95',
            phase === 'active' && 'opacity-100 scale-100',
            phase === 'exit' && 'opacity-0 scale-90 blur-sm',
          )}
        >
          <p
            className={cn(
              'text-2xl sm:text-3xl font-title tracking-[0.3em]',
              'text-amber-200/90 drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]',
            )}
          >
            {config.text}
          </p>
          <p className="mt-4 text-xs text-gray-500/50">
            点击任意处关闭
          </p>
        </div>
      </div>
    </div>
  );
};

export default RealityBreak;
