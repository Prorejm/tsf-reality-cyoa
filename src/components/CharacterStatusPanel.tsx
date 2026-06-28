// ============================================================================
// CharacterStatusPanel.tsx — 角色状态面板
// 显示角色当前的性别、年龄、身份、种族、TSF变化、认知度、侵蚀度
// ============================================================================

import React, { useMemo } from 'react';
import { useGame } from '@/game/engine/GameContext';
import { cn } from '@/lib/utils';

// ─── Props ────────────────────────────────────────────────────────────

interface CharacterStatusPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─── 性别映射 ─────────────────────────────────────────────────────────

interface GenderInfo {
  label: string;
  icon: string;
}

const GENDER_MAP: Record<string, GenderInfo> = {
  male: { label: '男', icon: '♂' },
  female: { label: '女', icon: '♀' },
  secret: { label: '秘密', icon: '⚤' },
};

const DEFAULT_GENDER: GenderInfo = { label: '未知', icon: '?' };

// ─── 年龄映射 ─────────────────────────────────────────────────────────

interface AgeInfo {
  label: string;
  icon: string;
}

const AGE_MAP: Record<string, AgeInfo> = {
  adult: { label: '成年', icon: '👨' },
  teen: { label: '少年', icon: '👦' },
  child: { label: '幼年', icon: '👶' },
};

const DEFAULT_AGE: AgeInfo = { label: '未知', icon: '?' };

// ─── 身份映射 ─────────────────────────────────────────────────────────

interface IdentityInfo {
  label: string;
  icon: string;
  desc: string;
}

const IDENTITY_MAP: Record<string, IdentityInfo> = {
  detective: { label: '侦探', icon: '🕵️', desc: '追查真相的探究者' },
  journalist: { label: '记者', icon: '📰', desc: '记录现实的观察者' },
  doctor: { label: '医生', label2: '医生', icon: '💉', desc: '治疗异常的医者' },
  student: { label: '学生', icon: '📚', desc: '探索知识的学者' },
};

const DEFAULT_IDENTITY: IdentityInfo = {
  label: '游客',
  icon: '🧳',
  desc: '偶然到访的旅人',
};

// ─── 种族映射 ─────────────────────────────────────────────────────────

interface SpeciesInfo {
  label: string;
  icon: string;
  desc: string;
}

function getSpeciesInfo(species: string): SpeciesInfo {
  const MAP: Record<string, SpeciesInfo> = {
    human: { label: '人类', icon: '👤', desc: '普通的现实居民' },
    slime: { label: '史莱姆', icon: '🟢', desc: '液态生命体' },
    lamia: { label: '拉米亚', icon: '🐍', desc: '蛇身人首的妖物' },
    succubus: { label: '魅魔', icon: '💋', desc: '汲取精气的梦魇' },
    werewolf: { label: '狼人', icon: '🐺', desc: '月下变身的猎手' },
    vampire: { label: '吸血鬼', icon: '🧛', desc: '永夜的贵族' },
    kitsune: { label: '狐妖', icon: '🦊', desc: '多尾的幻惑者' },
    harpy: { label: '哈比', icon: '🦅', desc: '天空的掠食者' },
    arachne: { label: '阿拉克尼', icon: '🕷️', desc: '织网的潜伏者' },
    mermaid: { label: '人鱼', icon: '🧜', desc: '深海的歌者' },
    alraune: { label: '阿尔劳妮', icon: '🌿', desc: '人形的毒之花' },
    doll: { label: '人偶', icon: '🎎', desc: '被操纵的玩偶' },
    dragon: { label: '龙娘', icon: '🐉', desc: '古龙的化身' },
    phantom: { label: '幻影', icon: '👻', desc: '虚实之间的存在' },
    oni: { label: '鬼族', icon: '👹', desc: '蛮力的化身' },
    golem: { label: '魔像', icon: '🗿', desc: '土石的造物' },
  };
  return MAP[species] ?? { label: species, icon: '❓', desc: '未知存在' };
}

// ─── TSF变化条目 ─────────────────────────────────────────────────────

interface TSFChangeItem {
  id: string;
  name: string;
  description: string;
}

// ─── 百分比条组件 ────────────────────────────────────────────────────

