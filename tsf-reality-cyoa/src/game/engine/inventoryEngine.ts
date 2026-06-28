import type {
  GameState,
  InventoryItem,
  Clue,
  ClueLink,
  ItemEffect,
  NarrativeEntry,
  ClueConnectionGraph,
  ClueConnectionNode,
  ClueConnectionEdge,
} from './types';

// ─── Constants ──────────────────────────────────────────────────────

const DEFAULT_MAX_INVENTORY = 20;

// ─── Item Addition ─────────────────────────────────────────────────

/**
 * Add an item to the player's inventory.
 * Handles stacking, capacity limits, and duplicate prevention.
 *
 * @returns New GameState with the item added (or stacked).
 *          If inventory is full, logs a warning narrative entry.
 */
export function addItem(state: GameState, item: InventoryItem): GameState {
  const inventory = [...state.inventory];
  const quantity = item.quantity ?? 1;

  // 1. Try stacking with existing items
  if (item.stackable) {
    const existingIdx = inventory.findIndex(
      (i) => i.id === item.id && i.stackable,
    );
    if (existingIdx !== -1) {
      inventory[existingIdx] = {
        ...inventory[existingIdx],
        quantity: (inventory[existingIdx].quantity ?? 1) + quantity,
      };
      return {
        ...state,
        inventory,
        narrativeLog: addNarrative(
          state,
          `获得了 ${item.name ?? item.id} x${quantity}` +
            ` (现有: ${inventory[existingIdx].quantity})`,
          'item',
        ),
      };
    }
  }

  // 2. Check capacity
  if (inventory.length >= (state.maxInventorySize ?? DEFAULT_MAX_INVENTORY)) {
    return {
      ...state,
      narrativeLog: addNarrative(
        state,
        `背包已满！无法拾取 ${item.name ?? item.id}。请先丢弃一些物品。`,
        'system',
      ),
    };
  }

  // 3. Add new item
  inventory.push({ ...item, quantity });
  return {
    ...state,
    inventory,
    narrativeLog: addNarrative(
      state,
      `获得了 ${item.name ?? item.id}`,
      'item',
    ),
  };
}

/**
 * Add multiple items at once.
 */
export function addItems(state: GameState, items: InventoryItem[]): GameState {
  return items.reduce((currentState, item) => addItem(currentState, item), state);
}

// ─── Item Removal ──────────────────────────────────────────────────

/**
 * Remove an item (or quantity) from inventory.
 * Automatically unequips if the item is currently equipped.
 *
 * @returns New GameState with the item removed/deducted.
 */
export function removeItem(
  state: GameState,
  itemId: string,
  quantity: number = 1,
): GameState {
  const itemIdx = state.inventory.findIndex((i) => i.id === itemId);
  if (itemIdx === -1) return state; // Item not found

  const inventory = [...state.inventory];
  const item = inventory[itemIdx];

  // Handle stackable items
  if (item.stackable && (item.quantity ?? 1) > quantity) {
    inventory[itemIdx] = { ...item, quantity: (item.quantity ?? 1) - quantity };
  } else {
    inventory.splice(itemIdx, 1);
  }

  // Unequip if needed
  const equippedItems = { ...state.equippedItems };
  for (const [slot, equippedId] of Object.entries(equippedItems)) {
    if (equippedId === itemId) {
      delete equippedItems[slot];
    }
  }

  return {
    ...state,
    inventory,
    equippedItems,
    narrativeLog: addNarrative(
      state,
      `丢弃了 ${item.name ?? item.id}`,
      'item',
    ),
  };
}

// ─── Item Equipping ────────────────────────────────────────────────

/**
 * Equip an item into a specific equipment slot.
 * Automatically unequips any item currently in the slot.
 *
 * @returns New GameState with updated equipment and stat changes applied.
 */
