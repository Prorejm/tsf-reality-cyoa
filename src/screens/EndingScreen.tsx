import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useGame } from '@/game/engine/GameContext';
import { cn } from '@/lib/utils';
import { getEndingById, ENDINGS } from '@/game/data/endingsData';
import type { EndingEntry } from '@/game/data/endingsData';

const ENDING_TYPE_COLORS: Record<string, string> = {
  true_end: 'from-amber-400/30 via-yellow-500/20 to-amber-600/10',
  normal_end: 'from-blue-400/20 via-blue-500/10 to-blue-600/5',
  bad_end: 'from-rose-600/30 via-red-700/20 to-rose-900/10',
  hidden_end: 'from-purple-400/30 via-fuchsia-500/20 to-purple-600/10',
  route_end: 'from-emerald-400/20 via-teal-500/10 to-emerald-600/5',
};

const ENDING_TYPE_NAMES: Record<string, string> = {
  true_end: 'TRUE END',
  normal_end: 'NORMAL END',
  bad_end: 'BAD END',
  hidden_end: 'HIDDEN END',
  route_end: 'ROUTE END',
};

const ENDING_TYPE_BORDER: Record<string, string> = {
  true_end: 'border-amber-500/30 text-amber-300/80 bg-amber-500/5',
  normal_end: 'border-blue-500/20 text-blue-300/60 bg-blue-500/5',
  bad_end: 'border-rose-500/30 text-rose-300/80 bg-rose-500/5',
  hidden_end: 'border-purple-500/30 text-purple-300/80 bg-purple-500/5',
  route_end: 'border-emerald-500/20 text-emerald-300/60 bg-emerald-500/5',
};

const ENDING_TYPE_TITLE: Record<string, string> = {
  true_end: 'text-amber-200 drop-shadow-[0_0_20px_rgba(251,191,36,0.3)]',
  normal_end: 'text-blue-200',
  bad_end: 'text-rose-300 drop-shadow-[0_0_20px_rgba(244,63,94,0.3)]',
  hidden_end: 'text-purple-200 drop-shadow-[0_0_20px_rgba(168,85,247,0.3)]',
  route_end: 'text-emerald-200',
};

