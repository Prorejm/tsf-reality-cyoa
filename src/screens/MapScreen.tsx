import React, { useState, useMemo, useCallback } from 'react';
import { useGame } from '@/game/engine/GameContext';
import type { SceneId, ZoneId, NpcId } from '@/game/engine/types';
import { cn } from '@/lib/utils';

interface ZoneInfo {
  id: ZoneId;
  name: string;
  description: string;
  scenes: SceneInfo[];
  unlocked: boolean;
  explorationProgress: number;
  lockedDisplay?: string;
}

interface SceneInfo {
  id: SceneId;
  name: string;
  explored: boolean;
  hasNpcs: boolean;
  isCurrent: boolean;
  npcNames: string[];
  type: 'exploration' | 'event' | 'safe_house' | 'shop' | 'dungeon' | 'social' | 'special';
}

// 游戏内置区域/场景数据（模拟）
const ZONE_DATA: Record<string, { name: string; description: string }> = {
  border_district: {
    name: '边界街区',
    description: '城市的边缘地带，新旧交替的过渡区域。这里的常识改变最为微弱。',
  },
  central_district: {
    name: '中央商业区',
    description: '城市的核心地带，繁华而喧嚣。常识改变在这里已经深入骨髓。',
  },
  distortion_core: {
    name: '扭曲核心',
    description: '城市的最深处，现实在这里变得极其不稳定。真相近在咫尺。',
  },
};

const SCENE_DATA: Record<string, { name: string; npcs: string[]; type: SceneInfo['type'] }> = {
  subway_station: { name: '地铁站', npcs: [], type: 'exploration' },
  convenience_store: { name: '便利店', npcs: ['slime_clerk'], type: 'shop' },
  old_bookstore: { name: '旧书店', npcs: [], type: 'safe_house' },
  residential_area: { name: '住宅区', npcs: [], type: 'exploration' },
  park: { name: '公园', npcs: [], type: 'exploration' },
  school: { name: '学校', npcs: [], type: 'exploration' },
  hospital: { name: '医院', npcs: ['vampire_doctor'], type: 'exploration' },
  shopping_street: { name: '商店街', npcs: [], type: 'social' },
  bar: { name: '酒吧', npcs: ['succubus_bartender'], type: 'social' },
  library: { name: '图书馆', npcs: [], type: 'safe_house' },
  tailor_shop: { name: '裁缝店', npcs: [], type: 'shop' },
  cafe: { name: '咖啡厅', npcs: [], type: 'safe_house' },
  swimming_pool: { name: '游泳馆', npcs: [], type: 'exploration' },
  flower_shop: { name: '花店', npcs: ['alraune_florist'], type: 'shop' },
  shrine: { name: '神社', npcs: ['kitsune_miko'], type: 'special' },
  city_hall: { name: '市政大厅', npcs: ['dragon_mayor'], type: 'dungeon' },
  church: { name: '教堂', npcs: [], type: 'event' },
  abyss_corridor: { name: '深淵回廊', npcs: [], type: 'dungeon' },
};

const NPC_NAMES: Record<string, string> = {
  slime_clerk: '小翠',
  vampire_doctor: '血月',
  succubus_bartender: '夜魅',
  alraune_florist: '花音',
  kitsune_miko: '狐鈴',
  dragon_mayor: '龙映',
};

const ZONE_SCENES: Record<ZoneId, SceneId[]> = {
  border_district: ['subway_station', 'convenience_store', 'old_bookstore', 'residential_area', 'park'],
  central_district: ['school', 'hospital', 'shopping_street', 'bar', 'library', 'tailor_shop', 'cafe', 'swimming_pool', 'flower_shop'],
  distortion_core: ['city_hall', 'shrine', 'church', 'abyss_corridor'],
};

