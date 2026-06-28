import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useGame } from '@/game/engine/GameContext';
import { cn } from '@/lib/utils';
import { MISSIONS, getMissionById, checkMissionPrerequisites } from '@/game/data/missionsData';
import type { MissionData } from '@/game/data/missionsData';

// ============================================================================
// Types
// ============================================================================

interface MissionProgress {
  missionId: string;
  active: boolean;
  completed: boolean;
  objectivesProgress: Record<string, number>;
  activatedAtDay: number;
}

// ============================================================================
// Helpers
// ============================================================================

const MISSION_TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  main: { label: '主线', color: 'text-amber-300 border-amber-500/30 bg-amber-500/10' },
  side: { label: '支线', color: 'text-blue-300 border-blue-500/30 bg-blue-500/10' },
  tsf: { label: 'TSF', color: 'text-pink-300 border-pink-500/30 bg-pink-500/10' },
  hidden: { label: '隐藏', color: 'text-purple-300 border-purple-500/30 bg-purple-500/10' },
  daily: { label: '日常', color: 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10' },
};

function readMissionProgress(state: any): MissionProgress[] {
  const raw = state.flags?.['_missions_progress'];
  if (!raw) return MISSIONS.map((m) => ({
    missionId: m.id,
    active: false,
    completed: false,
    objectivesProgress: {},
    activatedAtDay: 0,
  }));
  return raw as MissionProgress[];
}

function writeMissionProgress(state: any, dispatch: any, progress: MissionProgress[]) {
  dispatch({ type: 'SET_FLAG', payload: { key: '_missions_progress', value: progress } });
}

// ============================================================================
// Component
// ============================================================================

interface MissionTrackerProps {
  isOpen: boolean;
  onClose: () => void;
}

