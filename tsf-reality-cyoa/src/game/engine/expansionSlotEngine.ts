import type {
  ExpansionModule,
  ExpansionSlot,
  ExpansionHookType,
  ExpansionHookResult,
  ExpansionManifest,
  SlotReservation,
  GameState,
  GameAction,
} from './types';

// ─── Constants ──────────────────────────────────────────────────────

const MAX_SLOTS_PER_CATEGORY = 10;

// ─── ExpansionSlotManager ──────────────────────────────────────────

/**
 * Manages expansion modules (DLC-style content) for the TSF Reality CYOA.
 *
 * Expansion modules can:
 * - Register hooks into game events (scene transitions, time advances, etc.)
 * - Add new items, NPCs, scenes, and events to the game
 * - Modify existing game behavior through hook interception
 * - Reserve slots for future content
 *
 * Each module declares a version and its compatible game version range.
 */
export class ExpansionSlotManager {
  private slots: Map<string, ExpansionSlot> = new Map();
  private modules: Map<string, ExpansionModule> = new Map();
  private reservations: Map<string, SlotReservation> = new Map();

  // ─── Module Registration ───────────────────────────────────────

  /**
   * Register an expansion module.
   * Validates version compatibility and slot availability.
   *
   * @returns The slot ID if registration succeeded, or throws on error.
   */
  register(module: ExpansionModule): string {
    // 1. Validate manifest
    if (!this.validateManifest(module.manifest)) {
      throw new Error(
        `扩展模块 "${module.id}" 清单验证失败。`,
      );
    }

    // 2. Check version compatibility
    if (!this.checkGameVersion(module.manifest)) {
      throw new Error(
        `扩展模块 "${module.id}" (v${module.manifest.version}) ` +
          `与游戏版本不兼容 (需要: ${module.manifest.compatibleGameVersion ?? '*'})。`,
      );
    }

    // 3. Check for duplicate
    if (this.modules.has(module.id)) {
      throw new Error(
        `扩展模块 "${module.id}" 已经注册。请先卸载后再重新注册。`,
      );
    }

    // 4. Check slot availability
    const category = module.manifest.category ?? 'general';
    const existingSlots = Array.from(this.slots.values()).filter(
      (s) => s.category === category,
    );
    if (existingSlots.length >= MAX_SLOTS_PER_CATEGORY) {
      throw new Error(
        `类别 "${category}" 的插槽已满 (上限 ${MAX_SLOTS_PER_CATEGORY})。` +
          `无法注册模块 "${module.id}"。`,
      );
    }

    // 5. Create slot
    const slotId = `slot_${module.id}_${Date.now()}`;
    const slot: ExpansionSlot = {
      id: slotId,
      moduleId: module.id,
      category,
      priority: module.manifest.priority ?? 0,
      active: true,
      registeredAt: Date.now(),
    };

    this.slots.set(slotId, slot);
    this.modules.set(module.id, module);

    return slotId;
  }

  /**
   * Unregister an expansion module and release its slot.
   */
  unregister(moduleId: string): boolean {
    const module = this.modules.get(moduleId);
    if (!module) return false;

    // Run cleanup hooks if any
    if (module.hooks?.onUnregister) {
      try {
        module.hooks.onUnregister();
      } catch {
        // Cleanup errors are non-fatal
      }
    }

    // Remove slot
    for (const [slotId, slot] of this.slots) {
      if (slot.moduleId === moduleId) {
        this.slots.delete(slotId);
      }
    }

    return this.modules.delete(moduleId);
  }

  /**
   * Get a registered module by ID.
   */
  getModule<T extends ExpansionModule = ExpansionModule>(id: string): T | undefined {
    return this.modules.get(id) as T | undefined;
  }

  /**
   * Get the slot for a given module.
   */
  getSlot(moduleId: string): ExpansionSlot | undefined {
    for (const slot of this.slots.values()) {
      if (slot.moduleId === moduleId) return slot;
    }
    return undefined;
  }

  /**
   * Check if a module is registered and active.
   */
  isActive(moduleId: string): boolean {
    const slot = this.getSlot(moduleId);
    return slot?.active === true;
  }

  /**
   * Get all registered modules.
   */
  getAllModules(): ExpansionModule[] {
    return Array.from(this.modules.values());
  }

  /**
   * Get all active expansion slots.
   */
  getAllSlots(): ExpansionSlot[] {
    return Array.from(this.slots.values()).filter((s) => s.active);
  }

  /**
   * Get modules by category.
   */
  getModulesByCategory(category: string): ExpansionModule[] {
    return Array.from(this.modules.values()).filter(
      (m) => m.manifest.category === category,
    );
  }

