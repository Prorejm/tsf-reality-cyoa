import type {
  GameState,
  GameEvent,
  EventCondition,
  EventChoice,
  ChoiceResult,
  EventBranch,
  IdentityShift,
  IdentityDomain,
  NarrativeSegment,
} from './types';

// ─── Event Resolution ──────────────────────────────────────────────

export interface ResolvedEvent {
  state: GameState;
  narrative: NarrativeSegment[];
  availableChoices: EventChoice[];
  triggeredBadEnd: string | null;
  identityShift: IdentityShift | null;
}

/**
 * Resolve an event given its ID and the current game state.
 * Evaluates conditions, branches, choices, and produces narrative output.
 *
 * @returns ResolvedEvent with modified state + narrative + available choices.
 */
export function resolveEvent(
  eventId: string,
  state: GameState,
  eventRegistry: Map<string, GameEvent>,
): ResolvedEvent {
  const event = eventRegistry.get(eventId);
  if (!event) {
    return {
      state,
      narrative: [
        {
          type: 'narrative',
          content: `[错误: 未找到事件 "${eventId}"]`,
        },
      ],
      availableChoices: [],
      triggeredBadEnd: null,
      identityShift: null,
    };
  }

  let currentState = { ...state };
  const narrative: NarrativeSegment[] = [];

  // 1. Evaluate event prerequisites
  if (event.prerequisites && !evaluateConditionSet(event.prerequisites, currentState)) {
    return {
      state: currentState,
      narrative: [
        {
          type: 'narrative',
          content: `[事件 "${event.title ?? eventId}" 的前提条件未满足]`,
        },
      ],
      availableChoices: [],
      triggeredBadEnd: null,
      identityShift: null,
    };
  }

  // 2. Handle entry narrative
  if (event.entryNarrative) {
    narrative.push({
      type: 'narrative',
      content: event.entryNarrative,
      speaker: event.entrySpeaker,
    });
  }

  // 3. Handle branch structure (if any)
  const branchResult = handleBranchStructure(event, currentState);
  currentState = branchResult.state;
  narrative.push(...branchResult.narrative);

  // 4. Handle automatic identity shifts
  const identityResult = handleIdentityShift(event, currentState);
  currentState = identityResult.state;
  if (identityResult.applied) {
    narrative.push(...identityResult.narrative);
  }

  // 5. Apply automatic effects (before choices)
  if (event.autoEffects) {
    currentState = applyAutoEffects(event.autoEffects, currentState);
    if (event.autoEffects.narrative) {
      narrative.push({
        type: 'narrative',
        content: event.autoEffects.narrative,
      });
    }
  }

  // 6. Check bad end
  const badEndResult = handleBadEndCheck(event, currentState);

  // 7. Filter available choices
  const availableChoices = (event.choices ?? []).filter((choice) =>
    evaluateConditionSet(choice.conditions ?? [], currentState),
  );

  return {
    state: currentState,
    narrative,
    availableChoices,
    triggeredBadEnd: badEndResult,
    identityShift: identityResult.shift ?? null,
  };
}

// ─── Condition Evaluation ──────────────────────────────────────────

/**
 * Evaluate a set of conditions against the current state.
 * All conditions must pass (AND logic).
 */
export function evaluateConditionSet(
  conditions: EventCondition[],
  state: GameState,
): boolean {
  return conditions.every((cond) => evaluateCondition(cond, state));
}

/**
 * Evaluate a single condition.
 */