const MissionTracker: React.FC<MissionTrackerProps> = ({ isOpen, onClose }) => {
  const { state, dispatch } = useGame();

  // Read mission progress from state flags
  const missionProgress = useMemo(() => readMissionProgress(state), [state.flags?._missions_progress]);

  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('active');

  // Auto-activate missions when prerequisites are met
  useEffect(() => {
    if (!isOpen) return;
    const progress = readMissionProgress(state);
    let changed = false;

    for (const mission of MISSIONS) {
      const prog = progress.find((p) => p.missionId === mission.id);
      if (!prog || prog.completed || prog.active) continue;

      if (checkMissionPrerequisites(mission.prerequisites, state)) {
        prog.active = true;
        prog.activatedAtDay = state.currentDay ?? 1;
        changed = true;
      }
    }

    if (changed) {
      writeMissionProgress(state, dispatch, progress);
    }
  }, [isOpen, state, dispatch]);

  // Filter missions
  const filteredMissions = useMemo(() => {
    const list = MISSIONS.filter((m) => {
      const prog = missionProgress.find((p) => p.missionId === m.id);
      if (filter === 'active') return prog?.active && !prog.completed;
      if (filter === 'completed') return prog?.completed;
      return true; // 'all'
    });

    // Sort: active first, then by type priority
    const typeOrder: Record<string, number> = { main: 0, tsf: 1, side: 2, hidden: 3, daily: 4 };
    list.sort((a, b) => {
      const aProg = missionProgress.find((p) => p.missionId === a.id);
      const bProg = missionProgress.find((p) => p.missionId === b.id);
      const aActive = aProg?.active && !aProg?.completed ? 0 : 1;
      const bActive = bProg?.active && !bProg?.completed ? 0 : 1;
      if (aActive !== bActive) return aActive - bActive;
      return (typeOrder[a.type] ?? 99) - (typeOrder[b.type] ?? 99);
    });

    return list;
  }, [missionProgress, filter]);

  const selectedMission = useMemo(() => {
    if (!selectedMissionId) return null;
    return getMissionById(selectedMissionId) ?? null;
  }, [selectedMissionId]);

  const selectedProgress = useMemo(() => {
    if (!selectedMissionId) return null;
    return missionProgress.find((p) => p.missionId === selectedMissionId) ?? null;
  }, [selectedMissionId, missionProgress]);

  const activeCount = useMemo(
    () => missionProgress.filter((p) => p.active && !p.completed).length,
    [missionProgress],
  );

  const completedCount = useMemo(
    () => missionProgress.filter((p) => p.completed).length,
    [missionProgress],
  );

  const handleClose = useCallback(() => {
    setSelectedMissionId(null);
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-2xl max-h-[85vh] flex flex-col rounded-xl border border-white/10 bg-gray-900/95 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-sm">📋</span>
            <h2 className="text-sm font-bold text-gray-200 tracking-wider">任务追踪</h2>
            <span className="text-[10px] text-gray-500 ml-1">
              活跃 ({activeCount}) / 完成 ({completedCount}) / 总计 ({MISSIONS.length})
            </span>
          </div>
          <button
            onClick={handleClose}
            className="w-6 h-6 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors text-xs"
          >
            ✕
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 px-5 py-2 border-b border-white/5">
          {[
            { key: 'active' as const, label: `进行中 (${activeCount})` },
            { key: 'completed' as const, label: `已完成 (${completedCount})` },
            { key: 'all' as const, label: '全部' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={cn(
                'px-3 py-1 rounded-full text-[10px] tracking-wider font-game transition-all',
                filter === tab.key
                  ? 'bg-purple-500/20 border border-purple-400/30 text-purple-200'
                  : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-gray-200',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content area */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Mission list */}
          <div className={cn(
            'overflow-y-auto',
            selectedMissionId ? 'w-1/2 border-r border-white/5' : 'w-full',
          )}>
            {filteredMissions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-gray-500">
                <span className="text-2xl mb-2">📭</span>
                <p className="text-xs">没有符合条件的任务</p>
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {filteredMissions.map((mission) => {
                  const prog = missionProgress.find((p) => p.missionId === mission.id);
                  const isActive = prog?.active && !prog?.completed;
                  const isCompleted = prog?.completed;
                  const config = MISSION_TYPE_CONFIG[mission.type] ?? MISSION_TYPE_CONFIG.side;

                  return (
                    <button
                      key={mission.id}
                      onClick={() => setSelectedMissionId(mission.id)}
                      className={cn(
                        'w-full text-left px-3 py-2.5 rounded-lg transition-all border text-xs',
                        selectedMissionId === mission.id
                          ? 'border-purple-400/30 bg-purple-500/10'
                          : 'border-transparent hover:bg-white/5',
                        isCompleted && 'opacity-50',
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {/* Type badge */}
                        <span className={cn('px-1.5 py-0.5 rounded-full text-[9px] border', config.color)}>
                          {config.label}
                        </span>
                        {/* Title */}
                        <span className={cn(
                          'font-game tracking-wider truncate flex-1',
                          isCompleted ? 'text-gray-500 line-through' : 'text-gray-200',
                        )}>
                          {mission.nameCN}
                        </span>
                        {/* Status icon */}
                        {isCompleted && <span className="text-emerald-400/70 text-[10px]">✓</span>}
                        {isActive && <span className="text-amber-400/70 text-[10px]">●</span>}
                      </div>
                      <p className="text-[10px] text-gray-500 truncate leading-relaxed">
                        {mission.description}
                      </p>
                      {/* Progress dots */}
                      {isActive && (
                        <div className="flex gap-1 mt-1">
                          {mission.objectives.map((obj) => {
                            const objProg = prog?.objectivesProgress?.[obj.id] ?? 0;
                            const objCount = obj.count ?? 1;
                            const isObjDone = objProg >= objCount;
                            return (
                              <div
                                key={obj.id}
                                className={cn(
                                  'flex-1 h-1 rounded-full',
                                  isObjDone ? 'bg-amber-400/50' : 'bg-gray-700',
                                )}
                                title={obj.description}
                              />
                            );
                          })}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Detail panel */}
          {selectedMission && selectedProgress && (
            <div className="w-1/2 overflow-y-auto p-4">
              {/* Type + Status */}
              <div className="flex items-center gap-2 mb-3">
                <span className={cn('px-2 py-0.5 rounded-full text-[9px] border', MISSION_TYPE_CONFIG[selectedMission.type]?.color)}>
                  {MISSION_TYPE_CONFIG[selectedMission.type]?.label ?? selectedMission.type}
                </span>
                {selectedProgress.completed ? (
                  <span className="text-[10px] text-emerald-400/70">已完成</span>
                ) : selectedProgress.active ? (
                  <span className="text-[10px] text-amber-400/70">进行中</span>
                ) : (
                  <span className="text-[10px] text-gray-500">未激活</span>
                )}
              </div>

              {/* Title */}
              <h3 className="text-sm font-bold text-gray-200 mb-2">{selectedMission.nameCN}</h3>

              {/* Description */}
              <p className="text-[11px] text-gray-400 leading-relaxed mb-3">{selectedMission.description}</p>

              {/* Narrative */}
              <div className="p-3 rounded-lg bg-purple-900/20 border border-purple-500/15 mb-3">
                <p className="text-[10px] text-purple-300/70 leading-relaxed whitespace-pre-line">
                  {selectedMission.narrative}
                </p>
              </div>

              {/* Objectives */}
              <div className="mb-3">
                <h4 className="text-[10px] text-gray-500 tracking-wider mb-2">目标</h4>
                <div className="space-y-1.5">
                  {selectedMission.objectives.map((obj) => {
                    const objProg = selectedProgress.objectivesProgress?.[obj.id] ?? 0;
                    const objCount = obj.count ?? 1;
                    const done = objProg >= objCount;
                    return (
                      <div
                        key={obj.id}
                        className={cn(
                          'flex items-start gap-2 p-2 rounded-lg border text-xs',
                          done
                            ? 'border-emerald-500/20 bg-emerald-500/5'
                            : 'border-white/5 bg-white/5',
                        )}
                      >
                        <span className={cn(
                          'mt-0.5 text-[10px]',
                          done ? 'text-emerald-400' : 'text-gray-500',
                        )}>
                          {done ? '✓' : '○'}
                        </span>
                        <div className="flex-1 min-w-0">
                          <span className={cn(
                            'block text-[11px]',
                            done ? 'text-emerald-300/70 line-through' : 'text-gray-300',
                          )}>
                            {obj.description}
                          </span>
                          {obj.count && obj.count > 1 && (
                            <span className="text-[9px] text-gray-500">
                              进度: {objProg}/{obj.count}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Rewards preview */}
              {!selectedProgress.completed && (
                <div>
                  <h4 className="text-[10px] text-gray-500 tracking-wider mb-2">奖励预览</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedMission.rewards.awareness && (
                      <span className="px-2 py-0.5 rounded text-[9px] bg-blue-500/10 border border-blue-500/20 text-blue-300/70">
                        认知 +{selectedMission.rewards.awareness}
                      </span>
                    )}
                    {selectedMission.rewards.erosion && (
                      <span className="px-2 py-0.5 rounded text-[9px] bg-pink-500/10 border border-pink-500/20 text-pink-300/70">
                        侵蚀 +{selectedMission.rewards.erosion}
                      </span>
                    )}
                    {selectedMission.rewards.items?.map((item) => (
                      <span key={item} className="px-2 py-0.5 rounded text-[9px] bg-amber-500/10 border border-amber-500/20 text-amber-300/70">
                        道具: {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Prerequisites */}
              {selectedMission.prerequisites && !selectedProgress.active && (
                <div className="mt-3 p-2 rounded-lg bg-gray-800/50 border border-gray-700/50">
                  <h4 className="text-[9px] text-gray-500 tracking-wider mb-1">前置条件</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedMission.prerequisites.minDay && (
                      <span className="px-1.5 py-0.5 bg-gray-700/50 rounded text-[9px] text-gray-400">
                        第{selectedMission.prerequisites.minDay}天后
                      </span>
                    )}
                    {selectedMission.prerequisites.requiredItems?.map((item) => (
                      <span key={item} className="px-1.5 py-0.5 bg-gray-700/50 rounded text-[9px] text-gray-400">
                        需要: {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Activated info */}
              {selectedProgress.activatedAtDay > 0 && (
                <p className="mt-3 text-[9px] text-gray-600">
                  激活于第 {selectedProgress.activatedAtDay} 天
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-2 border-t border-white/5 flex items-center justify-between">
          <span className="text-[9px] text-gray-600">
            共 {MISSIONS.length} 个任务 · {activeCount} 活跃 · {completedCount} 完成
          </span>
          <button
            onClick={handleClose}
            className="px-4 py-1 rounded-lg text-[10px] border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-all"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};

export default MissionTracker;
