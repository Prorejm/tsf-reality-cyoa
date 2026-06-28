import type {
  GameState,
  ErosionStage,
  BadEndId,
  BadEndEntry,
  ErosionTrigger,
} from './types';

// ─── Stage Thresholds ───────────────────────────────────────────────

const EROSION_THRESHOLDS: { min: number; max: number; stage: ErosionStage }[] = [
  { min: 0, max: 15, stage: 'human' },
  { min: 16, max: 30, stage: 'subtle' },
  { min: 31, max: 50, stage: 'noticeable' },
  { min: 51, max: 70, stage: 'significant' },
  { min: 71, max: 85, stage: 'severe' },
  { min: 86, max: 95, stage: 'critical' },
  { min: 96, max: 100, stage: 'transcendence' },
];

// ─── Bad End Triggers (default registry) ───────────────────────────

const DEFAULT_BAD_END_TRIGGERS: ErosionTrigger[] = [
  {
    id: 'be_erosion_max',
    condition: (s) => s.erosionLevel >= 100,
    badEndId: 'erosion_overflow',
    priority: 100,
    narrative: '侵蚀值达到极限 — 你完全丧失了人类的形态与自我……',
  },
  {
    id: 'be_erosion_rapid',
    condition: (s) => {
      if (s.narrativeLog.length < 2) return false;
      const recent = s.narrativeLog
        .filter((n) => n.type === 'erosion')
        .slice(-3);
      if (recent.length < 2) return false;
      const totalChange = recent.reduce((sum, n) => sum + (n.erosionAmount ?? 0), 0);
      return Math.abs(totalChange) >= 40;
    },
    badEndId: 'erosion_rapid_collapse',
    priority: 90,
    narrative: '侵蚀速度过快 — 你的心智无法承受这急剧的变化……',
  },
  {
    id: 'be_awareness_collapse',
    condition: (s) => s.awarenessLevel >= 100 && s.erosionLevel >= 50,
    badEndId: 'truth_collapse',
    priority: 95,
    narrative: '真相的冲击过于强烈 — 你的理性在现实与虚幻的夹缝中崩溃了……',
  },
  {
    id: 'be_identity_dissonance',
    condition: (s) => {
      const humanFlags = Object.keys(s.flags).filter((k) =>
        k.startsWith('identity_human_'),
      ).length;
      const monsterFlags = Object.keys(s.flags).filter((k) =>
        k.startsWith('identity_monster_'),
      ).length;
      return monsterFlags > humanFlags + 5 && s.erosionLevel >= 60;
    },
    badEndId: 'identity_loss',
    priority: 80,
    narrative: '你已记不起自己曾经是人类的样子——身份认同彻底崩塌……',
  },
];

// ─── Public API ─────────────────────────────────────────────────────

/**
 * Calculate the erosion stage label based on current erosion level.
 */
export function calculateErosionStage(erosionLevel: number): ErosionStage {
  for (const threshold of EROSION_THRESHOLDS) {
    if (erosionLevel >= threshold.min && erosionLevel <= threshold.max) {
      return threshold.stage;
    }
  }
  return 'human'; // fallback
}

/**
 * Get the narrative description for a given erosion stage.
 */
export function getErosionStageDescription(stage: ErosionStage): string {
  const descriptions: Record<ErosionStage, string> = {
    human: '你看起来完全正常，没有任何异常变化。',
    subtle:
      '有些细微的变化开始显现——也许是指甲的颜色、瞳孔的微光，或是某些奇怪的念头。你觉得只是自己的错觉。',
    noticeable:
      '变化已经无法忽视。周围的人开始用异样的眼光看你，你照镜子时也认不出某些细节。',
    significant:
      '你的非人特征变得明显——翅膀、尾巴、鳞片或是其他什么。你开始习惯这些新肢体，甚至觉得它们本来就在那里。',
    severe:
      '人类的伪装已经摇摇欲坠。你的日常行为模式发生了根本性改变，常识正在被新的本能取代。',
    critical:
      '你还记得自己是"人"吗？这些词汇似乎已经失去了意义。你站在两个世界的交界线上。',
    transcendence:
      '你超越了人类的范畴——成为了全新的存在。人类的常识对你而言如同遥远的童话。',
  };
  return descriptions[stage] ?? '未知阶段。';
}

