import React, { useState, useMemo, useCallback } from 'react';
import { useGame } from '@/game/engine/GameContext';
import type { NpcId as NpcIdType } from '@/game/engine/types';
import { cn } from '@/lib/utils';

interface NpcCardData {
  id: NpcIdType;
  nameCN: string;
  species: string;
  location: string;
  affinity: number;
  affinityPoints: number;
  affinityLevel: number;
  stage: string;
  dialogueTopics: string[];
  romanceable: boolean;
  romanceProgress: number;
  interactCount: number;
}

const NPC_STAGE_LABELS: Record<number, string> = {
  0: '初识',
  1: '熟络',
  2: '深交',
  3: '信赖',
  4: '亲密',
  5: '羁绊',
};

const AFFINITY_LEVEL_LABELS: Record<number, string> = {
  0: '陌生人',
  1: '认识',
  2: '友好',
  3: '信任',
  4: '亲密',
  5: '羁绊',
};

const NPC_DATABASE: Record<string, { nameCN: string; species: string; romanceable: boolean }> = {
  slime_clerk: { nameCN: '小翠', species: '史莱姆', romanceable: false },
  kitsune_miko: { nameCN: '狐鈴', species: '狐妖', romanceable: true },
  alraune_florist: { nameCN: '花音', species: '花妖', romanceable: true },
  vampire_doctor: { nameCN: '血月', species: '吸血鬼', romanceable: true },
  succubus_bartender: { nameCN: '夜魅', species: '魅魔', romanceable: false },
  dragon_mayor: { nameCN: '龙映', species: '龙娘', romanceable: false },
  doll_shop_owner: { nameCN: '偶人', species: '人形', romanceable: false },
  werewolf_detective: { nameCN: '老狼', species: '狼人', romanceable: false },
};

