// ============================================================================
// TSF Reality CYOA - 常识改变TSF × 魔物娘变身 完整类型系统
// ============================================================================
// 本文件定义了游戏引擎所需的全部类型、接口、枚举与类型别名。
// 所有类型名使用英文，重要说明注释使用中文。
// ============================================================================

// ============================================================================
// 1. 基础 ID 类型别名
// ============================================================================

/** 区域唯一标识 */
export type ZoneId = string;

/** 场景唯一标识 */
export type SceneId = string;

/** 事件唯一标识 */
export type EventId = string;

/** NPC 唯一标识 */
export type NpcId = string;

/** 物品唯一标识 */
export type ItemId = string;

/** 线索唯一标识 */
export type ClueId = string;

/** 关键物品唯一标识 */
export type KeyItemId = string;

/** 谜题唯一标识 */
export type PuzzleId = string;

/** 结局唯一标识 */
export type EndingId = string;

/** Bad End 唯一标识 */
export type BadEndId = string;

/** 发现物唯一标识 */
export type DiscoveryId = string;

/** 身份变换唯一标识 */
export type IdentityShiftId = string;

/** 装备槽位 */
export type EquipSlot = 'head' | 'body' | 'accessory' | 'weapon';

// ============================================================================
// 2. 枚举与字面量联合类型
// ============================================================================

/** 一天中的时段 */
export type TimePeriod = 'morning' | 'afternoon' | 'evening' | 'night';

/** 认知阶段 — 角色对"现实被篡改"这一事实的认知深度 */
export type CognitionStage =
  | 'outsider'       // 局外人：尚未察觉任何异常
  | 'aware'          // 察觉：开始注意到周围的不协调感
  | 'wavering'       // 动摇：真相与常识剧烈冲突，认知摇摇欲坠
  | 'assimilated';   // 同化：已融入新常识，旧记忆变得模糊

/** 魔物类型分类 */
export type MonsterCategory =
  | 'slime'          // 史莱姆
  | 'lamia'          // 拉米亚（蛇身）
  | 'harpy'          // 哈比（鸟翼）
  | 'centaur'        // 半人马
  | 'arachne'        // 阿拉克涅（蜘蛛）
  | 'kitsune'        // 狐妖
  | 'nekomata'       // 猫又
  | 'dragon'         // 龙娘
  | 'vampire'        // 吸血鬼
  | 'succubus'       // 魅魔
  | 'elf'            // 精灵
  | 'dwarf'          // 矮人
  | 'oni'            // 鬼族
  | 'skeleton'       // 骸骨
  | 'ghost'          // 幽灵
  | 'mermaid'        // 人鱼
  | 'alraune'        // 花妖/蔓德拉
  | 'golem'          // 魔像
  | 'werewolf'       // 狼人
  | 'custom';        // 自定义

/** TSF 触发类型 */
export type TFTrigger =
  | 'item_use'       // 使用道具触发
  | 'event'          // 剧情事件触发
  | 'time'           // 时间推移触发
  | 'accumulate'     // 累积触发（如侵蚀值达到阈值）
  | 'choice'         // 选择支触发
  | 'location'       // 进入特定区域触发
  | 'npc_interact'   // 与 NPC 互动触发
  | 'puzzle_solve'   // 解开谜题触发
  | 'stage_reach'    // 阶段达成触发
  | 'custom';        // 自定义条件

/** 身份变换类型 */
export type IdentityShiftType =
  | 'gender'         // 性别变换
  | 'age'            // 年龄变换
  | 'species'        // 种族变换
  | 'occupation'     // 职业/身份变换
  | 'relation'       // 人际关系变换
  | 'memory'         // 记忆变换
  | 'personality'    // 人格变换
  | 'all';           // 全面变换

/** 事件结构类型 — 决定事件流程拓扑 */
export type EventStructure =
  | 'simple'         // 简单线性
  | 'confirming'     // 确认分支（二选一确认）
  | 'switch_route'   // 路线切换（多路线，独占）
  | 'scoring'        // 计分制（根据分数进入不同结局）
  | 'reentrant'      // 可重入事件（可反复进入、有冷却）
  | 'sorting_hat'    // 分院帽式（根据综合数据分配路线）
  | 'time_cave';     // 时间洞窟（多阶段连锁选择）

/** 结局类型 */
export type EndingType =
  | 'true_end'       // 真结局
  | 'normal_end'     // 普通结局
  | 'bad_end'        // Bad End
  | 'hidden_end'     // 隐藏结局
  | 'route_end';     // 路线结局

/** NPC 关系等级 */
export type AffinityLevel =
  | 0  // 陌生人
  | 1  // 认识
  | 2  // 友好
  | 3  // 信任
  | 4  // 亲密
  | 5; // 羁绊

/** 监听器类型 */
export type ListenerType =
  | 'stateChange'       // 状态变更
  | 'eventCompleted'    // 事件完成
  | 'choiceMade'        // 做出选择
  | 'timeAdvanced'      // 时间推进
  | 'zoneEntered'       // 进入区域
  | 'itemAcquired'      // 获得物品
  | 'itemUsed'          // 使用物品
  | 'npcAffinityChange' // NPC 好感变化
  | 'realityShift'      // 现实偏移
  | 'erosionThreshold'  // 侵蚀阈值
  | 'stageTransition'   // 阶段转换
  | 'puzzleSolved'      // 谜题解开
  | 'badEndTriggered'   // 触发 Bad End
  | 'custom';           // 自定义

/** 谜题状态 */
export type PuzzleState =
  | 'locked'         // 锁定
  | 'unlocked'       // 解锁
  | 'in_progress'    // 进行中
  | 'solved'         // 已解决
  | 'failed'         // 已失败
  | 'expired';       // 已过期

/** 线索类别 */
export type ClueCategory =
  | 'reality_anomaly'   // 现实异常
  | 'identity_trace'    // 身份痕迹
  | 'monster_lore'      // 魔物料考
  | 'organization'      // 组织情报
  | 'historical'        // 历史记录
  | 'personal'          // 私人线索
  | 'forbidden';        // 禁忌知识