export function evaluateCondition(
  condition: EventCondition,
  state: GameState,
): boolean {
  try {
    switch (condition.type) {
      // ── Flag checks ──
      case 'flag_equals':
        return state.flags[condition.flag!] === condition.value;
      case 'flag_exists':
        return condition.flag! in state.flags;
      case 'flag_gte':
        return (state.flags[condition.flag!] as number) >= (condition.value as number);
      case 'flag_lte':
        return (state.flags[condition.flag!] as number) <= (condition.value as number);

      // ── Stat checks ──
      case 'erosion_gte':
        return state.erosionLevel >= (condition.value as number);
      case 'erosion_lte':
        return state.erosionLevel <= (condition.value as number);
      case 'awareness_gte':
        return state.awarenessLevel >= (condition.value as number);
      case 'awareness_lte':
        return state.awarenessLevel <= (condition.value as number);

      // ── Time checks ──
      case 'day_gte':
        return state.currentDay >= (condition.value as number);
      case 'day_lte':
        return state.currentDay <= (condition.value as number);
      case 'period_equals':
        return state.currentPeriod === condition.value;

      // ── Scene checks ──
      case 'scene_equals':
        return state.currentScene === condition.value;
      case 'scene_explored':
        return state.exploredScenes.includes(condition.value as string);

      // ── Inventory / Item ──
      case 'has_item':
        return state.inventory.some((i) => i.id === condition.value);
      case 'has_clue':
        return state.clues.some((c) => c.id === condition.value);

      // ── NPC ──
      case 'npc_affinity_gte': {
        const [npcId, val] = condition.value as [string, number];
        return (state.npcRelations[npcId]?.affinity ?? 0) >= val;
      }
      case 'npc_affinity_lte': {
        const [npcId, val] = condition.value as [string, number];
        return (state.npcRelations[npcId]?.affinity ?? 0) <= val;
      }
      case 'npc_stage_equals': {
        const [npcId, stage] = condition.value as [string, number];
        return (state.npcRelations[npcId]?.stage ?? 0) === stage;
      }
      case 'npc_met':
        return state.npcRelations[condition.value as string]?.met === true;

      // ── Event history ──
      case 'event_completed':
        return state.completedEvents.includes(condition.value as string);
      case 'event_not_completed':
        return !state.completedEvents.includes(condition.value as string);

      // ── Perception ──
      case 'perception_is':
        return state.perceptionMode === condition.value;

      // ── Erosion stage ──
      case 'erosion_stage_is': {
        const { calculateErosionStage } = require('./erosionEngine');
        return calculateErosionStage(state.erosionLevel) === condition.value;
      }

      // ── Compound ──
      case 'any': {
        return (condition.subConditions ?? []).some((sub: EventCondition) =>
          evaluateCondition(sub, state),
        );
      }
      case 'all': {
        return (condition.subConditions ?? []).every((sub: EventCondition) =>
          evaluateCondition(sub, state),
        );
      }
      case 'not': {
        const sub = condition.subConditions?.[0];
        return sub ? !evaluateCondition(sub, state) : true;
      }

      // ── Custom evaluator ──
      case 'custom': {
        if (condition.evaluator) {
          return condition.evaluator(state);
        }
        return false;
      }

      default:
        return false;
    }
  } catch {
    return false;
  }
}

// ─── Choice Processing ─────────────────────────────────────────────

/**
 * Process a choice selection within an event.
 * Applies choice effects and returns the modified state.
 */
