import React, { useMemo } from 'react';
import { useGame } from '@/game/engine/GameContext';
import { cn } from '@/lib/utils';

// ─── Props ──────────────────────────────────────────────────────────

interface TransformationUIProps {
  onClose: () => void;
}

// ─── 种族图标与名称映射 ────────────────────────────────────────────

const SPECIES_MAP: Record<string, { emoji: string; name: string }> = {
  human: { emoji: '👤', name: '人类' },
  slime: { emoji: '💚', name: '史莱姆娘' },
  kitsune: { emoji: '🦊', name: '狐妖' },
  vampire: { emoji: '🩸', name: '吸血鬼' },
  succubus: { emoji: '💜', name: '魅魔' },
  dragon: { emoji: '🐉', name: '龙娘' },
  nekomata: { emoji: '🐱', name: '猫又' },
  harpy: { emoji: '🕊️', name: '哈比' },
  mermaid: { emoji: '🧜', name: '人鱼' },
  lamia: { emoji: '🐍', name: '拉米亚' },
  doll: { emoji: '🎎', name: '人偶' },
  golem: { emoji: '🗿', name: '魔像' },
  phantom: { emoji: '👻', name: '幽灵' },
  oni: { emoji: '👹', name: '鬼族' },
};

// ─── 性别图标与名称映射 ────────────────────────────────────────────

const GENDER_MAP: Record<string, { emoji: string; name: string }> = {
  male: { emoji: '♂️', name: '男性' },
  female: { emoji: '♀️', name: '女性' },
  secret: { emoji: '⚤', name: '秘密' },
  neuter: { emoji: '⚧', name: '无性' },
  futanari: { emoji: '⚥', name: '双性' },
};

// ─── 年龄图标与名称映射 ────────────────────────────────────────────

const AGE_MAP: Record<string, { emoji: string; name: string }> = {
  adult: { emoji: '👨', name: '成年' },
  teen: { emoji: '👦', name: '少年' },
  child: { emoji: '👶', name: '幼年' },
  elder: { emoji: '👴', name: '老年' },
};

// ─── 身份图标与名称映射 ────────────────────────────────────────────

const IDENTITY_MAP: Record<string, { emoji: string; name: string }> = {
  detective: { emoji: '🕵️', name: '侦探' },
  journalist: { emoji: '📰', name: '记者' },
  doctor: { emoji: '💉', name: '医生' },
  student: { emoji: '📚', name: '学生' },
};

// ─── 身体改造前缀映射 ─────────────────────────────────────────────

const BODY_MOD_MAP: Record<string, { emoji: string; label: string }> = {
  body_tail: { emoji: '🦊', label: '尾巴' },
  body_ears: { emoji: '🐱', label: '兽耳' },
  body_wings: { emoji: '🕊️', label: '翅膀' },
  body_skin: { emoji: '🎨', label: '皮肤' },
  body_horns: { emoji: '🐉', label: '角' },
  body_scales: { emoji: '🐍', label: '鳞片' },
  body_tentacles: { emoji: '🦑', label: '触手' },
  body_fins: { emoji: '🐟', label: '鳍' },
  body_claws: { emoji: '🦅', label: '爪' },
  body_fangs: { emoji: '🦷', label: '獠牙' },
  body_eyes: { emoji: '👁️', label: '异色瞳' },
  body_halo: { emoji: '😇', label: '光环' },
};

// ─── 组件 ───────────────────────────────────────────────────────────