// ============================================================================
// 3. 基础数据接口
// ============================================================================

/** 选择支 — CYOA 核心 */
export interface Choice {
  /** 选择唯一 ID */
  id: string;
  /** 选择文本（中文） */
  text: string;
  /** 选择后的简要反馈（可无） */
  feedback?: string;
  /** 解锁条件（条件表达式字符串，由条件引擎解析） */
  condition?: string;
  /** 条件的提示文本（条件不满足时显示，如 "需要敏锐≥3"） */
  conditionHint?: string;
  /** 选择后触发的效果列表 */
  effects?: GameEffect[];
  /** 选择后跳转的事件 ID（无则继续当前事件） */
  nextEventId?: EventId;
  /** 选择后解锁的新区域 */
  unlockZones?: ZoneId[];
  /** 选择后解锁的新场景 */
  unlockScenes?: SceneId[];
  /** 选择标签（供 switch_route / sorting_hat 参考） */
  tags?: string[];
  /** 选择权重（计分制时使用） */
  score?: number;
  /** 是否隐藏选择（需要满足 condition 才显示） */
  hidden?: boolean;
  /** 是否只可选用一次 */
  oneTime?: boolean;
}

/** 叙事片段 — 构成事件文案的基本单元 */
export interface NarrativeSegment {
  /** 唯一标识 */
  id: string;
  /** 段落文本（支持内联变量替换，如 {player.name}） */
  text: string;
  /** 本片段触发时应用的效果 */
  effects?: GameEffect[];
  /** 本片段触发时要设置的事件标记 */
  setFlags?: Record<string, boolean | number | string>;
  /** 展示本片段的前置条件 */
  condition?: string;
  /** 片段情感提示（给 AI 叙事引擎的提示） */
  moodHint?: string;
  /** 是否只在"居民视角"下显示 */
  residentOnly?: boolean;
  /** 是否只在"真相视角"下显示 */
  truthOnly?: boolean;
}

/** 游戏效果 — 描述一次操作产生的数据变更 */
export interface GameEffect {
  /** 目标字段路径（如 "player.currentGender"） */
  target: string;
  /** 操作类型 */
  operation: 'set' | 'add' | 'multiply' | 'push' | 'remove' | 'toggle' | 'clear';
  /** 操作值 */
  value: any;
  /** 可选：效果延迟执行的回合数 */
  delay?: number;
}

// ============================================================================
// 4. 状态效果 (Status Effects)
// ============================================================================

/** 状态效果 */
export interface StatusEffect {
  /** 效果唯一 ID */
  id: string;
  /** 效果名称（中文） */
  name: string;
  /** 效果描述 */
  description: string;
  /** 持续回合数（-1 表示永久） */
  duration: number;
  /** 已持续回合数 */
  elapsed: number;
  /** 效果类型 */
  type: 'buff' | 'debuff' | 'transformation' | 'mental' | 'special';
  /** 每回合自动触发的效果 */
  tickEffect?: GameEffect[];
  /** 效果叠加规则 */
  stackRule?: 'none' | 'refresh' | 'stack';
  /** 当前叠加层数 */
  stacks?: number;
  /** 最大叠加层数 */
  maxStacks?: number;
  /** 移除条件表达式 */
  removeCondition?: string;
  /** 图标路径（可选） */
  icon?: string;
}

// ============================================================================
// 5. 身份变换系统
// ============================================================================

/** 身份变更记录 — identityStack 中使用的类型 */
export interface IdentityChange {
  /** 变更唯一 ID */
  id: string;
  /** 变更类型 */
  type: IdentityShiftType;
  /** 变更名称（中文，如 "变为猫娘"） */
  name: string;
  /** 变更描述 */
  description: string;
  /** 变更发生时的事件 ID */
  sourceEventId: EventId;
  /** 变更发生时的游戏内日期 */
  happenedOnDay: number;
  /** 变更后的性别 */
  gender?: string;
  /** 变更后的年龄 */
  age?: number;
  /** 变更后的种族/类型 */
  species?: MonsterCategory;
  /** 是否永久变更 */
  permanent: boolean;
  /** 是否可逆 */
  reversible: boolean;
  /** 逆转条件表达式 */
  revertCondition?: string;
}

// ============================================================================
// 6. 双重认知系统 (Dual Perception)
// ============================================================================

/**
 * 双重认知接口 — 对同一事物呈现"居民视角"与"真相视角"两套叙事。
 * 居民视角：被篡改后的"常识"，一切看起来正常。
 * 真相视角：被掩盖的"真实"，揭露异常。
 */
export interface DualPerception {
  /** 居民视角（"常识"下的描述） */
  residentView: {
    /** 外貌/场景描述 — 正常化的版本 */
    description: string;
    /** 外观表现 */
    appearance: string;
    /** 对话内容 */
    dialogue: string;
    /** NPC 态度/行为描述 */
    attitude: string;
    /** 内部想法（可用于旁白提示） */
    internalThought?: string;
  };
  /** 真相视角（揭示异常） */
  truthView: {
    /** 外貌/场景描述 — 真实的版本 */
    description: string;
    /** 外观表现（如 "她其实是蛇尾"） */
    appearance: string;
    /** 对话内容（包含潜台词或真实含义） */
    dialogue: string;
    /** NPC 真实态度 */
    attitude: string;
    /** 内心独白（揭示真实想法） */
    internalThought?: string;
  };
  /** 当前显示的视角 */
  activeView: 'resident' | 'truth';
  /** 角色对该事物的认知值（0=完全被常识覆盖，100=完全看清真相） */
  perceptionLevel: number;
}

// ============================================================================
// 7. 魔物数据 (Monster Data)
// ============================================================================

