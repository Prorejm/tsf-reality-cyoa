import type {
  GameState,
  Period,
  ScheduleEntry,
  ScheduleEvent,
  CalendarEvent,
  NarrativeEntry,
} from './types';

// ─── Constants ──────────────────────────────────────────────────────

const PERIOD_ORDER: Period[] = ['morning', 'afternoon', 'evening', 'night'];

const PERIOD_LABELS: Record<Period, string> = {
  morning: '早晨',
  afternoon: '下午',
  evening: '傍晚',
  night: '夜晚',
};

const PERIOD_DURATIONS: Record<Period, { start: string; end: string }> = {
  morning: { start: '06:00', end: '11:59' },
  afternoon: { start: '12:00', end: '17:59' },
  evening: { start: '18:00', end: '20:59' },
  night: { start: '21:00', end: '05:59' },
};

// ─── Time Advancement ──────────────────────────────────────────────

/**
 * Advance the game time by one period.
 * Handles day rollover and end-of-day schedule checks.
 *
 * @returns New GameState with updated time and any triggered events.
 */
export function advanceTime(state: GameState): GameState {
  const currentIdx = PERIOD_ORDER.indexOf(state.currentPeriod);
  const isLastPeriod = currentIdx >= PERIOD_ORDER.length - 1;

  const newPeriod: Period = isLastPeriod ? 'morning' : PERIOD_ORDER[currentIdx + 1];
  const newDay = isLastPeriod ? state.currentDay + 1 : state.currentDay;

  let newState: GameState = {
    ...state,
    currentPeriod: newPeriod,
    currentDay: newDay,
  };

  // Add narrative entry
  const timeNarrative: string = isLastPeriod
    ? `第 ${state.currentDay} 天结束了。新的一天开始了——第 ${newDay} 天，${PERIOD_LABELS[newPeriod]}。`
    : `时间到了 ${PERIOD_LABELS[newPeriod]}。`;

  newState = {
    ...newState,
    narrativeLog: [
      ...newState.narrativeLog,
      {
        type: 'time_advance',
        content: timeNarrative,
        day: newDay,
        period: newPeriod,
        timestamp: Date.now(),
      },
    ],
  };

  // Check for missed events on day change
  if (isLastPeriod) {
    const missedEvents = checkMissedEvents(newState);
    if (missedEvents.length > 0) {
      newState = applyMissedEventConsequences(newState, missedEvents);
    }
  }

  return newState;
}

/**
 * Get the human-readable label for a period.
 */
export function getPeriodLabel(period: Period): string {
  return PERIOD_LABELS[period] ?? period;
}

/**
 * Get the time range for a period.
 */
export function getPeriodTimeRange(period: Period): { start: string; end: string } {
  return PERIOD_DURATIONS[period] ?? { start: '??:??', end: '??:??' };
}

/**
 * Get the current time range from state.
 */
export function getCurrentTimeRange(state: GameState): { start: string; end: string } {
  return getPeriodTimeRange(state.currentPeriod);
}

// ─── Scheduled Events ─────────────────────────────────────────────

/**
 * Get all scheduled events for a given day and period.
 *
 * @returns Array of ScheduleEvent objects matching the time slot.
 */
export function getScheduledEvents(
  day: number,
  period: Period,
  state: GameState,
): ScheduleEvent[] {
  return (state.schedule ?? []).filter(
    (entry) =>
      entry.day === day &&
      entry.period === period &&
      !entry.completed &&
      // Check prerequisites
      (!entry.prerequisites || evaluateSchedulePrerequisites(entry.prerequisites, state)),
  );
}

function evaluateSchedulePrerequisites(
  prereqs: Record<string, unknown>,
  state: GameState,
): boolean {
  // Default simple evaluator: flag checks
  if (prereqs.flag) {
    const flagName = prereqs.flag as string;
    const expectedValue = prereqs.value;
    if (expectedValue !== undefined) {
      return state.flags[flagName] === expectedValue;
    }
    return flagName in state.flags;
  }
  return true;
}

/**
 * Mark a scheduled event as completed.
 */
export function completeScheduleEntry(
  state: GameState,
  eventId: string,
): GameState {
  return {
    ...state,
    schedule: state.schedule.map((entry) =>
      entry.id === eventId ? { ...entry, completed: true } : entry,
    ),
  };
}

// ─── Missed Events ──────────────────────────────────────────────────

export interface MissedEventConsequence {
  eventId: string;
  consequence: string;
  erosionPenalty: number;
  awarenessPenalty: number;
}

/**
 * Check for events that were scheduled but not completed in the past day.
 * Called on day rollover.
 *
 * @returns Array of missed event consequences.
 */