export function equipItem(
  state: GameState,
  itemId: string,
  slot: string,
): GameState {
  const item = state.inventory.find((i) => i.id === itemId);
  if (!item) return state; // Item not in inventory
  if (!item.equippable) return state; // Not equippable
  if (!item.equipSlot || !item.equipSlot.includes(slot)) {
    return state; // Invalid slot for this item
  }

  const equippedItems = { ...state.equippedItems };
  const narrativeEntries: string[] = [];

  // Unequip existing item in the slot
  const existingItemId = equippedItems[slot];
  if (existingItemId) {
    equippedItems[slot] = itemId;
    narrativeEntries.push(
      `将 ${item.name ?? item.id} 装备到 ${slot} 槽位 (替换了 ${existingItemId})`,
    );
  } else {
    equippedItems[slot] = itemId;
    narrativeEntries.push(`将 ${item.name ?? item.id} 装备到 ${slot} 槽位`);
  }

  return {
    ...state,
    equippedItems,
    narrativeLog: addNarrative(state, narrativeEntries.join('；'), 'item'),
  };
}

/**
 * Unequip an item from a specific slot.
 * The item stays in inventory.
 */
export function unequipItem(state: GameState, slot: string): GameState {
  const equippedItems = { ...state.equippedItems };
  const itemId = equippedItems[slot];
  if (!itemId) return state; // Nothing equipped in this slot

  delete equippedItems[slot];
  return {
    ...state,
    equippedItems,
    narrativeLog: addNarrative(state, `从 ${slot} 槽位卸下了装备`, 'item'),
  };
}

// ─── Item Usage ────────────────────────────────────────────────────

/**
 * Use a consumable item from inventory.
 * Applies the item's effects (stat changes, flag changes, perception shifts).
 *
 * @returns New GameState with effects applied and item consumed (if consumable).
 */
export function useItem(
  state: GameState,
  itemId: string,
): GameState {
  const itemIdx = state.inventory.findIndex((i) => i.id === itemId);
  if (itemIdx === -1) return state; // Item not found

  const item = state.inventory[itemIdx];
  if (!item.useable) return state; // Item is not usable

  let newState = { ...state };

  // Apply item effects
  if (item.effects) {
    newState = applyItemEffects(newState, item.effects);
  }

  // Consume item if single-use
  if (item.consumeOnUse) {
    newState = removeItem(newState, itemId, 1);
  }

  // Add usage narrative
  newState.narrativeLog = addNarrative(
    newState,
    `使用了 ${item.name ?? item.id}`,
    'item',
  );

  return newState;
}

function applyItemEffects(state: GameState, effects: ItemEffect): GameState {
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
  if (effects.healErosion) {
    newState.erosionLevel = Math.max(
      0,
      newState.erosionLevel - effects.healErosion,
    );
  }
  if (effects.addItems) {
    for (const newItem of effects.addItems) {
      const result = addItem(newState, newItem);
      newState = result;
    }
  }

  return newState;
}

// ─── Clue System ───────────────────────────────────────────────────

/**
 * Add a clue to the player's clue collection.
 * If the clue already exists, merges fragments.
 */
export function addClue(state: GameState, clue: Clue): GameState {
  const existingIdx = state.clues.findIndex((c) => c.id === clue.id);
  const clues = [...state.clues];

  if (existingIdx !== -1) {
    // Merge fragments
    const existing = clues[existingIdx];
    clues[existingIdx] = {
      ...existing,
      ...clue,
      fragments: [
        ...new Set([...(existing.fragments ?? []), ...(clue.fragments ?? [])]),
      ],
    };
  } else {
    clues.push(clue);
  }

  return {
    ...state,
    clues,
    narrativeLog: addNarrative(
      state,
      `获得了新线索: ${clue.title ?? clue.id}` +
        (existingIdx !== -1 ? ' (补充了新信息)' : ''),
      'clue',
    ),
  };
}

/**
 * Add multiple clues at once.
 */
