import React, { useState, useCallback } from 'react';
import { useGame } from '@/game/engine/GameContext';
import { cn } from '@/lib/utils';

interface PointOfInterest {
  id: string;
  name: string;
  description: string;
  perceptionRequired: number;
  discoveryContent: string;
  category: string;
  discovered: boolean;
  journalRecorded: boolean;
}

const ObservationScreen: React.FC = () => {
  const { state, dispatch } = useGame();

  const awareness = state.awarenessLevel ?? 0;
  const perceptionMode = state.perceptionMode ?? 'resident';
  const currentScene = state.currentScene ?? 'home_bedroom';
  const day = state.currentDay ?? 1;

  const [pointsOfInterest] = useState<PointOfInterest[]>([
    {
      id: 'poi_wall',
      name: '墙壁上的涂鸦',
      description: '墙面上有一些模糊的痕迹',
      perceptionRequired: 0,
      discoveryContent: '那些"涂鸦"其实是一种文字——你曾在旧书上见过类似的符号。它们在描述某种「边界」。',
      category: 'reality_anomaly',
      discovered: false,
      journalRecorded: false,
    },
    {
      id: 'poi_shadow',
      name: '异常的影子',
      description: '某样物体的投影方向不符合光源位置',
      perceptionRequired: 15,
      discoveryContent: '这些影子不遵循物理规则。你注意到——有些影子比它们的本体慢了半拍。就好像影子活在稍微不同的时间里。',
      category: 'reality_anomaly',
      discovered: false,
      journalRecorded: false,
    },
    {
      id: 'poi_air',
      name: '空气中的气味',
      description: '空气中弥漫着一丝不自然的甜味',
      perceptionRequired: 25,
      discoveryContent: '这甜味不是花香或香水——它更像是一种信息素。你曾在医院的记录中读到过：某些怪物娘在紧张时会释放这种气味。',
      category: 'monster_hidden',
      discovered: false,
      journalRecorded: false,
    },
    {
      id: 'poi_memory',
      name: '既视感',
      description: '这个地方让你感到一种说不出的既视感',
      perceptionRequired: 35,
      discoveryContent: '你"记得"自己曾经来过这里——但那是不存在的记忆。某个时间点，你的记忆被植入了这个场景。这些都是「常識改變」的一部分。',
      category: 'identity_trace',
      discovered: false,
      journalRecorded: false,
    },
    {
      id: 'poi_truth',
      name: '真相裂缝',
      description: '空气中有一道细微的裂痕，像玻璃上的裂纹',
      perceptionRequired: 50,
      discoveryContent: '现实的表层出现了裂缝。透过裂缝，你看到了城市的另一种面貌——那里的人、建筑、天空，全都不一样。那就是被覆盖的"真实"。',
      category: 'reality_tear',
      discovered: false,
      journalRecorded: false,
    },
  ]);

  const [selectedPoi, setSelectedPoi] = useState<PointOfInterest | null>(null);
  const [discoveryLog, setDiscoveryLog] = useState<string[]>([]);
  const [localPois, setLocalPois] = useState(pointsOfInterest);

  // 根据感知过滤可用的观察点
  const visiblePois = localPois.filter(
    (p) => awareness >= p.perceptionRequired || p.discovered,
  );

  // 特殊感知模式下的额外观察点
  const truthOnlyPois = perceptionMode === 'truth'
    ? [
        {
          ...pointsOfInterest[4],
          id: 'poi_truth_deep',
          name: '更深层的真相',
          description: '真相视角下，更多的细节浮现出来',
          perceptionRequired: 40,
          discoveryContent: '在真相视角下，你看到更多隐藏的细节：那些"人类"脸上偶尔闪過的鳞片纹理、空氣中飄浮的微小光粒——它們是常識改變的能量殘渣。',
          category: 'reality_tear',
          discovered: false,
          journalRecorded: false,
        } as PointOfInterest,
      ].filter((p) => !localPois.find((lp) => lp.id === p.id))
    : [];

  const handlePointClick = useCallback(
    (poi: PointOfInterest) => {
      if (poi.discovered) {
        setSelectedPoi(poi);
        return;
      }

      // 发现新观察点
      setLocalPois((prev) =>
        prev.map((p) => (p.id === poi.id ? { ...p, discovered: true } : p)),
      );
      setSelectedPoi({ ...poi, discovered: true });

      const logMsg = `发现了「${poi.name}」—— ${poi.discoveryContent}`;
      setDiscoveryLog((prev) => [logMsg, ...prev]);

      // 分发发现物到游戏状态
      dispatch({
        type: 'ADD_DISCOVERY',
        payload: {
          id: `obs_${poi.id}_${Date.now()}`,
          name: poi.name,
          description: poi.description,
          category: poi.category,
          discoveredOnDay: day,
          discoveredInScene: currentScene,
          read: true,
          content: poi.discoveryContent,
          isCritical: poi.perceptionRequired >= 35,
        } as any,
      });
    },
    [dispatch, day, currentScene],
  );

  const handleRecordToJournal = useCallback(
    (poi: PointOfInterest) => {
      if (!poi.discovered) return;
      setLocalPois((prev) =>
        prev.map((p) => (p.id === poi.id ? { ...p, journalRecorded: true } : p)),
      );

      dispatch({
        type: 'SET_FLAG',
        payload: { key: `journal_obs_${poi.id}`, value: true },
      });

      setDiscoveryLog((prev) => [
        `已将「${poi.name}」的记录保存到日志`,
        ...prev,
      ]);
    },
    [dispatch],
  );

  const handleBack = useCallback(() => {
    dispatch({
      type: 'SET_FLAG',
      payload: { key: '_screen', value: 'exploration' },
    });
  }, [dispatch]);

  return (
    <div className="game-container min-h-screen flex flex-col">
      {/* 顶部 */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handleBack}
          className="text-xs text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded bg-white/5 border border-white/10"
        >
          返回探索
        </button>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">
            当前感知：{awareness}
          </span>
          <span
            className={cn(
              'text-xs px-2 py-0.5 rounded',
              perceptionMode === 'truth'
                ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
                : 'bg-gray-500/10 text-gray-400 border border-gray-500/20',
            )}
          >
            {perceptionMode === 'truth' ? '真相视角' : '居民视角'}
          </span>
        </div>
      </div>

      {/* 场景氛围描述 */}
      <div className="game-panel mb-4">
        <p className="narrative-text text-sm italic text-gray-300/80">
          {perceptionMode === 'truth'
            ? '你以真相之眼审视着周围的一切。原本看似普通的景象下，隐藏着无数异常的细节。空气中弥漫着淡淡的荧光，物体的影子在微微颤动……'
            : '你仔细打量四周。一切看起来都很正常——但你的直觉告诉你，有什么地方不对劲。那些被你忽略的细节，正在等待被发现。'}
        </p>
      </div>

      {/* 可交互观察点 */}
      <div className="game-panel flex-1 mb-4">
        <h3 className="font-title text-lg text-amber-300/80 mb-3 tracking-wider">
          值得注意的地方
        </h3>
        <div className="grid grid-cols-1 gap-2">
          {visiblePois.map((poi) => (
            <button
              key={poi.id}
              onClick={() => handlePointClick(poi)}
              className={cn(
                'text-left px-4 py-3 rounded-lg border transition-all duration-200',
                poi.discovered
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                  : 'bg-white/5 border-white/10 text-gray-300 hover:bg-amber-500/5 hover:border-amber-500/20 hover:text-amber-100',
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {poi.discovered ? '◆' : '◇'} {poi.name}
                </span>
                {!poi.discovered && (
                  <span className="text-[10px] text-gray-500">
                    需要认知 {poi.perceptionRequired}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">{poi.description}</p>
            </button>
          ))}

          {truthOnlyPois.map((poi) => (
            <button
              key={poi.id}
              onClick={() => handlePointClick(poi)}
              className={cn(
                'text-left px-4 py-3 rounded-lg border transition-all duration-200',
                poi.discovered
                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-200'
                  : 'bg-blue-500/5 border-blue-500/20 text-blue-200/70 hover:bg-blue-500/10',
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {poi.discovered ? '◆' : '◇'} {poi.name}
                </span>
                <span className="text-[10px] text-blue-300/60">[真相专属]</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">{poi.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 选中的观察点详情 */}
      {selectedPoi && selectedPoi.discovered && (
        <div className="game-panel mb-4">
          <h4 className="font-title text-base text-amber-200 mb-2">
            {selectedPoi.name}
          </h4>
          <p className="narrative-text text-sm text-gray-200 mb-3">
            {selectedPoi.discoveryContent}
          </p>
          <div className="flex items-center gap-3">
            {!selectedPoi.journalRecorded && (
              <button
                onClick={() => handleRecordToJournal(selectedPoi)}
                className="px-3 py-1.5 text-xs bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded hover:bg-amber-500/20 transition-all"
              >
                记录到日志
              </button>
            )}
            {selectedPoi.journalRecorded && (
              <span className="text-xs text-green-400/60">已记录到日志 ✓</span>
            )}
            <span className="text-[10px] text-gray-500">
              分类：{selectedPoi.category}
            </span>
          </div>
        </div>
      )}

      {/* 发现记录 */}
      {discoveryLog.length > 0 && (
        <div className="game-panel max-h-32 overflow-y-auto">
          <p className="text-xs text-gray-500 mb-1">发现记录：</p>
          {discoveryLog.map((log, i) => (
            <p key={i} className="text-xs text-gray-400 mb-0.5">
              {log}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default ObservationScreen;
