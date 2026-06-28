import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import type { Choice } from '@/game/engine/types';
import { useGame } from '@/game/engine/GameContext';
import {
  AlertTriangle,
  Eye,
  Skull,
  ArrowRight,
  Lock,
} from 'lucide-react';

// ─── Props ──────────────────────────────────────────────────────────

interface ChoicePanelProps {
  /** 可选的选择支列表 */
  choices: Choice[];
  /** 选择回调 */
  onSelect: (choiceId: string) => void;
  /** 被锁定的选择支 ID 列表 */
  lockedChoices?: string[];
}

// ─── 类型对应的图标映射 ─────────────────────────────────────────────

const typeIcons: Record<string, React.ReactNode> = {
  danger: <Skull className="w-4 h-4 shrink-0" />,
  awareness: <Eye className="w-4 h-4 shrink-0" />,
  erosion: <AlertTriangle className="w-4 h-4 shrink-0" />,
};

// ─── 侵蚀依赖的样式变换 ─────────────────────────────────────────────

function getErosionStyle(erosionLevel: number): string {
  if (erosionLevel >= 80) return 'border-pink-600/50 bg-pink-900/30 text-pink-200 shadow-[0_0_12px_rgba(236,72,153,0.3)]';
  if (erosionLevel >= 60) return 'border-pink-500/40 bg-pink-800/25 text-pink-300';
  if (erosionLevel >= 40) return 'border-pink-400/30 bg-pink-700/20';
  if (erosionLevel >= 20) return 'border-pink-300/20 bg-pink-600/15';
  return '';
}

// ─── Component ──────────────────────────────────────────────────────

export const ChoicePanel: React.FC<ChoicePanelProps> = ({
  choices,
  onSelect,
  lockedChoices = [],
}) => {
  const { state } = useGame();
  const erosionLevel = state.erosionLevel ?? 0;
  const [visible, setVisible] = useState(false);

  // 入场动画
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, [choices]);

  if (!choices.length) return null;

  return (
    <div className="space-y-3">
      {choices.map((choice, index) => {
        const isLocked = lockedChoices.includes(choice.id);
        const hasCondition = !!choice.condition && !isLocked;

        // 判断是否为侵蚀依赖型选择
        const isErosionChoice =
          choice.tags?.some((t) => t === 'erosion' || t === 'transformation') ?? false;
        const erosionStyle = isErosionChoice
          ? getErosionStyle(erosionLevel)
          : '';

        // 出场动画延迟
        const delay = index * 80;

        return (
          <button
            key={choice.id}
            disabled={isLocked}
            onClick={() => {
              if (!isLocked) onSelect(choice.id);
            }}
            className={cn(
              // 基础样式
              'choice-button flex items-start gap-3',
              'transform transition-all duration-300',
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
              // 类型样式
              choice.tags?.includes('danger') && 'danger',
              choice.tags?.includes('awareness') && 'awareness',
              choice.tags?.includes('erosion') && 'erosion',
              // 侵蚀依赖样式
              erosionStyle,
              // 锁定样式
              isLocked && 'opacity-40 cursor-not-allowed line-through decoration-gray-500/50',
            )}
            style={{ transitionDelay: `${delay}ms` }}
          >
            {/* 图标区域 */}
            <span className="mt-0.5 shrink-0">
              {isLocked ? (
                <Lock className="w-4 h-4 text-gray-500" />
              ) : (
                choice.tags?.reduce((_, tag) => typeIcons[tag] ?? null, null) ?? (
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                )
              )}
            </span>

            {/* 文本区 */}
            <span className="flex-1 min-w-0">
              <span className="block text-sm leading-snug">{choice.text}</span>

              {/* 锁定原因或条件提示 */}
              {isLocked && choice.conditionHint && (
                <span className="block mt-1 text-xs text-gray-500 italic">
                  {choice.conditionHint}
                </span>
              )}
              {hasCondition && choice.conditionHint && !isLocked && (
                <span className="block mt-1 text-xs text-gray-400/60">
                  {choice.conditionHint}
                </span>
              )}

              {/* 反馈预览 */}
              {choice.feedback && (
                <span className="block mt-1 text-xs text-gray-400/50 italic">
                  {choice.feedback}
                </span>
              )}
            </span>

            {/* 分数指示器（计分制使用） */}
            {choice.score !== undefined && (
              <span
                className={cn(
                  'shrink-0 text-xs font-mono px-1.5 py-0.5 rounded',
                  'bg-white/5 text-gray-400',
                )}
              >
                {choice.score > 0 ? '+' : ''}{choice.score}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ChoicePanel;