export function addClues(state: GameState, clues: Clue[]): GameState {
  return clues.reduce((s, c) => addClue(s, c), state);
}

/**
 * Remove a clue from the collection.
 */
export function removeClue(state: GameState, clueId: string): GameState {
  const clues = state.clues.filter((c) => c.id !== clueId);
  if (clues.length === state.clues.length) return state;

  // Also remove any links involving this clue
  const clueLinks = state.clueLinks.filter(
    (l) => l.sourceId !== clueId && l.targetId !== clueId,
  );

  return { ...state, clues, clueLinks };
}

// ─── Clue Linking ──────────────────────────────────────────────────

/**
 * Link two clues together, forming a connection in the clue graph.
 * Both clues must exist in the collection.
 *
 * @returns New GameState with the link added (or error narrative).
 */
export function linkClues(
  state: GameState,
  clueIds: [string, string],
): GameState {
  const [idA, idB] = clueIds;
  const aExists = state.clues.some((c) => c.id === idA);
  const bExists = state.clues.some((c) => c.id === idB);

  if (!aExists || !bExists) {
    return {
      ...state,
      narrativeLog: addNarrative(
        state,
        `无法连接线索: 未找到 ${!aExists ? idA : ''}${!aExists && !bExists ? ' 和 ' : ''}${!bExists ? idB : ''}`,
        'system',
      ),
    };
  }

  // Check for existing link
  const alreadyLinked = state.clueLinks.some(
    (l) =>
      (l.sourceId === idA && l.targetId === idB) ||
      (l.sourceId === idB && l.targetId === idA),
  );

  if (alreadyLinked) {
    return {
      ...state,
      narrativeLog: addNarrative(state, `线索 "${idA}" 和 "${idB}" 已经建立了连接`, 'clue'),
    };
  }

  return {
    ...state,
    clueLinks: [
      ...state.clueLinks,
      { sourceId: idA, targetId: idB, createdAt: Date.now() },
    ],
    narrativeLog: addNarrative(
      state,
      `发现了线索之间的关联: "${getClueTitle(idA, state)}" <-> "${getClueTitle(idB, state)}"`,
      'clue',
    ),
  };
}

/**
 * Remove a link between two clues.
 */
export function unlinkClues(
  state: GameState,
  clueIds: [string, string],
): GameState {
  const [idA, idB] = clueIds;
  return {
    ...state,
    clueLinks: state.clueLinks.filter(
      (l) =>
        !(
          (l.sourceId === idA && l.targetId === idB) ||
          (l.sourceId === idB && l.targetId === idA)
        ),
    ),
  };
}

// ─── Clue Graph ────────────────────────────────────────────────────

/**
 * Build a clue connection graph data structure.
 * Useful for rendering a visual clue map in the UI.
 */
export function getLinkedClues(state: GameState): ClueConnectionGraph {
  const nodes: ClueConnectionNode[] = state.clues.map((clue) => ({
    id: clue.id,
    title: clue.title ?? clue.id,
    category: clue.category ?? 'unknown',
    fragments: clue.fragments?.length ?? 0,
    totalFragments: clue.totalFragments ?? 1,
    discovered: true,
  }));

  const edges: ClueConnectionEdge[] = state.clueLinks.map((link) => ({
    sourceId: link.sourceId,
    targetId: link.targetId,
    createdAt: link.createdAt,
  }));

  // Identify orphaned clues (no connections)
  const linkedNodeIds = new Set<string>();
  for (const edge of edges) {
    linkedNodeIds.add(edge.sourceId);
    linkedNodeIds.add(edge.targetId);
  }

  return {
    nodes,
    edges,
    orphanedClues: nodes.filter((n) => !linkedNodeIds.has(n.id)),
  };
}

/**
 * Check if a clue is connected to any other clue.
 */
export function isClueLinked(state: GameState, clueId: string): boolean {
  return state.clueLinks.some(
    (l) => l.sourceId === clueId || l.targetId === clueId,
  );
}

