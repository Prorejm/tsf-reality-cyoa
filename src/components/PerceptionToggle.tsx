import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useGame } from '@/game/engine/GameContext';
import { Eye, EyeOff, Info } from 'lucide-react';

// ─── 视角切换工具提示 ───────────────────────────────────────────────

const TOOLTIP_TEXT =
  '切换至真相视角，揭露隐藏在日常假象背后的真实。\n某些选择和信息将因视角不同而产生变化。';

const LOCKED_TOOLTIP_TEXT =
  '认知度不足 (10)。\n你需要累积更多异常线索才能解锁真相视角。';

// ─── Component ──────────────────────────────────────────────────────

export const PerceptionToggle: React.FC = () => {
  const { state, dispatch } = useGame();
  const { perceptionMode, awarenessLevel } = state;

  const isTruth = perceptionMode === 'truth';
  const isLocked = awarenessLevel < 10 && !isTruth;

  const [animating, setAnimating] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleToggle = useCallback(() => {
    if (isLocked) return;
    setAnimating(true);
    dispatch({ type: 'SWITCH_PERCEPTION' });
    setTimeout(() => setAnimating(false), 800);
  }, [isLocked, dispatch]);

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        disabled={isLocked}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        className={cn(
          'perception-toggle',
          'flex items-center gap-2 px-3 py-2 rounded-full',
          'text-xs font-game tracking-wider',
          animating && 'animate-perception-flicker',
          isLocked && 'opacity-40 cursor-not-allowed',
          isTruth
            ? 'text-amber-400 border-amber-400/40 bg-amber-900/20'
            : 'text-gray-400 border-white/10 bg-black/40',
        )}
        aria-label={isTruth ? '当前：真相视角' : '当前：住民视角'}
      >
        {isTruth ? (
          <Eye className="w-4 h-4" />
        ) : (
          <EyeOff className="w-4 h-4" />
        )}

        <span className="hidden sm:inline">
          {isTruth ? '真相視点' : '住民視点'}
        </span>

        {/* 锁定标记 */}
        {isLocked && (
          <Info className="w-3 h-3 text-gray-500" />
        )}
      </button>

      {/* 工具提示 */}
      {showTooltip && (
        <div
          className={cn(
            'absolute top-full right-0 mt-2 z-50',
            'w-56 p-3 rounded-lg',
            'bg-gray-900/95 backdrop-blur-md border border-white/10',
            'text-xs text-gray-300 leading-relaxed whitespace-pre-line',
            'shadow-2xl',
          )}
        >
          {isLocked ? LOCKED_TOOLTIP_TEXT : TOOLTIP_TEXT}
        </div>
      )}
    </div>
  );
};

export default PerceptionToggle;