/** 魔物娘完整数据 */
export interface MonsterData {
  /** 魔物唯一 ID */
  id: string;
  /** 魔物名称（英文标识） */
  name: string;
  /** 魔物名称（中文） */
  nameCN: string;
  /** 魔物分类 */
  type: MonsterCategory;
  /** 描述 */
  description: string;
  /** 外观描述 */
  appearance: string;
  /** 基础属性 */
  stats: {
    hp: number;
    will: number;
    attack: number;
    defense: number;
  };
  /** TF（Transformation）触发配置 */
  tfMethod: {
    /** 触发方式 */
    trigger: TFTrigger;
    /** 倒计时回合数 */
    countdown: number;
    /** 触发后效果详情 */
    effects: string;
  };
  /** 人格偏移描述 — 变身后性格的改变 */
  personalityShift: string;
  /** AI 绘图用 prompt */
  imagePrompt: string;
  /** 特殊能力列表 */
  abilities?: string[];
  /** 弱点 */
  weaknesses?: string[];
  /** 是否已被发现/解锁 */
  discovered: boolean;
}

/** 变身阶段 — 从人到魔物娘的渐进过程 */
export interface TransformationStage {
  /** 阶段序号（0=人类形态） */
  stage: number;
  /** 阶段名称 */
  name: string;
  /** 阶段描述 */
  description: string;
  /** 此阶段新增的外观标签 */
  appearanceTags: string[];
  /** 此阶段的变化比率（0~1） */
  progress: number;
  /** 达到此阶段需要的事件或条件 */
  requirements: string[];
  /** 此阶段的属性修正 */
  statModifiers?: Partial<MonsterData['stats']>;
  /** 达到此阶段触发的事件 */
  onReachEvent?: EventId;
  /** 此阶段新增的状态效果 */
  addStatusEffects?: StatusEffect[];
}

// ============================================================================
// 8. 发现物系统
// ============================================================================

/** 发现物条目 */
export interface DiscoveryEntry {
  /** 发现物 ID */
  id: DiscoveryId;
  /** 名称 */
  name: string;
  /** 描述 */
  description: string;
  /** 分类 */
  category: ClueCategory;
  /** 发现日期（游戏内天数） */
  discoveredOnDay: number;
  /** 发现时的场景 ID */
  discoveredInScene: SceneId;
  /** 是否已阅读 */
  read: boolean;
  /** 详细内容（可长文本） */
  content: string;
  /** 关联的事件 ID */
  relatedEvents?: EventId[];
  /** 关联的线索 ID */
  relatedClues?: ClueId[];
  /** 是否为关键发现 */
  isCritical: boolean;
}

// ============================================================================
// 9. 物品系统 (Inventory)
// ============================================================================

/** 物品基础 */
export interface InventoryItem {
  /** 物品 ID */
  id: ItemId;
  /** 名称 */
  name: string;
  /** 描述 */
  description: string;
  /** 图标路径 */
  icon?: string;
  /** 物品分类 */
  category: 'consumable' | 'equipment' | 'key_item' | 'material' | 'clue' | 'special';
  /** 堆叠数量 */
  quantity: number;
  /** 最大堆叠数 */
  maxStack: number;
  /** 是否可丢弃 */
  droppable: boolean;
  /** 是否可交易 */
  tradeable: boolean;
  /** 价值（货币单位） */
  value: number;
  /** 使用效果 */
  useEffect?: GameEffect[];
  /** 使用条件 */
  useCondition?: string;
  /** 稀有度 */
  rarity?: 'common' | 'uncommon' | 'rare' | 'legendary' | 'unique';
  /** 使用后的反馈文本 */
  useFeedback?: string;
  /** 是否隐藏（不显示在清单中） */
  hidden?: boolean;
}

/** 已装备物品 */
export interface EquippedItem {
  /** 物品 ID（引用自 InventoryItem） */
  itemId: ItemId;
  /** 装备槽位 */
  slot: EquipSlot;
  /** 装备时间（游戏内天数） */
  equippedOnDay: number;
  /** 装备提供的属性修正 */
  statBonuses?: Partial<MonsterData['stats']>;
  /** 装备附带的状态效果 */
  statusEffects?: string[];
  /** 是否已绑定不可取下 */
  bound: boolean;
}

/** TSF 触发物 — 继承物品，额外包含变身触发逻辑 */
export interface TSFTriggerItem extends InventoryItem {
  /** 触发配置 */
  triggerConfig: {
    /** 触发条件表达式 */
    conditions: string[];
    /** 触发效果 */
    effect: GameEffect[];
    /** 触发后的反馈文本 */
    afterTrigger: string;
    /** 是否一次性触发 */
    oneShot: boolean;
    /** 触发所需的侵蚀值下限 */
    minErosion?: number;
    /** 触发后移除物品 */
    consumeOnTrigger?: boolean;
    /** 触发倒计时（回合数） */
    triggerDelay?: number;
  };
}

/** 线索条目 */
export interface ClueEntry {
  /** 线索 ID */
  id: ClueId;
  /** 线索名称 */
  name: string;
  /** 线索描述 */
  description: string;
  /** 线索详细内容 */
  content: string;
  /** 线索分类 */
  category: ClueCategory;
  /** 发现日期 */
  discoveredOnDay: number;
  /** 发现场景 */
  discoveredInScene: SceneId;
  /** 是否已解读 */
  interpreted: boolean;
  /** 解读后的内容 */
  interpretation?: string;
  /** 关联 NPC */
  relatedNpcs?: NpcId[];
  /** 关联事件 */
  relatedEvents?: EventId[];
  /** 关联物品 */
  relatedItems?: ItemId[];
  /** 关联线索（形成线索网） */
  relatedClues?: ClueId[];
  /** 是否为关键线索 */
  isCritical: boolean;
  /** 线索强度（0~1，影响推理判定） */
  strength: number;
}

/** 关键物品 — 推动剧情的核心道具 */
export interface KeyItem {
  /** 关键物品 ID */
  id: KeyItemId;
  /** 名称 */
  name: string;
  /** 描述 */
  description: string;
  /** 获取时间 */
  acquiredOnDay: number;
  /** 获取场景 */
  acquiredInScene: SceneId;
  /** 用途说明 */
  usage: string;
  /** 是否已使用 */
  used: boolean;
  /** 使用后触发的事件 */
  useTriggerEvent?: EventId;
  /** 是否在结局中起作用 */
  affectsEnding: boolean;
}

