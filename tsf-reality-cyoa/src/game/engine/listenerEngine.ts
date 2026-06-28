import type {
  GameState,
  ListenerRegistration,
  ListenerResult,
  ListenerEffect,
  TSFTriggerItem,
  TSFTriggerContext,
  ListenerType,
  NarrativeEntry,
} from './types';

// ─── Types ──────────────────────────────────────────────────────────

type ListenerCallback = (
  context: TSFTriggerContext,
  state: GameState,
) => ListenerResult;

interface InternalListener {
  id: string;
  name: string;
  type: ListenerType;
  priority: number;
  condition?: (context: TSFTriggerContext, state: GameState) => boolean;
  effect: ListenerEffect | ListenerCallback;
  oneShot: boolean;
  triggered: boolean;
  cooldownPeriods: number;
  lastTriggeredDay: number;
  lastTriggeredPeriod: string;
}

// ─── ListenerManager ───────────────────────────────────────────────

/**
 * Manages TSF trigger listeners.
 *
 * Listeners watch for specific in-game events (scene changes, erosion
 * thresholds, item usage, etc.) and can automatically apply effects
 * when conditions are met.
 */
export class ListenerManager {
  private listeners: Map<string, InternalListener> = new Map();
  private nextId: number = 0;

  /**
   * Create a new ListenerManager, optionally restoring from saved data.
   */
  constructor(savedListeners?: ListenerRegistration[]) {
    if (savedListeners) {
      this.restoreListeners(savedListeners);
    }
  }

  // ─── Registration ─────────────────────────────────────────────

  /**
   * Register a new listener.
   *
   * @returns The unique ID of the registered listener.
   */
  register(params: {
    name: string;
    type: ListenerType;
    priority?: number;
    condition?: (context: TSFTriggerContext, state: GameState) => boolean;
    effect: ListenerEffect | ListenerCallback;
    oneShot?: boolean;
    cooldownPeriods?: number;
  }): string {
    const id = `listener_${this.nextId++}_${Date.now()}`;
    const listener: InternalListener = {
      id,
      name: params.name,
      type: params.type,
      priority: params.priority ?? 0,
      condition: params.condition,
      effect: params.effect,
      oneShot: params.oneShot ?? false,
      triggered: false,
      cooldownPeriods: params.cooldownPeriods ?? 0,
      lastTriggeredDay: -1,
      lastTriggeredPeriod: '',
    };
    this.listeners.set(id, listener);
    return id;
  }

  /**
   * Unregister a listener by its ID.
   */
  unregister(id: string): boolean {
    return this.listeners.delete(id);
  }

  /**
   * Get a registered listener by ID.
   */
  get(id: string): ListenerRegistration | undefined {
    const listener = this.listeners.get(id);
    if (!listener) return undefined;
    return this.toRegistration(listener);
  }

  /**
   * Get all registered listeners.
   */
  getAll(): ListenerRegistration[] {
    return Array.from(this.listeners.values()).map((l) => this.toRegistration(l));
  }

  // ─── TSFTriggerItem Registration ───────────────────────────────

  /**
   * Automatically create a listener from a TSFTriggerItem.
   *
   * The listener watches for the item's trigger conditions and
   * activates the item's TSF effects when met.
   *
   * @returns The listener ID.
   */
  registerItemTrigger(item: TSFTriggerItem): string {
    return this.register({
      name: `TSF Item: ${item.name ?? item.id}`,
      type: item.triggerType ?? 'item_use',
      priority: item.triggerPriority ?? 50,
      condition: (context, state) => {
        // Check if the item is in inventory
        if (!state.inventory.some((i) => i.id === item.id)) return false;

        // Check trigger-specific conditions
        switch (item.triggerCondition?.type) {
          case 'erosion_threshold':
            return state.erosionLevel >= (item.triggerCondition.value as number);
          case 'awareness_threshold':
            return state.awarenessLevel >= (item.triggerCondition.value as number);
          case 'scene_enter':
            return context.sceneId === item.triggerCondition.value;
          case 'time_period':
            return context.period === item.triggerCondition.value;
          case 'day_threshold':
            return state.currentDay >= (item.triggerCondition.value as number);
          case 'perception_mode':
            return state.perceptionMode === item.triggerCondition.value;
          case 'flag_check':
            return (
              item.triggerCondition.flag
                ? state.flags[item.triggerCondition.flag] === item.triggerCondition.value
                : false
            );
          default:
            return true;
        }
      },
      effect: {
        erosionChange: item.erosionOnUse ?? 5,
        awarenessChange: item.awarenessOnUse ?? 2,
        setFlags: {
          ...(item.setFlagsOnUse ?? {}),
          [`tsf_item_triggered_${item.id}`]: true,
        },
        switchPerception: item.triggerPerceptionShift ?? false,
      },
      oneShot: item.oneShotTrigger ?? true,
      cooldownPeriods: item.cooldownPeriods ?? 0,
    });
  }

