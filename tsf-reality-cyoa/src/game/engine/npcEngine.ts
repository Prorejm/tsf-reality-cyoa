import type {
  GameState,
  NpcRelation,
  NpcDefinition,
  NpcDialogueTopic,
  NarrativeSegment,
  NpcScheduleSlot,
  DialogueLine,
} from './types';

// ─── Stage Thresholds ──────────────────────────────────────────────

/**
 * Affinity thresholds required to unlock each dialogue stage.
 * Stage 0 is always available (first meeting).
 */
const STAGE_AFFINITY_THRESHOLDS = [
  0,    // Stage 0: First meeting (0+ affinity)
  10,   // Stage 1: Acquaintance
  25,   // Stage 2: Friendly
  40,   // Stage 3: Close
  60,   // Stage 4: Intimate
  80,   // Stage 5: Deep Bond
];

// ─── Affinity Modification ─────────────────────────────────────────

/**
 * Modify an NPC's affinity value and return the updated state.
 * Automatically unlocks new dialogue stages when thresholds are crossed.
 */
export function modifyAffinity(
  state: GameState,
  npcId: string,
  amount: number,
): GameState {
  const relation = state.npcRelations[npcId];
  const currentAffinity = relation?.affinity ?? 0;
  const newAffinity = Math.max(-100, Math.min(100, currentAffinity + amount));

  const oldStage = getDialogueStage(state, npcId);
  const newRelation: NpcRelation = {
    affinity: newAffinity,
    stage: relation?.stage ?? 0,
    flags: { ...(relation?.flags ?? {}) },
    dialogueHistory: [...(relation?.dialogueHistory ?? [])],
    met: true,
  };

  // Check if a new stage is unlocked
  const newStage = calculateStage(newAffinity);
  if (newStage > oldStage) {
    newRelation.stage = newStage;
  }

  // Build narrative
  const direction = amount >= 0 ? '提升' : '降低';
  const narrative: string =
    amount !== 0
      ? `与 ${getNpcName(npcId, state)} 的好感度${direction}了 ${Math.abs(amount)} 点。(当前: ${newAffinity})`
      : '';

  return {
    ...state,
    npcRelations: {
      ...state.npcRelations,
      [npcId]: newRelation,
    },
    narrativeLog: narrative
      ? [
          ...state.narrativeLog,
          {
            type: 'npc_affinity',
            content: narrative,
            npcId,
            affinityChange: amount,
            day: state.currentDay,
            period: state.currentPeriod,
            timestamp: Date.now(),
          },
        ]
      : state.narrativeLog,
  };
}

function calculateStage(affinity: number): number {
  let stage = 0;
  for (let i = STAGE_AFFINITY_THRESHOLDS.length - 1; i >= 0; i--) {
    if (affinity >= STAGE_AFFINITY_THRESHOLDS[i]) {
      stage = i;
      break;
    }
  }
  return stage;
}

// ─── Dialogue Stage ────────────────────────────────────────────────

/**
 * Get the current dialogue stage for an NPC.
 * The stage is derived from both affinity thresholds and any
 * story-progressed stage overrides.
 */
export function getDialogueStage(state: GameState, npcId: string): number {
  const relation = state.npcRelations[npcId];
  if (!relation) return 0;

  // If story has explicitly set a stage, use it
  const storyStage = relation.stage;
  const affinityStage = calculateStage(relation.affinity);

  // Use the higher of the two
  return Math.max(storyStage, affinityStage);
}

/**
 * Get the human-readable label for a dialogue stage.
 */
export function getStageLabel(stage: number): string {
  const labels = [
    '初次见面',    // 0
    '相识',        // 1
    '友好',        // 2
    '亲密',        // 3
    '信赖',        // 4
    '羁绊',        // 5
  ];
  return labels[stage] ?? `阶段 ${stage}`;
}

/**
 * Get the affinity range for a given stage.
 */
