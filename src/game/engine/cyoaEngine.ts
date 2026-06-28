// ============================================================================
// cyoaEngine.ts — CYOA (Choose Your Own Adventure) 分支叙事网络引擎
// 定义节点网络结构、可用节点/选择过滤、以及效果应用函数
// ============================================================================

// ─── CYOA节点接口 ─────────────────────────────────────────────────────

export interface CYOANode {
  /** 唯一标识符 */
  id: string;
  /** 所属场景ID（用于关联地图等） */
  scene: string;
  /** 可用起始天数 */
  dayMin: number;
  /** 可用结束天数 */
  dayMax: number;
  /** 节点标题 */
  title: string;
  /** 显示的叙事文本（居民视角） */
  narrative: string;
  /** 真相视角版本（可选） */
  truthNarrative?: string;
  /** 可用选择列表 */
  choices: CYOAChoice[];
  /** 节点级别的状态条件（不满足时节点不可见） */
  stateConditions?: {
    /** 需要特定的玩家性别 */
    playerGender?: 'male' | 'female' | 'secret' | 'neuter' | 'futanari';
    /** 需要特定的玩家年龄 */
    playerAge?: 'adult' | 'teen' | 'child';
    /** 需要特定的玩家种族 */
    playerSpecies?: string;
    /** 需要特定的身份 */
    playerIdentity?: string;
    /** 需要特定flag被设置 */
    requiredFlags?: Record<string, any>;
  };
  /** 进入节点时的效果 */
  onEnter?: {
    erosion?: number;
    awareness?: number;
    flags?: Record<string, any>;
  };
  /** 离开节点时的效果 */
  onExit?: {
    erosion?: number;
    awareness?: number;
    flags?: Record<string, any>;
  };
}

export interface CYOAChoice {
  /** 选择唯一标识符 */
  id: string;
  /** 显示的选项文字 */
  text: string;
  /** 选择后的效果 */
  effects: {
    /** 侵蚀度变化 */
    erosion?: number;
    /** 认知度变化 */
    awareness?: number;
    /** NPC好感度变化 */
    affinity?: { npcId: string; amount: number };
    /** 添加物品到背包 */
    addItem?: {
      id: string;
      name: string;
      nameCN: string;
      type: string;
      quantity: number;
      maxStack: number;
      usable: boolean;
      description: string;
      icon: string;
      flags?: string[];
    };
    /** 设置游戏旗标 */
    setFlag?: Record<string, any>;
  };
  /** 选择后的反馈文本 */
  resultText: string;
  /** 指向的下一个节点ID */
  nextNodeId: string;
  /** 可选条件（不满足时隐藏该选项） */
  conditions?: {
    /** 最小侵蚀度要求 */
    minErosion?: number;
    /** 最大侵蚀度要求 */
    maxErosion?: number;
    /** 最小认知度要求 */
    minAwareness?: number;
    /** 需要拥有的物品 */
    hasItem?: string;
    /** 需要设置的旗标 */
    hasFlag?: string;
    /** 新增：需要特定玩家状态 */
    playerGender?: 'male' | 'female' | 'secret' | 'neuter' | 'futanari';
    playerAge?: 'adult' | 'teen' | 'child';
    playerSpecies?: string;  // 支持 'any_monster' 通配
    playerIdentity?: string;
    /** 新增：需要已附身某NPC */
    possessedNpc?: string;
    /** 新增：需要特定数量已完成节点 */
    minCompletedNodes?: number;
  };
}

// ─── 节点网络接口 ─────────────────────────────────────────────────────

export interface CYOANetwork {
  /** 所有节点的映射表（key为节点ID） */
  nodes: Record<string, CYOANode>;
  /** 起始节点ID */
  startNodeId: string;
}

// ─── 根据当前状态获取可用节点 ──────────────────────────────────────────

/**
 * 返回所有符合 dayMin/dayMax 条件且未完成的节点。
 * 用于在地图界面展示当前天数可探索的节点。
 *
 * @param network - CYOA节点网络
 * @param state - 游戏状态（需要包含 currentDay 和 flags.completedNodes）
 * @param completedNodes - 已完成节点ID数组
 * @returns 可用节点列表
 */
export function getAvailableNodes(
  network: CYOANetwork,
  state: { currentDay: number; flags?: Record<string, any> },
  completedNodes: string[],
): CYOANode[] {
  const completedSet = new Set(completedNodes ?? []);
  const flags = state.flags ?? {};
  return Object.values(network.nodes).filter((node) => {
    const day = state.currentDay;
    // 必须在 dayMin/dayMax 范围内
    if (day < node.dayMin || day > node.dayMax) return false;
    // 必须未完成
    if (completedSet.has(node.id)) return false;

    // ─── stateConditions 过滤 ─────────────────────────
    const sc = node.stateConditions;
    if (sc) {
      if (sc.playerGender !== undefined && flags.player_gender !== sc.playerGender) return false;
      if (sc.playerAge !== undefined && flags.player_age !== sc.playerAge) return false;
      if (sc.playerSpecies !== undefined && flags.player_species !== sc.playerSpecies) return false;
      if (sc.playerIdentity !== undefined && flags.player_identity !== sc.playerIdentity) return false;
      if (sc.requiredFlags) {
        for (const [key, value] of Object.entries(sc.requiredFlags)) {
          if (flags[key] !== value) return false;
        }
      }
    }

    return true;
  });
}

