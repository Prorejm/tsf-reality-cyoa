import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useGame, useAdvanceTime } from '@/game/engine/GameContext';
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

interface GameNotification {
  id: string;
  text: string;
  type: 'info' | 'discovery' | 'warning' | 'system';
}

const TIME_PERIOD_LABELS: Record<string, string> = {
  morning: '早晨',
  afternoon: '下午',
  evening: '傍晚',
  night: '深夜',
};

// Scene descriptions per sceneId
const SCENE_DESCRIPTIONS: Record<string, string> = {
  home_bedroom: '你站在自己熟悉的房间里。窗外的街道看起来和平常没什么不同——至少表面上是这样。',
  town_center: '小镇的中心广场。喷泉的水声和鸽子的鸣叫营造出一种安宁的氛围，但你能感觉到有些东西不对劲。',
  shrine: '古老的神社坐落在一座小山丘上。微风拂过，风铃发出清脆的声响。空气中弥漫着一种若有若无的异香。',
  hospital: '白色的医院大楼。消毒水的气味中混杂着某种甜腻的味道，让人有些头晕。',
  school: '放学后的校园空无一人。操场上有一个孤独的影子——或许不是你认识的那个人。',
  alley_night: '昏暗的小巷。墙上的涂鸦在黑暗中似乎微微发着光。远处传来奇怪的摩擦声。',
};

const SCENE_CHOICES: Record<string, string[]> = {
  home_bedroom: ['检查房间', '看向窗外', '打开手机', '出门'],
  town_center: ['观察路人', '查看公告栏', '进入商店', '继续探索'],
  shrine: ['参拜神社', '查看绘马', '寻找巫女', '探索树林'],
  hospital: ['询问前台', '查看病历室', '走向病房', '寻找出口'],
  school: ['进入教室', '走向体育馆', '查看图书馆', '寻找校医'],
  alley_night: ['调查涂鸦', '追踪声音', '查看垃圾桶', '离开小巷'],
};