/**
 * Get all clues connected to a specific clue (direct connections only).
 */
export function getConnectedClues(
  state: GameState,
  clueId: string,
): Clue[] {
  const connectedIds = new Set<string>();
  for (const link of state.clueLinks) {
    if (link.sourceId === clueId) connectedIds.add(link.targetId);
    if (link.targetId === clueId) connectedIds.add(link.sourceId);
  }
  return state.clues.filter((c) => connectedIds.has(c.id));
}

/**
 * Get the number of discovered clues.
 */
export function getClueCount(state: GameState): number {
  return state.clues.length;
}

/**
 * Get completion percentage for a specific clue.
 */
export function getClueCompletion(state: GameState, clueId: string): number {
  const clue = state.clues.find((c) => c.id === clueId);
  if (!clue) return 0;
  if (!clue.totalFragments || clue.totalFragments <= 0) return 100;
  return Math.round(
    ((clue.fragments?.length ?? 0) / clue.totalFragments) * 100,
  );
}

// ─── Inventory Queries ─────────────────────────────────────────────

/**
 * Get all equipped items.
 */
export function getEquippedItems(state: GameState): InventoryItem[] {
  const equippedIds = Object.values(state.equippedItems);
  return state.inventory.filter((item) => equippedIds.includes(item.id));
}

/**
 * Get item by ID.
 */
export function getItem(state: GameState, itemId: string): InventoryItem | undefined {
  return state.inventory.find((i) => i.id === itemId);
}

/**
 * Check if the player has a specific item.
 */
export function hasItem(state: GameState, itemId: string): boolean {
  return state.inventory.some((i) => i.id === itemId);
}

/**
 * Get the total number of items in inventory.
 */
export function getInventoryCount(state: GameState): number {
  return state.inventory.length;
}

/**
 * Get the remaining inventory capacity.
 */
export function getRemainingCapacity(state: GameState): number {
  return (state.maxInventorySize ?? DEFAULT_MAX_INVENTORY) - state.inventory.length;
}

/**
 * Check if inventory is full.
 */
export function isInventoryFull(state: GameState): boolean {
  return getRemainingCapacity(state) <= 0;
}

// ─── Helpers ───────────────────────────────────────────────────────

function addNarrative(
  state: GameState,
  content: string,
  type: NarrativeEntry['type'],
): NarrativeEntry[] {
  return [
    ...state.narrativeLog,
    {
      type,
      content,
      day: state.currentDay,
      period: state.currentPeriod,
      timestamp: Date.now(),
    },
  ];
}

function getClueTitle(clueId: string, state: GameState): string {
  return state.clues.find((c) => c.id === clueId)?.title ?? clueId;
}

// ─── Sorting & Filtering ──────────────────────────────────────────

/**
 * Sort inventory by a given criterion.
 */
export function sortInventory(
  state: GameState,
  by: 'name' | 'type' | 'quantity' = 'name',
): InventoryItem[] {
  const sorted = [...state.inventory];
  switch (by) {
    case 'name':
      sorted.sort((a, b) => (a.name ?? a.id).localeCompare(b.name ?? b.id));
      break;
    case 'type':
      sorted.sort((a, b) => (a.type ?? '').localeCompare(b.type ?? ''));
      break;
    case 'quantity':
      sorted.sort((a, b) => (b.quantity ?? 1) - (a.quantity ?? 1));
      break;
  }
  return sorted;
}

/**
 * Filter inventory by item type.
 */
export function filterInventoryByType(
  state: GameState,
  type: string,
): InventoryItem[] {
  return state.inventory.filter((item) => item.type === type);
}

/**
 * Get all items of a specific category (e.g., 'tsf_item', 'key_item', 'consumable').
 */
export function getItemsByCategory(
  state: GameState,
  category: string,
): InventoryItem[] {
  return state.inventory.filter((item) => item.category === category);
}