export function getStageAffinityRange(stage: number): { min: number; max: number } {
  const min = STAGE_AFFINITY_THRESHOLDS[stage] ?? 0;
  const max =
    stage < STAGE_AFFINITY_THRESHOLDS.length - 1
      ? STAGE_AFFINITY_THRESHOLDS[stage + 1] - 1
      : 100;
  return { min, max };
}

// ─── Available Topics ──────────────────────────────────────────────

/**
 * Get the list of unlocked dialogue topics for an NPC,
 * based on current stage, flags, and perception mode.
 */
export function getAvailableTopics(
  state: GameState,
  npcId: string,
  npcRegistry?: Map<string, NpcDefinition>,
): NpcDialogueTopic[] {
  const definition = npcRegistry?.get(npcId);
  if (!definition?.dialogueTopics) return [];

  const currentStage = getDialogueStage(state, npcId);

  return definition.dialogueTopics.filter((topic) => {
    // Stage gate
    if (topic.requiredStage !== undefined && topic.requiredStage > currentStage) {
      return false;
    }

    // Flag prerequisites
    if (topic.requiredFlags) {
      for (const [flag, value] of Object.entries(topic.requiredFlags)) {
        if (state.flags[flag] !== value) return false;
      }
    }

    // Already completed topics
    if (topic.once && state.npcRelations[npcId]?.dialogueHistory?.includes(topic.id)) {
      return false;
    }

    // Perception requirement
    if (topic.requiredPerception && topic.requiredPerception !== state.perceptionMode) {
      return false;
    }

    return true;
  });
}

// ─── NPC Schedule ──────────────────────────────────────────────────

/**
 * Check where an NPC currently is based on their schedule.
 */
export function checkNpcSchedule(
  state: GameState,
  npcId: string,
  npcRegistry?: Map<string, NpcDefinition>,
): { location: string; available: boolean } | null {
  const definition = npcRegistry?.get(npcId);
  if (!definition?.schedule) {
    return null;
  }

  const currentSlot = definition.schedule.find(
    (slot) =>
      slot.day === state.currentDay && slot.period === state.currentPeriod,
  );

  if (currentSlot) {
    return {
      location: currentSlot.location,
      available: currentSlot.available,
    };
  }

  // Default: check generic schedule (no specific day)
  const genericSlot = definition.schedule.find(
    (slot) => slot.day === -1 && slot.period === state.currentPeriod,
  );

  if (genericSlot) {
    return {
      location: genericSlot.location,
      available: genericSlot.available,
    };
  }

  return { location: 'unknown', available: false };
}

// ─── Dialogue Resolution ──────────────────────────────────────────

/**
 * Resolve an NPC dialogue topic and produce narrative segments.
 * Applies any effects defined on the topic (affinity changes, flags, etc.).
 */