/**
 * Process a daily erosion tick — passive erosion/awareness changes
 * based on current stage and active flags.
 *
 * @returns A new GameState with daily erosion effects applied.
 */
export function processErosionTick(state: GameState): GameState {
  const stage = calculateErosionStage(state.erosionLevel);
  let erosionDelta = 0;
  let awarenessDelta = 0;
  const effects: string[] = [];

  // Passive erosion based on current stage
  switch (stage) {
    case 'human':
      erosionDelta = 0;
      awarenessDelta = -1; // Slight regression in awareness
      break;
    case 'subtle':
      erosionDelta = 1;
      awarenessDelta = 0;
      break;
    case 'noticeable':
      erosionDelta = 2;
      awarenessDelta = 1;
      effects.push('你今天又发现了一些不对劲的细节……');
      break;
    case 'significant':
      erosionDelta = 3;
      awarenessDelta = 2;
      effects.push('新的身体部位越来越难以隐藏了。');
      break;
    case 'severe':
      erosionDelta = 4;
      awarenessDelta = 2;
      effects.push('你几乎忘记了"正常"是什么感觉。');
      break;
    case 'critical':
      erosionDelta = 5;
      awarenessDelta = 3;
      effects.push('两个世界的边界在你面前变得模糊不清。');
      break;
    case 'transcendence':
      erosionDelta = 2;
      awarenessDelta = 5;
      effects.push('你看到了一切——事物的本质与真相。');
      break;
  }

  // Modifiers from flags
  if (state.flags['erosion_acceleration']) {
    erosionDelta += 2;
  }
  if (state.flags['awareness_suppression']) {
    awarenessDelta = Math.max(0, awarenessDelta - 2);
  }

  // Apply
  const newErosion = Math.max(0, Math.min(100, state.erosionLevel + erosionDelta));
  const newAwareness = Math.max(
    0,
    Math.min(100, state.awarenessLevel + awarenessDelta),
  );

  const narrative = effects.length > 0 ? effects.join(' ') : undefined;

  return {
    ...state,
    erosionLevel: newErosion,
    awarenessLevel: newAwareness,
    narrativeLog: [
      ...state.narrativeLog,
      ...(narrative
        ? [
            {
              type: 'erosion_tick' as const,
              content: narrative,
              day: state.currentDay,
              period: state.currentPeriod,
              timestamp: Date.now(),
            },
          ]
        : []),
    ],
  };
}

/**
 * Check all registered bad end triggers against the current state.
 * Returns the highest-priority triggered BadEndId, or null.
 *
 * @param state        Current game state
 * @param customTriggers Optional additional triggers to check
 */
export function checkBadEndTrigger(
  state: GameState,
  customTriggers?: ErosionTrigger[],
): { badEndId: BadEndId; narrative: string } | null {
  const allTriggers = [...DEFAULT_BAD_END_TRIGGERS, ...(customTriggers ?? [])];
  // Sort by priority descending
  const sorted = [...allTriggers].sort((a, b) => b.priority - a.priority);

  for (const trigger of sorted) {
    try {
      if (trigger.condition(state)) {
        return { badEndId: trigger.badEndId, narrative: trigger.narrative };
      }
    } catch {
      // Skip malformed triggers
      continue;
    }
  }

  return null;
}

/**
 * Apply a modification to the erosion level with narrative context.
 *
 * @returns A new GameState with erosion change and narrative record.
 */
export function modifyErosion(
  state: GameState,
  amount: number,
  reason: string,
): GameState {
  const newErosion = Math.max(0, Math.min(100, state.erosionLevel + amount));
  return {
    ...state,
    erosionLevel: newErosion,
    narrativeLog: [
      ...state.narrativeLog,
      {
        type: 'erosion',
        content: reason,
        erosionAmount: amount,
        day: state.currentDay,
        period: state.currentPeriod,
        timestamp: Date.now(),
      },
    ],
  };
}

/**
 * Register a custom bad end trigger at runtime.
 * Returns a new array that can be passed to checkBadEndTrigger.
 */
export function registerBadEndTrigger(
  existingTriggers: ErosionTrigger[],
  newTrigger: ErosionTrigger,
): ErosionTrigger[] {
  return [...existingTriggers, newTrigger];
}
