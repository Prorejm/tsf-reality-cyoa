import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useGame } from '@/game/engine/GameContext';
import type { NpcId } from '@/game/engine/types';
import { cn } from '@/lib/utils';

interface Hotspot {
  id: string;
  x: number;
  y: number;
  label: string;
  description: string;
  perceptionRequired?: number;
}

const TIME_PERIOD_LABELS: Record<string, string> = {
  morning: '早晨',
  afternoon: '下午',
  evening: '傍晚',
  night: '深夜',
};

const COGNITION_LABELS: Record<string, string> = {
  outsider: '局外人',
  aware: '察觉',
  wavering: '动摇',
  assimilated: '同化',
};

const ExplorationScreen: React.FC = () => {
  const { state, dispatch } = useGame();
  const [displayedText, setDisplayedText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [showActions, setShowActions] = useState(false);
  const [activeHotspots, setActiveHotspots] = useState<Hotspot[]>([]);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [showNpcs, setShowNpcs] = useState(false);
  const typewriterRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [transitioning, setTransitioning] = useState(false);

  const day = state?.time?.day ?? 1;
  const period = state?.time?.period ?? 'morning';
  const awareness = state?.cognition?.realityAwareness ?? 0;
  const erosion = state?.cognition?.erosionLevel ?? 0;
  const stage = state?.cognition?.stage ?? 'outsider';
  const currentScene = state?.zone?.currentScene ?? 'unknown';
  const perceptionMode = (state as any)?.perceptionMode ?? 'resident';
  const sceneDescription =
    perceptionMode === 'truth'
      ? `【真相视角】你看到的事物表象之下暗流涌动……`
      : `你站在这个看似普通的街道上，周围的一切都井然有序。`;

  // 模拟场景描述文本，使用打字机效果
  const fullText = sceneDescription;

  useEffect(() => {
    setDisplayedText('');
    setTextIndex(0);
    setShowActions(false);
    setSelectedHotspot(null);
    setActiveHotspots(generateHotspots(awareness));

    typewriterRef.current = setInterval(() => {
      setTextIndex((prev) => prev + 1);
    }, 40);

    return () => {
      if (typewriterRef.current) clearInterval(typewriterRef.current);
    };
  }, [currentScene, perceptionMode, awareness]);

  useEffect(() => {
    if (textIndex < fullText.length) {
      setDisplayedText(fullText.slice(0, textIndex + 1));
    } else {
      if (typewriterRef.current) clearInterval(typewriterRef.current);
      setShowActions(true);
    }
  }, [textIndex, fullText]);

  const generateHotspots = useCallback(
    (aware: number): Hotspot[] => {
      const base: Hotspot[] = [
        { id: 'h1', x: 25, y: 35, label: '奇怪的涂鸦', description: '墙上有一些你不认识的符号……', perceptionRequired: 0 },
        { id: 'h2', x: 60, y: 50, label: '路边的广告牌', description: '广告牌上的明星面孔看起来不太自然。', perceptionRequired: 10 },
        { id: 'h3', x: 40, y: 70, label: '下水道井盖', description: '下水道里隐约传来微弱的低语声。', perceptionRequired: 20 },
        { id: 'h4', x: 75, y: 30, label: '灯柱的影子', description: '这根灯柱的影子方向与周围的灯光不一致。', perceptionRequired: 30 },
      ];
      return base.filter((h) => aware >= (h.perceptionRequired ?? 0));
    },
    [],
  );

  const handleHotspotClick = useCallback(
    (hotspot: Hotspot) => {
      setSelectedHotspot(hotspot);
      dispatch({
        type: 'ADD_DISCOVERY',
        payload: {
          id: `discovery_${hotspot.id}_${Date.now()}`,
          name: hotspot.label,
          description: hotspot.description,
          category: 'reality_anomaly',
          discoveredOnDay: day,
          discoveredInScene: currentScene,
          read: false,
          content: hotspot.description,
          isCritical: false,
        } as any,
      });
    },
    [dispatch, day, currentScene],
  );

  const handleAction = useCallback(
    (action: string) => {
      switch (action) {
        case 'explore':
          dispatch({ type: 'EXPLORE_SCENE', payload: currentScene });
          break;
        case 'investigate':
          setShowActions(false);
          dispatch({
            type: 'SET_FLAG',
            payload: { key: '_screen', value: 'observation' },
          });
          break;
        case 'dialogue':
          setShowNpcs(!showNpcs);
          break;
        case 'next_scene':
          setTransitioning(true);
          setTimeout(() => {
            setTransitioning(false);
            dispatch({ type: 'TIME_ADVANCE' });
          }, 500);
          break;
        case 'inventory':
          dispatch({
            type: 'SET_FLAG',
            payload: { key: '_screen', value: 'inventory' },
          });
          break;
        case 'calendar':
          dispatch({
            type: 'SET_FLAG',
            payload: { key: '_screen', value: 'calendar' },
          });
          break;
        case 'phone':
          dispatch({
            type: 'SET_FLAG',
            payload: { key: '_screen', value: 'phone' },
          });
          break;
      }
    },
    [dispatch, currentScene, showNpcs],
  );

  const handleNpcInteract = useCallback(
    (npcId: NpcId) => {
      dispatch({
        type: 'SET_FLAG',
        payload: { key: '_dialogue_npc', value: npcId },
      });
      dispatch({
        type: 'SET_FLAG',
        payload: { key: '_screen', value: 'dialogue' },
      });
    },
    [dispatch],
  );

  // 切换认知视角
  const togglePerception = useCallback(() => {
    dispatch({ type: 'SWITCH_PERCEPTION' });
  }, [dispatch]);

  return (
    <div
      className={cn(
        'relative min-h-screen bg-gradient-to-b from-gray-900 via-purple-950/30 to-gray-900',
        'game-container',
        transitioning && 'screen-transition screen-enter',
      )}
    >
      {/* 认知切换按钮 */}
      <button
        onClick={togglePerception}
        className="perception-toggle"
        title={perceptionMode === 'resident' ? '切换至真相视角' : '切换至居民视角'}
      >
        <span
          className={cn(
            'text-xs font-bold tracking-wider',
            perceptionMode === 'truth' ? 'text-blue-300' : 'text-gray-400',
          )}
        >
          {perceptionMode === 'resident' ? '常识' : '真实'}
        </span>
      </button>

      {/* 顶部状态栏 */}
      <div className="status-bar mb-4">
        <div className="flex items-center gap-2">
          <span className="status-label">天数</span>
          <span className="status-value text-gray-100">
            第 {day} 日
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="status-label">时段</span>
          <span className="status-value text-amber-300">
            {TIME_PERIOD_LABELS[period] ?? period}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="status-label">认知</span>
          <span className={cn('status-value', awareness > 50 ? 'text-blue-400' : 'text-gray-100')}>
            {awareness}%
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="status-label">侵蚀</span>
          <span className={cn('status-value', erosion > 50 ? 'text-pink-400' : 'text-gray-100')}>
            {erosion}%
          </span>
        </div>
        <div className="flex-1 text-right">
          <span className="text-[10px] text-gray-500">{COGNITION_LABELS[stage]}</span>
        </div>
      </div>

      {/* 场景标题 */}
      <div className="mb-3">
        <h2 className="font-title text-2xl text-purple-200 tracking-wider">
          {currentScene}
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          {perceptionMode === 'resident' ? '居民视角' : '真相视角'}
        </p>
      </div>

      {/* 叙事文本 + 打字机效果 */}
      <div className="typewriter-box mb-4 min-h-[120px]">
        <p className="narrative-text text-sm md:text-base leading-relaxed">
          {displayedText}
          {textIndex < fullText.length && <span className="typewriter-cursor" />}
        </p>
      </div>

      {/* 观察热点区域 */}
      {showActions && activeHotspots.length > 0 && (
        <div className="relative mb-4 p-4 bg-black/40 rounded-lg border border-white/5">
          <p className="text-xs text-gray-400 mb-2 tracking-wider">
            你注意到了一些值得留意的细节：
          </p>
          <div className="flex flex-wrap gap-2">
            {activeHotspots.map((hotspot) => (
              <button
                key={hotspot.id}
                onClick={() => handleHotspotClick(hotspot)}
                className={cn(
                  'px-3 py-1.5 rounded-md text-xs transition-all duration-200',
                  selectedHotspot?.id === hotspot.id
                    ? 'bg-amber-500/20 border border-amber-400/30 text-amber-300'
                    : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white',
                )}
              >
                {hotspot.label}
              </button>
            ))}
          </div>
          {selectedHotspot && (
            <div className="mt-3 p-3 bg-amber-500/5 rounded border border-amber-500/10">
              <p className="text-xs text-amber-200/80">{selectedHotspot.description}</p>
            </div>
          )}
        </div>
      )}

      {/* NPC 互动列表 */}
      {showNpcs && (
        <div className="mb-4 p-3 bg-black/40 rounded-lg border border-blue-500/10">
          <p className="text-xs text-blue-300/70 mb-2 tracking-wider">
            可互动的角色：
          </p>
          <div className="flex flex-wrap gap-2">
            {/* 模拟NPC列表 */}
            {['kitsune_miko', 'alraune_florist', 'slime_clerk'].map((npcId) => (
              <button
                key={npcId}
                onClick={() => handleNpcInteract(npcId)}
                className="px-3 py-1.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-xs text-blue-200 hover:bg-blue-500/20 transition-all duration-200"
              >
                {npcId === 'kitsune_miko' ? '狐鈴' : npcId === 'alraune_florist' ? '花音' : '小翠'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 底部操作按钮 */}
      {showActions && (
        <div className="mt-auto grid grid-cols-2 gap-2 pb-4">
          <button onClick={() => handleAction('explore')} className="choice-button">
            探索
          </button>
          <button onClick={() => handleAction('investigate')} className="choice-button awareness">
            调查
          </button>
          <button onClick={() => handleAction('dialogue')} className="choice-button">
            对话
          </button>
          <button onClick={() => handleAction('next_scene')} className="choice-button">
            前往下个场景
          </button>
          <button onClick={() => handleAction('inventory')} className="choice-button">
            打开背包
          </button>
          <button onClick={() => handleAction('calendar')} className="choice-button">
            查看日程
          </button>
          <button onClick={() => handleAction('phone')} className="choice-button bg-amber-900/20 border-amber-500/30 hover:bg-amber-800/30 flex items-center gap-2">
            <span className="text-lg">📱</span>
            <span>手机</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ExplorationScreen;