const AffinityScreen: React.FC = () => {
  const { state, dispatch } = useGame();

  const npcRelations = state?.npcRelations ?? {};
  const flags = state?.narrative?.flags ?? {};

  const [expandedNpc, setExpandedNpc] = useState<NpcIdType | null>(null);
  const [sortBy, setSortBy] = useState<'affinity' | 'name' | 'recent'>('affinity');
  const [filterMet, setFilterMet] = useState<'all' | 'met' | 'unmet'>('all');

  // 构建NPC卡片数据
  const npcCards: NpcCardData[] = useMemo(() => {
    return Object.entries(NPC_DATABASE)
      .map(([npcId, data]) => {
        const rel = npcRelations[npcId];
        const affinity = rel?.affinity ?? 0;
        const affinityPoints = rel?.affinityPoints ?? 0;
        const interactCount = rel?.interactCount ?? 0;
        const met = rel?.met ?? false;
        const stage = rel?.dialogueStages?.length
          ? `阶段 ${rel.dialogueStages.length}`
          : '未开始';
        const romanceProgress = rel?.romanceProgress ?? 0;
        const dialogueTopics = rel?.dialogueStages ?? [];

        return {
          id: npcId as NpcIdType,
          nameCN: data.nameCN,
          species: data.species,
          location: '未知',
          affinity: met ? affinity : 0,
          affinityPoints: met ? affinityPoints : 0,
          affinityLevel: met ? (rel?.affinity ?? 0) : 0,
          stage: met ? stage : '???',
          dialogueTopics: met ? dialogueTopics : [],
          romanceable: data.romanceable,
          romanceProgress: met ? romanceProgress : 0,
          interactCount: met ? interactCount : 0,
        };
      });
  }, [npcRelations]);

  // 排序与过滤
  const filteredAndSorted = useMemo(() => {
    let list = [...npcCards];

    // 过滤
    if (filterMet === 'met') list = list.filter((c) => c.interactCount > 0);
    else if (filterMet === 'unmet') list = list.filter((c) => c.interactCount === 0);

    // 排序
    switch (sortBy) {
      case 'affinity':
        list.sort((a, b) => b.affinityPoints - a.affinityPoints);
        break;
      case 'name':
        list.sort((a, b) => a.nameCN.localeCompare(b.nameCN));
        break;
      case 'recent':
        list.sort((a, b) => b.interactCount - a.interactCount);
        break;
    }

    return list;
  }, [npcCards, sortBy, filterMet]);

  const totalAffinity = useMemo(() => {
    const max = npcCards.length * 100;
    const current = npcCards.reduce((sum, c) => sum + c.affinityPoints, 0);
    return { current, max, percentage: max > 0 ? Math.round((current / max) * 100) : 0 };
  }, [npcCards]);

  const handleBack = useCallback(() => {
    dispatch({
      type: 'SET_FLAG',
      payload: { key: '_screen', value: 'exploration' },
    });
  }, [dispatch]);

  // 好感度条颜色
  const affinityBarColor = (points: number): string => {
    if (points >= 80) return 'bg-pink-400';
    if (points >= 60) return 'bg-pink-300';
    if (points >= 40) return 'bg-amber-400';
    if (points >= 20) return 'bg-blue-400';
    return 'bg-gray-500';
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
        <h2 className="font-title text-xl text-pink-200/80 tracking-wider">
          角色关系
        </h2>
        <div className="text-right">
          <p className="text-xs text-gray-500">总好感度</p>
          <p className="text-sm text-pink-300">
            {totalAffinity.percentage}%
          </p>
        </div>
      </div>

      {/* 整体进度 */}
      <div className="game-panel mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400">好感度完成度</span>
          <span className="text-xs text-gray-500">
            {totalAffinity.current} / {totalAffinity.max}
          </span>
        </div>
        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-pink-500/40 via-pink-400/60 to-pink-300/80 rounded-full transition-all duration-500"
            style={{ width: `${totalAffinity.percentage}%` }}
          />
        </div>
      </div>

      {/* 排序/过滤 */}
      <div className="flex items-center gap-2 mb-3">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-gray-300"
        >
          <option value="affinity">按好感度</option>
          <option value="name">按名称</option>
          <option value="recent">按互动</option>
        </select>
        <div className="flex gap-1">
          {(['all', 'met', 'unmet'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilterMet(f)}
              className={cn(
                'px-2 py-1 text-xs rounded transition-all',
                filterMet === f
                  ? 'bg-pink-500/20 border border-pink-400/30 text-pink-200'
                  : 'text-gray-500 hover:text-gray-300',
              )}
            >
              {f === 'all' ? '全部' : f === 'met' ? '已结识' : '未结识'}
            </button>
          ))}
        </div>
      </div>

      {/* NPC卡片网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredAndSorted.map((npc) => {
          const isExpanded = expandedNpc === npc.id;
          const hasMet = npc.interactCount > 0;

          return (
            <div
              key={npc.id}
              className={cn(
                'game-panel transition-all duration-200',
                isExpanded && 'md:col-span-2',
              )}
            >
              {/* 卡片头部 */}
              <button
                onClick={() => setExpandedNpc(isExpanded ? null : npc.id)}
                className="w-full text-left"
              >
                <div className="flex items-center gap-3">
                  {/* 头像占位 */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-400/10 flex items-center justify-center shrink-0">
                    <span className="font-title text-lg text-pink-300">
                      {npc.nameCN.charAt(0)}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-game text-sm text-gray-100">{npc.nameCN}</h3>
                      {npc.romanceable && (
                        <span className="text-[10px] text-pink-300/60">♥</span>
                      )}
                      <span className="text-[10px] text-gray-500">({npc.species})</span>
                    </div>

                    {/* 好感度条 */}
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all duration-500',
                            hasMet ? affinityBarColor(npc.affinityPoints) : 'bg-gray-700',
                          )}
                          style={{ width: `${npc.affinityPoints}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-gray-400 w-8 text-right">
                        {npc.affinityPoints}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-gray-500">
                        {hasMet
                          ? AFFINITY_LEVEL_LABELS[npc.affinityLevel as keyof typeof AFFINITY_LEVEL_LABELS] ?? `Lv.${npc.affinityLevel}`
                          : '未结识'}
                      </span>
                      {hasMet && (
                        <span className="text-[10px] text-gray-600">
                          互动 {npc.interactCount} 次
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="text-xs text-gray-500">
                    {isExpanded ? '▲' : '▼'}
                  </span>
                </div>
              </button>

              {/* 展开详情 */}
              {isExpanded && hasMet && (
                <div className="mt-4 pt-3 border-t border-white/5">
                  {/* 当前阶段 */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-400">当前阶段</span>
                    <span className="text-xs text-pink-300/80">
                      {npc.stage}
                    </span>
                  </div>

                  {/* 攻略进度（若可攻略） */}
                  {npc.romanceable && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-pink-300/60">攻略进度</span>
                        <span className="text-xs text-gray-500">
                          {Math.round(npc.romanceProgress * 100)}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-pink-500/30 to-rose-400/60 rounded-full transition-all duration-500"
                          style={{ width: `${npc.romanceProgress * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* 对话话题 */}
                  <div>
                    <p className="text-xs text-gray-400 mb-2">对话话题</p>
                    {npc.dialogueTopics.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {npc.dialogueTopics.map((topic, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 text-[10px] bg-pink-500/5 border border-pink-500/10 text-pink-200/70 rounded"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-600">还没有解锁任何话题。</p>
                    )}
                  </div>
                </div>
              )}

              {isExpanded && !hasMet && (
                <div className="mt-4 pt-3 border-t border-white/5">
                  <p className="text-xs text-gray-500 text-center py-2">
                    你还没有遇到这位角色。继续探索吧。
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AffinityScreen;
