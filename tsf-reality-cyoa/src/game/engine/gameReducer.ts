import type {
  GameState,
  GameAction,
  Period,
  ChoiceResult,
  Discovery,
  InventoryItem,
  Clue,
  ClueLink,
  NpcRelation,
  BadEndEntry,
  ListenerResult,
  GameConfig,
  TSFTriggerContext,
  ScheduleEntry,
  NarrativeEntry,
  ContainerResult,
} from './types';

// ─── Helpers ────────────────────────────────────────────────────────

const PERIOD_ORDER: Period[] = ['morning', 'afternoon', 'evening', 'night'];

function nextPeriod(current: Period): Period | null {
  const idx = PERIOD_ORDER.indexOf(current);
  if (idx === -1 || idx === PERIOD_ORDER.length - 1) return null;
  return PERIOD_ORDER[idx + 1];
}

function generatePlaythroughId(): string {
  return `pt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function mergeNpcRelation(
  existing: NpcRelation | undefined,
  updates: Partial<NpcRelation>,
): NpcRelation {
  return {
    affinity: 0,
    stage: 0,
    flags: {},
    dialogueHistory: [],
    met: false,
    ...(existing ?? {}),
    ...updates,
    flags: { ...(existing?.flags ?? {}), ...(updates.flags ?? {}) },
    dialogueHistory: [
      ...(existing?.dialogueHistory ?? []),
      ...(updates.dialogueHistory ?? []),
    ],
  };
}

// ─── Initialisation ─────────────────────────────────────────────────

export function createInitialState(config?: GameConfig): GameState {
  return {
    gameVersion: '1.0.0',
    playthroughCount: 0,
    playthroughId: generatePlaythroughId(),

    currentDay: 1,
    currentPeriod: 'morning',
    totalDays: config?.totalDays ?? 30,

    currentScene: config?.startingScene ?? 'home_bedroom',
    sceneHistory: [],
    exploredScenes: [config?.startingScene ?? 'home_bedroom'],

    erosionLevel: 0,
    awarenessLevel: 0,
    perceptionMode: 'resident',

    inventory: [],
    equippedItems: {},
    maxInventorySize: config?.maxInventorySize ?? 20,

    discoveries: [],
    clues: [],
    clueLinks: [],

    npcRelations: {},

    flags: { ...(config?.initialFlags ?? {}) },
    activeEvents: [],
    completedEvents: [],

    endings: [],
    badEnds: [],

    narrativeLog: [],

    schedule: [],
    listeners: [],

    lastSave: '',
  };
}

export function createNewGameState(config?: GameConfig): GameState {
  return {
    ...createInitialState(config),
    playthroughCount: 1,
    playthroughId: generatePlaythroughId(),
  };
}

export function loadGameState(data: GameState): GameState {
  return { ...data, playthroughId: generatePlaythroughId() };
}

// ─── Reducer ────────────────────────────────────────────────────────

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    // ── Time ───────────────────────────────────────────────────────
    case 'TIME_ADVANCE': {
      const next = nextPeriod(state.currentPeriod);
      const isNewDay = next === null;
      return {
        ...state,
        currentPeriod: next ?? 'morning',
        currentDay: isNewDay ? state.currentDay + 1 : state.currentDay,
        narrativeLog: [
          ...state.narrativeLog,
          {
            type: 'system',
            content: isNewDay
              ? `第 ${state.currentDay + 1} 天 - 早晨`
              : `时间推进到 ${next ?? '早晨'}`,
            day: isNewDay ? state.currentDay + 1 : state.currentDay,
            period: next ?? 'morning',
            timestamp: Date.now(),
          },
        ],
      };
    }

    // ── Scene ──────────────────────────────────────────────────────
    case 'SET_SCENE': {
      const sceneId = action.payload;
      return {
        ...state,
        currentScene: sceneId,
        sceneHistory: [...state.sceneHistory, sceneId],
        exploredScenes: state.exploredScenes.includes(sceneId)
          ? state.exploredScenes
          : [...state.exploredScenes, sceneId],
      };
    }

    case 'EXPLORE_SCENE': {
      const sceneId = action.payload;
      if (state.exploredScenes.includes(sceneId)) return state;
      return {
        ...state,
        exploredScenes: [...state.exploredScenes, sceneId],
        narrativeLog: [
          ...state.narrativeLog,
          {
            type: 'exploration',
            content: `探索了新场景: ${sceneId}`,
            day: state.currentDay,
            period: state.currentPeriod,
            timestamp: Date.now(),
          },
        ],
      };
    }

    // ── Choice ─────────────────────────────────────────────────────
    case 'MAKE_CHOICE': {
      const choice = action.payload;
      let newState = { ...state };

      // Apply identity shifts
      if (choice.identityShift) {
        Object.entries(choice.identityShift).forEach(([key, value]) => {
          newState.flags[`identity_${key}`] =
            (newState.flags[`identity_${key}`] ?? 0) + value;
        });
      }

      // Apply erosion change
      if (choice.erosionChange) {
        newState.erosionLevel = clamp(
          newState.erosionLevel + choice.erosionChange,
          0,
          100,
        );
      }

      // Apply awareness change
      if (choice.awarenessChange) {
        newState.awarenessLevel = clamp(
          newState.awarenessLevel + choice.awarenessChange,
          0,
          100,
        );
      }

      // Apply flag changes
      if (choice.setFlags) {
        Object.entries(choice.setFlags).forEach(([k, v]) => {
          newState.flags[k] = v;
        });
      }

      // Apply NPC affinity changes
      if (choice.npcAffinityChanges) {
        const npcRelations = { ...newState.npcRelations };
        Object.entries(choice.npcAffinityChanges).forEach(([npcId, amount]) => {
          const existing = npcRelations[npcId];
          npcRelations[npcId] = mergeNpcRelation(existing, {
            affinity: clamp((existing?.affinity ?? 0) + amount, -100, 100),
            met: true,
          });
        });
        newState.npcRelations = npcRelations;
      }

      // Apply item changes
      if (choice.itemsToAdd) {
        newState.inventory = [...newState.inventory, ...choice.itemsToAdd];
      }
      if (choice.itemsToRemove) {
        newState.inventory = newState.inventory.filter(
          (it) => !choice.itemsToRemove!.includes(it.id),
        );
      }

      newState.narrativeLog = [
        ...newState.narrativeLog,
        {
          type: 'choice',
          content: choice.narrative ?? '',
          choiceId: choice.choiceId,
          day: state.currentDay,
          period: state.currentPeriod,
          timestamp: Date.now(),
        },
      ];

      return newState;
    }

    // ── Discovery ──────────────────────────────────────────────────
    case 'ADD_DISCOVERY': {
      const disc = action.payload;
      if (state.discoveries.some((d) => d.id === disc.id)) return state;
      return {
        ...state,
        discoveries: [...state.discoveries, disc],
      };
    }

    // ── Inventory ──────────────────────────────────────────────────
    case 'ADD_ITEM': {
      const item = action.payload;
      const existingIdx = state.inventory.findIndex(
        (i) => i.id === item.id && i.stackable,
      );
      if (existingIdx !== -1) {
        const inventory = [...state.inventory];
        inventory[existingIdx] = {
          ...inventory[existingIdx],
          quantity: (inventory[existingIdx].quantity ?? 1) + (item.quantity ?? 1),
        };
        return { ...state, inventory };
      }
      if (state.inventory.length >= state.maxInventorySize) {
        // Inventory full — log warning
        return {
          ...state,
          narrativeLog: [
            ...state.narrativeLog,
            {
              type: 'system',
              content: `背包已满，无法拾取 ${item.name ?? item.id}`,
              day: state.currentDay,
              period: state.currentPeriod,
              timestamp: Date.now(),
            },
          ],
        };
      }
      return {
        ...state,
        inventory: [
          ...state.inventory,
          { ...item, quantity: item.quantity ?? 1 },
        ],
      };
    }

    case 'REMOVE_ITEM': {
      const itemId = action.payload;
      const idx = state.inventory.findIndex((i) => i.id === itemId);
      if (idx === -1) return state;

      const inventory = [...state.inventory];
      const item = inventory[idx];
      if (item.stackable && item.quantity && item.quantity > 1) {
        inventory[idx] = { ...item, quantity: item.quantity - 1 };
      } else {
        inventory.splice(idx, 1);
      }

      // Also remove from equipped
      const equippedItems = { ...state.equippedItems };
      for (const [slot, eid] of Object.entries(equippedItems)) {
        if (eid === itemId) delete equippedItems[slot];
      }

      return { ...state, inventory, equippedItems };
    }

    case 'EQUIP_ITEM': {
      const { itemId, slot } = action.payload;
      const item = state.inventory.find((i) => i.id === itemId);
      if (!item || !item.equippable) return state;

      // Unequip existing item in slot
      const equippedItems = { ...state.equippedItems };
      const existingItemId = equippedItems[slot];
      if (existingItemId) {
        // Put existing item back into inventory
        const inventory = [...state.inventory];
        const existingInvIdx = inventory.findIndex(
          (i) => i.id === existingItemId,
        );
        if (existingInvIdx !== -1) {
          inventory[existingInvIdx] = {
            ...inventory[existingInvIdx],
            equipped: false,
          };
        }
        equippedItems[slot] = itemId;
        return { ...state, inventory, equippedItems };
      }

      equippedItems[slot] = itemId;
      return { ...state, equippedItems };
    }

    // ── Clues ──────────────────────────────────────────────────────
    case 'ADD_CLUE': {
      const clue = action.payload;
      if (state.clues.some((c) => c.id === clue.id)) {
        // Merge existing clue
        return {
          ...state,
          clues: state.clues.map((c) =>
            c.id === clue.id
              ? { ...c, ...clue, fragments: [...new Set([...(c.fragments ?? []), ...(clue.fragments ?? [])])] }
              : c,
          ),
        };
      }
      return {
        ...state,
        clues: [...state.clues, clue],
      };
    }

    case 'LINK_CLUES': {
      const [clueAId, clueBId] = action.payload;
      const aExists = state.clues.some((c) => c.id === clueAId);
      const bExists = state.clues.some((c) => c.id === clueBId);
      if (!aExists || !bExists) return state;

      const alreadyLinked = state.clueLinks.some(
        (l) =>
          (l.sourceId === clueAId && l.targetId === clueBId) ||
          (l.sourceId === clueBId && l.targetId === clueAId),
      );
      if (alreadyLinked) return state;

      return {
        ...state,
        clueLinks: [
          ...state.clueLinks,
          { sourceId: clueAId, targetId: clueBId, createdAt: Date.now() },
        ],
      };
    }

    // ── NPC ────────────────────────────────────────────────────────
    case 'MODIFY_NPC_AFFINITY': {
      const { npcId, amount } = action.payload;
      const existing = state.npcRelations[npcId];
      const newAffinity = clamp((existing?.affinity ?? 0) + amount, -100, 100);
      return {
        ...state,
        npcRelations: {
          ...state.npcRelations,
          [npcId]: mergeNpcRelation(existing, {
            affinity: newAffinity,
            met: true,
          }),
        },
      };
    }

    case 'SET_NPC_STAGE': {
      const { npcId, stage } = action.payload;
      const existing = state.npcRelations[npcId];
      return {
        ...state,
        npcRelations: {
          ...state.npcRelations,
          [npcId]: mergeNpcRelation(existing, {
            stage,
            met: existing?.met ?? true,
          }),
        },
      };
    }

    // ── Erosion & Awareness ────────────────────────────────────────
    case 'APPLY_EROSION': {
      const { amount, reason } = action.payload;
      const newErosion = clamp(state.erosionLevel + amount, 0, 100);
      return {
        ...state,
        erosionLevel: newErosion,
        narrativeLog: [
          ...state.narrativeLog,
          {
            type: 'erosion',
            content: `侵蚀度 ${amount >= 0 ? '+' : ''}${amount}: ${reason}`,
            day: state.currentDay,
            period: state.currentPeriod,
            timestamp: Date.now(),
          },
        ],
      };
    }

    case 'APPLY_AWARENESS': {
      const { amount, reason } = action.payload;
      const newAwareness = clamp(state.awarenessLevel + amount, 0, 100);
      return {
        ...state,
        awarenessLevel: newAwareness,
        narrativeLog: [
          ...state.narrativeLog,
          {
            type: 'awareness',
            content: `认知度 ${amount >= 0 ? '+' : ''}${amount}: ${reason}`,
            day: state.currentDay,
            period: state.currentPeriod,
            timestamp: Date.now(),
          },
        ],
      };
    }

    // ── Perception ─────────────────────────────────────────────────
    case 'SWITCH_PERCEPTION': {
      const nextMode =
        state.perceptionMode === 'resident' ? 'truth' : 'resident';
      return {
        ...state,
        perceptionMode: nextMode,
        narrativeLog: [
          ...state.narrativeLog,
          {
            type: 'perception',
            content:
              nextMode === 'truth'
                ? '真相之眼已开启 — 你看到了世界的另一面'
                : '切换回日常视角 — 一切恢复了"正常"',
            day: state.currentDay,
            period: state.currentPeriod,
            timestamp: Date.now(),
          },
        ],
      };
    }

    // ── Listener ───────────────────────────────────────────────────
    case 'TRIGGER_LISTENER': {
      const result = action.payload;
      if (!result.triggered || !result.effects) return state;

      let newState = { ...state };

      if (result.effects.erosionChange) {
        newState.erosionLevel = clamp(
          newState.erosionLevel + result.effects.erosionChange,
          0,
          100,
        );
      }
      if (result.effects.awarenessChange) {
        newState.awarenessLevel = clamp(
          newState.awarenessLevel + result.effects.awarenessChange,
          0,
          100,
        );
      }
      if (result.effects.setFlags) {
        Object.entries(result.effects.setFlags).forEach(([k, v]) => {
          newState.flags[k] = v;
        });
      }
      if (result.effects.switchPerception) {
        newState.perceptionMode =
          newState.perceptionMode === 'resident' ? 'truth' : 'resident';
      }
      if (result.effects.addItems) {
        newState.inventory = [...newState.inventory, ...result.effects.addItems];
      }
      if (result.effects.removeItems) {
        newState.inventory = newState.inventory.filter(
          (it) => !result.effects.removeItems!.includes(it.id),
        );
      }

      newState.narrativeLog = [
        ...newState.narrativeLog,
        {
          type: 'listener',
          content: result.narrative ?? `触发器 [${result.listenerId}] 被激活`,
          day: state.currentDay,
          period: state.currentPeriod,
          timestamp: Date.now(),
        },
      ];

      return newState;
    }

    // ── TSF Item Trigger ───────────────────────────────────────────
    case 'TRIGGER_TSF_ITEM': {
      const { itemId } = action.payload;
      const item = state.inventory.find((i) => i.id === itemId);
      if (!item) return state;

      // TSFTriggerItem activates — increase erosion, possibly perception shift
      const tsfItem = item as any; // cast to TSFTriggerItem at runtime
      return {
        ...state,
        erosionLevel: clamp(state.erosionLevel + (tsfItem.erosionOnUse ?? 5), 0, 100),
        awarenessLevel: clamp(
          state.awarenessLevel + (tsfItem.awarenessOnUse ?? 2),
          0,
          100,
        ),
        flags: {
          ...state.flags,
          [`tsf_item_used_${itemId}`]: true,
          ...(tsfItem.setFlagsOnUse ?? {}),
        },
        narrativeLog: [
          ...state.narrativeLog,
          {
            type: 'tsf_item',
            content: `使用了 TSF 物品 [${item.name ?? itemId}] — 身体产生了某种变化……`,
            day: state.currentDay,
            period: state.currentPeriod,
            timestamp: Date.now(),
          },
        ],
      };
    }

    // ── Flags ──────────────────────────────────────────────────────
    case 'SET_FLAG': {
      const { key, value } = action.payload;
      return {
        ...state,
        flags: { ...state.flags, [key]: value },
      };
    }

    // ── Endings ────────────────────────────────────────────────────
    case 'SET_ENDING': {
      const endingId = action.payload;
      if (state.endings.includes(endingId)) return state;
      return {
        ...state,
        endings: [...state.endings, endingId],
        narrativeLog: [
          ...state.narrativeLog,
          {
            type: 'ending',
            content: `结局达成: ${endingId}`,
            day: state.currentDay,
            period: state.currentPeriod,
            timestamp: Date.now(),
          },
        ],
      };
    }

    case 'ADD_BAD_END': {
      const entry = action.payload;
      return {
        ...state,
        badEnds: [...state.badEnds, entry],
        narrativeLog: [
          ...state.narrativeLog,
          {
            type: 'bad_end',
            content: entry.narrative ?? `Bad End: ${entry.id}`,
            day: state.currentDay,
            period: state.currentPeriod,
            timestamp: Date.now(),
          },
        ],
      };
    }

    // ── Load / New Game ────────────────────────────────────────────
    case 'LOAD_GAME': {
      return loadGameState(action.payload);
    }

    case 'NEW_GAME': {
      return createNewGameState(action.payload);
    }

    default: {
      const _exhaustive: never = action;
      return state;
    }
  }
}