export function processChoices(
  event: GameEvent,
  choiceId: string,
  state: GameState,
): GameState {
  const choice = (event.choices ?? []).find((c) => c.id === choiceId);
  if (!choice) return state;

  let newState = { ...state };

  // Apply flag changes
  if (choice.setFlags) {
    Object.entries(choice.setFlags).forEach(([k, v]) => {
      newState.flags[k] = v;
    });
  }

  // Apply stat changes
  if (choice.erosionChange) {
    newState.erosionLevel = Math.max(
      0,
      Math.min(100, newState.erosionLevel + choice.erosionChange),
    );
  }
  if (choice.awarenessChange) {
    newState.awarenessLevel = Math.max(
      0,
      Math.min(100, newState.awarenessLevel + choice.awarenessChange),
    );
  }

  // Apply NPC affinity changes
  if (choice.npcAffinityChanges) {
    Object.entries(choice.npcAffinityChanges).forEach(([npcId, amount]) => {
      const existing = newState.npcRelations[npcId];
      newState.npcRelations = {
        ...newState.npcRelations,
        [npcId]: {
          affinity: Math.max(-100, Math.min(100, (existing?.affinity ?? 0) + amount)),
          stage: existing?.stage ?? 0,
          flags: { ...(existing?.flags ?? {}) },
          dialogueHistory: [...(existing?.dialogueHistory ?? [])],
          met: true,
        },
      };
    });
  }

  // Apply identity shifts
  if (choice.identityShift) {
    Object.entries(choice.identityShift).forEach(([key, value]) => {
      newState.flags[`identity_${key}`] =
        (newState.flags[`identity_${key}`] ?? 0) + value;
    });
  }

  // Add/remove items
  if (choice.itemsToAdd) {
    newState.inventory = [...newState.inventory, ...choice.itemsToAdd];
  }
  if (choice.itemsToRemove) {
    newState.inventory = newState.inventory.filter(
      (i) => !choice.itemsToRemove!.includes(i.id),
    );
  }

  // Scene transition
  if (choice.nextScene) {
    newState.currentScene = choice.nextScene;
    newState.sceneHistory = [...newState.sceneHistory, choice.nextScene];
  }

  // Mark event as completed
  if (!newState.completedEvents.includes(event.id)) {
    newState.completedEvents = [...newState.completedEvents, event.id];
  }

  return newState;
}

// ─── Branch Handling ───────────────────────────────────────────────

/**
 * Handle the 6 CYOA branch structures for an event.
 *
 * Supported structures:
 * 1. linear        — simple sequential flow
 * 2. choice_branch — player choice determines narrative path
 * 3. condition_branch — automatic branch based on state conditions
 * 4. random_branch — randomized outcome (deterministic via state hash)
 * 5. loop          — repeatable section until exit condition met
 * 6. composite     — combination of multiple structures
 */
export function handleBranchStructure(
  event: GameEvent,
  state: GameState,
): { state: GameState; narrative: NarrativeSegment[] } {
  const narrative: NarrativeSegment[] = [];

  if (!event.branches || event.branches.length === 0) {
    return { state, narrative };
  }

  let currentState = { ...state };

  for (const branch of event.branches) {
    switch (branch.type) {
      case 'linear': {
        // Linear just runs sequentially
        if (branch.narrative) {
          narrative.push({
            type: 'narrative',
            content: branch.narrative,
          });
        }
        break;
      }

      case 'choice_branch': {
        // choice_branch is resolved at the choice level; here we just
        // mark the branch narrative as available context.
        if (branch.description) {
          narrative.push({
            type: 'branch_hint',
            content: branch.description,
          });
        }
        break;
      }

      case 'condition_branch': {
        // Automatically follow the first matching sub-branch
        const matchingSub = (branch.subBranches ?? []).find((sub) =>
          evaluateConditionSet(sub.conditions ?? [], currentState),
        );
        if (matchingSub) {
          if (matchingSub.narrative) {
            narrative.push({
              type: 'narrative',
              content: matchingSub.narrative,
            });
          }
          if (matchingSub.effects) {
            currentState = applyAutoEffects(matchingSub.effects, currentState);
          }
        }
        break;
      }

      case 'random_branch': {
        // Deterministic pseudo-random based on state + branch seed
        const seed =
          (currentState.currentDay * 31 +
            currentState.narrativeLog.length * 17 +
            (branch.seed ?? 0)) %
          100;
        const totalWeight = (branch.subBranches ?? []).reduce(
          (sum, sub) => sum + (sub.weight ?? 1),
          0,
        );
        let cumulative = 0;
        const roll = seed % totalWeight;
        for (const sub of branch.subBranches ?? []) {
          cumulative += sub.weight ?? 1;
          if (roll < cumulative) {
            if (sub.narrative) {
              narrative.push({ type: 'narrative', content: sub.narrative });
            }
            if (sub.effects) {
              currentState = applyAutoEffects(sub.effects, currentState);
            }
            break;
          }
        }
        break;
      }

      case 'loop': {
        // Loop runs while condition is true (max iterations to prevent infinite)
        const maxIterations = branch.maxIterations ?? 10;
        let iterations = 0;
        while (
          iterations < maxIterations &&
          evaluateConditionSet(branch.loopCondition ?? [], currentState)
        ) {
          if (branch.narrative) {
            narrative.push({
              type: 'narrative',
              content: `[循环 #${iterations + 1}] ${branch.narrative}`,
            });
          }
          if (branch.loopEffects) {
            currentState = applyAutoEffects(branch.loopEffects, currentState);
          }
          iterations++;
        }
        break;
      }

      case 'composite': {
        // Composite: recursively handle nested branches
        const childResult = handleBranchStructure(
          { ...event, branches: branch.subBranches ?? [] },
          currentState,
        );
        currentState = childResult.state;
        narrative.push(...childResult.narrative);
        break;
      }
    }
  }

  return { state: currentState, narrative };
}

