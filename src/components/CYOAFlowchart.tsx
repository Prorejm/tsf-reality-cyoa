// ============================================================================
// CYOAFlowchart.tsx — CYOA 分支叙事树状可视化流程图
// 完全用CSS实现树状可视化，显示所有节点、连线、状态
// ============================================================================

import React, { useMemo, useCallback, useState } from 'react';
import { useGame } from '@/game/engine/GameContext';
import cyoaNetwork from '@/game/data/cyoaData';
import type { CYOANode, CYOAChoice } from '@/game/engine/cyoaEngine';

// ─── Props ────────────────────────────────────────────────────────────

interface FlowchartProps {
  onClose: () => void;
  onViewNode?: (nodeId: string) => void;
}

// ─── 树节点（含布局信息） ──────────────────────────────────────────────

interface TreeNode {
  node: CYOANode;
  depth: number;
  children: TreeNode[];
  parentId: string | null;
}

// ─── 主题色 ────────────────────────────────────────────────────────────

const STATUS_COLORS = {
  completed: {
    bg: 'bg-emerald-900/40',
    border: 'border-emerald-500/60',
    text: 'text-emerald-300',
    badge: 'bg-emerald-500',
  },
  current: {
    bg: 'bg-amber-900/40',
    border: 'border-amber-400/80',
    text: 'text-amber-200',
    badge: 'bg-amber-400',
  },
  locked: {
    bg: 'bg-gray-800/30',
    border: 'border-gray-600/30',
    text: 'text-gray-500',
    badge: 'bg-gray-600',
  },
  ending: {
    bg: 'bg-purple-900/30',
    border: 'border-purple-500/40',
    text: 'text-purple-300',
    badge: 'bg-purple-500',
  },
};

// ─── 工具：构建树结构 ──────────────────────────────────────────────────

function buildTree(
  nodes: Record<string, CYOANode>,
  startNodeId: string,
): TreeNode[] {
  const visited = new Set<string>();
  const roots: TreeNode[] = [];

  function walk(nodeId: string, depth: number, parentId: string | null): TreeNode | null {
    if (visited.has(nodeId)) return null;
    const node = nodes[nodeId];
    if (!node) return null;
    visited.add(nodeId);

    const children: TreeNode[] = [];
    const childIds = new Set<string>();

    // 收集所有子节点（通过 choices 的 nextNodeId）
    for (const choice of node.choices) {
      if (choice.nextNodeId && !childIds.has(choice.nextNodeId)) {
        childIds.add(choice.nextNodeId);
        const child = walk(choice.nextNodeId, depth + 1, nodeId);
        if (child) children.push(child);
      }
    }

    return { node, depth, children, parentId };
  }

  // 从 start 开始遍历
  const root = walk(startNodeId, 0, null);
  if (root) roots.push(root);

  // 收集未被遍历到的孤立节点（如 ending 节点）
  const allVisited = new Set<string>();
  function collectIds(tns: TreeNode[]) {
    for (const tn of tns) {
      allVisited.add(tn.node.id);
      collectIds(tn.children);
    }
  }
  collectIds(roots);

  for (const nodeId of Object.keys(nodes)) {
    if (!allVisited.has(nodeId)) {
      // 找到其父节点
      let foundParent = false;
      for (const otherNode of Object.values(nodes)) {
        for (const choice of otherNode.choices) {
          if (choice.nextNodeId === nodeId && !allVisited.has(otherNode.id)) {
            const child = walk(nodeId, 0, null);
            if (child) roots.push(child);
            foundParent = true;
            break;
          }
        }
        if (foundParent) break;
      }
      if (!foundParent) {
        // 独立节点，在 roots 层添加
        const orphan = walk(nodeId, 0, null);
        if (orphan) roots.push(orphan);
      }
    }
  }

  return roots;
}

// ─── 扁平化树以便于渲染层级 ────────────────────────────────────────────

interface FlatRow {
  node: CYOANode;
  depth: number;
  parentId: string | null;
  index: number;
  totalSiblings: number;
  siblingIndex: number;
}

function flattenTree(roots: TreeNode[]): FlatRow[] {
  const result: FlatRow[] = [];

  function walk(tns: TreeNode[], parentId: string | null) {
    tns.forEach((tn, idx) => {
      // 如果是根节点且有多个根，每个根视为独立的 sibling
      const siblingIndex = parentId === null ? 0 : idx;
      const totalSiblings = parentId === null ? 1 : tns.length;

      result.push({
        node: tn.node,
        depth: tn.depth,
        parentId: tn.parentId,
        index: result.length,
        totalSiblings,
        siblingIndex,
      });
      walk(tn.children, tn.node.id);
    });
  }

  for (const root of roots) {
    result.push({
      node: root.node,
      depth: root.depth,
      parentId: root.parentId,
      index: result.length,
      totalSiblings: roots.length,
      siblingIndex: roots.indexOf(root),
    });
    walk(root.children, root.node.id);
  }

  return result;
}

