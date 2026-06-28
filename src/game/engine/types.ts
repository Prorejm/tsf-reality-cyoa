// ============================================================================
// types.ts — Unified type system for TSF Reality CYOA
// Combines engine-compatible flat GameState with all supporting types.
// ============================================================================

/**
 * ─── Base ID Types ───────────────────────────────────────────────────
 */
export type ZoneId = string;
export type SceneId = string;
export type EventId = string;
export type NpcId = string;
export type ItemId = string;
export type ClueId = string;
export type KeyItemId = string;
export type PuzzleId = string;
export type EndingId = string;
export type BadEndId = string;
export type DiscoveryId = string;
export type IdentityShiftId = string;
export type EquipSlot = 'head' | 'body' | 'accessory' | 'weapon';

/**
 * ─── Enum / Union Type Aliases ──────────────────────────────────────
 */
export type TimePeriod = 'morning' | 'afternoon' | 'evening' | 'night';
export type CognitionStage = 'outsider' | 'aware' | 'wavering' | 'assimilated';

/** 感知模式 */
export type PerceptionMode = 'resident' | 'truth';

/** 时段 — 引擎内部使用 (alias for TimePeriod) */
export type Period = TimePeriod;

export type MonsterCategory =
  | 'slime' | 'lamia' | 'succubus' | 'werewolf' | 'vampire'
  | 'kitsune' | 'harpy' | 'arachne' | 'mermaid' | 'alraune'
  | 'maid' | 'angel' | 'witch' | 'doll' | 'dragon' | 'chimera'
  | 'phantom' | 'oni' | 'golem' | 'custom';

export type TFTrigger =
  | 'touch' | 'ingestion' | 'injection' | 'inhalation'
  | 'curse' | 'pact' | 'environment' | 'psychological'
  | 'dream' | 'technology';

export type IdentityShiftType =
  | 'gender' | 'age' | 'species' | 'occupation' | 'relationship'
  | 'memory' | 'personality' | 'all';

export type EventStructure =
  | 'simple' | 'confirming' | 'switch_route' | 'scoring'
  | 'reentrant' | 'sorting_hat' | 'time_cave';

export type EndingType =
  | 'true_end' | 'normal_end' | 'bad_end' | 'hidden_end' | 'route_end';

export type AffinityLevel = 0 | 1 | 2 | 3 | 4 | 5;

export type ListenerType =
  | 'stateChange' | 'eventCompleted' | 'choiceMade' | 'timeAdvanced'
  | 'zoneEntered' | 'itemAcquired' | 'itemUsed' | 'npcAffinityChange'
  | 'realityShift' | 'erosionThreshold' | 'stageTransition'
  | 'puzzleSolved' | 'badEndTriggered' | 'custom';

export type PuzzleState =
  | 'locked' | 'unlocked' | 'in_progress' | 'solved' | 'failed' | 'expired';

export type ClueCategory =
  | 'reality_anomaly' | 'identity_trace' | 'monster_lore'
  | 'organization' | 'historical' | 'personal' | 'forbidden';

/**
 * ─── Basic Interfaces ───────────────────────────────────────────────
 */
export interface Choice {
  id: string;
  text: string;
  feedback?: string;
  condition?: string;
  conditionHint?: string;
  effects?: GameEffect[];
  nextEventId?: EventId;
  unlockZones?: ZoneId[];
  unlockScenes?: SceneId[];
  tags?: string[];
  score?: number;
  hidden?: boolean;
  oneTime?: boolean;
}

export interface NarrativeSegment {
  speaker?: string;
  text: string;
  mode?: 'resident' | 'truth';
  effects?: GameEffect[];
}

export interface GameEffect {
  type: string;
  target: string;
  value: number | string | boolean;
}

export interface StatusEffect {
  id: string;
  name: string;
  duration: number;
  remaining: number;
  effects: Record<string, number>;
  tickEffect?: string;
  stackRule?: 'add' | 'replace' | 'max';
}

export interface IdentityChange {
  type: IdentityShiftType;
  from: string;
  to: string;
  description: string;
  day: number;
  reversible?: boolean;
  permanent?: boolean;
}

export interface DualPerception {
  residentView: {
    description: string;
    appearance: string;
    dialogue: string[];
    attitude: string;
  };
  truthView: {
    description: string;
    appearance: string;
    internalThought: string[];
    contradiction: string;
  };
}

export interface MonsterData {
  id: string;
  name: string;
  nameCN: string;
  type: MonsterCategory;
  description: string;
  appearance: string;
  imagePrompt?: string;
  stats: { hp: number; will: number; attack: number; defense: number };
  tfMethod: { trigger: TFTrigger; countdown: number; effects: GameEffect[] };
  personalityShift: string;
}

export interface TransformationStage {
  id: string;
  name: string;
  progressMin: number;
  progressMax: number;
  bodyChanges: string[];
  mentalChanges: string[];
  narrativeDescription: string;
  statChanges?: Record<string, number>;
}

export interface DiscoveryEntry {
  id: string;
  title: string;
  description: string;
  source?: string;
  category: ClueCategory;
  relatedClues?: string[];
  truthDescription?: string;
  discovered?: boolean;
}

