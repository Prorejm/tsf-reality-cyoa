// ============================================================================
// useCYOA.ts — CYOA分支叙事React Hook
// 集成 cyoaEngine + cyoaData + GameContext，提供完整的CYOA交互接口
// ============================================================================

import { useCallback, useMemo } from 'react';
import { useGame } from '../engine/GameContext';
import {
  getAvailableNodes,
  getAvailableChoices,
  processChoice,
  type CYOANode,
  type CYOANetwork,
} from '../engine/cyoaEngine';

/**
 * useCYOA hook
 *
 * 從 game state 獲取已完成節點列表 (from state.flags.cyoaCompletedNodes)
 * 以及當前節點ID (from state.flags.cyoaCurrentNode)
 * 獲取當前可用節點，並提供 makeChoice 函數進行選擇。
 *
 * @param network - CYOA節點網絡（從 cyoaData 導入）
 * @returns CYOA交互接口
 *
 * @example
 * ```tsx
 * import cyoaNetwork from '../game/data/cyoaData';
 * const { currentNodes, currentNode, completedNodes, makeChoice } = useCYOA(cyoaNetwork);
 * ```
 */
export function useCYOA(network: CYOANetwork) {
  const { state, dispatch } = useGame();

  // ─── 從 state.flags 中讀取 CYOA 狀態 ────────────────────────────

  /** 已完成節點ID數組 */
  const completedNodes: string[] = useMemo(() => {
    const raw = state.flags?.cyoaCompletedNodes;
    if (Array.isArray(raw)) return raw as string[];
    return [];
  }, [state.flags?.cyoaCompletedNodes]);

  /** 當前節點ID (預設為 network.startNodeId) */
  const currentNodeId: string = useMemo(() => {
    const raw = state.flags?.cyoaCurrentNode;
    if (typeof raw === 'string' && raw in network.nodes) return raw;
    return network.startNodeId;
  }, [state.flags?.cyoaCurrentNode, network.nodes, network.startNodeId]);

  // ─── 當前節點對象 ──────────────────────────────────────────────

  /** 當前正在閱讀的節點 */
  const currentNode: CYOANode | null = useMemo(() => {
    return network.nodes[currentNodeId] ?? null;
  }, [network.nodes, currentNodeId]);

  // ─── 當前可用節點列表（按天數過濾） ─────────────────────────────

  /** 當前天數下所有未完成的節點（用於地圖/總覽展示） */
  const currentNodes: CYOANode[] = useMemo(() => {
    return getAvailableNodes(network, state, completedNodes);
  }, [network, state, completedNodes]);

  // ─── 當前節點的可用選擇 ─────────────────────────────────────────

  /** 當前節點中 conditions 滿足的選擇 */
  const currentChoices = useMemo(() => {
    if (!currentNode) return [];
    return getAvailableChoices(currentNode, state);
  }, [currentNode, state]);

  // ─── makeChoice ─────────────────────────────────────────────────

  /**
   * 執行一個CYOA選擇：
   * 1. 查找當前節點中匹配的choice
   * 2. 調用 processChoice 應用效果
   * 3. 將當前節點ID加入已完成列表
   * 4. 如果 nextNodeId 存在，設置當前節點為下一個
   * 5. 重新獲取可用節點（通過觸發重渲染）
   */
  const makeChoice = useCallback(
    (choiceId: string) => {
      if (!currentNode) return;

      // 1. 查找匹配的選擇
      const choice = currentNode.choices.find((c) => c.id === choiceId);
      if (!choice) return;

      // 2. 應用選擇效果並獲取下一個節點ID
      const nextNodeId = processChoice(choice, dispatch);

      // 3. 將當前節點加入已完成列表（如果尚未完成）
      const currentCompleted = new Set(completedNodes);
      if (!currentCompleted.has(currentNode.id)) {
        currentCompleted.add(currentNode.id);
        dispatch({
          type: 'SET_FLAG',
          payload: {
            key: 'cyoaCompletedNodes',
            value: Array.from(currentCompleted),
          },
        });
      }

      // 4. 設置下一個節點
      if (nextNodeId && network.nodes[nextNodeId]) {
        dispatch({
          type: 'SET_FLAG',
          payload: {
            key: 'cyoaCurrentNode',
            value: nextNodeId,
          },
        });

        // 同時觸發場景切換（如果節點的 scene 與當前不同）
        const nextNode = network.nodes[nextNodeId];
        if (nextNode && nextNode.scene !== state.currentScene) {
          dispatch({ type: 'SET_SCENE', payload: nextNode.scene });
        }
      }

      // 5. 應用到節點 onExit / onEnter 效果
      if (currentNode.onExit) {
        const exit = currentNode.onExit;
        if (exit.erosion) {
          dispatch({
            type: 'APPLY_EROSION',
            payload: { amount: exit.erosion, reason: `離開 [${currentNode.title}]` },
          });
        }
        if (exit.awareness) {
          dispatch({
            type: 'APPLY_AWARENESS',
            payload: { amount: exit.awareness, reason: `離開 [${currentNode.title}]` },
          });
        }
        if (exit.flags) {
          Object.entries(exit.flags).forEach(([key, value]) => {
            dispatch({ type: 'SET_FLAG', payload: { key, value } });
          });
        }
      }

      if (nextNodeId && network.nodes[nextNodeId]?.onEnter) {
        const enter = network.nodes[nextNodeId].onEnter!;
        if (enter.erosion) {
          dispatch({
            type: 'APPLY_EROSION',
            payload: { amount: enter.erosion, reason: `進入 [${network.nodes[nextNodeId].title}]` },
          });
        }
        if (enter.awareness) {
          dispatch({
            type: 'APPLY_AWARENESS',
            payload: { amount: enter.awareness, reason: `進入 [${network.nodes[nextNodeId].title}]` },
          });
        }
        if (enter.flags) {
          Object.entries(enter.flags).forEach(([key, value]) => {
            dispatch({ type: 'SET_FLAG', payload: { key, value } });
          });
        }
      }
    },
    [currentNode, completedNodes, dispatch, network, state.currentScene],
  );

  // ─── 重置CYOA進度 ──────────────────────────────────────────────

  /**
   * 重置CYOA進度（從起始節點重新開始）
   */
  const resetCYOA = useCallback(() => {
    dispatch({
      type: 'SET_FLAG',
      payload: { key: 'cyoaCompletedNodes', value: [] },
    });
    dispatch({
      type: 'SET_FLAG',
      payload: { key: 'cyoaCurrentNode', value: network.startNodeId },
    });
  }, [dispatch, network.startNodeId]);

  // ─── 返回 ──────────────────────────────────────────────────────

  return {
    /** 當前天數下所有可用的未完成節點（用於地圖/總覽） */
    currentNodes,
    /** 當前正在閱讀的節點 */
    currentNode,
    /** 當前節點中所有可用的選擇 */
    currentChoices,
    /** 已完成節點的ID列表 */
    completedNodes,
    /** 執行一個選擇：應用效果、推進到下一節點 */
    makeChoice,
    /** 重置CYOA進度 */
    resetCYOA,
  };
}
