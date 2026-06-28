import React, { useMemo } from 'react';
import { useGame } from '@/game/engine/GameContext';
import { cn } from '@/lib/utils';

// ─── 可附身NPC配置 ──────────────────────────────────────────────────

interface PossessableNpc {
  id: string;
  name: string;
  nameCN: string;
  scene: string;
  /** 最低好感度要求 */
  minAffinity: number;
  /** 附身难度（1-5星） */
  difficulty: number;
  /** flag前缀 */
  flagPrefix: string;
}

const POSSESSABLE_NPCS: PossessableNpc[] = [
  { id: 'kitsune_miko', name: 'Kitsune Miko', nameCN: '狐铃', scene: 'shrine', minAffinity: 2, difficulty: 3, flagPrefix: 'kitsune' },
  { id: 'slime_girl', name: 'Slime Girl', nameCN: '小翠', scene: 'town_center', minAffinity: 1, difficulty: 2, flagPrefix: 'slime' },
  { id: 'vampire_nurse', name: 'Vampire Doctor', nameCN: '血月医生', scene: 'hospital', minAffinity: 2, difficulty: 4, flagPrefix: 'vampire' },
  { id: 'succubus_bartender', name: 'Succubus Bartender', nameCN: '魅魔调酒师', scene: 'alley_night', minAffinity: 3, difficulty: 4, flagPrefix: 'succubus' },
  { id: 'werewolf_guard', name: 'Werewolf Guard', nameCN: '狼人保安', scene: 'school', minAffinity: 2, difficulty: 3, flagPrefix: 'werewolf' },
  { id: 'alraune_florist', name: 'Alraune Florist', nameCN: '花店老板娘', scene: 'town_center', minAffinity: 2, difficulty: 2, flagPrefix: 'alraune' },
  { id: 'dragon_mayor', name: 'Dragon Mayor', nameCN: '龙映市长', scene: 'town_hall', minAffinity: 4, difficulty: 5, flagPrefix: 'dragon' },
];

// ─── Props ──────────────────────────────────────────────────────────

interface PossessionUIProps {
  onClose: () => void;
}

// ─── 组件 ───────────────────────────────────────────────────────────

const PossessionUI: React.FC<PossessionUIProps> = ({ onClose }) => {
  const { state, dispatch } = useGame();
  const flags = state.flags ?? {};
  const npcRelations = state.npcRelations ?? {};

  // ─── 获取当前场景的可附身NPC ───────────────────────────────

  const availableNpcs = useMemo(() => {
    const currentScene = state.currentScene ?? '';
    return POSSESSABLE_NPCS.filter((npc) => {
      // 必须在同一场景
      if (npc.scene !== currentScene) return false;
      // 好感度检查
      const relation = npcRelations[npc.id];
      const affinity = relation?.affinity ?? 0;
      if (affinity < npc.minAffinity) return false;
      // 检查是否已被附身
      if (flags[`possessed_${npc.flagPrefix}`]) return false;
      return true;
    });
  }, [state.currentScene, npcRelations, flags]);

  // ─── 附身操作 ───────────────────────────────────────────────

  const handlePossess = (npc: PossessableNpc) => {
    // 设置该NPC的附身flag
    dispatch({
      type: 'SET_FLAG',
      payload: { key: `possessed_${npc.flagPrefix}`, value: true },
    });
    // 解锁附身能力
    dispatch({
      type: 'SET_FLAG',
      payload: { key: 'unlocked_possession', value: true },
    });
    // 跳转到possession_awakening节点
    dispatch({
      type: 'SET_FLAG',
      payload: { key: 'cyoaCurrentNode', value: 'possession_awakening' },
    });
    onClose();
  };

  // ─── 难度星星渲染 ───────────────────────────────────────────

  const renderDifficulty = (level: number) => {
    return '★'.repeat(level) + '☆'.repeat(5 - level);
  };

  // ─── 获取好感度数值 ─────────────────────────────────────────

  const getAffinity = (npcId: string): number => {
    return npcRelations[npcId]?.affinity ?? 0;
  };

  // ─── 在没有可附身NPC时的显示 ───────────────────────────────

  if (availableNpcs.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
        <div className="relative w-full max-w-sm mx-4 p-6 rounded-xl bg-gradient-to-b from-purple-900/80 to-gray-900/90 border border-purple-500/20 shadow-2xl">
          <div className="text-center">
            <div className="text-3xl mb-3 opacity-50">🌀</div>
            <p className="text-sm text-gray-400 font-game tracking-wider">
              当前场景没有可附身的对象。
            </p>
            <p className="text-xs text-gray-500 mt-2">
              尝试前往其他场景，或提升与NPC的好感度。
            </p>
          </div>
          <button
            onClick={onClose}
            className="absolute bottom-4 right-4 px-4 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          >
            关闭
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-sm mx-4 p-5 rounded-xl bg-gradient-to-b from-purple-900/80 to-gray-900/90 border border-purple-500/20 shadow-2xl">
        {/* 标题 */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">🌀</span>
          <h2 className="text-sm font-bold text-purple-200 tracking-wider">意识附身</h2>
          <span className="text-[9px] text-purple-400/50 ml-auto">选择附身目标</span>
        </div>

        {/* NPC列表 */}
        <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-1">
          {availableNpcs.map((npc) => {
            const affinity = getAffinity(npc.id);
            const avatarChar = npc.nameCN.charAt(0);
            return (
              <button
                key={npc.id}
                onClick={() => handlePossess(npc)}
                className={cn(
                  'w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left',
                  'border border-white/10 bg-white/5 hover:bg-purple-500/15 hover:border-purple-400/30',
                  'group'
                )}
              >
                {/* 头像 */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shrink-0 shadow-lg">
                  <span className="text-sm font-bold text-white">{avatarChar}</span>
                </div>

                {/* 信息 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-200 group-hover:text-purple-200 transition-colors">
                      {npc.nameCN}
                    </span>
                    <span className="text-[9px] text-gray-500 truncate">{npc.scene}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    {/* 好感度 */}
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] text-pink-300/70">❤</span>
                      <span className="text-[10px] text-pink-200/80">{affinity}</span>
                    </div>
                    <span className="text-[9px] text-gray-600">|</span>
                    {/* 难度 */}
                    <span className="text-[9px] text-amber-400/70">
                      {renderDifficulty(npc.difficulty)}
                    </span>
                  </div>
                </div>

                {/* 附身按钮指示 */}
                <div className="text-[10px] text-purple-400/50 group-hover:text-purple-300/80 transition-colors">
                  附身 →
                </div>
              </button>
            );
          })}
        </div>

        {/* 底部提示 */}
        <div className="mt-3 text-[9px] text-gray-600 text-center tracking-wider">
          附身后将进入该角色的记忆世界
        </div>

        {/* 关闭按钮 - 右下角 */}
        <button
          onClick={onClose}
          className="absolute -bottom-10 right-0 px-4 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
        >
          关闭
        </button>
      </div>
    </div>
  );
};

export default PossessionUI;