export interface InventoryItem {
  id: string;
  name: string;
  nameCN?: string;
  type: 'consumable' | 'equipment' | 'material' | 'key_item' | 'clue' | 'reusable' | 'tsf_trigger';
  description: string;
  truthDescription?: string;
  icon?: string;
  quantity: number;
  maxStack: number;
  usable: boolean;
  useEffect?: { action: string; description: string; payload?: Record<string, any> };
  sellPrice?: number;
  flags?: string[];
  discoveryLink?: string;
}

export interface EquippedItem {
  itemId: string;
  slot: EquipSlot;
  name: string;
  nameCN?: string;
  description: string;
  stats: { awarenessBonus?: number; erosionResist?: number; stabilityBonus?: number; special?: string };
  appearanceEffect?: string;
  curseLevel?: number;
  durability?: number;
  maxDurability?: number;
}

export interface ClueEntry {
  id: string;
  title: string;
  description: string;
  source: string;
  category: ClueCategory;
  relatedClues: string[];
  discoveredDay?: number;
  discoveredPeriod?: TimePeriod;
  verified?: boolean;
  connectedNpc?: NpcId;
  connectedScene?: SceneId;
  truthUnlocked?: boolean;
}

export interface KeyItem {
  id: string;
  name: string;
  nameCN: string;
  description: string;
  importance: 'plot' | 'ending' | 'secret';
  obtainedDay?: number;
  relatedEnding?: EndingType;
  relatedBadEnd?: BadEndId;
}

export interface ClueConnection {
  id: string;
  requiredClues: string[];
  resultDescription: string;
  awarenessReward: number;
  unlockFlag?: string;
  unlockEvent?: EventId;
  unlockDialogue?: string;
}

export interface NpcRelationState {
  npcId: NpcId;
  affinity: number;
  currentLevel: number;
  maxAffinityReached: number;
  currentStage: number;
  unlockedTopics: string[];
  dialogueCount: number;
  lastInteractionDay: number;
  flags: Record<string, boolean>;
  discovered: boolean;
  transformed: boolean;
}

export interface NpcData {
  id: NpcId;
  name: string;
  nameCN: string;
  location: SceneId;
  schedule?: NpcSchedule[];
  type: 'resident' | 'monster_girl' | 'key_npc' | 'hidden';
  monsterType?: MonsterCategory;
  perception: DualPerception;
  affinity: { maxLevel: number; unlockThresholds: number[]; levelRewards: string[] };
  dialogueStages: Array<{ stageId: number; condition: Record<string, any>; topics: string[] }>;
  transformation?: { type: MonsterCategory; triggerCondition: string; stages: TransformationStage[] };
}

export interface NpcSchedule { day: number; period: TimePeriod | 'all_day'; location: SceneId; action: string; notes?: string; }
export interface NpcDailySchedule { day: number; slots: NpcTimeSlot[]; }
export interface NpcTimeSlot { period: TimePeriod; location: SceneId; action: string; }

/** CYOA Structures */
export interface ConfirmStep { question: string; options: Choice[]; repeatCount: number; confirmText: string; }
export interface SwitchRoute { routes: Array<{ id: string; name: string; events: EventId[]; exclusive: boolean }>; }
export interface ScoringTrack { questions: Array<{ id: string; text: string; options: Array<{ label: string; score: Record<string, number> }> }>; thresholds: Record<string, number>; }
export interface ReentrantTopic { id: string; label: string; prompt: string; condition?: string; cooldown?: number; }

export interface GameEvent {
  id: EventId;
  sceneId: SceneId;
  title: string;
  structure: EventStructure;
  conditions: { minErosion?: number; maxErosion?: number; minAwareness?: number; dayPhase?: string[]; dayMin?: number; hasItem?: string[]; completedEvents?: string[]; flags?: string[] };
  narrative: { residentSegments: string[]; truthSegments: string[] };
  choices: Choice[];
  effects: { erosion?: number; awareness?: number; setFlag?: string; setDiscovery?: string; triggerItemDrop?: string };
  badEndCheck?: { condition: string; erosionThreshold: number; description: string };
  puzzle?: PuzzleId;
}

export interface SortingHatConfig { categories: Array<{ id: string; name: string; threshold: string[]; scene: SceneId }>; }
export interface TimeCaveConfig { branches: Array<{ condition: string; events: EventId[]; endingType: EndingType }>; }

export interface ZoneData { id: ZoneId; name: string; nameCN: string; description: string; erosionRange: [number, number]; scenes: SceneId[]; unlockConditions?: string; ambientDescription?: string; }
export interface SceneData { id: SceneId; zone: ZoneId; name: string; nameCN: string; description: string; type: string; connectedScenes: SceneId[]; }

export interface PuzzleConfig {
  id: PuzzleId; puzzleType: string; title: string; description: string; goal: string;
  difficulty: number; maxAttempts: number; timeLimit: number; hints: string[];
  solution: any; reward: { erosion?: number; awareness?: number; item?: string; flag?: string };
}

