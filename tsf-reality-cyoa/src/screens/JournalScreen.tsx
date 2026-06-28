import React, { useState, useMemo, useCallback } from 'react';
import { useGame } from '@/game/engine/GameContext';
import type { DiscoveryEntry, ClueEntry, EndingData, BadEndData, ClueCategory } from '@/game/engine/types';
import { cn } from '@/lib/utils';

type JournalTab = 'discoveries' | 'clues' | 'bestiary' | 'endings';

const CATEGORY_LABELS: Record<string, string> = {
  reality_anomaly: '现实异常',
  identity_trace: '身份痕迹',
  monster_lore: '魔物料考',
  organization: '组织情报',
  historical: '历史记录',
  personal: '私人线索',
  forbidden: '禁忌知识',
  gender_reversal: '性别改写',
  age_reversal: '年龄反转',
  identity_swap: '身份替换',
  monster_hidden: '怪物隐藏',
  reality_tear: '现实裂缝',
};

const CATEGORY_COLORS: Record<string, string> = {
  reality_anomaly: 'border-blue-500/30 bg-blue-500/5 text-blue-300',
  identity_trace: 'border-green-500/30 bg-green-500/5 text-green-300',
  monster_lore: 'border-purple-500/30 bg-purple-500/5 text-purple-300',
  organization: 'border-red-500/30 bg-red-500/5 text-red-300',
  historical: 'border-amber-500/30 bg-amber-500/5 text-amber-300',
  personal: 'border-pink-500/30 bg-pink-500/5 text-pink-300',
  forbidden: 'border-rose-700/30 bg-rose-700/5 text-rose-400',
  gender_reversal: 'border-cyan-500/30 bg-cyan-500/5 text-cyan-300',
  age_reversal: 'border-teal-500/30 bg-teal-500/5 text-teal-300',
  identity_swap: 'border-orange-500/30 bg-orange-500/5 text-orange-300',
  monster_hidden: 'border-violet-500/30 bg-violet-500/5 text-violet-300',
  reality_tear: 'border-rose-500/30 bg-rose-500/5 text-rose-300',
};