const TransformationUI: React.FC<TransformationUIProps> = ({ onClose }) => {
  const { state } = useGame();
  const flags = state.flags ?? {};

  // ─── 从flags读取玩家状态 ────────────────────────────────────
  const gender = (flags.player_gender as string) ?? 'male';
  const age = (flags.player_age as string) ?? 'adult';
  const species = (flags.player_species as string) ?? 'human';
  const identity = (flags.player_identity as string) ?? 'detective';
  const transformations: string[] = Array.isArray(flags.player_transformations)
    ? (flags.player_transformations as string[])
    : [];
  const erosion = state.erosionLevel ?? 0;
  const awareness = state.awarenessLevel ?? 0;

  // ─── 当前状态卡片数据 ───────────────────────────────────────
  const genderInfo = GENDER_MAP[gender] ?? { emoji: '❓', name: gender };
  const ageInfo = AGE_MAP[age] ?? { emoji: '❓', name: age };
  const identityInfo = IDENTITY_MAP[identity] ?? { emoji: '❓', name: identity };
  const speciesInfo = SPECIES_MAP[species] ?? { emoji: '👤', name: species };

  // ─── 身体改造列表（从flags读取 body_xxx）────────────────────
  const bodyMods = useMemo(() => {
    const items: Array<{ emoji: string; label: string; value: string }> = [];
    for (const [key, cfg] of Object.entries(BODY_MOD_MAP)) {
      const val = flags[key];
      if (val !== undefined && val !== null && val !== false) {
        items.push({
          emoji: cfg.emoji,
          label: cfg.label,
          value: String(val),
        });
      }
    }
    return items;
  }, [flags]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg mx-4 max-h-[85vh] overflow-y-auto rounded-xl bg-gradient-to-b from-gray-900 via-purple-950/60 to-gray-900 border border-purple-500/20 shadow-2xl">
        {/* 顶部：标题 + 关闭按钮 */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-3 bg-gray-900/90 backdrop-blur-sm border-b border-white/5 rounded-t-xl">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔄</span>
            <h2 className="text-sm font-bold text-purple-200 tracking-wider">TSF变化状态</h2>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg text-xs bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          >
            关闭
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* ─── 第一部分：当前状态卡片 ─────────────────────── */}
          <div>
            <h3 className="text-[10px] text-gray-500 tracking-wider mb-2">▸ 当前状态</h3>
            <div className="grid grid-cols-2 gap-3">
              {/* 左列 */}
              <div className="space-y-2">
                {/* 性别 */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-lg">{genderInfo.emoji}</span>
                  <div>
                    <div className="text-[10px] text-gray-500">性别</div>
                    <div className="text-xs font-semibold text-gray-200">{genderInfo.name}</div>
                  </div>
                </div>

                {/* 年龄 */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-lg">{ageInfo.emoji}</span>
                  <div>
                    <div className="text-[10px] text-gray-500">年龄</div>
                    <div className="text-xs font-semibold text-gray-200">{ageInfo.name}</div>
                  </div>
                </div>

                {/* 身份 */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-lg">{identityInfo.emoji}</span>
                  <div>
                    <div className="text-[10px] text-gray-500">身份</div>
                    <div className="text-xs font-semibold text-gray-200">{identityInfo.name}</div>
                  </div>
                </div>
              </div>

              {/* 右列 */}
              <div className="space-y-2">
                {/* 种族 */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-lg">{speciesInfo.emoji}</span>
                  <div>
                    <div className="text-[10px] text-gray-500">种族</div>
                    <div className="text-xs font-semibold text-gray-200">{speciesInfo.name}</div>
                  </div>
                </div>

                {/* 侵蚀度进度条 */}
                <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-pink-400/80">侵蚀度</span>
                    <span className="text-[9px] text-pink-300/60">{erosion}%</span>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 10 }).map((_, i) => {
                      const filled = erosion >= (i + 1) * 10;
                      return (
                        <div
                          key={i}
                          className={cn(
                            'flex-1 h-2 rounded-sm transition-all',
                            filled ? 'bg-pink-500 shadow-[0_0_4px_rgba(236,72,153,0.5)]' : 'bg-gray-700',
                          )}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* 认知度进度条 */}
                <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-blue-400/80">认知度</span>
                    <span className="text-[9px] text-blue-300/60">{awareness}%</span>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 10 }).map((_, i) => {
                      const filled = awareness >= (i + 1) * 10;
                      return (
                        <div
                          key={i}
                          className={cn(
                            'flex-1 h-2 rounded-sm transition-all',
                            filled ? 'bg-blue-500 shadow-[0_0_4px_rgba(59,130,246,0.5)]' : 'bg-gray-700',
                          )}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── 第二部分：TSF变化记录 ─────────────────────── */}
          <div>
            <h3 className="text-[10px] text-gray-500 tracking-wider mb-2">▸ TSF变化记录</h3>
            {transformations.length === 0 ? (
              <div className="px-3 py-3 rounded-lg bg-white/5 border border-dashed border-white/10 text-center">
                <span className="text-[10px] text-gray-500">尚未触发任何TSF变化</span>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto pr-1">
                {transformations.map((t, idx) => {
                  // 尝试从变化字符串中提取emoji信息
                  const emojiMap: Record<string, string> = {
                    slime: '💚',
                    vampire: '🩸',
                    kitsune: '🦊',
                    succubus: '💜',
                    dragon: '🐉',
                    nekomata: '🐱',
                    harpy: '🕊️',
                    mermaid: '🧜',
                    lamia: '🐍',
                    doll: '🎎',
                    golem: '🗿',
                    phantom: '👻',
                    oni: '👹',
                    gender: '⚤',
                    age: '👶',
                    identity: '🆔',
                    body: '🔧',
                  };
                  const matchedKey = Object.keys(emojiMap).find((k) =>
                    t.toLowerCase().includes(k),
                  );
                  const emoji = matchedKey ? emojiMap[matchedKey] : '🔄';
                  return (
                    <div
                      key={`tf-${idx}`}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 rounded-lg',
                        'bg-gradient-to-r from-purple-900/20 to-pink-900/10 border border-purple-500/15',
                      )}
                    >
                      <span>{emoji}</span>
                      <span className="text-[11px] text-gray-300">
                        {t.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ─── 第三部分：身体改造列表 ─────────────────────── */}
          <div>
            <h3 className="text-[10px] text-gray-500 tracking-wider mb-2">▸ 身体改造</h3>
            {bodyMods.length === 0 ? (
              <div className="px-3 py-3 rounded-lg bg-white/5 border border-dashed border-white/10 text-center">
                <span className="text-[10px] text-gray-500">尚未检测到身体改造</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-1.5">
                {bodyMods.map((mod, idx) => (
                  <div
                    key={`body-${idx}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10"
                  >
                    <span className="text-base">{mod.emoji}</span>
                    <div>
                      <div className="text-[10px] text-gray-500">{mod.label}</div>
                      <div className="text-[11px] font-medium text-gray-200 truncate max-w-[100px]">
                        {mod.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 底部留白 */}
        <div className="h-4" />
      </div>
    </div>
  );
};

export default TransformationUI;