export function resolveNpcDialogue(
  state: GameState,
  npcId: string,
  topicId: string,
  npcRegistry?: Map<string, NpcDefinition>,
): { state: GameState; segments: NarrativeSegment[] } {
  const segments: NarrativeSegment[] = [];
  const definition = npcRegistry?.get(npcId);

  if (!definition) {
    segments.push({
      type: 'narrative',
      content: `[错误: NPC "${npcId}" 未在注册表中找到]`,
    });
    return { state, segments };
  }

  const topic = definition.dialogueTopics?.find((t) => t.id === topicId);
  if (!topic) {
    segments.push({
      type: 'narrative',
      content: `[错误: NPC "${npcId}" 没有对话主题 "${topicId}"]`,
    });
    return { state, segments };
  }

  // Generate dialogue lines
  if (topic.lines && topic.lines.length > 0) {
    for (const line of topic.lines) {
      segments.push({
        type: 'dialogue',
        content: line.text,
        speaker: line.speaker ?? definition.name,
        emotion: line.emotion,
      });
    }
  } else if (topic.narrative) {
    segments.push({
      type: 'narrative',
      content: topic.narrative,
    });
  }

  // Apply topic effects
  let newState = { ...state };

  if (topic.affinityChange) {
    const newAffinity = Math.max(
      -100,
      Math.min(
        100,
        (newState.npcRelations[npcId]?.affinity ?? 0) + topic.affinityChange,
      ),
    );
    newState.npcRelations = {
      ...newState.npcRelations,
      [npcId]: {
        affinity: newAffinity,
        stage: newState.npcRelations[npcId]?.stage ?? 0,
        flags: { ...(newState.npcRelations[npcId]?.flags ?? {}) },
        dialogueHistory: [
          ...(newState.npcRelations[npcId]?.dialogueHistory ?? []),
          topicId,
        ],
        met: true,
      },
    };
  } else {
    // Still record dialogue history even without affinity change
    newState.npcRelations = {
      ...newState.npcRelations,
      [npcId]: {
        ...(newState.npcRelations[npcId] ?? {
          affinity: 0,
          stage: 0,
          flags: {},
          dialogueHistory: [],
          met: false,
        }),
        dialogueHistory: [
          ...(newState.npcRelations[npcId]?.dialogueHistory ?? []),
          topicId,
        ],
        met: true,
      },
    };
  }

  if (topic.setFlags) {
    Object.entries(topic.setFlags).forEach(([k, v]) => {
      newState.flags[k] = v;
    });
  }

  if (topic.erosionChange) {
    newState.erosionLevel = Math.max(
      0,
      Math.min(100, newState.erosionLevel + topic.erosionChange),
    );
  }

  if (topic.awarenessChange) {
    newState.awarenessLevel = Math.max(
      0,
      Math.min(100, newState.awarenessLevel + topic.awarenessChange),
    );
  }

  return { state: newState, segments };
}

// ─── Helpers ───────────────────────────────────────────────────────

/**
 * Get the display name for an NPC.
 */
function getNpcName(npcId: string, state: GameState): string {
  // Attempt to get name from NPC relations or flags
  const customName = state.flags[`npc_name_${npcId}`];
  return (customName as string) ?? npcId;
}

/**
 * Check if an NPC has been met.
 */
export function hasMetNpc(state: GameState, npcId: string): boolean {
  return state.npcRelations[npcId]?.met === true;
}

/**
 * Get the raw affinity value for an NPC.
 */
export function getNpcAffinity(state: GameState, npcId: string): number {
  return state.npcRelations[npcId]?.affinity ?? 0;
}

/**
 * Get the affinity trend direction.
 */
export function getAffinityTrend(
  state: GameState,
  npcId: string,
): 'rising' | 'falling' | 'stable' {
  const relation = state.npcRelations[npcId];
  if (!relation) return 'stable';

  const recentEntries = state.narrativeLog.filter(
    (n) => n.type === 'npc_affinity' && n.npcId === npcId,
  );
  if (recentEntries.length < 2) return 'stable';

  const recentChanges = recentEntries
    .slice(-3)
    .reduce((sum, n) => sum + (n.affinityChange ?? 0), 0);

  if (recentChanges > 5) return 'rising';
  if (recentChanges < -5) return 'falling';
  return 'stable';
}

/**
 * Calculate the affinity progress percentage toward the next stage.
 */
export function getAffinityProgress(
  state: GameState,
  npcId: string,
): number {
  const currentStage = getDialogueStage(state, npcId);
  const affinity = getNpcAffinity(state, npcId);

  const currentThreshold = STAGE_AFFINITY_THRESHOLDS[currentStage] ?? 0;
  const nextThreshold =
    STAGE_AFFINITY_THRESHOLDS[currentStage + 1] ??
    STAGE_AFFINITY_THRESHOLDS[STAGE_AFFINITY_THRESHOLDS.length - 1];

  if (nextThreshold <= currentThreshold) return 100;

  const progress =
    ((affinity - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
  return Math.max(0, Math.min(100, Math.round(progress)));
}

/**
 * Get dialogue history for an NPC.
 */
export function getDialogueHistory(
  state: GameState,
  npcId: string,
): string[] {
  return state.npcRelations[npcId]?.dialogueHistory ?? [];
}