const JournalScreen: React.FC = () => {
  const { state, dispatch } = useGame();

  const [activeTab, setActiveTab] = useState<JournalTab>('discoveries');
  const [selectedDiscovery, setSelectedDiscovery] = useState<DiscoveryEntry | null>(null);
  const [selectedClue, setSelectedClue] = useState<ClueEntry | null>(null);
  const [selectedEndingId, setSelectedEndingId] = useState<string | null>(null);

  const discoveries = state?.discoveries?.entries ?? [];
  const clues = state?.inventory?.clues ?? [];
  const endingsUnlocked = state?.ending?.endingsUnlocked ?? [];
  const badEndsUnlocked = state?.ending?.badEndsUnlocked ?? [];

  // 模拟魔物娘图鉴数据
  const bestiaryEntries = useMemo(
    () => [
      { id: 'slime', nameCN: '史莱姆娘', description: '身体由半透明凝胶构成的生物。性格温和，但具有极强的可塑性。', discovered: true },
      { id: 'kitsune', nameCN: '狐妖', description: '拥有多条尾巴的狐狸精。擅长幻术和结界术。', discovered: true },
      { id: 'alraune', nameCN: '花妖', description: '植物的化身。本体是一株巨大的古老植物。', discovered: true },
      { id: 'vampire', nameCN: '吸血鬼', description: '以血液为生的夜行性存在。优雅而危险。', discovered: false },
      { id: 'succubus', nameCN: '魅魔', description: '以精气为食的恶魔。拥有极强的魅惑能力。', discovered: true },
      { id: 'dragon', nameCN: '龙娘', description: '东方巨龙的人形态。拥有改变现实的力量。', discovered: false },
      { id: 'lamia', nameCN: '拉米亚', description: '上半身为人、下半身为蛇的存在。', discovered: false },
      { id: 'harpy', nameCN: '哈比', description: '拥有鸟翼和利爪的半人半鸟存在。', discovered: false },
      { id: 'mermaid', nameCN: '人鱼', description: '拥有鱼尾的水中住民。歌声具有魔力。', discovered: true },
    ],
    [],
  );

  const tabs: { key: JournalTab; label: string; count?: number }[] = [
    { key: 'discoveries', label: '发现记录', count: discoveries.length },
    { key: 'clues', label: '线索关联', count: clues.length },
    { key: 'bestiary', label: '魔物娘图鉴', count: bestiaryEntries.filter((e) => e.discovered).length },
    { key: 'endings', label: '结局记录', count: endingsUnlocked.length + badEndsUnlocked.length },
  ];

  const handleBack = useCallback(() => {
    dispatch({
      type: 'SET_FLAG',
      payload: { key: '_screen', value: 'exploration' },
    });
  }, [dispatch]);

  // 渲染发现记录
  const renderDiscoveries = () => (
    <div className="space-y-3">
      {discoveries.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-8">还没有发现任何记录。去探索这座城市吧。</p>
      ) : (
        discoveries.map((disc) => (
          <button
            key={disc.id}
            onClick={() => setSelectedDiscovery(disc)}
            className={cn(
              'w-full text-left p-3 rounded-lg border transition-all',
              selectedDiscovery?.id === disc.id
                ? 'bg-amber-500/10 border-amber-500/30'
                : 'bg-black/30 border-white/5 hover:bg-black/40 hover:border-white/10',
            )}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-200 font-medium">{disc.name}</span>
              <span
                className={cn(
                  'text-[10px] px-1.5 py-0.5 rounded border',
                  CATEGORY_COLORS[disc.category] ?? 'border-gray-500/30 text-gray-400',
                )}
              >
                {CATEGORY_LABELS[disc.category] ?? disc.category}
              </span>
            </div>
            <p className="text-xs text-gray-400 line-clamp-2">{disc.description}</p>
            <p className="text-[10px] text-gray-600 mt-1">第 {disc.discoveredOnDay} 日发现</p>
          </button>
        ))
      )}
      {selectedDiscovery && (
        <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-lg">
          <h4 className="font-journal text-base text-amber-200 mb-2">{selectedDiscovery.name}</h4>
          <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap font-journal">
            {selectedDiscovery.content}
          </p>
          {selectedDiscovery.isCritical && (
            <p className="text-xs text-rose-300/70 mt-2">* 这是一个关键发现。</p>
          )}
        </div>
      )}
    </div>
  );

  // 渲染线索关联（文字图谱）
  const renderClues = () => (
    <div className="space-y-3">
      {clues.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-8">尚未收集到任何线索。</p>
      ) : (
        <>
          <div className="p-4 bg-black/30 border border-white/5 rounded-lg">
            <p className="text-xs text-gray-400 mb-3">线索网络：</p>
            <div className="flex flex-wrap gap-2">
              {clues.map((clue) => (
                <button
                  key={clue.id}
                  onClick={() => setSelectedClue(clue)}
                  className={cn(
                    'px-3 py-1.5 rounded text-xs border transition-all',
                    selectedClue?.id === clue.id
                      ? 'bg-blue-500/10 border-blue-400/30 text-blue-200'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10',
                  )}
                >
                  {clue.name}
                </button>
              ))}
            </div>
            {/* 关联线（简化显示） */}
            <div className="mt-3 pt-3 border-t border-white/5">
              <p className="text-[10px] text-gray-500">
                提示：某些线索之间存在关联。收集更多线索以揭示真相。
              </p>
            </div>
          </div>
          {selectedClue && (
            <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-journal text-sm text-blue-200">{selectedClue.name}</h4>
                <span className="text-[10px] text-gray-500">
                  强度：{(selectedClue.strength * 100).toFixed(0)}%
                </span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">{selectedClue.content}</p>
              {selectedClue.interpretation && (
                <div className="mt-2 p-2 bg-green-500/5 border border-green-500/10 rounded">
                  <p className="text-[10px] text-green-300/70">解读：{selectedClue.interpretation}</p>
                </div>
              )}
              {selectedClue.isCritical && (
                <p className="text-xs text-rose-300/70 mt-1">* 关键线索</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );

  // 渲染魔物娘图鉴
  const renderBestiary = () => (
    <div className="grid grid-cols-2 gap-3">
      {bestiaryEntries.map((entry) => (
        <div
          key={entry.id}
          className={cn(
            'p-3 rounded-lg border transition-all',
            entry.discovered
              ? 'bg-purple-500/5 border-purple-500/20'
              : 'bg-black/20 border-white/5 opacity-40',
          )}
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/10 flex items-center justify-center mb-2">
            <span className="font-title text-lg text-purple-300">
              {entry.nameCN.charAt(0)}
            </span>
          </div>
          <h4 className="font-journal text-sm text-gray-200 mb-1">{entry.nameCN}</h4>
          {entry.discovered ? (
            <p className="text-xs text-gray-400">{entry.description}</p>
          ) : (
            <p className="text-xs text-gray-600">??? 未解锁 ???</p>
          )}
        </div>
      ))}
    </div>
  );

  // 渲染结局记录
  const renderEndings = () => (
    <div className="space-y-3">
      <div className="p-3 bg-black/30 border border-white/5 rounded-lg">
        <h4 className="font-journal text-sm text-gray-300 mb-2">已解锁的结局</h4>
        {endingsUnlocked.length === 0 && badEndsUnlocked.length === 0 ? (
          <p className="text-xs text-gray-500">尚未达成任何结局。</p>
        ) : (
          <div className="space-y-2">
            {endingsUnlocked.map((eId) => (
              <button
                key={eId}
                onClick={() => setSelectedEndingId(eId)}
                className={cn(
                  'w-full text-left p-2 rounded border text-xs transition-all',
                  selectedEndingId === eId
                    ? 'bg-amber-500/10 border-amber-400/30 text-amber-200'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10',
                )}
              >
                {eId}
              </button>
            ))}
            {badEndsUnlocked.map((bId) => (
              <button
                key={bId}
                onClick={() => setSelectedEndingId(bId)}
                className="w-full text-left p-2 rounded border border-rose-500/20 bg-rose-500/5 text-rose-300/80 text-xs"
              >
                Bad End: {bId}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="p-3 bg-black/30 border border-white/5 rounded-lg">
        <h4 className="font-journal text-sm text-gray-300 mb-1">收集进度</h4>
        <p className="text-xs text-gray-500">
          普通结局：{endingsUnlocked.length}/7 · Bad End：{badEndsUnlocked.length}/12
        </p>
      </div>
    </div>
  );

  const tabContent: Record<JournalTab, () => React.ReactNode> = {
    discoveries: renderDiscoveries,
    clues: renderClues,
    bestiary: renderBestiary,
    endings: renderEndings,
  };

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
        <h2 className="font-title text-xl text-amber-200/80 tracking-wider">
          调查日志
        </h2>
        <div className="w-20" />
      </div>

      {/* 笔记本样式容器 */}
      <div className="game-panel" style={{ background: 'rgba(15,12,41,0.85)' }}>
        {/* 标签页 */}
        <div className="flex border-b border-white/10 mb-4 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setSelectedDiscovery(null);
                setSelectedClue(null);
              }}
              className={cn(
                'px-4 py-2 text-xs transition-all border-b-2 whitespace-nowrap',
                activeTab === tab.key
                  ? 'border-amber-400 text-amber-200'
                  : 'border-transparent text-gray-500 hover:text-gray-300',
              )}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className="ml-1 text-[10px] text-gray-600">({tab.count})</span>
              )}
            </button>
          ))}
        </div>

        {/* 标签页内容 */}
        <div className="font-journal">{tabContent[activeTab]()}</div>
      </div>
    </div>
  );
};

export default JournalScreen;
