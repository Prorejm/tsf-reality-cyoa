import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useGame } from '@/game/engine/GameContext';
import type { SceneData, SceneId } from '@/game/engine/types';
import { MapPin, Lock, User } from 'lucide-react';

// ─── Props ──────────────────────────────────────────────────────────

interface MiniMapProps {
  /** 场景数据列表 */
  scenes: SceneData[];
  /** 当前场景 ID */
  currentScene: SceneId;
  /** 已探索的场景 ID 列表 */
  exploredScenes: SceneId[];
}

// ─── 布局常量：简单树状拓扑 ────────────────────────────────────────
// 根据场景数量动态做网格，每行最多 4 个节点

function buildLayout(
  scenes: SceneData[],
  currentScene: SceneId,
  exploredScenes: SceneId[],
) {
  const nodes = scenes.map((scene) => ({
    id: scene.id,
    name: scene.name,
    type: scene.type,
    explored: exploredScenes.includes(scene.id),
    isCurrent: scene.id === currentScene,
    npcCount: scene.npcsPresent?.length ?? 0,
    isLocked: !!scene.enterCondition && !exploredScenes.includes(scene.id),
  }));

  // 按场景类型分组
  const groups: { label: string; items: typeof nodes }[] = [];
  const typeLabels: Record<string, string> = {
    exploration: '探索',
    event: '事件',
    safe_house: '安全屋',
    shop: '商店',
    dungeon: '迷宫',
    social: '社交',
    special: '特殊',
  };

  const grouped = nodes.reduce(
    (acc, node) => {
      const type = node.type;
      if (!acc[type]) acc[type] = [];
      acc[type].push(node);
      return acc;
    },
    {} as Record<string, typeof nodes>,
  );

  for (const [type, items] of Object.entries(grouped)) {
    groups.push({
      label: typeLabels[type] ?? type,
      items,
    });
  }

  return { nodes, groups };
}

// ─── Component ──────────────────────────────────────────────────────

export const MiniMap: React.FC<MiniMapProps> = ({
  scenes,
  currentScene,
  exploredScenes,
}) => {
  const { state } = useGame();
  const perceptionMode = state.perceptionMode ?? 'resident';
  const isTruth = perceptionMode === 'truth';

  const { nodes, groups } = useMemo(
    () => buildLayout(scenes, currentScene, exploredScenes),
    [scenes, currentScene, exploredScenes],
  );

  if (!scenes.length) {
    return (
      <div className="game-panel text-center text-gray-500 text-xs py-4">
        暂无可用场景
      </div>
    );
  }

  return (
    <div
      className={cn(
        'game-panel p-3 space-y-3',
        isTruth && 'border-amber-500/20',
      )}
    >
      {/* 标题 */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-gray-400 tracking-wider uppercase">
          場景地圖
        </h3>
        <span className="text-[10px] text-gray-500">
          {exploredScenes.length}/{scenes.length}
        </span>
      </div>

      {/* 分组渲染 */}
      <div className="space-y-2">
        {groups.map((group) => (
          <div key={group.label} className="space-y-1">
            {/* 组标签 */}
            <span className="text-[10px] text-gray-600 uppercase tracking-wider block">
              {group.label}
            </span>

            {/* 节点网格 */}
            <div className="grid grid-cols-4 gap-1.5">
              {group.items.map((node) => {
                const isCurrent = node.isCurrent;
                const isExplored = node.explored;
                const isLocked = node.isLocked;

                return (
                  <div
                    key={node.id}
                    className={cn(
                      'relative flex flex-col items-center gap-0.5',
                      'p-1.5 rounded-md transition-all duration-200',
                      'border',
                      isCurrent
                        ? 'border-amber-400/50 bg-amber-900/20'
                        : isExplored
                        ? 'border-white/5 bg-white/[0.02]'
                        : 'border-transparent bg-transparent',
                      isLocked && !isCurrent && 'opacity-30',
                    )}
                    title={node.name}
                  >
                    {/* 当前位置指示器 */}
                    {isCurrent && (
                      <MapPin className="w-3 h-3 text-amber-400 absolute -top-1 -left-1" />
                    )}

                    {/* 节点 */}
                    <div
                      className={cn(
                        'w-4 h-4 rounded-full transition-all duration-300',
                        isCurrent
                          ? 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]'
                          : isExplored
                          ? 'bg-white/20'
                          : 'bg-white/5',
                      )}
                    />

                    {/* 锁定图标 */}
                    {isLocked && (
                      <Lock className="w-2.5 h-2.5 text-gray-600 absolute -top-0.5 -right-0.5" />
                    )}

                    {/* NPC 指示器 */}
                    {node.npcCount > 0 && isExplored && (
                      <div className="flex items-center gap-0.5">
                        <User className="w-2 h-2 text-blue-400/60" />
                        <span className="text-[8px] text-blue-400/60">
                          {node.npcCount}
                        </span>
                      </div>
                    )}

                    {/* 场景名 */}
                    <span
                      className={cn(
                        'text-[8px] truncate max-w-full text-center leading-tight',
                        isCurrent
                          ? 'text-amber-300 font-bold'
                          : isExplored
                          ? 'text-gray-400'
                          : 'text-gray-600',
                      )}
                    >
                      {node.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MiniMap;
