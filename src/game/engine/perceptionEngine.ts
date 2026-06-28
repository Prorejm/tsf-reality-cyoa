import type {
  GameState,
  EntityDescriptor,
  PerceptionMode,
  RealityBreakEvent,
  NarrativeEntry,
} from './types';

// ─── Resident View (日常视角) ───────────────────────────────────────

/**
 * Generate the "resident" (everyday) description for a given entity.
 * This is the normal, mundane view — everything appears ordinary.
 */
export function getResidentView(
  entity: EntityDescriptor,
  _state: GameState,
): string {
  if (entity.residentDescription) {
    return entity.residentDescription;
  }

  // Fallback: mask supernatural elements
  const maskedName = entity.mundaneName ?? entity.name;
  const maskedAppearance = entity.mundaneAppearance ?? entity.appearance ?? '看起来很正常。';
  const maskedBehavior = entity.mundaneBehavior ?? entity.behavior ?? '行为举止与常人无异。';

  return `${maskedName}。${maskedAppearance}${maskedBehavior}`;
}

/**
 * Get the resident-view interaction options (filtered).
 * Removes any truth-only interaction options.
 */
export function getResidentInteractions(
  entity: EntityDescriptor,
): string[] {
  const all = entity.interactions ?? [];
  return all.filter((opt) => !opt.startsWith('[真相]'));
}

// ─── Truth View (真相视角) ─────────────────────────────────────────

/**
 * Generate the "truth" (supernatural) description for a given entity.
 * This reveals the monster-girl / TSF reality beneath the surface.
 */
export function getTruthView(
  entity: EntityDescriptor,
  state: GameState,
): string {
  // Base truth description
  const baseDescription =
    entity.truthDescription ??
    entity.appearance ??
    '你看到了表象之下的真实……';

  // Append erosion-level contextual hints
  const erosionHint = getErosionHint(state.erosionLevel, entity);
  const awarenessNote =
    state.awarenessLevel >= 40
      ? `\n\n[认知共鸣] 你的内在变化让你更容易理解眼前的存在——你们之间有某种微妙的联系。`
      : '';

  return `${baseDescription}${erosionHint}${awarenessNote}`;
}

/**
 * Get the truth-view interaction options (unfiltered + extras).
 */
export function getTruthInteractions(
  entity: EntityDescriptor,
): string[] {
  const base = entity.interactions ?? [];
  const truthExtras = entity.truthInteractions ?? [];
  return [...base, ...truthExtras];
}

// ─── Erosion-Level Contextual Hints ─────────────────────────────────

function getErosionHint(erosionLevel: number, entity: EntityDescriptor): string {
  if (erosionLevel < 20) return '';
  if (erosionLevel < 40) {
    return `\n\n[隐约感知] 你隐约觉得${entity.name}身边有某种不自然的气息在流动。`;
  }
  if (erosionLevel < 60) {
    return `\n\n[异常感知] 你能看到${entity.name}周围有微弱的能量波动——那绝对不是人类的特征。`;
  }
  if (erosionLevel < 80) {
    return `\n\n[深度感知] ${entity.name}的真实形态在你眼前若隐若现——你看到了不属于人类的轮廓。`;
  }
  return `\n\n[完全感知] 你毫无阻碍地看到了${entity.name}的真实本质——那个隐藏在常识之下的怪物少女。`;
}

// ─── Perception Switch ─────────────────────────────────────────────

/**
 * Toggle the player's current perception mode.
 * Returns the new state with perception toggled and a narrative entry.
 */
export function switchPerception(state: GameState): GameState {
  const newMode: PerceptionMode =
    state.perceptionMode === 'resident' ? 'truth' : 'resident';

  const narrative =
    newMode === 'truth'
      ? '你闭上了眼，再次睁开——世界的轮廓发生了微妙的变化。你看到了表象之下的真实。\n[真相之眼已开启]'
      : '你强行让自己回到"正常"的视角。一切恢复了日常的模样——但你心里清楚，那层薄纱之下藏着什么。\n[日常视角已恢复]';

  const entry: NarrativeEntry = {
    type: 'perception',
    content: narrative,
    day: state.currentDay,
    period: state.currentPeriod,
    timestamp: Date.now(),
  };

  return {
    ...state,
    perceptionMode: newMode,
    narrativeLog: [...state.narrativeLog, entry],
  };
}

