// ============================================================================
// EvidenceTracker.tsx — 证据/线索追踪侧边抽屉面板
// 显示所有已发现的线索和发现物，按类别分组
// ============================================================================

import React, { useMemo } from 'react';
import { useGame } from '@/game/engine/GameContext';
import { cn } from '@/lib/utils';

// ─── Props ────────────────────────────────────────────────────────────

interface EvidenceTrackerProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─── 类别定义 ─────────────────────────────────────────────────────────

interface CategoryInfo {
  label: string;
  icon: string;
  color: string;
}

const CATEGORY_MAP: Record<string, CategoryInfo> = {
  reality_anomaly: {
    label: '现实异常',
    icon: '🌀',
    color: 'text-purple-300 border-purple-500/30 bg-purple-500/10',
  },
  identity_trace: {
    label: '身份痕迹',
    icon: '👤',
    color: 'text-blue-300 border-blue-500/30 bg-blue-500/10',
  },
  monster_lore: {
    label: '怪物传说',
    icon: '🐲',
    color: 'text-green-300 border-green-500/30 bg-green-500/10',
  },
  organization: {
    label: '组织情报',
    icon: '🏛️',
    color: 'text-amber-300 border-amber-500/30 bg-amber-500/10',
  },
  historical: {
    label: '历史记录',
    icon: '📜',
    color: 'text-cyan-300 border-cyan-500/30 bg-cyan-500/10',
  },
  personal: {
    label: '个人线索',
    icon: '💌',
    color: 'text-pink-300 border-pink-500/30 bg-pink-500/10',
  },
  forbidden: {
    label: '禁忌知识',
    icon: '⚠️',
    color: 'text-red-300 border-red-500/30 bg-red-500/10',
  },
  gender_reversal: {
    label: '性别反转',
    icon: '⚤',
    color: 'text-pink-300 border-pink-500/30 bg-pink-500/10',
  },
  age_reversal: {
    label: '年龄反转',
    icon: '🔄',
    color: 'text-cyan-300 border-cyan-500/30 bg-cyan-500/10',
  },
  identity_swap: {
    label: '身份替换',
    icon: '🎭',
    color: 'text-amber-300 border-amber-500/30 bg-amber-500/10',
  },
  monster_hidden: {
    label: '怪物潜藏',
    icon: '👾',
    color: 'text-green-300 border-green-500/30 bg-green-500/10',
  },
  reality_tear: {
    label: '现实裂隙',
    icon: '🌌',
    color: 'text-purple-300 border-purple-500/30 bg-purple-500/10',
  },
};

// ─── 默认类别 ─────────────────────────────────────────────────────────

const DEFAULT_CATEGORY: CategoryInfo = {
  label: '其他',
  icon: '📎',
  color: 'text-gray-300 border-gray-500/30 bg-gray-500/10',
};

function getCategoryInfo(category: string): CategoryInfo {
  return CATEGORY_MAP[category] ?? DEFAULT_CATEGORY;
}

// ─── 组件 ─────────────────────────────────────────────────────────────

const EvidenceTracker: React.FC<EvidenceTrackerProps> = ({ isOpen, onClose }) => {
  const { state } = useGame();

  // ─── 收集发现物 ───────────────────────────────────────────────
  const discoveredItems = useMemo(() => {
    const items: Array<{
      id: string;
      title: string;
      description: string;
      category: string;
      source: string;
      discoveredDay: number | null;
    }> = [];

    // 1. 从 state.discoveries 中读取
    if (Array.isArray(state.discoveries)) {
      for (const disc of state.discoveries) {
        items.push({
          id: disc.id,
          title: disc.title ?? '未知发现',
          description: disc.description ?? '',
          category: disc.category ?? 'other',
          source: (disc as any).source ?? '',
          discoveredDay: (disc as any).discoveredDay ?? null,
        });
      }
    }

    // 2. 从 state.flags 中读取 discovered_ 前缀的 flag
    if (state.flags) {
      for (const [key, value] of Object.entries(state.flags)) {
        if (key.startsWith('discovered_') && value === true) {
          const evidenceId = key.replace('discovered_', '');
          // 避免重复
          if (!items.some((i) => i.id === evidenceId)) {
            items.push({
              id: evidenceId,
              title: evidenceId.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
              description: '通过探索发现的线索。',
              category: 'reality_anomaly',
              source: '',
              discoveredDay: null,
            });
          }
        }
      }
    }

    return items;
  }, [state.discoveries, state.flags]);

  // ─── 按类别分组 ───────────────────────────────────────────────
  const groupedItems = useMemo(() => {
    const groups: Record<string, typeof discoveredItems> = {};
    for (const item of discoveredItems) {
      const cat = item.category || 'other';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    }
    return groups;
  }, [discoveredItems]);

  const categoryKeys = useMemo(
    () => Object.keys(groupedItems).sort(),
    [groupedItems],
  );

  // ─── 总数统计 ─────────────────────────────────────────────────
  const totalCount = discoveredItems.length;

  return (
    <>
      {/* ── 遮罩层 ──────────────────────────────────────────── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* ── 侧边抽屉 ────────────────────────────────────────── */}
      <div
        className={cn(
          'fixed top-0 right-0 z-50 h-full w-full max-w-md bg-gray-950/95 border-l border-white/10 shadow-2xl transition-all duration-300 ease-out flex flex-col',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* ── 标题栏 ──────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-black/30">
          <div className="flex items-center gap-2.5">
            <span className="text-sm">📋</span>
            <h2 className="text-sm font-bold text-purple-200 tracking-wider">
              证据记录
            </h2>
            <span className="text-[10px] text-gray-500 bg-white/5 px-1.5 py-0.5 rounded">
              {totalCount} 项
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors text-xs"
          >
            ✕
          </button>
        </div>

        {/* ── 内容 ──────────────────────────────────────────── */}
        {totalCount === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
            <span className="text-3xl mb-3 opacity-30">🔍</span>
            <p className="text-xs tracking-wider">尚未发现任何线索</p>
            <p className="text-[10px] text-gray-600 mt-1">
              探索场景、与NPC对话来收集证据
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {categoryKeys.map((catKey) => {
              const catInfo = getCategoryInfo(catKey);
              const items = groupedItems[catKey];
              return (
                <div key={catKey}>
                  {/* 类别标题 */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs">{catInfo.icon}</span>
                    <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                      {catInfo.label}
                    </span>
                    <span className="text-[9px] text-gray-600">
                      {items.length} 项
                    </span>
                  </div>

                  {/* 项目列表 */}
                  <div className="space-y-1.5">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className={cn(
                          'p-2.5 rounded-lg border text-xs transition-colors',
                          catInfo.color,
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-[11px] font-medium text-gray-200 truncate">
                              {item.title}
                            </p>
                            <p className="text-[9px] text-gray-400 mt-0.5 leading-relaxed line-clamp-2">
                              {item.description}
                            </p>
                            {item.source && (
                              <p className="text-[8px] text-gray-600 mt-0.5">
                                来源: {item.source}
                              </p>
                            )}
                          </div>
                        </div>
                        {item.discoveredDay && (
                          <div className="mt-1 text-[8px] text-gray-600">
                            发现于 第{item.discoveredDay}天
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── 底部提示 ──────────────────────────────────────── */}
        <div className="px-5 py-2 border-t border-white/5 bg-black/20">
          <p className="text-[8px] text-gray-600 text-center tracking-wider">
            证据记录将帮助揭示这座城市的真相
          </p>
        </div>
      </div>
    </>
  );
};

export default EvidenceTracker;