/** 线索关联 — 描述线索之间的逻辑关系 */
export interface ClueConnection {
  /** 关联 ID */
  id: string;
  /** 源线索 */
  fromClue: ClueId;
  /** 目标线索 */
  toClue: ClueId;
  /** 关联类型 */
  type: 'confirms' | 'contradicts' | 'leads_to' | 'supplements' | 'required_for';
  /** 关联描述 */
  description: string;
  /** 是否已被玩家发现 */
  discovered: boolean;
  /** 发现后的提示文本 */
  discoveryText?: string;
}

// ============================================================================
// 10. NPC 系统
// ============================================================================

/** NPC 关系状态 */
export interface NpcRelationState {
  /** NPC ID */
  npcId: NpcId;
  /** 好感等级（0~5） */
  affinity: AffinityLevel;
  /** 好感度精确数值（0~100，映射到等级） */
  affinityPoints: number;
  /** 各等级的好感度阈值 */
  thresholds: [number, number, number, number, number, number];
  /** 已达成的对话阶段 */
  dialogueStages: string[];
  /** 对话阶段解锁条件 */
  dialogueStageConditions: Record<string, string>;
  /** 已触发的专属事件 */
  triggeredEvents: EventId[];
  /** 对玩家的认知（取决于对方处于哪个认知阶段） */
  cognitionOfPlayer: CognitionStage;
  /** 是否已结识 */
  met: boolean;
  /** 初次见面日期 */
  firstMetDay?: number;
  /** 最近互动日期 */
  lastInteractDay?: number;
  /** 互动次数 */
  interactCount: number;
  /** 好感度修正因子 */
  affinityModifier: number;
  /** 是否有未读对话 */
  hasNewDialogue: boolean;
  /** 是否可攻略 */
  romanceable: boolean;
  /** 攻略进度（0~1） */
  romanceProgress?: number;
  /** 自定义标记 */
  flags: Record<string, boolean | number | string>;
}

/** NPC 完整数据定义 */
export interface NpcData {
  /** NPC ID */
  id: NpcId;
  /** NPC 名称（英文标识） */
  name: string;
  /** NPC 名称（中文） */
  nameCN: string;
  /** NPC 种族 */
  species: MonsterCategory | 'human';
  /** NPC 描述 */
  description: string;
  /** NPC 外观 */
  appearance: string;
  /** 双重认知描述 */
  dualPerception: DualPerception;
  /** 初始关系状态模板 */
  initialRelation: Partial<NpcRelationState>;
  /** 日程表 */
  schedule: NpcSchedule;
  /** 是否可见（未被发现时为 false） */
  visible: boolean;
  /** 发现条件 */
  discoverCondition?: string;
  /** 角色形象提示词（AI 绘图用） */
  imagePrompt?: string;
  /** 角色类型 */
  role: 'main' | 'support' | 'antagonist' | 'neutral' | 'villain' | 'mentor' | 'romance';
  /** 是否可攻略 */
  romanceable: boolean;
}

/** NPC 日常行程 */
export interface NpcSchedule {
  /** 周一至周日的行程 */
  days: Record<number, NpcDailySchedule>;
  /** 特殊日期的行程覆盖 */
  specialDays?: Record<string, NpcDailySchedule>;
}

/** NPC 单日行程 */
export interface NpcDailySchedule {
  morning: NpcTimeSlot;
  afternoon: NpcTimeSlot;
  evening: NpcTimeSlot;
  night: NpcTimeSlot;
}

/** NPC 单个时段位置与行为 */
export interface NpcTimeSlot {
  /** 所在场景 ID */
  sceneId: SceneId;
  /** 正在执行的行为描述 */
  activity: string;
  /** 是否在此场景中可交互 */
  interactable: boolean;
  /** 交互条件 */
  interactCondition?: string;
  /** 此时段可触发的特殊对话 */
  specialDialogue?: string[];
}

// ============================================================================
// 11. 分支结构 (CYOA Branch Structures)
// ============================================================================

/**
 * 确认分支 — 二选一确认流程。
 * 流程：呈现描述A → 选择"确认/等等" → 确认后执行A分支，否认后执行B分支。
 */
export interface ConfirmStep {
  /** 分支 ID */
  id: string;
  /** 呈现给玩家的初始描述 */
  prompt: string;
  /** 确认选项文本（如 "就是这样"） */
  confirmText: string;
  /** 否认选项文本（如 "再想想"） */
  denyText: string;
  /** 确认后触发的叙事 */
  confirmNarrative: NarrativeSegment[];
  /** 确认后应用的全局效果 */
  confirmEffects: GameEffect[];
  /** 确认后跳转到的事件 ID */
  confirmNextEvent?: EventId;
  /** 否认后触发的叙事 */
  denyNarrative: NarrativeSegment[];
  /** 否认后应用的全局效果 */
  denyEffects: GameEffect[];
  /** 否认后跳转到的事件 ID */
  denyNextEvent?: EventId;
  /** 分支标签（供后续逻辑引用） */
  tags: string[];
  /** 确认后设置的事件标记 */
  confirmFlags?: Record<string, boolean | number | string>;
  /** 否认后设置的事件标记 */
  denyFlags?: Record<string, boolean | number | string>;
}

/**
 * 路线切换 — 多路线独占分支。
 * 根据条件自动或手动切换路线，每条路线独占，不可回退。
 */
export interface SwitchRoute {
  /** 路线 ID */
  id: string;
  /** 路线名称 */
  name: string;
  /** 路线描述 */
  description: string;
  /** 进入该路线所需的条件 */
  condition: string;
  /** 条件不满足时的提示文本 */
  conditionHint?: string;
  /** 该路线包含的叙事片段 */
  narrative: NarrativeSegment[];
  /** 进入路线时应用的效果 */
  entryEffects: GameEffect[];
  /** 路线专属的事件列表 */
  routeEvents: EventId[];
  /** 路线专属的可用场景 */
  routeScenes: SceneId[];
  /** 路线专属 NPC 变化 */
  npcChanges?: Record<NpcId, Partial<NpcRelationState>>;
  /** 路线是否为隐藏路线 */
  hidden: boolean;
  /** 是否可逆转 */
  reversible: boolean;
  /** 逆转条件 */
  revertCondition?: string;
}