// ─── 获取节点的可用选择（过滤条件不满足的） ──────────────────────────────

/**
 * 返回所有 conditions 满足的选择。
 * 如果某个选择有条件但条件不满足，则该选择不可见。
 *
 * @param node - 当前节点
 * @param state - 游戏状态（包含 erosionLevel, awarenessLevel, inventory, flags）
 * @returns 可用的选择列表
 */
export function getAvailableChoices(
  node: CYOANode,
  state: {
    erosionLevel: number;
    awarenessLevel: number;
    inventory?: any[];
    flags?: Record<string, any>;
    completedNodes?: string[];
  },
): CYOAChoice[] {
  const flags = state.flags ?? {};
  const completedNodes = state.completedNodes ?? [];

  return node.choices.filter((choice) => {
    const cond = choice.conditions;
    if (!cond) return true; // 无条件限制

    // 侵蚀度下限
    if (cond.minErosion !== undefined && state.erosionLevel < cond.minErosion) {
      return false;
    }
    // 侵蚀度上限
    if (cond.maxErosion !== undefined && state.erosionLevel > cond.maxErosion) {
      return false;
    }
    // 认知度下限
    if (cond.minAwareness !== undefined && state.awarenessLevel < cond.minAwareness) {
      return false;
    }
    // 需要拥有某物品
    if (cond.hasItem !== undefined) {
      const inventory = state.inventory ?? [];
      const hasIt = inventory.some(
        (item: any) => item.id === cond.hasItem,
      );
      if (!hasIt) return false;
    }
    // 需要某旗标被设置
    if (cond.hasFlag !== undefined) {
      if (!flags[cond.hasFlag]) return false;
    }

    // ─── 新增条件过滤 ─────────────────────────────
    // 玩家性别
    if (cond.playerGender !== undefined && flags.player_gender !== cond.playerGender) return false;
    // 玩家年龄
    if (cond.playerAge !== undefined && flags.player_age !== cond.playerAge) return false;
    // 玩家种族（支持 'any_monster' 通配）
    if (cond.playerSpecies !== undefined) {
      const species = flags.player_species;
      if (cond.playerSpecies === 'any_monster') {
        if (!species || species === 'human') return false;
      } else {
        if (species !== cond.playerSpecies) return false;
      }
    }
    // 玩家身份
    if (cond.playerIdentity !== undefined && flags.player_identity !== cond.playerIdentity) return false;
    // 需要已附身某NPC
    if (cond.possessedNpc !== undefined && !flags[cond.possessedNpc]) return false;
    // 需要特定数量已完成节点
    if (cond.minCompletedNodes !== undefined && completedNodes.length < cond.minCompletedNodes) return false;

    return true;
  });
}

// ─── 应用选择效果并返回下一个节点ID ──────────────────────────────────────

/**
 * 应用 choice 中定义的 effects 到游戏状态（通过 dispatch），
 * 并返回下一个节点的ID。
 *
 * 调用的 dispatch action 类型:
 * - APPLY_EROSION (payload: number | { amount: number; reason?: string })
 * - APPLY_AWARENESS (payload: number | { amount: number; reason?: string })
 * - MODIFY_NPC_AFFINITY (payload: { npcId: string; amount: number })
 * - ADD_ITEM (payload: InventoryItem)
 * - SET_FLAG (payload: { key: string; value: any })
 *
 * @param choice - 被选中的选择
 * @param dispatch - React dispatch 函数
 * @returns 下一个节点ID
 */
export function processChoice(
  choice: CYOAChoice,
  dispatch: React.Dispatch<any>,
): string {
  const fx = choice.effects;

  // 应用侵蚀度变化
  if (fx.erosion !== undefined && fx.erosion !== 0) {
    dispatch({
      type: 'APPLY_EROSION',
      payload: { amount: fx.erosion, reason: choice.resultText },
    });
  }

  // 应用认知度变化
  if (fx.awareness !== undefined && fx.awareness !== 0) {
    dispatch({
      type: 'APPLY_AWARENESS',
      payload: { amount: fx.awareness, reason: choice.resultText },
    });
  }

  // 应用NPC好感度变化
  if (fx.affinity) {
    dispatch({
      type: 'MODIFY_NPC_AFFINITY',
      payload: { npcId: fx.affinity.npcId, amount: fx.affinity.amount },
    });
  }

  // 添加物品到背包
  if (fx.addItem) {
    const itemPayload = {
      ...fx.addItem,
      // 增加 inventoryEngine 兼容字段
      stackable: fx.addItem.maxStack > 1,
      useable: fx.addItem.usable,
      category: fx.addItem.type,
    };
    dispatch({ type: 'ADD_ITEM', payload: itemPayload });

    // 处理物品的flags数组——将每个flag设置为true
    if (fx.addItem.flags && Array.isArray(fx.addItem.flags)) {
      fx.addItem.flags.forEach((flag: string) => {
        dispatch({ type: 'SET_FLAG', payload: { key: flag, value: true } });
      });
    }
  }

  // 设置游戏旗标
  if (fx.setFlag) {
    Object.entries(fx.setFlag).forEach(([key, value]) => {
      dispatch({ type: 'SET_FLAG', payload: { key, value } });
    });
  }

  return choice.nextNodeId;
}