export interface EndingData { id: EndingId; type: EndingType; name: string; description: string; conditions: Record<string, any>; narrative: string; }
export interface BadEndData { id: BadEndId; name: string; description: string; triggerCondition: string; narrative: string; }

export interface ScheduleEvent { id: string; day: number; period: TimePeriod; eventId: EventId; type: 'mandatory' | 'optional' | 'conditional'; priority: number; description: string; missedConsequence?: string; conditions?: Record<string, any>; }

export interface ExpansionSlotData { id: string; description: string; }
export interface ExpansionModule { id: string; name: string; version: string; description: string; onLoad: () => void; }
export interface ExpansionSlotManager { register(m: ExpansionModule): boolean; unregister(id: string): boolean; }

export interface ListenerResult { type: string; triggered: boolean; data?: any; }
export interface EventContext { type: string; sceneId?: string; npcId?: string; }
export interface GameEventListener { id: string; type: ListenerType; priority: number; condition: (state: GameState, ctx: EventContext) => boolean; handler: (state: GameState, ctx: EventContext) => ListenerResult; maxTriggers: number; currentTriggers: number; enabled: boolean; }
export interface ListenerManager { register(l: GameEventListener): void; unregister(id: string): void; dispatch(type: ListenerType, ctx: EventContext, state: GameState): ListenerResult[]; }

/** Narrative log entry */
export interface NarrativeEntry { type: string; content: string; day: number; period: Period; timestamp: number; }

/** Entity descriptor */
export interface EntityDescriptor { name: string; description: string; tags?: string[]; }

/** Reality break event */
export interface RealityBreakEvent { id: string; narrative: string; intensity: 'mild' | 'moderate' | 'severe'; }

/** Engine-internal types */
export interface ChoiceResult { choiceId: string; effects?: Record<string, number>; }
export interface Discovery { id: string; title: string; description: string; category: string; source?: string; }
export interface Clue { id: string; title: string; description: string; category: string; }
export interface ClueLink { id: string; clueIds: string[]; resultDescription: string; }
export interface NpcRelation { affinity: number; stage: number; flags: Record<string, boolean>; dialogueHistory: string[]; met: boolean; }
export interface BadEndEntry { id: string; name: string; triggerDay: number; description: string; }
export interface TSFTriggerContext { itemId: string; sceneId?: string; period?: Period; day?: number; }
export interface ContainerResult { success: boolean; message?: string; }
export interface EngineScheduleEntry extends ScheduleEvent {}
export interface CalendarEvent { day: number; period: Period; title: string; type: string; completed: boolean; missed: boolean; }

/** Game action union type */
export type GameAction =
  | { type: 'NEW_GAME'; payload?: GameConfig }
  | { type: 'LOAD_GAME'; payload: GameState }
  | { type: 'TIME_ADVANCE' }
  | { type: 'SET_SCENE'; payload: string }
  | { type: 'EXPLORE_SCENE'; payload: string }
  | { type: 'MAKE_CHOICE'; payload: { choiceId: string; eventId: string } }
  | { type: 'ADD_ITEM'; payload: any }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'EQUIP_ITEM'; payload: { itemId: string; slot: string } }
  | { type: 'ADD_DISCOVERY'; payload: Discovery }
  | { type: 'ADD_CLUE'; payload: Clue }
  | { type: 'MODIFY_NPC_AFFINITY'; payload: { npcId: string; amount: number } }
  | { type: 'APPLY_EROSION'; payload: number }
  | { type: 'APPLY_AWARENESS'; payload: number }
  | { type: 'SET_FLAG'; payload: { key: string; value: any } }
  | { type: 'SET_ENDING'; payload: { type: string; description: string } }
  | { type: 'ADD_BAD_END'; payload: BadEndEntry }
  | { type: 'TRIGGER_LISTENER'; payload: any }
  | { type: 'SWITCH_PERCEPTION' }
  | { type: string; payload?: any };

/** Game config */
export interface GameConfig {
  totalDays?: number;
  startingScene?: string;
  maxInventorySize?: number;
  initialFlags?: Record<string, boolean | number | string>;
}

/**
 * ─── GameState — Flat structure (engine-compatible) ─────────────────
 */
export interface GameState {
  gameVersion: string;
  playthroughCount: number;
  playthroughId: string;
  currentDay: number;
  currentPeriod: Period;
  totalDays: number;
  currentScene: string;
  sceneHistory: string[];
  exploredScenes: string[];
  erosionLevel: number;
  awarenessLevel: number;
  perceptionMode: PerceptionMode;
  inventory: any[];
  equippedItems: Record<string, any>;
  maxInventorySize: number;
  discoveries: Discovery[];
  clues: Clue[];
  clueLinks: ClueLink[];
  npcRelations: Record<string, NpcRelation>;
  flags: Record<string, any>;
  activeEvents: string[];
  completedEvents: string[];
  endings: string[];
  badEnds: BadEndEntry[];
  narrativeLog: NarrativeEntry[];
  schedule: EngineScheduleEntry[];
  listeners: any[];
  lastSave: string;
}