  // ─── Dispatch ─────────────────────────────────────────────────

  /**
   * Dispatch an event type to all matching listeners.
   * Listeners are evaluated in priority order (highest first).
   *
   * @returns Array of triggered listener results.
   */
  dispatch(
    type: ListenerType,
    context: TSFTriggerContext,
    state: GameState,
  ): ListenerResult[] {
    const results: ListenerResult[] = [];

    // Get matching listeners sorted by priority descending
    const candidates = Array.from(this.listeners.values())
      .filter((l) => l.type === type && !l.triggered)
      .sort((a, b) => b.priority - a.priority);

    for (const listener of candidates) {
      // Check cooldown
      if (this.isOnCooldown(listener, state)) continue;

      // Check condition
      if (listener.condition && !listener.condition(context, state)) continue;

      // Evaluate effect
      const result = this.evaluateListener(listener, context, state);
      if (result.triggered) {
        results.push(result);

        // Handle one-shot listeners
        if (listener.oneShot) {
          listener.triggered = true;
        }

        // Update cooldown
        listener.lastTriggeredDay = state.currentDay;
        listener.lastTriggeredPeriod = state.currentPeriod;
      }
    }

    return results;
  }

  // ─── Check & Trigger ──────────────────────────────────────────

  /**
   * Convenience method: check all listener types against the current
   * context and state, and return all triggered results.
   *
   * Useful for periodic checks (e.g., after time advance).
   */
  checkAndTrigger(
    state: GameState,
    context: Partial<TSFTriggerContext> = {},
  ): ListenerResult[] {
    const fullContext: TSFTriggerContext = {
      type: 'system',
      sceneId: state.currentScene,
      period: state.currentPeriod,
      day: state.currentDay,
      erosionLevel: state.erosionLevel,
      awarenessLevel: state.awarenessLevel,
      perceptionMode: state.perceptionMode,
      ...context,
    };

    const results: ListenerResult[] = [];

    // Check all listener types
    const typesToCheck: ListenerType[] = [
      'system',
      'erosion_threshold',
      'scene_enter',
      'item_use',
      'time_passage',
      'npc_interaction',
      'awareness_threshold',
      'perception_shift',
    ];

    for (const type of typesToCheck) {
      const typeResults = this.dispatch(type, fullContext, state);
      results.push(...typeResults);
    }

    return results;
  }

  // ─── Persistence ──────────────────────────────────────────────

  /**
   * Serialize all listeners for save data.
   */
  persistListeners(state: GameState): ListenerRegistration[] {
    return Array.from(this.listeners.values()).map((l) => this.toRegistration(l));
  }

  /**
   * Restore listeners from saved data.
   */
  restoreListeners(data: ListenerRegistration[]): void {
    this.listeners.clear();
    for (const reg of data) {
      const listener: InternalListener = {
        id: reg.id,
        name: reg.name,
        type: reg.type,
        priority: reg.priority ?? 0,
        condition: reg.condition,
        effect: reg.effect,
        oneShot: reg.oneShot ?? false,
        triggered: reg.triggered ?? false,
        cooldownPeriods: reg.cooldownPeriods ?? 0,
        lastTriggeredDay: reg.lastTriggeredDay ?? -1,
        lastTriggeredPeriod: reg.lastTriggeredPeriod ?? '',
      };
      this.listeners.set(reg.id, listener);
    }
  }

