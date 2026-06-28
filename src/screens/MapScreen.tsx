import React, { useState, useMemo, useCallback } from 'react';
import { useGame } from '@/game/engine/GameContext';
import type { SceneId, ZoneId } from '@/game/engine/types';
import { scenes } from '@/game/data/scenes';
import { characters } from '@/game/data/characters';
import { cn } from '@/lib/utils';

// ─── 场景类型 → 侦探板颜色映射 ───
const SCENE_TYPE_STYLES: Record<string, { dot: string; border: string; bg: string; label: string }> = {
  exploration: { dot: 'bg-blue-400', border: 'border-blue-500/40', bg: 'bg-blue-500/8', label: '探索区域' },
  event:       { dot: 'bg-red-400',   border: 'border-red-500/40',   bg: 'bg-red-500/8',   label: '事件区域' },
  safe:        { dot: 'bg-green-400', border: 'border-green-500/40', bg: 'bg-green-500/8',  label: '安全屋' },
  boss:        { dot: 'bg-purple-400',border: 'border-purple-500/40',bg: 'bg-purple-500/8',  label: '危险区域' },
};
const DEFAULT_STYLE = { dot: 'bg-gray-400', border: 'border-gray-500/30', bg: 'bg-gray-500/8', label: '未知' };

// ─── 区域数据 ───
const ZONE_META: Record<ZoneId, { name: string; description: string; unlockErosion: number }> = {
  border_district: {
    name: '边界街区',
    description: '城市的边缘地带，新旧交替的过渡区域。常识改变最为微弱。',
    unlockErosion: 0,
  },
  central_district: {
    name: '中央商业区',
    description: '城市的核心地带，繁华而喧嚣。常识改变已经深入骨髓。',
    unlockErosion: 25,
  },
  distortion_core: {
    name: '扭曲核心',
    description: '城市的最深处，现实在这里变得极其不稳定。真相近在咫尺。',
    unlockErosion: 50,
  },
};

interface ZoneCardData {
  id: ZoneId;
  name: string;
  description: string;
  unlocked: boolean;
  unlockCondition: string;
  explorationProgress: number;
  scenes: SceneNodeData[];
}

interface SceneNodeData {
  id: SceneId;
  name: string;
  type: string;
  explored: boolean;
  locked: boolean;
  isCurrent: boolean;
  npcNames: string[];
}

// ─── 组件 ───

