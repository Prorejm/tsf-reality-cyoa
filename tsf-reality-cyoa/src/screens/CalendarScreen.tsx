import React, { useState, useMemo, useCallback } from 'react';
import { useGame } from '@/game/engine/GameContext';
import { cn } from '@/lib/utils';

interface CalendarEvent {
  id: string;
  day: number;
  period: string;
  title: string;
  description: string;
  missed: boolean;
  completed: boolean;
}

const PERIOD_ORDER: string[] = ['morning', 'afternoon', 'evening', 'night'];
const PERIOD_LABELS: Record<string, string> = {
  morning: '早晨',
  afternoon: '下午',
  evening: '傍晚',
  night: '深夜',
};

const WEEKDAY_LABELS = ['日', '一', '二', '三', '四', '五', '六'];

const CalendarScreen: React.FC = () => {
  const { state, dispatch } = useGame();

  const currentDay = state?.time?.day ?? 1;
  const currentPeriod = state?.time?.period ?? 'morning';
  const periodAction = state?.time?.periodAction ?? 0;
  const maxActions = state?.time?.maxActionsPerPeriod ?? 2;
  const totalDays = state?.time?.totalDays ?? 30;
  const dayLimit = state?.time?.dayLimit ?? 30;

  const [viewMonth, setViewMonth] = useState(1);
  const [selectedDay, setSelectedDay] = useState<number | null>(currentDay);

  // 模拟日程事件
  const scheduleEvents: CalendarEvent[] = useMemo(() => {
    const events: CalendarEvent[] = [];
    for (let d = 1; d <= dayLimit; d++) {
      if (d % 3 === 0) {
        events.push({
          id: `event_day_${d}_1`,
          day: d,
          period: 'afternoon',
          title: '神社 · 结界维护',
          description: '狐铃需要在午后进行定期的结界检查。你可以去帮忙（好感度提升机会）。',
          missed: d < currentDay,
          completed: d < currentDay && d % 5 === 0,
        });
      }
      if (d % 5 === 0) {
        events.push({
          id: `event_day_${d}_2`,
          day: d,
          period: 'evening',
          title: '酒吧 · 夜魅的特调之夜',
          description: '每周一次的特别活动。可能会遇到新的面孔。',
          missed: d < currentDay && d % 5 !== 0,
          completed: d < currentDay && d % 5 === 0,
        });
      }
      if (d === 7) {
        events.push({
          id: `event_day_7_major`,
          day: 7,
          period: 'night',
          title: '【主线】市政厅的晚宴',
          description: '市长龙映邀请你参加一场私人晚宴。这可能是揭开真相的关键。',
          missed: false,
          completed: d < currentDay,
        });
      }
      if (d === 14) {
        events.push({
          id: `event_day_14_major`,
          day: 14,
          period: 'night',
          title: '【主线】深淵回廊的入口',
          description: '你在调查中发现了通往真相核心的线索。今夜是行动的最佳时机。',
          missed: false,
          completed: d < currentDay,
        });
      }
    }
    return events;
  }, [dayLimit, currentDay]);

  // 获取指定日期的所有事件
  const eventsForDay = useMemo(() => {
    if (!selectedDay) return [];
    return scheduleEvents
      .filter((e) => e.day === selectedDay)
      .sort((a, b) => PERIOD_ORDER.indexOf(a.period) - PERIOD_ORDER.indexOf(b.period));
  }, [selectedDay, scheduleEvents]);

  // 模拟日历网格
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(2026, viewMonth - 1, 1).getDay();
    const daysInMonth = new Date(2026, viewMonth, 0).getDate();
    const days: Array<{ day: number; isCurrent: boolean; hasEvent: boolean; isPast: boolean; isFuture: boolean }> = [];

    // 填充前部空白
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: 0, isCurrent: false, hasEvent: false, isPast: false, isFuture: false });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const hasEvent = scheduleEvents.some((e) => e.day === d);
      days.push({
        day: d,
        isCurrent: d === currentDay && viewMonth === 1,
        hasEvent,
        isPast: d < currentDay && viewMonth === 1,
        isFuture: d > currentDay || viewMonth > 1,
      });
    }

    return days;
  }, [viewMonth, currentDay, scheduleEvents]);

  const prevMonth = useCallback(() => setViewMonth((p) => Math.max(1, p - 1)), []);
  const nextMonth = useCallback(() => setViewMonth((p) => p + 1), []);

  // 推进时间
  const handleAdvanceTime = useCallback(() => {
    dispatch({ type: 'TIME_ADVANCE' });
  }, [dispatch]);

  const handleBack = useCallback(() => {
    dispatch({
      type: 'SET_FLAG',
      payload: { key: '_screen', value: 'exploration' },
    });
  }, [dispatch]);

  const isAllActionsUsed = periodAction >= maxActions;
  const currentPeriodIndex = PERIOD_ORDER.indexOf(currentPeriod);
  const isLastPeriod = currentPeriodIndex >= PERIOD_ORDER.length - 1;

  return (
    <div className="game-container min-h-screen">
      {/* 顶部 */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handleBack}
          className="text-xs text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded bg-white/5 border border-white/10"
        >
          返回探索
        </button>
        <h2 className="font-title text-xl text-blue-200/80 tracking-wider">
          日程
        </h2>
        <div className="w-20" />
      </div>

      {/* 时间状态 */}
      <div className="game-panel mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-200">
              第 <span className="text-blue-200 font-bold">{currentDay}</span> 日
            </span>
            <span className="text-xs text-amber-300/80">
              {PERIOD_LABELS[currentPeriod] ?? currentPeriod}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              行动：{periodAction}/{maxActions}
            </span>
            <div className="flex gap-0.5">
              {Array.from({ length: maxActions }, (_, i) => (
                <div
                  key={i}
                  className={cn(
                    'w-3 h-3 rounded-full transition-all',
                    i < periodAction ? 'bg-blue-400/60' : 'bg-gray-700/50',
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 时间线 */}
        <div className="flex gap-1 mb-2">
          {PERIOD_ORDER.map((p, idx) => (
            <div
              key={p}
              className={cn(
                'flex-1 h-1 rounded transition-all',
                idx < currentPeriodIndex
                  ? 'bg-gray-600/30'
                  : idx === currentPeriodIndex
                  ? 'bg-blue-400/50'
                  : 'bg-gray-800/30',
              )}
            />
          ))}
        </div>

        {/* 推进时间按钮 */}
        {isAllActionsUsed && (
          <button
            onClick={handleAdvanceTime}
            className={cn(
              'w-full mt-2 px-4 py-2 rounded text-xs transition-all',
              isLastPeriod
                ? 'bg-amber-500/10 border border-amber-500/20 text-amber-300 hover:bg-amber-500/20'
                : 'bg-blue-500/10 border border-blue-500/20 text-blue-300 hover:bg-blue-500/20',
            )}
          >
            {isLastPeriod ? '进入下一天' : `进入${PERIOD_LABELS[PERIOD_ORDER[currentPeriodIndex + 1]]}`}
          </button>
        )}
      </div>

      {/* 月历 */}
      <div className="game-panel mb-4">
        <div className="flex items-center justify-between mb-3">
          <button onClick={prevMonth} className="text-xs text-gray-400 hover:text-white px-2 py-1">
            ‹
          </button>
          <span className="text-sm text-gray-200">
            2026年 {viewMonth}月
          </span>
          <button onClick={nextMonth} className="text-xs text-gray-400 hover:text-white px-2 py-1">
            ›
          </button>
        </div>

        {/* 星期表头 */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {WEEKDAY_LABELS.map((w, i) => (
            <div
              key={i}
              className={cn(
                'text-center text-[10px] py-1',
                i === 0 ? 'text-red-400/50' : i === 6 ? 'text-blue-400/50' : 'text-gray-500',
              )}
            >
              {w}
            </div>
          ))}
        </div>

        {/* 日期网格 */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((d, idx) => (
            <button
              key={idx}
              onClick={() => d.day > 0 && setSelectedDay(d.day)}
              disabled={d.day === 0}
              className={cn(
                'aspect-square rounded text-xs transition-all relative',
                d.day === 0 && 'invisible',
                d.isCurrent && 'bg-blue-500/30 border border-blue-400/40 text-blue-200',
                !d.isCurrent && d.day === selectedDay && 'bg-blue-500/10 border border-blue-400/20 text-blue-200',
                !d.isCurrent && !d.isFuture && 'text-gray-300 hover:bg-white/5',
                d.isFuture && 'text-gray-600',
              )}
            >
              <span>{d.day}</span>
              {d.hasEvent && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-400/60" />
              )}
              {d.isPast && d.hasEvent && (
                <span className="absolute top-0.5 right-0.5 text-[8px] text-red-400/60">!</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 选定日期的事件详情 */}
      {selectedDay && (
        <div className="game-panel">
          <h3 className="text-sm text-gray-200 mb-3">
            第 {selectedDay} 日 · 日程详情
          </h3>
          {eventsForDay.length === 0 ? (
            <p className="text-xs text-gray-500">这一天没有预定的特殊事件。</p>
          ) : (
            <div className="space-y-2">
              {eventsForDay.map((event) => (
                <div
                  key={event.id}
                  className={cn(
                    'p-3 rounded-lg border transition-all',
                    event.completed
                      ? 'bg-green-500/5 border-green-500/10'
                      : event.missed
                      ? 'bg-red-500/5 border-red-500/10'
                      : 'bg-blue-500/5 border-blue-500/10',
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={cn(
                        'text-xs font-medium',
                        event.completed
                          ? 'text-green-300'
                          : event.missed
                          ? 'text-red-300'
                          : 'text-blue-200',
                      )}
                    >
                      {event.title}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {PERIOD_LABELS[event.period] ?? event.period}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{event.description}</p>
                  {event.missed && !event.completed && (
                    <p className="text-[10px] text-red-400/60 mt-1">⚠ 已错过</p>
                  )}
                  {event.completed && (
                    <p className="text-[10px] text-green-400/60 mt-1">✓ 已完成</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CalendarScreen;