// ─── Identity Shift ────────────────────────────────────────────────

/**
 * Apply identity shift effects from an event.
 */
export function handleIdentityShift(
  event: GameEvent,
  state: GameState,
): { state: GameState; applied: boolean; shift?: IdentityShift; narrative: NarrativeSegment[] } {
  const narrative: NarrativeSegment[] = [];

  if (!event.identityShift) {
    return { state, applied: false, narrative };
  }

  const shift = event.identityShift;
  let newState = { ...state };

  // Apply domain shifts
  if (shift.domains) {
    Object.entries(shift.domains).forEach(([domain, delta]) => {
      const key = `identity_${domain}`;
      newState.flags[key] = (newState.flags[key] ?? 0) + delta;
    });
  }

  // Apply consciousness merge
  if (shift.consciousnessMerge) {
    newState.flags['consciousness_merge'] =
      (newState.flags['consciousness_merge'] ?? 0) + shift.consciousnessMerge;
  }

  // Apply memory bleed
  if (shift.memoryBleed) {
    newState.flags['memory_bleed'] =
      (newState.flags['memory_bleed'] ?? 0) + shift.memoryBleed;
  }

  // Narrative output
  if (shift.narrative) {
    narrative.push({
      type: 'identity_shift',
      content: shift.narrative,
    });
  } else if (shift.domains) {
    const domainEntries = Object.entries(shift.domains).filter(
      ([, v]) => v !== 0,
    );
    if (domainEntries.length > 0) {
      const desc = domainEntries
        .map(([d, v]) => `${d}: ${v > 0 ? '+' : ''}${v}`)
        .join(', ');
      narrative.push({
        type: 'identity_shift',
        content: `身份偏移 — ${desc}`,
      });
    }
  }

  return { state: newState, applied: true, shift, narrative };
}

// ─── Bad End Check ─────────────────────────────────────────────────

/**
 * Check if the event triggers a bad end.
 */
export function handleBadEndCheck(
  event: GameEvent,
  state: GameState,
): string | null {
  if (!event.badEndCheck) return null;

  const conditions = event.badEndCheck.conditions;
  if (evaluateConditionSet(conditions, state)) {
    return event.badEndCheck.badEndId ?? 'generic_bad_end';
  }

  return null;
}

// ─── Auto Effects ──────────────────────────────────────────────────

function applyAutoEffects(
  effects: GameEvent['autoEffects'],
  state: GameState,
): GameState {
  if (!effects) return state;

  let newState = { ...state };

  if (effects.erosionChange) {
    newState.erosionLevel = Math.max(
      0,
      Math.min(100, newState.erosionLevel + effects.erosionChange),
    );
  }
  if (effects.awarenessChange) {
    newState.awarenessLevel = Math.max(
      0,
      Math.min(100, newState.awarenessLevel + effects.awarenessChange),
    );
  }
  if (effects.setFlags) {
    Object.entries(effects.setFlags).forEach(([k, v]) => {
      newState.flags[k] = v;
    });
  }
  if (effects.switchPerception) {
    newState.perceptionMode =
      newState.perceptionMode === 'resident' ? 'truth' : 'resident';
  }

  return newState;
}