const MapScreen: React.FC = () => {
  const { state, dispatch } = useGame();

  const currentZone = state?.zone?.currentZone ?? 'border_district';
  const currentScene = state.currentScene ?? 'subway_station';
  const exploredScenes: SceneId[] = state.exploredScenes ?? [];
  const erosion = state.erosionLevel ?? 0;
  const lockedZones: ZoneId[] = state?.zone?.lockedZones ?? [];

  const [expandedZones, setExpandedZones] = useState<ZoneId[]>([currentZone]);

  // ─── 构建 NPC → 场景 映射 ───
  const npcSceneMap = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const char of characters) {
      const loc = char.location;
      if (!map[loc]) map[loc] = [];
      map[loc].push(char.nameCN);
    }
    return map;
  }, []);

  // ─── 构建区域卡片数据 ───
  const zoneCards: ZoneCardData[] = useMemo(() => {
    return Object.entries(ZONE_META).map(([zoneId, meta]) => {
      const isLocked = lockedZones.includes(zoneId);
      const zoneScenes = scenes.filter((s) => s.zone === zoneId);

      const sceneNodes: SceneNodeData[] = zoneScenes.map((sc) => ({
        id: sc.id,
        name: sc.nameCN,
        type: sc.type,
        explored: exploredScenes.includes(sc.id),
        locked: isLocked,
        isCurrent: sc.id === currentScene,
        npcNames: npcSceneMap[sc.id] ?? [],
      }));

      const exploredCount = sceneNodes.filter((n) => n.explored).length;
      const progress = sceneNodes.length > 0
        ? Math.round((exploredCount / sceneNodes.length) * 100)
        : 0;

      let unlockCondition = '';
      if (isLocked) {
        if (erosion < meta.unlockErosion) {
          unlockCondition = `需要侵蚀率 ≥ ${meta.unlockErosion}%（当前 ${erosion}%）`;
        } else {
          unlockCondition = '需要特定的剧情推进';
        }
      }

      return {
        id: zoneId,
        name: meta.name,
        description: meta.description,
        unlocked: !isLocked,
        unlockCondition,
        explorationProgress: progress,
        scenes: sceneNodes,
      };
    });
  }, [exploredScenes, currentScene, lockedZones, erosion, npcSceneMap]);

  // ─── 展开/折叠 ───
  const toggleZone = useCallback((zoneId: ZoneId) => {
    setExpandedZones((prev) =>
      prev.includes(zoneId)
        ? prev.filter((z) => z !== zoneId)
        : [...prev, zoneId],
    );
  }, []);

  // ─── 导航 ───
  const handleNavigate = useCallback(
    (sceneId: SceneId) => {
      dispatch({ type: 'SET_SCENE', payload: sceneId });
      dispatch({
        type: 'SET_FLAG',
        payload: { key: '_screen', value: 'exploration' },
      });
    },
    [dispatch],
  );

  const handleBack = useCallback(() => {
    dispatch({
      type: 'SET_FLAG',
      payload: { key: '_screen', value: 'exploration' },
    });
  }, [dispatch]);

  // ─── 样式助手 ───
  const styleForType = (type: string) =>
    SCENE_TYPE_STYLES[type] ?? DEFAULT_STYLE;

  return (
    <div className="game-container min-h-screen">
      {/* ─── 顶部栏 ─── */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handleBack}
          className="text-xs text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded bg-white/5 border border-white/10"
        >
          返回探索
        </button>
        <h2 className="font-title text-xl text-amber-200/80 tracking-wider">
          侦探地图
        </h2>
        <div className="w-20" />
      </div>

      {/* ─── 侦探板主体 ─── */}
      <div className="space-y-3">
        {zoneCards.map((zone) => {
          const expanded = expandedZones.includes(zone.id);
          const hasScenes = zone.scenes.length > 0;

          return (
            <div
              key={zone.id}
              className={cn(
                'rounded-lg border transition-all',
                zone.unlocked
                  ? 'bg-black/40 border-amber-900/30'
                  : 'bg-black/20 border-gray-800/30 opacity-60',
              )}
            >
              {/* ─── 区域标题头（可点击展开） ─── */}
              <button
                onClick={() => zone.unlocked && toggleZone(zone.id)}
                disabled={!zone.unlocked}
                className="w-full text-left p-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* 展开/折叠箭头 */}
                  <span
                    className={cn(
                      'text-xs transition-transform shrink-0',
                      expanded ? 'text-amber-400' : 'text-gray-600',
                      expanded ? 'rotate-90' : '',
                    )}
                  >
                    ▶
                  </span>
                  {/* 区域名称 */}
                  <span
                    className={cn(
                      'font-title text-sm',
                      zone.unlocked ? 'text-amber-200' : 'text-gray-600',
                    )}
                  >
                    {zone.name}
                  </span>
                  {/* 锁定状态 */}
                  {!zone.unlocked && (
                    <span className="text-[10px] text-gray-600 flex items-center gap-1">
                      <span>🔒</span>
                      <span>已锁定</span>
                    </span>
                  )}
                </div>

                {/* 探索进度 */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-20 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        zone.explorationProgress >= 100
                          ? 'bg-emerald-500'
                          : zone.explorationProgress >= 50
                          ? 'bg-amber-500'
                          : 'bg-gray-600',
                      )}
                      style={{ width: `${zone.explorationProgress}%` }}
                    />
                  </div>
                  <span
                    className={cn(
                      'text-xs tabular-nums',
                      zone.explorationProgress >= 100
                        ? 'text-emerald-400'
                        : 'text-gray-500',
                    )}
                  >
                    {zone.explorationProgress}%
                  </span>
                </div>
              </button>

              {/* ─── 展开内容：场景节点 ─── */}
              {expanded && (
                <div className="px-3 pb-3">
                  {/* 区域描述 */}
                  <p className="text-[11px] text-gray-500 mb-3 ml-5">
                    {zone.description}
                  </p>

                  {/* 锁定状态详情 */}
                  {!zone.unlocked && zone.unlockCondition && (
                    <div className="ml-5 mb-3 p-2 bg-red-900/10 border border-red-900/20 rounded text-[11px] text-red-300/60">
                      {zone.unlockCondition}
                    </div>
                  )}

                  {/* 场景节点网络 */}
                  {zone.unlocked && hasScenes && (
                    <div className="relative ml-5 pl-4 border-l border-amber-900/20">
                      {zone.scenes.map((scene, idx) => {
                        const st = styleForType(scene.type);
                        const isLast = idx === zone.scenes.length - 1;

                        return (
                          <div key={scene.id} className="relative pb-3 last:pb-0">
                            {/* 连接线 */}
                            {!isLast && (
                              <div className="absolute left-[-1px] top-3 bottom-0 w-px bg-gradient-to-b from-amber-700/30 to-amber-700/10" />
                            )}

                            {/* 节点本体 */}
                            <button
                              onClick={() => scene.explored && handleNavigate(scene.id)}
                              disabled={scene.locked || !scene.explored}
                              className={cn(
                                'relative w-full text-left p-2.5 rounded-lg border transition-all',
                                scene.isCurrent
                                  ? 'bg-amber-900/15 border-amber-500/40'
                                  : scene.explored
                                  ? `${st.bg} ${st.border} hover:bg-white/5`
                                  : 'bg-gray-900/20 border-gray-800/30 text-gray-700 cursor-not-allowed',
                              )}
                            >
                              {/* 节点行内容 */}
                              <div className="flex items-center gap-2">
                                {/* 类型色点 */}
                                <span
                                  className={cn(
                                    'w-2.5 h-2.5 rounded-full shrink-0 ring-1 ring-white/10',
                                    st.dot,
                                    scene.isCurrent ? 'animate-pulse' : '',
                                  )}
                                />

                                {/* 场景名称 */}
                                <span
                                  className={cn(
                                    'text-xs',
                                    scene.isCurrent
                                      ? 'text-amber-200 font-medium'
                                      : scene.explored
                                      ? 'text-gray-200'
                                      : 'text-gray-700',
                                  )}
                                >
                                  {scene.name}
                                </span>

                                {/* 状态图标 */}
                                {scene.isCurrent && (
                                  <span className="ml-auto text-[9px] text-amber-400/70 tracking-wider">
                                    ● 当前位置
                                  </span>
                                )}
                                {!scene.isCurrent && scene.explored && (
                                  <span className="ml-auto text-[10px] text-emerald-500/60">✓</span>
                                )}
                                {!scene.explored && !scene.locked && (
                                  <span className="ml-auto text-[9px] text-gray-600">???</span>
                                )}

                                {/* NPC 图标 */}
                                {scene.npcNames.length > 0 && scene.explored && (
                                  <span className="text-[10px] text-purple-400/50 shrink-0">
                                    {scene.npcNames.map((n) => `🧝${n}`).join(' ')}
                                  </span>
                                )}
                              </div>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* 空区域 */}
                  {zone.unlocked && !hasScenes && (
                    <p className="ml-5 text-xs text-gray-600">此区域暂无可用场景</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ─── 图例 ─── */}
      <div className="mt-4 game-panel">
        <p className="text-[10px] text-gray-500 mb-2 tracking-wider">图 例</p>
        <div className="flex flex-wrap gap-3">
          {Object.entries(SCENE_TYPE_STYLES).map(([type, st]) => (
            <div key={type} className="flex items-center gap-1.5">
              <span className={cn('w-2 h-2 rounded-full', st.dot)} />
              <span className="text-[10px] text-gray-500">{st.label}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[10px] text-gray-500">当前位置</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-emerald-500/60">✓</span>
            <span className="text-[10px] text-gray-500">已探索</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapScreen;