/**
 * 计分制 — 根据玩家在各维度的累计分数进入不同结局。
 * 分数由选择支、行为、事件效果等累积。
 */
export interface ScoringTrack {
  /** 计分轨 ID */
  id: string;
  /** 计分轨名称 */
  name: string;
  /** 计分描述 */
  description: string;
  /** 计分范围 */
  range: { min: number; max: number };
  /** 当前分数 */
  currentScore: number;
  /** 各分数段对应的结局 */
  thresholds: Array<{
    /** 下限 */
    min: number;
    /** 上限 */
    max: number;
    /** 该区间对应的叙事 */
    outcome: NarrativeSegment[];
    /** 该区间对应的下一事件 */
    nextEvent?: EventId;
    /** 该区间对应的结局 ID */
    endingId?: EndingId;
    /** 标签 */
    label: string;
  }>;
  /** 可见分数变化提示 */
  showScoreChanges: boolean;
}

/**
 * 可重入事件 — 可反复进入的事件。
 * 有冷却机制和状态记忆，每次进入可能有不同内容。
 */
export interface ReentrantTopic {
  /** 主题 ID */
  id: string;
  /** 主题名称 */
  name: string;
  /** 冷却回合数（期间不可再次进入） */
  cooldown: number;
  /** 剩余冷却回合 */
  remainingCooldown: number;
  /** 最大可进入次数（-1 为无限制） */
  maxEntries: number;
  /** 已进入次数 */
  entryCount: number;
  /** 每次进入时的变体叙事（按次数索引） */
  variantNarratives: NarrativeSegment[][];
  /** 每次进入时应用的累计效果 */
  cumulativeEffects: GameEffect[][];
  /** 进入条件 */
  entryCondition?: string;
  /** 当日是否已进入过 */
  enteredToday: boolean;
  /** 是否永久耗尽 */
  exhausted: boolean;
}

// ============================================================================
// 12. 游戏事件 (GameEvent)
// ============================================================================

/** 游戏事件的完整定义 */
export interface GameEvent {
  /** 事件唯一 ID */
  id: EventId;
  /** 事件发生的场景 ID */
  sceneId: SceneId;
  /** 事件标题（中文） */
  title: string;
  /** 事件结构类型 */
  structure: EventStructure;
  /** 事件触发条件表达式 */
  conditions: string[];
  /** 居民视角叙事片段 */
  narrative: {
    /** 居民视角片段 */
    residentSegments: NarrativeSegment[];
    /** 真相视角片段 */
    truthSegments: NarrativeSegment[];
  };
  /** 分支配置（根据结构类型不同使用不同的配置） */
  branchConfig?: {
    confirmSteps?: ConfirmStep[];
    switchRoutes?: SwitchRoute[];
    scoringTracks?: ScoringTrack[];
    reentrantTopics?: ReentrantTopic[];
    sortingHatConfig?: SortingHatConfig;
    timeCaveConfig?: TimeCaveConfig;
  };
  /** 可选选择支列表（适用于 simple 结构） */
  choices?: Choice[];
  /** 事件中可能触发的身份变换 */
  identityShift?: IdentityChange[];
  /** 事件完成后应用的全局效果 */
  effects?: GameEffect[];
  /** Bad End 检查 */
  badEndCheck?: {
    /** 检查条件 */
    condition: string;
    /** 触发后跳转的 Bad End ID */
    badEndId: BadEndId;
    /** 触发前的警告叙事 */
    warningNarrative?: NarrativeSegment[];
  };
  /** 关联谜题 */
  puzzle?: {
    puzzleId: PuzzleId;
    /** 谜题必须在事件继续前解决 */
    requiredBeforeContinue: boolean;
  };
  /** 事件是否只触发一次 */
  oneTime: boolean;
  /** 事件优先级（用于事件队列排序） */
  priority: number;
  /** 事件缩略图/插图路径 */
  image?: string;
  /** 事件触发时的氛围描述 */
  atmosphere?: string;
  /** 事件完成后设置的事件标记 */
  setFlags?: Record<string, boolean | number | string>;
  /** 事件依赖的标记条件 */
  requiredFlags?: Record<string, boolean | number | string>;
}

/** 分院帽式配置 — 根据多个维度综合判定分配路线 */
export interface SortingHatConfig {
  /** 用于判定的维度 */
  dimensions: Array<{
    /** 维度名称 */
    name: string;
    /** 权重 */
    weight: number;
    /** 数据来源（字段路径） */
    source: string;
  }>;
  /** 路线定义 */
  routes: Array<{
    /** 路线 ID */
    id: string;
    /** 路线名称 */
    name: string;
    /** 路线描述 */
    description: string;
    /** 判定算法（'highest'/'threshold'/'custom'） */
    algorithm: 'highest' | 'threshold' | 'custom';
    /** 阈值条件（algorithm='threshold' 时使用） */
    thresholdCondition?: string;
    /** 自定义判定函数名 */
    customJudge?: string;
    /** 入线后的事件 */
    entryEvent: EventId;
    /** 路线叙事 */
    narrative: NarrativeSegment[];
  }>;
}

/** 时间洞窟式配置 — 多阶段连锁选择 */
export interface TimeCaveConfig {
  /** 阶段列表 */
  stages: Array<{
    /** 阶段序号 */
    order: number;
    /** 阶段标题 */
    title: string;
    /** 阶段叙事 */
    narrative: NarrativeSegment[];
    /** 本阶段选择支 */
    choices: Choice[];
    /** 本阶段限时（回合数，0=不限时） */
    timeLimit: number;
  }>;
  /** 各阶段结果综合后的终局判定 */
  finalJudgment: {
    /** 综合条件表达式 */
    condition: string;
    /** 终局叙事 */
    narrative: NarrativeSegment[];
    /** 下一事件 */
    nextEvent: EventId;
  };
}

// ============================================================================
// 13. 区域与场景 (Zone & Scene)
// ============================================================================