const MapScreen: React.FC = () => {
  const { state, dispatch } = useGame();

  const currentZone = state?.zone?.currentZone ?? 'border_district';
  const currentScene = state?.zone?.currentScene ?? 'subway_station';
  const exploredScenes = state?.zone?.exploredScenes ?? [];
  const awareness = state?.cognition?.realityAwareness ?? 0;
  const erosion = state?.cognition?.erosionLevel ?? 0;
  const lockedZones = state?.zone?.lockedZones ?? [];

  const [selectedZone, setSelectedZone] = useState<ZoneId>(currentZone);

  // 构建区域数据
  const zones: ZoneInfo[] = useMemo(() => {
    return Object.entries(ZONE_SCENES).map(([zoneId, sceneIds]) => {
      const zoneData = ZONE_DATA[zoneId];
      const isLocked = lockedZones.includes(zoneId);
      const scenes: SceneInfo[] = sceneIds.map((sid) => {
        const scData = SCENE_DATA[sid];
        return {
          id: sid,
          name: scData?.name ?? sid,
          explored: exploredScenes.includes(sid),
          hasNpcs: (scData?.npcs?.length ?? 0) > 0,
          isCurrent: sid === currentScene,
          npcNames: (scData?.npcs ?? []).map((n) => NPC_NAMES[n] ?? n),
          type: scData?.type ?? 'exploration',
        };
      });

      return {
        id: zoneId,
        name: zoneData?.name ?? zoneId,
        description: zoneData?.description ?? '',
        scenes,
        unlocked: !isLocked,
        explorationProgress: Math.round(
          (scenes.filter((s) => s.explored).length / scenes.length) * 100,
        ),
        lockedDisplay: erosion < 40 ? '需要侵蚀率 ≥ 40%' : '需要特定的剧情推进',
      };
    });
  }, [exploredScenes, currentScene, lockedZones, erosion]);

  // 场景类型对应的颜色
  const sceneTypeColors: Record<string, string> = {
    exploration: 'border-blue-500/20 bg-blue-500/5',
    event: 'border-amber-500/20 bg-amber-500/5',
    safe_house: 'border-green-500/20 bg-green-500/5',
    shop: 'border-purple-500/20 bg-purple-500/5',
    dungeon: 'border-red-500/20 bg-red-500/5',
    social: 'border-pink-500/20 bg-pink-500/5',
    special: 'border-cyan-500/20 bg-cyan-500/5',
  };

  // 导航到场景
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

  const selectedZoneData = zones.find((z) => z.id === selectedZone);

  return (
    <div className="game-container min-h-screen">
      {/* 顶部 */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handleBack}
          className="text-xs text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded bg-white/5 border border-white/10"
        >
          返回探索
        </button>
        <h2 className="font-title text-xl text-emerald-200/80 tracking-wider">
          区域地图
        </h2>
        <div className="w-20" />
      </div>

      {/* 区域选择 */}
      <div className="game-panel mb-4">
        <div className="flex gap-2 mb-3">
          {zones.map((zone) => (
            <button
              key={zone.id}
              onClick={() => !zone.unlocked || setSelectedZone(zone.id)}
              disabled={!zone.unlocked}
              className={cn(
                'flex-1 p-2 rounded-lg border text-center transition-all',
                selectedZone === zone.id
                  ? 'bg-emerald-500/10 border-emerald-400/30 text-emerald-200'
                  : zone.unlocked
                  ? 'bg-black/20 border-white/5 text-gray-300 hover:bg-black/40'
                  : 'bg-black/10 border-white/5 text-gray-600 cursor-not-allowed',
              )}
            >
              <p className="text-xs font-medium">{zone.name}</p>
              {!zone.unlocked && (
                <p className="text-[8px] text-gray-600 mt-0.5">已锁定</p>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 当前区域详情 */}
      {selectedZoneData && (
        <div className="game-panel mb-4">
          {/* 区域信息 */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-title text-base text-emerald-200">
                {selectedZoneData.name}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">{selectedZoneData.description}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">探索度</p>
              <p className="text-sm text-emerald-300">{selectedZoneData.explorationProgress}%</p>
            </div>
          </div>

          {/* 场景列表 */}
          {selectedZoneData.unlocked ? (
            <div className="space-y-2">
              {/* 标题行 */}
              <div className="flex items-center gap-2 mb-2">
                <div className="h-px flex-1 bg-gradient-to-r from-emerald-500/20 to-transparent" />
                <span className="text-[10px] text-gray-500">场景</span>
                <div className="h-px flex-1 bg-gradient-to-l from-emerald-500/20 to-transparent" />
              </div>

              {selectedZoneData.scenes.map((scene, idx) => (
                <React.Fragment key={scene.id}>
                  {/* 连接线（非最后一个） */}
                  {idx > 0 && (
                    <div className="flex justify-center">
                      <div className="w-px h-3 bg-gradient-to-b from-emerald-500/10 to-emerald-500/20" />
                    </div>
                  )}
                  <button
                    onClick={() => scene.explored && handleNavigate(scene.id)}
                    disabled={!scene.explored}
                    className={cn(
                      'w-full text-left p-3 rounded-lg border transition-all',
                      scene.isCurrent
                        ? 'bg-emerald-500/15 border-emerald-400/40'
                        : scene.explored
                        ? `${sceneTypeColors[scene.type] ?? 'bg-gray-500/5 border-white/5'} hover:bg-white/5`
                        : 'bg-gray-800/20 border-gray-800/30 text-gray-600 cursor-not-allowed',
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {scene.isCurrent && (
                          <span className="text-emerald-400 text-xs">◆</span>
                        )}
                        <span
                          className={cn(
                            'text-sm',
                            scene.isCurrent
                              ? 'text-emerald-200 font-medium'
                              : scene.explored
                              ? 'text-gray-200'
                              : 'text-gray-600',
                          )}
                        >
                          {scene.name}
                        </span>
                        {scene.hasNpcs && scene.explored && (
                          <span className="text-[10px] text-purple-300/60">
                            ({scene.npcNames.join('、')})
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {scene.isCurrent && (
                          <span className="text-[10px] text-emerald-400/60">当前位置</span>
                        )}
                        {!scene.explored && (
                          <span className="text-[10px] text-gray-600">未探索</span>
                        )}
                      </div>
                    </div>
                  </button>
                </React.Fragment>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-lg text-center">
              <p className="text-sm text-red-300/80 mb-1">此区域尚未解锁</p>
              <p className="text-xs text-gray-500">{selectedZoneData.lockedDisplay}</p>
            </div>
          )}
        </div>
      )}

      {/* 图例 */}
      <div className="game-panel">
        <p className="text-[10px] text-gray-500 mb-2">图例</p>
        <div className="flex flex-wrap gap-3">
          {[
            { type: 'exploration', label: '探索区域' },
            { type: 'event', label: '事件区域' },
            { type: 'safe_house', label: '安全屋' },
            { type: 'shop', label: '商店' },
            { type: 'dungeon', label: '危险区域' },
            { type: 'social', label: '社交场所' },
            { type: 'special', label: '特殊地点' },
          ].map((item) => (
            <div key={item.type} className="flex items-center gap-1">
              <div className={cn('w-2 h-2 rounded-sm border', sceneTypeColors[item.type]?.split(' ')[0] ?? 'border-gray-500/30')} />
              <span className="text-[10px] text-gray-500">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapScreen;