// ─── 获取节点颜色 ──────────────────────────────────────────────────────

function getNodeStatusStyles(
  nodeId: string,
  completedNodes: string[],
  currentNodeId: string,
): typeof STATUS_COLORS.completed {
  if (nodeId === currentNodeId) return STATUS_COLORS.current;
  if (completedNodes.includes(nodeId)) return STATUS_COLORS.completed;
  // 检测是否是 ending 节点
  if (nodeId.includes('ending')) return STATUS_COLORS.ending;
  return STATUS_COLORS.locked;
}

// ─── 判断是否为叶子节点（结局） ─────────────────────────────────────────

function isEndingNode(nodeId: string): boolean {
  return nodeId.includes('_ending');
}

// ─── 组件 ─────────────────────────────────────────────────────────────

const CYOAFlowchart: React.FC<FlowchartProps> = ({ onClose, onViewNode }) => {
  const { state } = useGame();
  const displayText = 'TSF Reality CYOA — 剧情流程图';

  // ─── 读取游戏状态 ──────────────────────────────────────────────
  const completedNodes: string[] = useMemo(() => {
    const raw = state.flags?.cyoaCompletedNodes;
    return Array.isArray(raw) ? (raw as string[]) : [];
  }, [state.flags?.cyoaCompletedNodes]);

  const currentNodeId: string = useMemo(() => {
    const raw = state.flags?.cyoaCurrentNode;
    if (typeof raw === 'string' && raw in cyoaNetwork.nodes) return raw;
    return cyoaNetwork.startNodeId;
  }, [state.flags?.cyoaCurrentNode]);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // ─── 构建树 ────────────────────────────────────────────────────
  const flatRows = useMemo(() => {
    const roots = buildTree(cyoaNetwork.nodes, cyoaNetwork.startNodeId);
    return flattenTree(roots);
  }, []);

  // ─── 已完成的节点ID集合（快速查找） ────────────────────────────
  const completedSet = useMemo(() => new Set(completedNodes), [completedNodes]);

  // ─── 获取节点的叙事文本回顾 ────────────────────────────────────
  const getNodeReviewText = useCallback(
    (nodeId: string): string | null => {
      const node = cyoaNetwork.nodes[nodeId];
      if (!node) return null;
      return node.narrative.slice(0, 200) + (node.narrative.length > 200 ? '...' : '');
    },
    [],
  );

  // ─── 获取节点标题（含天数和场景标签） ─────────────────────────
  const getNodeLabel = useCallback((node: CYOANode): string => {
    return node.title;
  }, []);

  const getNodeSubLabel = useCallback((node: CYOANode): string => {
    const parts: string[] = [];
    if (node.dayMin === node.dayMax) {
      parts.push(`D${node.dayMin}`);
    } else {
      parts.push(`D${node.dayMin}-D${node.dayMax}`);
    }
    parts.push(node.scene.replace(/_/g, ' '));
    return parts.join(' · ');
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      {/* ── 面板容器 ──────────────────────────────────────────── */}
      <div className="relative w-[90vw] h-[85vh] max-w-6xl bg-gray-950/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* ── 标题栏 ──────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-black/40">
          <div className="flex items-center gap-3">
            <span className="text-xs text-purple-400/70">📊</span>
            <h2 className="text-sm font-bold text-purple-200 tracking-wider">
              {displayText}
            </h2>
            <span className="text-[10px] text-gray-500">
              {completedNodes.length}/{Object.keys(cyoaNetwork.nodes).length} 节点
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors text-xs"
          >
            ✕
          </button>
        </div>

        {/* ── 底部图例 ──────────────────────────────────────────── */}
        <div className="absolute bottom-0 left-0 right-0 z-10 flex items-center gap-4 px-5 py-2 bg-black/60 border-t border-white/5">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-[9px] text-gray-400">已完成</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[9px] text-gray-400">当前</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-600" />
            <span className="text-[9px] text-gray-400">未完成</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <span className="text-[9px] text-gray-400">结局</span>
          </div>
          <div className="ml-auto text-[9px] text-gray-600">
            ＊ 点击已完成的节点可查看叙事摘要
          </div>
        </div>

        {/* ── 可滚动画布 ────────────────────────────────────────── */}
        <div className="flex-1 overflow-auto p-6">
          <div className="relative min-w-max">
            {/* 树状布局 — 使用flex纵向排列，每层depth产生缩进 */}
            <div className="flex flex-col gap-2">
              {flatRows.map((row, idx) => {
                const status = getNodeStatusStyles(
                  row.node.id,
                  completedNodes,
                  currentNodeId,
                );
                const isCompleted = completedSet.has(row.node.id);
                const isCurrent = row.node.id === currentNodeId;
                const isEnding = isEndingNode(row.node.id);
                const isClickable = isCompleted || isCurrent;

                return (
                  <div key={row.node.id} className="relative flex items-start">
                    {/* ── 连线 ───────────────────────────── */}
                    {row.parentId && (
                      <div
                        className="absolute border-l border-white/10"
                        style={{
                          left: `${row.depth * 180 - 10}px`,
                          top: '-16px',
                          height: '32px',
                          width: '20px',
                          borderBottom: '1px solid rgba(255,255,255,0.08)',
                          borderLeft: '1px solid rgba(255,255,255,0.08)',
                        }}
                      />
                    )}

                    {/* ── 缩进 + 节点内容 ────────────────── */}
                    <div
                      className="relative flex items-start gap-3 transition-all"
                      style={{ marginLeft: `${row.depth * 180}px` }}
                    >
                      {/* 垂直指示线 */}
                      <div className="flex flex-col items-center pt-2">
                        <span
                          className={`w-2.5 h-2.5 rounded-full border-2 ${
                            isCurrent
                              ? 'bg-amber-400 border-amber-300 animate-ping absolute'
                              : ''
                          }`}
                        />
                        <span
                          className={`w-2.5 h-2.5 rounded-full border-2 relative ${
                            isCurrent
                              ? 'bg-amber-400 border-amber-300 animate-pulse shadow-lg shadow-amber-400/50'
                              : isCompleted
                              ? 'bg-emerald-500 border-emerald-400'
                              : isEnding
                              ? 'bg-purple-500 border-purple-400'
                              : 'bg-gray-600 border-gray-500'
                          }`}
                        />
                      </div>

                      {/* 节点卡片 */}
                      <button
                        onClick={() => {
                          if (isClickable) {
                            setSelectedNodeId(
                              selectedNodeId === row.node.id ? null : row.node.id,
                            );
                          }
                        }}
                        className={`
                          relative text-left transition-all duration-200 rounded-xl border
                          ${status.bg} ${status.border}
                          ${isCurrent ? 'ring-2 ring-amber-400/50 shadow-lg shadow-amber-400/10' : ''}
                          ${isClickable ? 'cursor-pointer hover:scale-[1.02]' : 'cursor-default'}
                          ${!isCompleted && !isCurrent ? 'opacity-50' : ''}
                          px-3 py-2 min-w-[160px] max-w-[220px]
                        `}
                      >
                        {/* 顶部标记 */}
                        <div className="flex items-center gap-1.5 mb-1">
                          {isCompleted && (
                            <span className="text-[10px] text-emerald-400">✓</span>
                          )}
                          {isCurrent && (
                            <span className="text-[10px] text-amber-400 animate-pulse">▶</span>
                          )}
                          <span
                            className={`text-[10px] font-bold tracking-wider ${
                              isEnding ? 'text-purple-300' : status.text
                            }`}
                          >
                            {getNodeLabel(row.node)}
                          </span>
                        </div>

                        {/* 副标签 */}
                        <div className="text-[8px] text-gray-500 tracking-wider">
                          {getNodeSubLabel(row.node)}
                        </div>

                        {/* 选择数量提示 */}
                        {row.node.choices.length > 0 && (
                          <div className="mt-1 flex gap-0.5">
                            {row.node.choices.map((choice: CYOAChoice, ci: number) => (
                              <span
                                key={choice.id}
                                className="text-[7px] px-1 py-0.5 rounded bg-white/5 text-gray-500"
                              >
                                {ci + 1}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* 叙事摘要（展开状态） */}
                        {selectedNodeId === row.node.id && (
                          <div className="mt-2 pt-2 border-t border-white/5">
                            <p className="text-[9px] text-gray-400 leading-relaxed line-clamp-4">
                              {getNodeReviewText(row.node.id)}
                            </p>
                            <div className="mt-1 text-[8px] text-gray-600">
                              {row.node.choices.length} 个选择分支
                            </div>
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CYOAFlowchart;