/**
 * Determine whether the player's perception mode is allowed.
 * Truth mode requires awareness >= 10 to activate.
 */
export function canUseTruthMode(state: GameState): boolean {
  return state.awarenessLevel >= 10;
}

// ─── Reality Break ─────────────────────────────────────────────────

/**
 * Check if a "reality break" event should occur — moments where
 * the boundary between resident and truth perception shatters.
 *
 * Returns a RealityBreakEvent if triggered, or null.
 */
export function checkRealityBreak(state: GameState): RealityBreakEvent | null {
  // High erosion + high awareness = potential reality break
  if (state.erosionLevel >= 50 && state.awarenessLevel >= 30) {
    // Determine if a break happens based on thresholds and random-ish checks
    const breakChance = Math.min(
      100,
      (state.erosionLevel - 50) * 0.5 +
        (state.awarenessLevel - 30) * 0.3 +
        (state.flags['reality_stability'] !== undefined
          ? -Number(state.flags['reality_stability']) * 10
          : 0),
    );

    // Use a deterministic check based on state to avoid RNG in pure functions
    const checkValue =
      (state.currentDay * 7 + PERIOD_INDEX(state.currentPeriod) * 3 +
        state.narrativeLog.length) %
      100;

    if (checkValue < breakChance) {
      return generateRealityBreak(state);
    }
  }

  return null;
}

function PERIOD_INDEX(period: string): number {
  const map: Record<string, number> = {
    morning: 0,
    afternoon: 1,
    evening: 2,
    night: 3,
  };
  return map[period] ?? 0;
}

function generateRealityBreak(state: GameState): RealityBreakEvent {
  const severity = Math.min(
    5,
    Math.floor(
      ((state.erosionLevel - 50) / 10 + (state.awarenessLevel - 30) / 10) / 2,
    ) + 1,
  );

  const breakTypes = [
    {
      id: 'reality_break_visual',
      narrative:
        '眼前的景象突然扭曲——墙壁变成了跳动的血肉，天花板上的纹理化作了流动的符文。你眨了眨眼，一切又恢复了正常。',
    },
    {
      id: 'reality_break_auditory',
      narrative:
        '你听到了不该存在的声音——低语、歌声、或是某种古老语言的呼唤。它们来自墙壁内部，来自地底，来自你自己的脑海中。',
    },
    {
      id: 'reality_break_temporal',
      narrative:
        '时间似乎停滞了一瞬。你看到周围的人定格在原地，而某些"东西"在他们之间缓慢移动——那些东西注意到了你。',
    },
    {
      id: 'reality_break_identity',
      narrative:
        '你低头看向自己的双手——它们不再是你的手。至少，不是你记忆中应该有的样子。你愣了几秒，它们又变回了"正常"。',
    },
    {
      id: 'reality_break_existential',
      narrative:
        '一个可怕的念头闪过你的脑海：你现在看到的"日常"，真的是真实的吗？还是说，整个世界都只是一个精心编织的伪装？',
    },
  ];

  const breakIndex =
    ((state.currentDay * 13 + state.narrativeLog.length * 7) %
      breakTypes.length);

  return {
    id: breakTypes[breakIndex].id,
    type: 'reality_break',
    severity,
    narrative: breakTypes[breakIndex].narrative,
    effects: {
      awarenessGain: severity * 2,
      erosionGain: severity * 1,
    },
    timestamp: Date.now(),
  };
}

// ─── Utility: Build Entity Descriptor ──────────────────────────────

/**
 * Create a complete EntityDescriptor from resident and truth descriptions.
 * Useful for runtime entity creation.
 */
export function buildEntityDescriptor(params: {
  id: string;
  name: string;
  mundaneName?: string;
  appearance?: string;
  mundaneAppearance?: string;
  behavior?: string;
  mundaneBehavior?: string;
  residentDescription?: string;
  truthDescription?: string;
  interactions?: string[];
  truthInteractions?: string[];
}): EntityDescriptor {
  return {
    id: params.id,
    name: params.name,
    mundaneName: params.mundaneName,
    appearance: params.appearance,
    mundaneAppearance: params.mundaneAppearance,
    behavior: params.behavior,
    mundaneBehavior: params.mundaneBehavior,
    residentDescription: params.residentDescription,
    truthDescription: params.truthDescription,
    interactions: params.interactions,
    truthInteractions: params.truthInteractions,
  };
}