export function checkMissedEvents(state: GameState): MissedEventConsequence[] {
  const yesterday = state.currentDay - 1;
  const missed: MissedEventConsequence[] = [];

  for (const entry of state.schedule ?? []) {
    if (entry.day === yesterday && !entry.completed) {
      // Determine consequence based on event importance
      const importance = entry.importance ?? 'normal';
      const basePenalty =
        importance === 'critical'
          ? 8
          : importance === 'important'
            ? 4
            : importance === 'normal'
              ? 2
              : 0;

      missed.push({
        eventId: entry.id,
        consequence:
          entry.missedConsequence ??
          `错过了 "${entry.title ?? entry.id}" — 机会溜走了。`,
        erosionPenalty: entry.missedErosionPenalty ?? basePenalty,
        awarenessPenalty: entry.missedAwarenessPenalty ?? Math.floor(basePenalty / 2),
      });
    }
  }

  return missed;
}

function applyMissedEventConsequences(
  state: GameState,
  missed: MissedEventConsequence[],
): GameState {
  if (missed.length === 0) return state;

  let newState = { ...state };

  for (const miss of missed) {
    newState.erosionLevel = Math.max(
      0,
      Math.min(100, newState.erosionLevel + miss.erosionPenalty),
    );
    newState.awarenessLevel = Math.max(
      0,
      Math.min(100, newState.awarenessLevel + miss.awarenessPenalty),
    );

    newState.narrativeLog.push({
      type: 'missed_event',
      content: `[错过] ${miss.consequence}`,
      day: state.currentDay,
      period: state.currentPeriod,
      timestamp: Date.now(),
    });
  }

  return newState;
}

// ─── Schedule Building ─────────────────────────────────────────────

/**
 * Add a schedule entry to the game state.
 */
export function addScheduleEntry(
  state: GameState,
  entry: ScheduleEntry,
): GameState {
  // Avoid duplicates
  if (state.schedule.some((e) => e.id === entry.id)) {
    return state;
  }
  return {
    ...state,
    schedule: [...state.schedule, entry],
  };
}

/**
 * Add multiple schedule entries at once.
 */
export function addScheduleEntries(
  state: GameState,
  entries: ScheduleEntry[],
): GameState {
  const existingIds = new Set(state.schedule.map((e) => e.id));
  const newEntries = entries.filter((e) => !existingIds.has(e.id));
  if (newEntries.length === 0) return state;
  return {
    ...state,
    schedule: [...state.schedule, ...newEntries],
  };
}

/**
 * Remove a schedule entry by ID.
 */
export function removeScheduleEntry(
  state: GameState,
  entryId: string,
): GameState {
  return {
    ...state,
    schedule: state.schedule.filter((e) => e.id !== entryId),
  };
}

/**
 * Get all events scheduled for a given day (all periods).
 */
export function getDaySchedule(day: number, state: GameState): ScheduleEntry[] {
  return (state.schedule ?? []).filter((e) => e.day === day);
}

// ─── Calendar View ─────────────────────────────────────────────────

/**
 * Get calendar events for a specific day.
 * Returns formatted events suitable for UI calendar rendering.
 */
export function getCalendarEvents(
  day: number,
  state: GameState,
): CalendarEvent[] {
  const dayEntries = (state.schedule ?? []).filter(
    (e) => e.day === day,
  );

  return dayEntries.map((entry) => ({
    id: entry.id,
    title: entry.title ?? entry.id,
    period: entry.period,
    completed: entry.completed,
    importance: entry.importance ?? 'normal',
    description: entry.description,
    location: entry.location,
    npcId: entry.npcId,
    timeRange: getPeriodTimeRange(entry.period),
  }));
}

/**
 * Get entire week's calendar events (starting from current day).
 */
export function getWeekCalendar(state: GameState): Map<number, CalendarEvent[]> {
  const calendar = new Map<number, CalendarEvent[]>();
  for (let offset = 0; offset < 7; offset++) {
    const day = state.currentDay + offset;
    if (day <= state.totalDays) {
      calendar.set(day, getCalendarEvents(day, state));
    }
  }
  return calendar;
}

// ─── Schedule Validation ───────────────────────────────────────────

/**
 * Check if the current period has any mandatory events that must be
 * attended (critical importance).
 */
export function hasMandatoryEvent(state: GameState): boolean {
  return (state.schedule ?? []).some(
    (e) =>
      e.day === state.currentDay &&
      e.period === state.currentPeriod &&
      !e.completed &&
      e.importance === 'critical',
  );
}

/**
 * Get the number of remaining periods in the current day.
 */
export function getRemainingPeriods(state: GameState): number {
  const currentIdx = PERIOD_ORDER.indexOf(state.currentPeriod);
  return PERIOD_ORDER.length - 1 - currentIdx;
}

/**
 * Check if the game day is over (night period has passed).
 */
export function isDayOver(state: GameState): boolean {
  return state.currentPeriod === 'night';
}

/**
 * Get the current day progress as a percentage.
 */
export function getDayProgress(state: GameState): number {
  const currentIdx = PERIOD_ORDER.indexOf(state.currentPeriod);
  return Math.round(((currentIdx + 1) / PERIOD_ORDER.length) * 100);
}