  // ─── Hook Dispatch ─────────────────────────────────────────────

  /**
   * Dispatch a hook call to all registered expansion modules.
   * Modules are called in priority order (higher priority first).
   *
   * @param hookType  The type of hook to trigger
   * @param args      Arguments to pass to the hook handlers
   * @returns Array of hook results from each module
   */
  dispatchHooks(
    hookType: ExpansionHookType,
    ...args: unknown[]
  ): ExpansionHookResult[] {
    const results: ExpansionHookResult[] = [];

    // Get modules sorted by priority (descending)
    const sortedSlots = Array.from(this.slots.values())
      .filter((s) => s.active)
      .sort((a, b) => b.priority - a.priority);

    for (const slot of sortedSlots) {
      const module = this.modules.get(slot.moduleId);
      if (!module?.hooks) continue;

      let handler: ((...args: unknown[]) => ExpansionHookResult) | undefined;

      switch (hookType) {
        case 'onSceneEnter':
          handler = module.hooks.onSceneEnter as (...args: unknown[]) => ExpansionHookResult;
          break;
        case 'onTimeAdvance':
          handler = module.hooks.onTimeAdvance as (...args: unknown[]) => ExpansionHookResult;
          break;
        case 'onChoiceMade':
          handler = module.hooks.onChoiceMade as (...args: unknown[]) => ExpansionHookResult;
          break;
        case 'onErosionChange':
          handler = module.hooks.onErosionChange as (...args: unknown[]) => ExpansionHookResult;
          break;
        case 'onPerceptionSwitch':
          handler = module.hooks.onPerceptionSwitch as (...args: unknown[]) => ExpansionHookResult;
          break;
        case 'onNpcInteract':
          handler = module.hooks.onNpcInteract as (...args: unknown[]) => ExpansionHookResult;
          break;
        case 'onItemUsed':
          handler = module.hooks.onItemUsed as (...args: unknown[]) => ExpansionHookResult;
          break;
        case 'onGameSave':
          handler = module.hooks.onGameSave as (...args: unknown[]) => ExpansionHookResult;
          break;
        case 'onGameLoad':
          handler = module.hooks.onGameLoad as (...args: unknown[]) => ExpansionHookResult;
          break;
        case 'onBadEnd':
          handler = module.hooks.onBadEnd as (...args: unknown[]) => ExpansionHookResult;
          break;
        case 'onCustom':
          handler = module.hooks.onCustom as (...args: unknown[]) => ExpansionHookResult;
          break;
      }

      if (handler) {
        try {
          const result = handler(...args);
          results.push({
            moduleId: module.id,
            moduleName: module.manifest.name,
            hookType,
            result,
            halted: result?.halted ?? false,
          });

          // If a module halts execution, stop dispatching
          if (result?.halted) break;
        } catch (err) {
          results.push({
            moduleId: module.id,
            moduleName: module.manifest.name,
            hookType,
            result: null,
            error: `Hook error: ${err}`,
            halted: false,
          });
        }
      }
    }

    return results;
  }

  /**
   * Dispatch hooks and apply their state mutations.
   * Convenience method for common hook types.
   */
  dispatchAndApply(
    hookType: ExpansionHookType,
    state: GameState,
    dispatch: React.Dispatch<GameAction>,
    ...args: unknown[]
  ): ExpansionHookResult[] {
    const results = this.dispatchHooks(hookType, state, dispatch, ...args);

    for (const result of results) {
      if (result.error) {
        console.error(
          `[ExpansionSlotManager] 模块 "${result.moduleName}" 钩子错误:`,
          result.error,
        );
        continue;
      }

      // If the result returned actions, dispatch them
      if (result.result?.actions) {
        for (const action of result.result.actions) {
          dispatch(action);
        }
      }
    }

    return results;
  }

  // ─── Slot Reservation ──────────────────────────────────────────

  /**
   * Reserve a slot for a future expansion module.
   * Useful for DLC planning and content scheduling.
   */
  reserveSlot(reservation: SlotReservation): string {
    const id = `reservation_${reservation.moduleId}_${Date.now()}`;
    this.reservations.set(id, { ...reservation, id });
    return id;
  }

  /**
   * Release a slot reservation.
   */
  releaseReservation(reservationId: string): boolean {
    return this.reservations.delete(reservationId);
  }

  /**
   * Get all slot reservations.
   */
  getReservations(): SlotReservation[] {
    return Array.from(this.reservations.values());
  }

  /**
   * Get pending (unfulfilled) reservations.
   */
  getPendingReservations(): SlotReservation[] {
    return Array.from(this.reservations.values()).filter(
      (r) => !r.fulfilled,
    );
  }