const EndingScreen: React.FC = () => {
  const { state, dispatch } = useGame();

  // Read current ending from flags
  const currentEndingId = ((state.flags ?? {})['_current_ending'] as string) ?? '';
  const endingData = useMemo(() => getEndingById(currentEndingId), [currentEndingId]);

  // Collect unlocked endings from state.endings + badEnds
  const unlockedEndings = state.endings ?? [];
  const unlockedBadEnds = state.badEnds.map((b) => b.id);

  const endingType = endingData?.type ?? 'normal_end';
  const isErosionEnding = (state.erosionLevel ?? 0) > 70;
  const isAwarenessEnding = (state.awarenessLevel ?? 0) > 70;

  const daysSpent = state.currentDay ?? 1;
  const discoveriesCount = state.discoveries?.length ?? 0;
  const finalErosion = state.erosionLevel ?? 0;
  const finalAwareness = state.awarenessLevel ?? 0;
  const metNpcs = Object.values(state?.npcRelations ?? {}).filter((r: any) => r?.met).length;

  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setTimeout(() => setFadeIn(true), 200);
  }, []);

  const handleReturnToTitle = useCallback(() => {
    dispatch({ type: 'NEW_GAME', payload: undefined });
  }, [dispatch]);

  const handleNewPlaythrough = useCallback(() => {
    dispatch({ type: 'NEW_GAME', payload: undefined });
    dispatch({
      type: 'SET_FLAG',
      payload: { key: '_screen', value: 'exploration' },
    });
  }, [dispatch]);

  const handleViewEndings = useCallback(() => {
    dispatch({
      type: 'SET_FLAG',
      payload: { key: '_screen', value: 'journal' },
    });
  }, [dispatch]);

  const handleBack = useCallback(() => {
    dispatch({
      type: 'SET_FLAG',
      payload: { key: '_screen', value: 'exploration' },
    });
  }, [dispatch]);

  return (
    <div
      className={cn(
        'relative min-h-screen overflow-hidden transition-all duration-1000',
        isErosionEnding
          ? 'bg-gradient-to-b from-[#1a0a0a] via-[#2d0f1a] to-[#1a0a0a]'
          : isAwarenessEnding
          ? 'bg-gradient-to-b from-[#0a0a1a] via-[#0f1a2d] to-[#0a0a1a]'
          : 'bg-gradient-to-b from-[#0f0c29] via-[#1a1530] to-[#0f0c29]',
      )}
    >
      {/* Background effects */}
      <div
        className={cn(
          'absolute inset-0 opacity-20',
          isErosionEnding
            ? 'bg-gradient-to-b from-pink-500/10 via-red-500/5 to-transparent'
            : isAwarenessEnding
            ? 'bg-gradient-to-b from-blue-500/10 via-cyan-500/5 to-transparent'
            : 'bg-gradient-to-b from-purple-500/5 via-transparent to-transparent',
        )}
      />

      <div
        className={cn(
          'relative z-10 game-container min-h-screen flex flex-col items-center justify-center text-center transition-all duration-1000',
          fadeIn ? 'opacity-100' : 'opacity-0',
        )}
      >
        {/* Ending Type Badge */}
        <div
          className={cn(
            'mb-6 px-4 py-1.5 rounded-full text-xs tracking-[0.3em] border',
            ENDING_TYPE_BORDER[endingType] ?? ENDING_TYPE_BORDER.normal_end,
          )}
        >
          {ENDING_TYPE_NAMES[endingType] ?? endingType}
        </div>

        {/* Ending Title */}
        <h1
          className={cn(
            'font-title text-5xl md:text-6xl mb-6 tracking-wider',
            ENDING_TYPE_TITLE[endingType] ?? ENDING_TYPE_TITLE.normal_end,
          )}
        >
          {endingData?.nameCN ?? endingData?.name ?? '未知的结局'}
        </h1>

        {/* Ending Narrative — from endingsData.ts */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="narrative-text text-sm md:text-base leading-relaxed text-gray-200/90 mb-6 whitespace-pre-line">
            {endingData?.narrative ?? '结局描述未找到。'}
          </div>

          {/* Epilogue */}
          {endingData?.epilogue && (
            <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
              <p className="text-sm italic text-gray-300/80 font-journal">
                {endingData.epilogue}
              </p>
            </div>
          )}

          {/* Tags */}
          {endingData?.tags && endingData.tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1.5 mt-4">
              {endingData.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-full text-[9px] bg-white/5 border border-white/10 text-gray-400"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="game-panel w-full max-w-md mb-8">
          <h3 className="text-xs text-gray-400 mb-3 tracking-wider">
            这次旅程的轨迹
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <p className="text-2xl font-title text-gray-200">{daysSpent}</p>
              <p className="text-[10px] text-gray-500">经历天数</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-title text-gray-200">{discoveriesCount}</p>
              <p className="text-[10px] text-gray-500">发现数量</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-title text-pink-300">{finalErosion}%</p>
              <p className="text-[10px] text-gray-500">最终侵蚀</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-title text-blue-300">{finalAwareness}%</p>
              <p className="text-[10px] text-gray-500">最终认知</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-title text-gray-200">{metNpcs}</p>
              <p className="text-[10px] text-gray-500">结识的NPC</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-title text-gray-200">{unlockedEndings.length + unlockedBadEnds.length}</p>
              <p className="text-[10px] text-gray-500">结局收集</p>
            </div>
          </div>
        </div>

        {/* Collection Progress */}
        <div className="game-panel w-full max-w-md mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400">结局收集</span>
            <span className="text-xs text-gray-500">
              {unlockedEndings.length + unlockedBadEnds.length} / {ENDINGS.length}
            </span>
          </div>
          <div className="flex gap-1 mb-2">
            {ENDINGS.slice(0, 7).map((_, i) => (
              <div
                key={`normal-${i}`}
                className={cn(
                  'flex-1 h-2 rounded-full',
                  i < unlockedEndings.length ? 'bg-amber-400/40' : 'bg-gray-800/50',
                )}
              />
            ))}
          </div>
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-gray-500">普通结局 {unlockedEndings.length}/{ENDINGS.length}</span>
            <span className="text-gray-500">Bad End {unlockedBadEnds.length}/9</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={handleBack}
            className={cn(
              'w-64 px-8 py-3 rounded-lg border transition-all duration-300 font-game text-sm',
              'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white',
            )}
          >
            ← 返回探索
          </button>
          <button
            onClick={handleReturnToTitle}
            className={cn(
              'w-64 px-8 py-3 rounded-lg border transition-all duration-300 font-game text-sm',
              'border-purple-500/30 bg-purple-500/10 text-purple-200 hover:bg-purple-500/20 hover:text-white',
            )}
          >
            返回标题
          </button>
          <button
            onClick={handleNewPlaythrough}
            className={cn(
              'w-64 px-8 py-3 rounded-lg border transition-all duration-300 font-game text-sm',
              'border-amber-500/30 bg-amber-500/10 text-amber-200 hover:bg-amber-500/20 hover:text-white',
            )}
          >
            开始新周目
          </button>
          <button
            onClick={handleViewEndings}
            className={cn(
              'w-64 px-8 py-3 rounded-lg border transition-all duration-300 font-game text-sm',
              'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white',
            )}
          >
            查看结局图鉴
          </button>
        </div>

        <p className="mt-8 text-[10px] text-gray-700 tracking-widest">
          TSF Reality CYOA — 你的每一段旅程都值得铭记。
        </p>
      </div>
    </div>
  );
};

export default EndingScreen;
