import React, { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { useGame } from '@/game/engine/GameContext';

// ─── 角色首字母色板 ─────────────────────────────────────────────────

const AVATAR_PALETTE = [
  'from-pink-500 to-rose-500',
  'from-violet-500 to-purple-600',
  'from-blue-500 to-cyan-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-indigo-500 to-blue-600',
  'from-fuchsia-500 to-pink-600',
  'from-rose-500 to-red-500',
];

function hashId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash) + id.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getGradient(id: string): string {
  return AVATAR_PALETTE[hashId(id) % AVATAR_PALETTE.length];
}

function getInitials(id: string): string {
  // 取 ID 中大写字母或前两个字符
  const upper = id.replace(/[^A-Z]/g, '');
  if (upper.length >= 2) return upper.slice(0, 2).toUpperCase();
  return id.slice(0, 2).toUpperCase();
}

// ─── 阶段变换装饰 ───────────────────────────────────────────────────

interface StageDecoration {
  glowColor: string;
  borderClass: string;
  distortionClass: string;
  label: string;
}

function getStageDecoration(erosionLevel: number): StageDecoration {
  if (erosionLevel >= 75) {
    return {
      glowColor: 'rgba(236,72,153,0.8)',
      borderClass: 'border-erosion-500 animate-erosion-pulse',
      distortionClass: 'blur-[1px] contrast-125',
      label: '深度侵蚀',
    };
  }
  if (erosionLevel >= 50) {
    return {
      glowColor: 'rgba(249,115,22,0.6)',
      borderClass: 'border-orange-500/60',
      distortionClass: 'contrast-110',
      label: '侵蚀中',
    };
  }
  if (erosionLevel >= 25) {
    return {
      glowColor: 'rgba(234,179,8,0.4)',
      borderClass: 'border-yellow-500/40',
      distortionClass: '',
      label: '违和感',
    };
  }
  return {
    glowColor: 'transparent',
    borderClass: 'border-white/10',
    distortionClass: '',
    label: '',
  };
}

// ─── Props ──────────────────────────────────────────────────────────

interface CharacterPortraitProps {
  /** 角色 ID */
  characterId: string;
  /** 当前模式 */
  mode: 'resident' | 'truth';
  /** 额外类名 */
  className?: string;
  /** 自定义尺寸 (px) */
  size?: number;
  /** 自定义装饰阶段（不传则从 GameState 侵蚀值自动推断） */
  stageOverride?: number;
}

// ─── Component ──────────────────────────────────────────────────────

export const CharacterPortrait: React.FC<CharacterPortraitProps> = ({
  characterId,
  mode,
  className,
  size = 80,
  stageOverride,
}) => {
  const { state } = useGame();
  const erosionLevel = stageOverride ?? state.erosionLevel ?? 0;

  const gradient = useMemo(() => getGradient(characterId), [characterId]);
  const initials = useMemo(() => getInitials(characterId), [characterId]);
  const decoration = useMemo(
    () => getStageDecoration(erosionLevel),
    [erosionLevel],
  );

  const [imgError, setImgError] = useState(false);

  // 头像路径（约定：/characters/{id}.png）
  const imagePath = `/characters/${characterId}.png`;

  return (
    <div
      className={cn(
        'relative inline-flex flex-col items-center gap-1',
        className,
      )}
      style={{ width: size }}
    >
      {/* 头像区域 */}
      <div
        className={cn(
          'relative rounded-full overflow-hidden',
          'border-2 transition-all duration-500',
          decoration.borderClass,
          'flex items-center justify-center',
          mode === 'truth' && decoration.distortionClass,
        )}
        style={{
          width: size,
          height: size,
          boxShadow: mode === 'truth'
            ? `0 0 ${size * 0.3}px ${decoration.glowColor}`
            : '0 2px 8px rgba(0,0,0,0.3)',
        }}
      >
        {/* 尝试加载图片，失败时显示渐变色+首字母 */}
        {!imgError ? (
          <img
            src={imagePath}
            alt={characterId}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
            draggable={false}
          />
        ) : null}

        {/* 回退：渐变色 + 首字母 */}
        {imgError && (
          <div
            className={cn(
              'w-full h-full bg-gradient-to-br flex items-center justify-center',
              gradient,
            )}
          >
            <span
              className="font-bold text-white/80 select-none"
              style={{
                fontSize: size * 0.38,
                textShadow: '0 1px 3px rgba(0,0,0,0.3)',
              }}
            >
              {initials}
            </span>
          </div>
        )}

        {/* 真相模式扭曲叠加 */}
        {mode === 'truth' && (
          <div
            className="absolute inset-0 pointer-events-none mix-blend-overlay"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${decoration.glowColor}20, transparent 70%)`,
            }}
          />
        )}
      </div>

      {/* 侵蚀阶段标签 */}
      {decoration.label && (
        <span
          className={cn(
            'text-[10px] font-mono tracking-wider',
            'text-erosion-400/70',
          )}
        >
          {decoration.label}
        </span>
      )}

      {/* 模式标签 */}
      {mode === 'truth' && (
        <span
          className={cn(
            'absolute -top-1 -right-1',
            'w-4 h-4 rounded-full',
            'bg-amber-400 border-2 border-gray-900',
            'flex items-center justify-center',
          )}
          title="真相视角"
        >
          <span className="text-[8px] text-gray-900 font-bold">!</span>
        </span>
      )}
    </div>
  );
};

export default CharacterPortrait;