/** 区域数据 */
export interface ZoneData {
  /** 区域 ID */
  id: ZoneId;
  /** 区域名称（中文） */
  name: string;
  /** 区域描述 */
  description: string;
  /** 区域的双重认知描述 */
  dualPerception: DualPerception;
  /** 区域内包含的场景 ID 列表 */
  scenes: SceneId[];
  /** 区域现实稳定度（0~100，越低越容易发生异常） */
  realityStability: number;
  /** 探索进度（0~100） */
  explorationProgress: number;
  /** 是否已解锁 */
  unlocked: boolean;
  /** 解锁条件 */
  unlockCondition?: string;
  /** 关联 NPC */
  npcs: NpcId[];
  /** 是否为主角当前所在区域 */
  isCurrentHome?: boolean;
  /** 区域氛围 */
  atmosphere?: string;
  /** 进入区域时触发的事件 */
  onEnterEvent?: EventId;
  /** 区域现实侵蚀速度 */
  erosionRate: number;
}

/** 场景数据 */
export interface SceneData {
  /** 场景 ID */
  id: SceneId;
  /** 场景名称（中文） */
  name: string;
  /** 场景描述 */
  description: string;
  /** 场景的双重认知描述 */
  dualPerception: DualPerception;
  /** 所属区域 ID */
  zoneId: ZoneId;
  /** 场景类型 */
  type: 'exploration' | 'event' | 'safe_house' | 'shop' | 'dungeon' | 'social' | 'special';
  /** 该场景可触发的事件 ID 列表 */
  availableEvents: EventId[];
  /** 该场景存在的 NPC */
  npcsPresent: NpcId[];
  /** 场景中可发现的物品 */
  discoverableItems: ItemId[];
  /** 场景中可发现的线索 */
  discoverableClues: ClueId[];
  /** 进入场景需要满足的条件 */
  enterCondition?: string;
  /** 是否已被探索 */
  explored: boolean;
  /** 场景安全等级（0=危险，100=绝对安全） */
  safety: number;
  /** 场景对侵蚀值的影响 */
  erosionEffect: number;
  /** 场景区域图路径 */
  backgroundImage?: string;
  /** 场景音效/音乐提示 */
  soundHint?: string;
}

// ============================================================================
// 14. 谜题系统 (Puzzle)
// ============================================================================

/** 谜题配置 */
export interface PuzzleConfig {
  /** 谜题 ID */
  id: PuzzleId;
  /** 谜题名称（中文） */
  name: string;
  /** 谜题描述 */
  description: string;
  /** 谜题类别 */
  type: 'riddle' | 'pattern' | 'logic' | 'memory' | 'social' | 'investigation' | 'custom';
  /** 谜题难度（1~5） */
  difficulty: 1 | 2 | 3 | 4 | 5;
  /** 谜题初始状态 */
  initialState: PuzzleState;
  /** 解锁条件 */
  unlockCondition?: string;
  /** 解决谜题所需的条件 */
  solveCondition: string;
  /** 解决后触发的效果 */
  solveEffects: GameEffect[];
  /** 解决后的叙事 */
  solveNarrative?: NarrativeSegment[];
  /** 失败条件 */
  failCondition?: string;
  /** 失败后的叙事 */
  failNarrative?: NarrativeSegment[];
  /** 允许的尝试次数（0=不限） */
  maxAttempts: number;
  /** 当前尝试次数 */
  currentAttempts: number;
  /** 提示列表 */
  hints: string[];
  /** 查看提示需要消耗的行动力 */
  hintCost?: number;
  /** 超时回合数（0=不限时） */
  timeLimit: number;
  /** 是否向玩家显示倒计时 */
  showTimer: boolean;
  /** 关联的事件 */
  relatedEvents?: EventId[];
  /** 关联的 NPC */
  relatedNpcs?: NpcId[];
  /** 关联的物品 */
  relatedItems?: ItemId[];
  /** 自定义数据（供自定义谜题类型使用） */
  customData?: Record<string, any>;
}

// ============================================================================
// 15. 结局系统 (Ending)
// ============================================================================

/** 结局数据 */
export interface EndingData {
  /** 结局 ID */
  id: EndingId;
  /** 结局标题 */
  title: string;
  /** 结局描述 */
  description: string;
  /** 结局类型 */
  type: EndingType;
  /** 达成条件 */
  condition: string;
  /** 是否已被达成 */
  achieved: boolean;
  /** 达成日期 */
  achievedOnDay?: number;
  /** 结局叙事 */
  narrative: NarrativeSegment[];
  /** 结局插图路径 */
  image?: string;
  /** 主角最终形态描述 */
  playerFinalForm?: string;
  /** 结局评级（S/A/B/C/D） */
  rank?: 'S' | 'A' | 'B' | 'C' | 'D';
  /** 是否隐藏结局（需要特殊条件解锁） */
  hidden: boolean;
  /** 关联的成就 ID */
  achievementId?: string;
}

/** Bad End 数据 */
export interface BadEndData {
  /** Bad End ID */
  id: BadEndId;
  /** Bad End 标题 */
  title: string;
  /** Bad End 描述 */
  description: string;
  /** 触发条件 */
  triggerCondition: string;
  /** 是否已被解锁 */
  unlocked: boolean;
  /** 严重程度 */
  severity: 'mild' | 'moderate' | 'severe' | 'game_over';
  /** Bad End 叙事 */
  narrative: NarrativeSegment[];
  /** Bad End 插图 */
  image?: string;
  /** 是否允许从读档继续 */
  allowLoad: boolean;
  /** 解锁后的提示文本 */
  unlockHint?: string;
  /** 是否计入结局收集 */
  countsAsEnding: boolean;
}

// ============================================================================
// 16. 事件调度 (Schedule)
// ============================================================================

/** 日程事件 */
export interface ScheduleEvent {
  /** 日程事件 ID */
  id: string;
  /** 事件 ID（关联的 GameEvent） */
  eventId: EventId;
  /** 触发日期（游戏内天数，-1=每日触发） */
  day: number;
  /** 触发时段 */
  period: TimePeriod;
  /** 优先级 */
  priority: number;
  /** 是否已触发 */
  triggered: boolean;
  /** 是否可重复触发 */
  repeatable: boolean;
  /** 重复间隔（天数） */
  repeatInterval?: number;
  /** 触发条件 */
  condition?: string;
  /** 过期条件（满足后移除该日程） */
  expireCondition?: string;
}