  // ─── Management ───────────────────────────────────────────────

  /**
   * Remove all triggered one-shot listeners.
   */
  cleanTriggered(): void {
    for (const [id, listener] of this.listeners) {
      if (listener.oneShot && listener.triggered) {
        this.listeners.delete(id);
      }
    }
  }

  /**
   * Get the total count of registered listeners.
   */
  get count(): number {
    return this.listeners.size;
  }

  /**
   * Get count of active (non-triggered) listeners.
   */
  get activeCount(): number {
    return Array.from(this.listeners.values()).filter((l) => !l.triggered).length;
  }

  // ─── Internal ─────────────────────────────────────────────────

  private evaluateListener(
    listener: InternalListener,
    context: TSFTriggerContext,
    state: GameState,
  ): ListenerResult {
    // If effect is a callback, call it
    if (typeof listener.effect === 'function') {
      try {
        const callback = listener.effect as ListenerCallback;
        return callback(context, state);
      } catch (err) {
        return {
          listenerId: listener.id,
          listenerName: listener.name,
          triggered: false,
          narrative: `[监听器错误] ${listener.name}: ${err}`,
        };
      }
    }

    // Otherwise, effect is a ListenerEffect object
    const effect = listener.effect as ListenerEffect;
    return {
      listenerId: listener.id,
      listenerName: listener.name,
      triggered: true,
      effects: effect,
      narrative: effect.narrative ?? `[触发] ${listener.name}`,
    };
  }

  private isOnCooldown(listener: InternalListener, state: GameState): boolean {
    if (listener.cooldownPeriods <= 0) return false;
    if (listener.lastTriggeredDay < 0) return false;

    const periodsSinceLastTrigger =
      (state.currentDay - listener.lastTriggeredDay) * 4 +
      this.periodOffset(state.currentPeriod) -
      this.periodOffset(listener.lastTriggeredPeriod as any);

    return periodsSinceLastTrigger < listener.cooldownPeriods;
  }

  private periodOffset(period: string): number {
    const map: Record<string, number> = {
      morning: 0,
      afternoon: 1,
      evening: 2,
      night: 3,
    };
    return map[period] ?? 0;
  }

  private toRegistration(listener: InternalListener): ListenerRegistration {
    return {
      id: listener.id,
      name: listener.name,
      type: listener.type,
      priority: listener.priority,
      condition: listener.condition,
      effect: listener.effect as ListenerEffect,
      oneShot: listener.oneShot,
      triggered: listener.triggered,
      cooldownPeriods: listener.cooldownPeriods,
      lastTriggeredDay: listener.lastTriggeredDay,
      lastTriggeredPeriod: listener.lastTriggeredPeriod,
    };
  }
}

// ─── Factory Function ──────────────────────────────────────────────

/**
 * Create a new ListenerManager, optionally loaded with saved listener data.
 */
export function createListenerManager(
  savedListeners?: ListenerRegistration[],
): ListenerManager {
  return new ListenerManager(savedListeners);
}

/**
 * Apply all listener results to a game state.
 * Returns the modified state.
 */
export function applyListenerResults(
  state: GameState,
  results: ListenerResult[],
): GameState {
  let newState = { ...state };

  for (const result of results) {
    if (!result.triggered || !result.effects) continue;

    if (result.effects.erosionChange) {
      newState.erosionLevel = Math.max(
        0,
        Math.min(100, newState.erosionLevel + result.effects.erosionChange),
      );
    }
    if (result.effects.awarenessChange) {
      newState.awarenessLevel = Math.max(
        0,
        Math.min(100, newState.awarenessLevel + result.effects.awarenessChange),
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

    if (result.narrative) {
      newState.narrativeLog.push({
        type: 'listener',
        content: result.narrative,
        day: state.currentDay,
        period: state.currentPeriod,
        timestamp: Date.now(),
      });
    }
  }

  return newState;
}