const ProgressBar: React.FC<{
  value: number;
  max: number;
  color: string;
  label: string;
}> = ({ value, max, color, label }) => {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const segments = 10;
  const filled = Math.round((pct / 100) * segments);

  return (
    <div className="flex items-center gap-2">
      <span className="text-[9px] text-gray-500 w-12 shrink-0 tracking-wider">
        {label}
      </span>
      <div className="flex-1 flex gap-0.5">
        {Array.from({ length: segments }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-2.5 w-full rounded-sm transition-all',
              i < filled
                ? color
                : 'bg-gray-700/50',
            )}
          />
        ))}
      </div>
      <span className="text-[9px] text-gray-400 w-8 text-right font-mono">
        {Math.round(value)}%
      </span>
    </div>
  );
};

// ─── 组件 ─────────────────────────────────────────────────────────────

const CharacterStatusPanel: React.FC<CharacterStatusPanelProps> = ({
  isOpen,
  onClose,
}) => {
  const { state } = useGame();
  const flags = state.flags ?? {};

  // ─── 角色基础属性 ────────────────────────────────────────────
  const gender = useMemo(() => {
    const raw = flags.player_gender as string | undefined;
    return GENDER_MAP[raw ?? ''] ?? DEFAULT_GENDER;
  }, [flags.player_gender]);

  const age = useMemo(() => {
    const raw = flags.player_age as string | undefined;
    return AGE_MAP[raw ?? ''] ?? DEFAULT_AGE;
  }, [flags.player_age]);

  const identity = useMemo(() => {
    const raw = flags.player_identity as string | undefined;
    return IDENTITY_MAP[raw ?? ''] ?? DEFAULT_IDENTITY;
  }, [flags.player_identity]);

  const speciesRaw = useMemo<string>(() => {
    return (flags.player_species as string) ?? 'human';
  }, [flags.player_species]);

  const species = useMemo(() => getSpeciesInfo(speciesRaw), [speciesRaw]);

  // ─── 认知度 / 侵蚀度 ────────────────────────────────────────
  const awarenessLevel = state.awarenessLevel ?? 0;
  const erosionLevel = state.erosionLevel ?? 0;

  // ─── TSF变化收集 ────────────────────────────────────────────
  const tsfChanges = useMemo<TSFChangeItem[]>(() => {
    const items: TSFChangeItem[] = [];

    // 1. 从 flags.player_transformations 读取
    const rawTransforms = flags.player_transformations;
    if (Array.isArray(rawTransforms)) {
      for (const t of rawTransforms as string[]) {
        items.push({
          id: `transform_${t}`,
          name: t.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
          description: 'TSF转变已触发',
        });
      }
    }

    // 2. 从 inventory 中查找带有 tsf_trigger 的 or flags 中带 tsf 的物品
    if (Array.isArray(state.inventory)) {
      for (const item of state.inventory) {
        if (item.flags?.includes('tsf_item') || item.type === 'tsf_trigger') {
          // 去重
          if (!items.some((i) => i.id === `item_${item.id}`)) {
            items.push({
              id: `item_${item.id}`,
              name: item.nameCN ?? item.name ?? item.id,
              description: item.description ?? '',
            });
          }
        }
      }
    }

    return items;
  }, [flags.player_transformations, state.inventory]);

  // ─── 角色创建信息 ────────────────────────────────────────────
  const createdAt = useMemo(() => {
    const raw = flags.character_created_at as string | undefined;
    if (raw) return raw;
    return null;
  }, [flags.character_created_at]);

  // ─── 认知阶段描述 ────────────────────────────────────────────
  const cognitionStage = useMemo(() => {
    if (awarenessLevel >= 80) return { label: '觉醒', color: 'text-blue-300' };
    if (awarenessLevel >= 50) return { label: '怀疑', color: 'text-cyan-300' };
    if (awarenessLevel >= 20) return { label: '察觉', color: 'text-teal-300' };
    return { label: '蒙昧', color: 'text-gray-400' };
  }, [awarenessLevel]);

  const erosionStage = useMemo(() => {
    if (erosionLevel >= 80) return { label: '同化', color: 'text-red-300' };
    if (erosionLevel >= 50) return { label: '侵蚀', color: 'text-pink-300' };
    if (erosionLevel >= 20) return { label: '感染', color: 'text-rose-300' };
    return { label: '稳定', color: 'text-gray-400' };
  }, [erosionLevel]);

  return (
    <>
      {/* ── 遮罩层 ──────────────────────────────────────────── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* ── 面板 ────────────────────────────────────────────── */}
      <div
        className={cn(
          'fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-gray-950/95 border-l border-white/10 shadow-2xl transition-all duration-300 ease-out flex flex-col',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* ── 标题栏 ──────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-black/30">
          <div className="flex items-center gap-2.5">
            <span className="text-sm">👤</span>
            <h2 className="text-sm font-bold text-purple-200 tracking-wider">
              角色状态
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors text-xs"
          >
            ✕
          </button>
        </div>

        {/* ── 内容区域 ────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">

          {/* ── 基础属性卡片 ──────────────────────────────── */}
          <div className="space-y-2">
            <div className="text-[10px] text-gray-500 tracking-wider uppercase mb-2">
              基础属性
            </div>

            {/* 性别 */}
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 border border-white/5">
              <div className="flex items-center gap-2">
                <span className="text-sm">{gender.icon}</span>
                <span className="text-[11px] text-gray-400">性别</span>
              </div>
              <span className="text-xs font-medium text-gray-200">{gender.label}</span>
            </div>

            {/* 年龄 */}
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 border border-white/5">
              <div className="flex items-center gap-2">
                <span className="text-sm">{age.icon}</span>
                <span className="text-[11px] text-gray-400">年龄</span>
              </div>
              <span className="text-xs font-medium text-gray-200">{age.label}</span>
            </div>

            {/* 身份 */}
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 border border-white/5">
              <div className="flex items-center gap-2">
                <span className="text-sm">{identity.icon}</span>
                <span className="text-[11px] text-gray-400">身份</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-medium text-gray-200">{identity.label}</span>
                <p className="text-[8px] text-gray-600">{identity.desc}</p>
              </div>
            </div>

            {/* 种族 */}
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 border border-white/5">
              <div className="flex items-center gap-2">
                <span className="text-sm">{species.icon}</span>
                <span className="text-[11px] text-gray-400">种族</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-medium text-gray-200">{species.label}</span>
                <p className="text-[8px] text-gray-600">{species.desc}</p>
              </div>
            </div>
          </div>

          {/* ── 状态条 ────────────────────────────────────── */}
          <div className="space-y-2">
            <div className="text-[10px] text-gray-500 tracking-wider uppercase mb-2">
              精神状态
            </div>

            <div className="px-3 py-3 rounded-lg bg-white/5 border border-white/5 space-y-3">
              {/* 认知度 */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px]">🧠</span>
                    <span className="text-[9px] text-gray-400">认知度</span>
                  </div>
                  <span className={cn('text-[9px] font-medium', cognitionStage.color)}>
                    {cognitionStage.label}
                  </span>
                </div>
                <ProgressBar
                  value={awarenessLevel}
                  max={100}
                  color="bg-blue-500"
                  label="认知"
                />
              </div>

              {/* 侵蚀度 */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px]">💀</span>
                    <span className="text-[9px] text-gray-400">侵蚀度</span>
                  </div>
                  <span className={cn('text-[9px] font-medium', erosionStage.color)}>
                    {erosionStage.label}
                  </span>
                </div>
                <ProgressBar
                  value={erosionLevel}
                  max={100}
                  color="bg-pink-500"
                  label="侵蚀"
                />
              </div>
            </div>
          </div>

          {/* ── TSF变化 ────────────────────────────────────── */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px]">🔄</span>
              <span className="text-[10px] text-gray-500 tracking-wider uppercase">
                TSF变化记录
              </span>
              {tsfChanges.length > 0 && (
                <span className="text-[9px] text-gray-600 bg-white/5 px-1.5 py-0.5 rounded">
                  {tsfChanges.length} 项
                </span>
              )}
            </div>

            {tsfChanges.length === 0 ? (
              <div className="px-3 py-4 text-center text-gray-600">
                <p className="text-[10px]">尚未触发任何TSF变化</p>
                <p className="text-[8px] text-gray-700 mt-1">
                  使用特殊道具或做出特定选择可能引发转变
                </p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {tsfChanges.map((change) => (
                  <div
                    key={change.id}
                    className="px-3 py-2 rounded-lg bg-amber-500/5 border border-amber-500/20"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px]">🔄</span>
                      <span className="text-[10px] font-medium text-amber-200/80">
                        {change.name}
                      </span>
                    </div>
                    {change.description && (
                      <p className="text-[8px] text-gray-500 mt-0.5 ml-4">
                        {change.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── 游戏信息 ────────────────────────────────────── */}
          <div className="pt-2 border-t border-white/5">
            <div className="text-[8px] text-gray-600 space-y-1">
              <p>第 {state.currentDay ?? 1} 天 · {state.currentPeriod ?? 'morning'}</p>
              <p>场景: {state.currentScene ?? 'unknown'}</p>
              <p>
                感知模式:{' '}
                {state.perceptionMode === 'truth' ? '真实视野' : '居民视角'}
              </p>
              {createdAt && <p>创建时间: {createdAt}</p>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CharacterStatusPanel;