// ============================================================================
// 17. 扩展模块系统 (Expansion Modules)
// ============================================================================

/** 扩展槽数据 */
export interface ExpansionSlotData {
  /** 槽位 ID */
  slotId: string;
  /** 槽位名称 */
  name: string;
  /** 槽位描述 */
  description: string;
  /** 当前安装的模块 */
  installedModule?: ExpansionModule;
  /** 是否已解锁 */
  unlocked: boolean;
  /** 解锁条件 */
  unlockCondition?: string;
  /** 槽位容量 */
  capacity: number;
  /** 已占用容量 */
  usedCapacity: number;
  /** 槽位类型 */
  slotType: 'content' | 'system' | 'visual' | 'narrative' | 'mechanic';
  /** 是否可热插拔 */
  hotSwappable: boolean;
}

/** 扩展模块 */
export interface ExpansionModule {
  /** 模块 ID */
  id: string;
  /** 模块名称 */
  name: string;
  /** 模块版本 */
  version: string;
  /** 模块描述 */
  description: string;
  /** 模块作者 */
  author?: string;
  /** 模块类型 */
  type: ExpansionSlotData['slotType'];
  /** 模块所需容量 */
  capacityRequired: number;
  /** 模块提供的功能列表 */
  features: string[];
  /** 模块添加的物品 */
  addItems?: InventoryItem[];
  /** 模块添加的事件 */
  addEvents?: GameEvent[];
  /** 模块添加的区域 */
  addZones?: ZoneData[];
  /** 模块添加的场景 */
  addScenes?: SceneData[];
  /** 模块添加的 NPC */
  addNpcs?: NpcData[];
  /** 模块添加的线索 */
  addClues?: ClueEntry[];
  /** 模块添加的结局 */
  addEndings?: EndingData[];
  /** 模块添加的状态效果 */
  addStatusEffects?: StatusEffect[];
  /** 模块添加的谜题 */
  addPuzzles?: PuzzleConfig[];
  /** 模块启用的配置 */
  config?: Record<string, any>;
  /** 模块入口事件（安装时触发） */
  entryEvent?: GameEvent;
  /** 兼容性信息 */
  compatibility?: {
    /** 最小游戏版本 */
    minGameVersion: string;
    /** 冲突模块列表 */
    conflictsWith: string[];
    /** 依赖模块 */
    dependsOn: string[];
  };
  /** 是否已安装 */
  installed: boolean;
}

/** 扩展槽管理器 */
export interface ExpansionSlotManager {
  /** 所有槽位 */
  slots: Record<string, ExpansionSlotData>;
  /** 获取已安装的模块 */
  getInstalledModules(): ExpansionModule[];
  /** 安装模块 */
  installModule(module: ExpansionModule, slotId: string): boolean;
  /** 卸载模块 */
  uninstallModule(slotId: string): boolean;
  /** 检查兼容性 */
  checkCompatibility(module: ExpansionModule): { ok: boolean; issues: string[] };
  /** 获取槽位可用容量 */
  getAvailableCapacity(slotId: string): number;
  /** 获取指定类型的所有槽位 */
  getSlotsByType(type: ExpansionSlotData['slotType']): ExpansionSlotData[];
}

// ============================================================================
// 18. 事件监听系统 (Event System)
// ============================================================================

/** 监听器结果 */
export interface ListenerResult {
  /** 是否阻止了事件的默认行为 */
  prevented: boolean;
  /** 是否修改了游戏状态 */
  stateModified: boolean;
  /** 监听器执行后的附加效果 */
  effects?: GameEffect[];
  /** 是否停止后续监听器的执行 */
  stopPropagation: boolean;
  /** 返回自定义数据 */
  data?: Record<string, any>;
}

/** 事件上下文 */
export interface EventContext {
  /** 监听器类型 */
  type: ListenerType;
  /** 触发时间（游戏内天数） */
  gameDay: number;
  /** 触发时段 */
  period: TimePeriod;
  /** 触发时的事件 ID（若有） */
  eventId?: EventId;
  /** 触发时的场景 ID */
  sceneId?: SceneId;
  /** 触发时的区域 ID */
  zoneId?: ZoneId;
  /** 触发时的选择 ID（若有） */
  choiceId?: string;
  /** 触发时的物品 ID（若有） */
  itemId?: ItemId;
  /** 触发时的 NPC ID（若有） */
  npcId?: NpcId;
  /** 触发时的谜题 ID（若有） */
  puzzleId?: PuzzleId;
  /** 触发时的自定义数据 */
  customData?: Record<string, any>;
}

/** 游戏事件监听器 */
export interface GameEventListener {
  /** 监听器唯一 ID */
  id: string;
  /** 监听器类型 */
  type: ListenerType;
  /** 优先级（数值越小越优先） */
  priority: number;
  /** 标签（用于分组管理） */
  tags: string[];
  /** 监听过滤器条件（返回 false 则不触发） */
  filter?: (context: EventContext) => boolean;
  /** 处理器 */
  handler: (context: EventContext) => ListenerResult | Promise<ListenerResult>;
  /** 监听器描述 */
  description: string;
  /** 监听器来源模块（若来自扩展模块） */
  sourceModule?: string;
  /** 是否只执行一次 */
  once: boolean;
  /** 是否已执行 */
  executed: boolean;
  /** 是否已启用 */
  enabled: boolean;
}

/** 监听器管理器 */
export interface ListenerManager {
  /** 所有已注册的监听器 */
  listeners: GameEventListener[];
  /** 注册一个监听器 */
  register(listener: GameEventListener): void;
  /** 批量注册监听器 */
  registerMany(listeners: GameEventListener[]): void;
  /** 注销监听器 */
  unregister(listenerId: string): boolean;
  /** 按类型获取监听器 */
  getByType(type: ListenerType): GameEventListener[];
  /** 按标签获取监听器 */
  getByTag(tag: string): GameEventListener[];
  /** 触发事件 */
  emit(context: EventContext): Promise<ListenerResult[]>;
  /** 启用/禁用监听器 */
  setEnabled(listenerId: string, enabled: boolean): void;
  /** 清空所有监听器 */
  clear(): void;
  /** 获取指定来源模块的所有监听器 */
  getByModule(moduleId: string): GameEventListener[];
}