  /**
   * Mark a reservation as fulfilled.
   */
  fulfillReservation(reservationId: string): boolean {
    const reservation = this.reservations.get(reservationId);
    if (!reservation) return false;
    reservation.fulfilled = true;
    return true;
  }

  // ─── Version Checking ──────────────────────────────────────────

  /**
   * Compare two semantic version strings.
   * Returns -1 if v1 < v2, 0 if equal, 1 if v1 > v2.
   */
  compareVersions(v1: string, v2: string): number {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);
    const maxLen = Math.max(parts1.length, parts2.length);

    for (let i = 0; i < maxLen; i++) {
      const p1 = parts1[i] ?? 0;
      const p2 = parts2[i] ?? 0;
      if (p1 < p2) return -1;
      if (p1 > p2) return 1;
    }
    return 0;
  }

  /**
   * Check if the module version matches the compatible game version string.
   * Supports: "1.0.0", ">=1.0.0", "^1.0.0", "~1.0.0", "1.0.0 - 2.0.0"
   */
  checkGameVersion(manifest: ExpansionManifest): boolean {
    // Placeholder: always returns true.
    // In a real implementation this would check against the game's current version.
    return true;
  }

  /**
   * Validate an expansion module's manifest.
   */
  private validateManifest(manifest: ExpansionManifest): boolean {
    if (!manifest.id || typeof manifest.id !== 'string') return false;
    if (!manifest.name || typeof manifest.name !== 'string') return false;
    if (!manifest.version || typeof manifest.version !== 'string') return false;

    // Version must be semver-like
    const versionPattern = /^\d+\.\d+\.\d+$/;
    if (!versionPattern.test(manifest.version)) return false;

    return true;
  }

  // ─── Module Querying ───────────────────────────────────────────

  /**
   * Find modules that provide a specific content type.
   */
  findModulesByContent(contentType: string): ExpansionModule[] {
    return Array.from(this.modules.values()).filter(
      (m) => m.providedContent?.includes(contentType),
    );
  }

  /**
   * Get combined provided content types from all active modules.
   */
  getAllProvidedContent(): string[] {
    const content = new Set<string>();
    for (const module of this.modules.values()) {
      if (module.providedContent) {
        for (const type of module.providedContent) {
          content.add(type);
        }
      }
    }
    return Array.from(content);
  }

  /**
   * Toggle module activation state.
   */
  setModuleActive(moduleId: string, active: boolean): boolean {
    const slot = this.getSlot(moduleId);
    if (!slot) return false;
    slot.active = active;
    return true;
  }

  // ─── State Management ──────────────────────────────────────────

  /**
   * Serialize the current manager state for persistence.
   */
  serialize(): SerializedSlotState {
    return {
      slots: Array.from(this.slots.values()),
      moduleIds: Array.from(this.modules.keys()),
      reservations: Array.from(this.reservations.values()),
    };
  }

  /**
   * Deserialize and restore manager state.
   * Note: modules themselves need to be re-registered externally.
   */
  deserialize(data: SerializedSlotState): void {
    this.slots.clear();
    for (const slot of data.slots) {
      this.slots.set(slot.id, slot);
    }
    this.reservations.clear();
    for (const res of data.reservations) {
      this.reservations.set(res.id ?? `res_${res.moduleId}_${Date.now()}`, res);
    }
  }
}

// ─── Serialization Type ────────────────────────────────────────────

interface SerializedSlotState {
  slots: ExpansionSlot[];
  moduleIds: string[];
  reservations: SlotReservation[];
}

// ─── Factory ────────────────────────────────────────────────────────

/**
 * Create a new ExpansionSlotManager instance.
 */
export function createExpansionSlotManager(): ExpansionSlotManager {
  return new ExpansionSlotManager();
}

/**
 * Create a basic expansion module skeleton for development.
 */
export function createExpansionModule(params: {
  id: string;
  name: string;
  version: string;
  author?: string;
  description?: string;
  category?: string;
  priority?: number;
  compatibleGameVersion?: string;
  hooks?: ExpansionModule['hooks'];
  providedContent?: string[];
}): ExpansionModule {
  return {
    id: params.id,
    manifest: {
      id: params.id,
      name: params.name,
      version: params.version,
      author: params.author,
      description: params.description,
      category: params.category ?? 'general',
      priority: params.priority ?? 0,
      compatibleGameVersion: params.compatibleGameVersion ?? '>=1.0.0',
    },
    hooks: params.hooks ?? {},
    providedContent: params.providedContent,
  };
}