const ExplorationScreen: React.FC = () => {
  const { state, dispatch } = useGame();
  const advanceTime = useAdvanceTime();
  
  // === Flat state access (compatible with engine) ===
  const day = state.currentDay ?? 1;
  const period = state.currentPeriod ?? 'morning';
  const awareness = state.awarenessLevel ?? 0;
  const erosion = state.erosionLevel ?? 0;
  const perceptionMode = state.perceptionMode ?? 'resident';
  const currentScene = state.currentScene ?? 'home_bedroom';
  const inventory = state.inventory ?? [];

  const [displayedText, setDisplayedText] = useState('');
  const [showActions, setShowActions] = useState(false);
  const [notifications, setNotifications] = useState<GameNotification[]>([]);
  const [selectedHotspotIndex, setSelectedHotspotIndex] = useState<number | null>(null);

  // Get scene description
  const sceneDescription = useMemo(() => {
    const base = SCENE_DESCRIPTIONS[currentScene] ?? '一个普通的场景。';
    if (perceptionMode === 'truth') {
      return `【真相】${base.replace(/正常|普通/g, '⋯表面之下暗流涌动')}`;
    }
    return base;
  }, [currentScene, perceptionMode]);

  // Local choices for this scene
  const sceneActions = useMemo(() => {
    return SCENE_CHOICES[currentScene] ?? ['探索', '调查', '对话', '前往下个场景'];
  }, [currentScene]);

  // Hotspots for this scene
  const hotspots = useMemo((): Hotspot[] => {
    const base: Hotspot[] = [
      { id: 'h1', x: 25, y: 35, label: '奇怪的涂鸦', description: '墙上有一些你不认识的符号……', perceptionRequired: 0 },
      { id: 'h2', x: 60, y: 50, label: '可疑的痕迹', description: '地上有不寻常的拖拽痕迹。', perceptionRequired: 10 },
      { id: 'h3', x: 40, y: 70, label: '异常的声音', description: '你听到了一种不自然的、规律性的声音。', perceptionRequired: 20 },
      { id: 'h4', x: 75, y: 30, label: '错觉？', description: '眼角的余光中，似乎有什么东西移动了。', perceptionRequired: 30 },
    ];
    return base.filter(h => awareness >= (h.perceptionRequired ?? 0));
  }, [awareness]);

  // Typewriter effect
  useEffect(() => {
    setDisplayedText('');
    setShowActions(false);
    setSelectedHotspotIndex(null);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayedText(sceneDescription.slice(0, i));
      if (i >= sceneDescription.length) {
        clearInterval(interval);
        setShowActions(true);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [sceneDescription]);

  // Notification auto-dismiss
  const addNotification = useCallback((text: string, type: GameNotification['type'] = 'info') => {
    const id = `n-${Date.now()}`;
    setNotifications(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  }, []);

  // === Action handlers ===
  const handleAction = useCallback((action: string) => {
    switch (action) {
      case 'explore': case '探索':
      case '检查房间': case '进入商店':
        // Generic explore: add discovery + awareness
        dispatch({ type: 'APPLY_AWARENESS', payload: 5 });
        dispatch({
          type: 'ADD_DISCOVERY',
          payload: { id: `disc_${Date.now()}`, title: '发现异常', description: `你在${currentScene}发现了一些不寻常的事物。`, category: 'reality_anomaly' },
        });
        addNotification('洞察力略微提升 (+5)', 'discovery');
        break;

      // Scene-specific actions with item rewards
      case '观察路人':
        dispatch({ type: 'APPLY_AWARENESS', payload: 3 });
        addNotification('你注意到路人的举止有些……不自然。', 'discovery');
        break;

      case '参拜神社':
        dispatch({ type: 'APPLY_AWARENESS', payload: 5 });
        dispatch({ type: 'APPLY_EROSION', payload: -3 }); // soothe
        dispatch({ type: 'ADD_ITEM', payload: { id: 'amulet_protect', name: '守护护符', nameCN: '守护护符', type: 'equipment', quantity: 1, maxStack: 1, usable: true, description: '神社的护身符。能减轻"常识改写"的影响。', icon: '🪬' } });
        addNotification('你获得了一个守护护符！侵蚀略微减轻。', 'discovery');
        break;

      case '查看绘马':
        dispatch({ type: 'ADD_DISCOVERY', payload: { id: `disc_ema_${Date.now()}`, title: '绘马的留言', description: '绘马上写着:"我不想忘记自己是谁。"落款是一个狐狸爪印。', category: 'identity_trace' } });
        addNotification('你发现了一块可疑的绘马…', 'discovery');
        break;

      case '查看公告栏':
        dispatch({ type: 'ADD_DISCOVERY', payload: { id: `disc_bulletin_${Date.now()}`, title: '公告栏异常', description: '公告栏上的日期全部被改写了。你清楚地记得今天不是这个日期。', category: 'reality_anomaly' } });
        dispatch({ type: 'APPLY_AWARENESS', payload: 8 });
        addNotification('日期不对… 你的记忆没有错。', 'warning');
        break;

      case '进入教室':
        dispatch({ type: 'ADD_ITEM', payload: { id: 'photo_old', name: 'Old Photograph', nameCN: '旧照片', type: 'clue', quantity: 1, maxStack: 1, usable: false, description: '一张泛黄的照片，上面的人看起来和现在镇上的人一模一样。', icon: '📸' } });
        addNotification('你找到了一张旧照片… 上面的人你认识。', 'discovery');
        break;

      case '查看图书馆':
        dispatch({ type: 'APPLY_AWARENESS', payload: 8 });
        dispatch({ type: 'ADD_ITEM', payload: { id: 'note_stranger', name: 'Mysterious Note', nameCN: '神秘便条', type: 'key_item', quantity: 1, maxStack: 1, usable: false, description: '"不要相信镇长的话。他已经被替换了。——K"', icon: '📝' } });
        addNotification('你在一本书里发现了一张便条！', 'discovery');
        break;

      case '调查涂鸦':
        dispatch({ type: 'APPLY_AWARENESS', payload: 5 });
        dispatch({ type: 'APPLY_EROSION', payload: 3 });
        dispatch({ type: 'ADD_ITEM', payload: { id: 'mirror_antique', name: 'Antique Mirror', nameCN: '古镜', type: 'tsf_trigger', quantity: 1, maxStack: 1, usable: true, description: '涂鸦旁边放着一面古老的铜镜。镜中的倒影不对劲。', icon: '🪞' } });
        addNotification('你在涂鸦旁发现了一面古镜… 镜中的你动作慢了半拍。', 'warning');
        break;

      case '调查':
      case '查看病历室': case '查看垃圾桶':
      case '走向体育馆': case '追踪声音':
        dispatch({ type: 'SET_FLAG', payload: { key: '_screen', value: 'observation' } });
        break;

      case '对话':
      case '寻找巫女': case '寻找校医': case '寻找出口': {
        // Auto-set NPC based on scene
        const sceneNpcMap: Record<string, string> = {
          shrine: 'kitsune_miko',
          hospital: 'vampire_doctor',
          school: 'werewolf_detective',
          alley_night: 'succubus_bartender',
          town_center: 'alraune_florist',
          home_bedroom: 'kitsune_miko',
        };
        const npcTarget = sceneNpcMap[currentScene] ?? 'kitsune_miko';
        dispatch({ type: 'SET_FLAG', payload: { key: '_dialogue_npc', value: npcTarget } });
        dispatch({ type: 'SET_FLAG', payload: { key: '_screen', value: 'dialogue' } });
        break;
      }

      case 'next_scene': case '前往下个场景':
      case '出门': case '继续探索': case '离开小巷':
        advanceTime();
        addNotification('时间流逝...', 'system');
        // Cycle through scenes if we have time change
        break;

      case '看向窗外':
        addNotification('街道上有一个戴着面具的身影一闪而过...', 'warning');
        dispatch({ type: 'APPLY_EROSION', payload: 3 });
        dispatch({ type: 'APPLY_AWARENESS', payload: 2 });
        break;

      case '打开手机': case '进入商店': case '进入商店':
        dispatch({ type: 'SET_FLAG', payload: { key: '_screen', value: 'phone' } });
        break;

      case '查看图书馆':
        dispatch({ type: 'APPLY_AWARENESS', payload: 8 });
        addNotification('你发现了一些关于这座城镇历史的记录...', 'discovery');
        break;

      case '查看垃圾桶':
        dispatch({ type: 'APPLY_EROSION', payload: 2 });
        addNotification('垃圾桶里有一些令人不安的发现...', 'warning');
        break;

      case 'inventory': case '打开背包':
        dispatch({ type: 'SET_FLAG', payload: { key: '_screen', value: 'inventory' } });
        break;

      case 'calendar': case '查看日程':
        dispatch({ type: 'SET_FLAG', payload: { key: '_screen', value: 'calendar' } });
        break;

      default:
        addNotification(`你尝试了「${action}」`, 'info');
        break;
    }
  }, [dispatch, advanceTime, currentScene, addNotification]);

  // Quick action button rows
  const handleQuickAction = useCallback((action: string) => {
    switch (action) {
      case 'time':
        advanceTime();
        addNotification('时间流逝...', 'system');
        break;
      case 'inventory':
        dispatch({ type: 'SET_FLAG', payload: { key: '_screen', value: 'inventory' } });
        break;
      case 'map':
        dispatch({ type: 'SET_FLAG', payload: { key: '_screen', value: 'map' } });
        break;
      case 'phone':
        dispatch({ type: 'SET_FLAG', payload: { key: '_screen', value: 'phone' } });
        break;
      case 'journal':
        dispatch({ type: 'SET_FLAG', payload: { key: '_screen', value: 'journal' } });
        break;
      case 'calendar':
        dispatch({ type: 'SET_FLAG', payload: { key: '_screen', value: 'calendar' } });
        break;
      case 'affinity':
        dispatch({ type: 'SET_FLAG', payload: { key: '_screen', value: 'affinity' } });
        break;
    }
  }, [dispatch, advanceTime, addNotification]);

  const handleHotspotClick = useCallback((idx: number) => {
    setSelectedHotspotIndex(idx);
    const hs = hotspots[idx];
    if (hs) {
      addNotification(`发现: ${hs.label}`, 'discovery');
      dispatch({ type: 'APPLY_AWARENESS', payload: 3 });
      dispatch({
        type: 'ADD_DISCOVERY',
        payload: { id: `disc_${hs.id}_${Date.now()}`, title: hs.label, description: hs.description, category: 'reality_anomaly' },
      });
    }
  }, [hotspots, dispatch, addNotification]);

  // Erosion warning
  useEffect(() => {
    if (erosion >= 70 && erosion < 80) {
      addNotification('侵蚀值偏高——你的现实感知正在发生变化...', 'warning');
    } else if (erosion >= 50 && erosion < 55) {
      addNotification('你开始感觉到这个世界的"裂缝"...', 'warning');
    }
  }, [erosion, addNotification]);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-900 via-purple-950/30 to-gray-900">
      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-xs">
          {notifications.map(n => (
            <div
              key={n.id}
              className={cn(
                'px-4 py-2 rounded-lg text-xs font-game tracking-wider animate-slide-in shadow-lg',
                n.type === 'discovery' && 'bg-blue-900/80 border border-blue-500/30 text-blue-200',
                n.type === 'warning' && 'bg-amber-900/80 border border-amber-500/30 text-amber-200',
                n.type === 'system' && 'bg-purple-900/80 border border-purple-500/30 text-purple-200',
                n.type === 'info' && 'bg-gray-800/80 border border-gray-600/30 text-gray-300',
              )}
            >
              {n.text}
            </div>
          ))}
        </div>
      )}

      {/* Status Bar */}
      <div className="sticky top-0 z-40 flex items-center gap-3 px-4 py-2 bg-black/60 backdrop-blur-sm border-b border-white/5">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-gray-500 tracking-wider">D{day}</span>
          <span className="text-[10px] text-amber-400/80">{TIME_PERIOD_LABELS[period]}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-16 h-1.5 rounded-full bg-gray-700 overflow-hidden">
            <div className="h-full bg-blue-400 rounded-full transition-all" style={{ width: `${awareness}%` }} />
          </div>
          <span className="text-[9px] text-blue-300/70">{awareness}%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-16 h-1.5 rounded-full bg-gray-700 overflow-hidden">
            <div className="h-full bg-pink-500 rounded-full transition-all" style={{ width: `${erosion}%` }} />
          </div>
          <span className="text-[9px] text-pink-300/70">{erosion}%</span>
        </div>
        <button
          onClick={() => dispatch({ type: 'SWITCH_PERCEPTION' })}
          className={cn(
            'ml-auto px-2 py-0.5 rounded text-[9px] tracking-wider font-bold transition-all',
            perceptionMode === 'truth' ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30' : 'bg-gray-700/50 text-gray-400 border border-gray-600/30',
          )}
        >
          {perceptionMode === 'resident' ? '常识' : '真实'}
        </button>
      </div>

      {/* Scene Display */}
      <div className="px-4 pt-4 pb-2">
        <div className="relative mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-purple-900/30 via-gray-900 to-pink-900/20 border border-white/5 min-h-[120px] p-4">
          {/* Scene name */}
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-purple-400/60" />
            <h2 className="text-sm font-bold text-purple-200 tracking-wider">
              {currentScene.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
            </h2>
          </div>
          
          {/* Typewriter narrative text */}
          <p className="text-sm text-gray-300 leading-relaxed">
            {displayedText}
            {!showActions && <span className="animate-pulse text-purple-400">▌</span>}
          </p>
        </div>

        {/* Hotspots */}
        {showActions && hotspots.length > 0 && (
          <div className="mb-3">
            <p className="text-[10px] text-gray-500 tracking-wider mb-1.5">▸ 值得留意的细节</p>
            <div className="flex flex-wrap gap-1.5">
              {hotspots.map((hs, i) => (
                <button
                  key={hs.id}
                  onClick={() => handleHotspotClick(i)}
                  className={cn(
                    'px-2.5 py-1 rounded-md text-[11px] transition-all',
                    selectedHotspotIndex === i
                      ? 'bg-amber-500/20 border border-amber-400/30 text-amber-300'
                      : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-gray-200',
                  )}
                >
                  {hs.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Scene-specific actions (when typing done) */}
      {showActions && (
        <div className="px-4 pb-20">
          <p className="text-[10px] text-gray-500 tracking-wider mb-2">▸ 行動</p>
          <div className="grid grid-cols-2 gap-1.5">
            {sceneActions.map((action, i) => (
              <button
                key={i}
                onClick={() => handleAction(action)}
                className={cn(
                  'px-3 py-2.5 rounded-lg text-xs font-game tracking-wider transition-all text-left',
                  'border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-gray-300 hover:text-white',
                )}
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick action bar */}
      {showActions && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-gray-900/90 backdrop-blur-md border-t border-white/5">
          <div className="flex items-center justify-around px-2 py-2">
            {[
              { key: 'time', label: '⏩ 推进', color: 'text-purple-300' },
              { key: 'inventory', label: '🎒 背包', color: 'text-blue-300' },
              { key: 'map', label: '🗺 地图', color: 'text-emerald-300' },
              { key: 'phone', label: '📱 手机', color: 'text-amber-300' },
              { key: 'journal', label: '📖 日志', color: 'text-pink-300' },
              { key: 'calendar', label: '📅 日程', color: 'text-cyan-300' },
              { key: 'affinity', label: '❤ 好感', color: 'text-rose-300' },
            ].map(btn => (
              <button
                key={btn.key}
                onClick={() => handleQuickAction(btn.key)}
                className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg hover:bg-white/5 transition-colors"
              >
                <span className={`text-xs ${btn.color}`}>{btn.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExplorationScreen;