// ============================================================================
// 19. 完全游戏状态 (Complete GameState)
// ============================================================================

/**
 * 游戏状态 — 游戏运行时所有可变数据的根容器。
 * 所有字段均为必需（除非标记为 optional），作为单例 Store 的核心类型。
 */
export interface GameState {
  /** ---- 周目系统 ---- */
  playthrough: {
    /** 当前周目数 */
    current: number;
    /** 已解锁的最大周目数 */
    maxUnlocked: number;
    /** 继承至下一周目的数据 */
    carryOver: {
      /** 继承的标记 */
      flags: Record<string, boolean | number | string>;
      /** 继承的物品 ID 列表 */
      inventoryItems: ItemId[];
      /** 已解锁的结局 */
      endingsUnlocked: EndingId[];
      /** 已解锁的 Bad End */
      badEndsUnlocked: BadEndId[];
      /** 已发现的线索分类 */
      clueCategories: ClueCategory[];
      /** 继承的 NPC 好感基础值 */
      npcAffinityBases: Record<NpcId, number>;
    };
  };

  /** ---- 时间系统 ---- */
  time: {
    /** 当前天数（从 1 开始） */
    day: number;
    /** 总天数 */
    totalDays: number;
    /** 当前时段 */
    period: TimePeriod;
    /** 当前时段已进行的行动次数 */
    periodAction: number;
    /** 每个时段的最大行动次数 */
    maxActionsPerPeriod: number;
    /** 时间限制（总天数上限，0=无限制） */
    dayLimit: number;
    /** 特殊日期标记 */
    specialDate?: string;
  };

  /** ---- 玩家数据 ---- */
  player: {
    /** 玩家 ID */
    id: string;
    /** 玩家名称 */
    name: string;
    /** 原始性别 */
    originalGender: string;
    /** 原始年龄 */
    originalAge: number;
    /** 当前性别 */
    currentGender: string;
    /** 当前年龄 */
    currentAge: number;
    /** 当前身份/职业 */
    identity: string;
    /** 身份变更历史栈（后进先出） */
    identityStack: IdentityChange[];
    /** 外观标签（如 ["猫耳","尾巴","鳞片"]） */
    appearanceTags: string[];
    /** 当前激活的状态效果 */
    statusEffects: StatusEffect[];
  };

  /** ---- 认知系统 ---- */
  cognition: {
    /** 现实认知度（0~100） */
    realityAwareness: number;
    /** 侵蚀值（0~100） */
    erosionLevel: number;
    /** 当前认知阶段 */
    stage: CognitionStage;
    /** 精神稳定度（0~100，归零可能导致崩溃或 Bad End） */
    stability: number;
  };

  /** ---- 发现物 ---- */
  discoveries: {
    /** 发现物总数 */
    total: number;
    /** 发现物条目 */
    entries: DiscoveryEntry[];
    /** 已发现的分类 */
    categories: ClueCategory[];
    /** 当前查看的发现物日志页码 */
    journalPage: number;
    /** 是否有未读发现 */
    hasUnread: boolean;
  };

  /** ---- 区域/场景 ---- */
  zone: {
    /** 当前所在区域 ID */
    currentZone: ZoneId;
    /** 当前所在场景 ID */
    currentScene: SceneId;
    /** 已探索的场景 ID 集合 */
    exploredScenes: SceneId[];
    /** 区域总探索进度（0~100） */
    zoneProgress: number;
    /** 区域现实稳定度 */
    zoneReality: number;
    /** 被锁定的区域（需要条件解锁） */
    lockedZones: ZoneId[];
    /** 今日是否已经切换过区域 */
    dayChanged: boolean;
  };

  /** ---- 物品栏 ---- */
  inventory: {
    /** 所有物品列表 */
    items: InventoryItem[];
    /** 最大物品格数 */
    maxItems: number;
    /** 装备栏 */
    equipment: {
      head: EquippedItem | null;
      body: EquippedItem | null;
      accessory: EquippedItem | null;
      weapon: EquippedItem | null;
    };
    /** 已装备的物品 ID 列表 */
    equipped: Record<EquipSlot, ItemId | null>;
    /** 线索条目 */
    clues: ClueEntry[];
    /** 已解锁的线索分类 */
    clueCategories: ClueCategory[];
    /** 关键物品列表 */
    keyItems: KeyItem[];
    /** 笔记内容 */
    notes: string;
    /** 持有货币 */
    money: number;
  };

  /** ---- NPC 关系 ---- */
  npcRelations: Record<NpcId, NpcRelationState>;

  /** ---- 叙事状态 ---- */
  narrative: {
    /** 当前活跃的事件 ID（正在执行的事件） */
    activeEvent: EventId | null;
    /** 全局标记（用于条件判断与剧情分支） */
    flags: Record<string, boolean | number | string>;
    /** 已访问过的事件 ID 集合 */
    visitedEvents: EventId[];
    /** 当前对话的索引 */
    currentDialogueIndex: number;
    /** 对话历史记录 */
    dialogueHistory: Array<{
      eventId: EventId;
      timestamp: number;
      choiceMade?: string;
    }>;
    /** 当前可用的路线 */
    availableRoutes: string[];
    /** 路线锁定（切换后被锁定的路线） */
    routeLock: string[];
  };

  /** ---- 谜题状态 ---- */
  puzzles: Record<PuzzleId, PuzzleState>;

  /** ---- 结局系统 ---- */
  ending: {
    /** 当前已达成的结局类型 */
    type: EndingType | null;
    /** 结局描述 */
    description: string;
    /** 主角最终形态描述 */
    playerFinalForm: string;
    /** 已解锁的 Bad End ID 列表 */
    badEndsUnlocked: BadEndId[];
    /** 已解锁的结局 ID 列表 */
    endingsUnlocked: EndingId[];
  };

  /** ---- 扩展插槽 ---- */
  expansionSlots: Record<string, ExpansionSlotData>;
}
