import React, { useState, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useGame } from '@/game/engine/GameContext';
import type { NarrativeSegment } from '@/game/engine/types';
import TypewriterText from './TypewriterText';
import { ChevronDown } from 'lucide-react';

// ─── Props ──────────────────────────────────────────────────────────

interface DialogueBoxProps {
  /** 叙事片段列表 */
  segments: NarrativeSegment[];
  /** 当前片段索引 */
  currentIndex: number;
  /** 所有片段播放完成回调 */
  onComplete?: () => void;
}

// ─── 根据当前模式获取文本 ───────────────────────────────────────────

function getSegmentText(
  segment: NarrativeSegment,
  mode: 'resident' | 'truth',
): string {
  // 如果是真相模式且有 truthOnly 文本
  if (mode === 'truth' && segment.truthOnly) {
    return segment.text;
  }
  // 如果是居民模式且有 residentOnly 文本
  if (mode === 'resident' && segment.residentOnly) {
    return segment.text;
  }
  // 默认返回普通文本
  return segment.text;
}

// ─── Component ──────────────────────────────────────────────────────

export const DialogueBox: React.FC<DialogueBoxProps> = ({
  segments,
  currentIndex,
  onComplete,
}) => {
  const { state } = useGame();
  const perceptionMode = state.perceptionMode ?? 'resident';

  const currentSegment = segments[currentIndex];
  const isLastSegment = currentIndex >= segments.length - 1;

  const [typewriterComplete, setTypewriterComplete] = useState(false);
  const [localIndex, setLocalIndex] = useState(currentIndex);

  // 重置打字机状态当片段变化
  useEffect(() => {
    setTypewriterComplete(false);
  }, [currentIndex, currentSegment?.id]);

  // 同步外部索引
  useEffect(() => {
    setLocalIndex(currentIndex);
  }, [currentIndex]);

  // 点击继续
  const handleContinue = useCallback(() => {
    if (!typewriterComplete) {
      // 跳过打字机效果
      setTypewriterComplete(true);
      return;
    }
    if (isLastSegment) {
      onComplete?.();
    } else {
      setLocalIndex((prev) => prev + 1);
    }
  }, [typewriterComplete, isLastSegment, onComplete]);

  // 打字机完成
  const handleTypewriterComplete = useCallback(() => {
    setTypewriterComplete(true);
  }, []);

  if (!currentSegment) {
    return (
      <div className="game-panel text-center text-gray-500 text-sm py-8">
        没有更多对话内容。
      </div>
    );
  }

  const text = getSegmentText(currentSegment, perceptionMode);
  const isTruth = perceptionMode === 'truth' && !!currentSegment.truthOnly;
  const isResident =
    perceptionMode === 'resident' && !!currentSegment.residentOnly;

  // 尝试从 moodHint 或条件推断说话者
  const speakerName = currentSegment.moodHint ?? undefined;

  return (
    <div className="w-full space-y-3" onClick={handleContinue}>
      {/* 说话者标签 */}
      {speakerName && (
        <div className="flex items-center gap-2 px-1">
          <span
            className={cn(
              'text-xs font-semibold tracking-wider px-2 py-0.5 rounded',
              isTruth
                ? 'bg-amber-900/30 text-amber-300 border border-amber-700/30'
                : 'bg-gray-800/50 text-gray-300 border border-white/5',
            )}
          >
            {speakerName}
          </span>
          {isTruth && (
            <span className="text-[10px] text-amber-500/60 tracking-wider">
              [真相]
            </span>
          )}
        </div>
      )}

      {/* 叙事文本框 */}
      <div
        className={cn(
          'game-panel min-h-[100px]',
          isTruth && 'border-amber-500/20',
        )}
      >
        <TypewriterText
          key={`${currentSegment.id}-${localIndex}`}
          text={text}
          speed={35}
          onComplete={handleTypewriterComplete}
          isTruth={isTruth}
          isResident={isResident}
        />
      </div>

      {/* 进度指示器 */}
      <div className="flex items-center justify-between px-1">
        <div className="flex gap-1">
          {segments.map((_, idx) => (
            <span
              key={idx}
              className={cn(
                'h-1 rounded-full transition-all duration-300',
                idx === localIndex
                  ? 'w-6 bg-amber-400/60'
                  : idx < localIndex
                  ? 'w-2 bg-white/20'
                  : 'w-2 bg-white/5',
              )}
            />
          ))}
        </div>

        {/* 继续提示 */}
        <span
          className={cn(
            'text-xs flex items-center gap-1 transition-opacity',
            typewriterComplete ? 'opacity-100' : 'opacity-0',
            isTruth ? 'text-amber-400/60' : 'text-gray-500',
          )}
        >
          {isLastSegment ? '結束' : '点击继续'}
          <ChevronDown className="w-3 h-3 animate-bounce" />
        </span>
      </div>
    </div>
  );
};

export default DialogueBox;
