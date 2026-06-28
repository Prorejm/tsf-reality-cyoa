import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import type { ScheduleEvent } from '@/game/engine/types';
import { AlertCircle, X } from 'lucide-react';

// ─── 事件类型配置 ───────────────────────────────────────────────────

interface EventTypeConfig {
  dotColor: string;
  label: string;
}

function getEventTypeConfig(event: ScheduleEvent): EventTypeConfig {
  // 基于 day 字段判断事件类型
  // day === -1: 每日触发（optional）
  // day > 0 且非每日: 根据优先级判断：高=mandatory, 中=optional, 低=conditional
  if (event.day === -1) {
    return { dotColor: 'bg-blue-400', label: '日常' };
  }
  if (event.priority >= 8) {
    return { dotColor: 'bg-red-400', label: '主线' };
  }
  if (event.priority >= 4) {
    return { dotColor: 'bg-blue-400', label: '支线' };
  }
  return { dotColor: 'bg-green-400', label: '条件' };
}

// ─── Props ──────────────────────────────────────────────────────────

interface CalendarDayProps {
  /** 日期编号 */
  day: number;
  /** 该日的事件列表 */
  events: ScheduleEvent[];
  /** 是否为当前日期 */
  isCurrent: boolean;
  /** 是否已过 */
  isPast: boolean;
  /** 是否有错过的关键事件 */
  hasMissed: boolean;
}

// ─── Component ──────────────────────────────────────────────────────

export const CalendarDay: React.FC<CalendarDayProps> = ({
  day,
  events,
  isCurrent,
  isPast,
  hasMissed,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const handleToggle = useCallback(() => {
    if (events.length > 0) setShowDetails((prev) => !prev);
  }, [events.length]);

  // 按优先级分组事件
  const sortedEvents = [...events].sort((a, b) => b.priority - a.priority);

  return (
    <div className="relative">
      {/* 日期卡片 */}
      <button
        onClick={handleToggle}
        disabled={events.length === 0 && !isCurrent}
        className={cn(
          // 基础布局
          'relative w-full p-2 rounded-lg border transition-all duration-200',
          'flex flex-col items-start gap-1',
          // 背景
          isCurrent
            ? 'bg-amber-900/20 border-amber-500/40'
            : isPast
            ? 'bg-white/[0.02] border-white/5'
            : 'bg-black/30 border-white/5',
          // 悬停
          events.length > 0 && 'hover:bg-white/5 cursor-pointer',
          // 错过
          hasMissed && 'border-rose-500/30',
        )}
      >
        {/* 日期数字 */}
        <div className="flex items-center gap-1.5 w-full">
          <span
            className={cn(
              'text-sm font-mono font-bold',
              isCurrent ? 'text-amber-400' : isPast ? 'text-gray-500' : 'text-gray-400',
            )}
          >
            {day}
          </span>

          {/* 今日标签 */}
          {isCurrent && (
            <span
              className={cn(
                'text-[8px] font-bold px-1 py-0.5 rounded',
                'bg-amber-500/20 text-amber-400 border border-amber-500/30',
              )}
            >
              今日
            </span>
          )}
        </div>

        {/* 事件指示点 */}
        {events.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap">
            {sortedEvents.slice(0, 4).map((event) => {
              const cfg = getEventTypeConfig(event);
              return (
                <span
                  key={event.id}
                  className={cn('w-1.5 h-1.5 rounded-full', cfg.dotColor)}
                  title={cfg.label}
                />
              );
            })}
            {events.length > 4 && (
              <span className="text-[8px] text-gray-500">
                +{events.length - 4}
              </span>
            )}
          </div>
        )}

        {/* 错过标记 */}
        {hasMissed && (
          <span className="absolute -top-1 -right-1">
            <AlertCircle className="w-3 h-3 text-rose-400" />
          </span>
        )}
      </button>

      {/* 事件详情弹窗 */}
      {showDetails && events.length > 0 && (
        <div
          className={cn(
            'absolute top-full left-0 mt-1 z-50 w-56',
            'bg-gray-900/95 backdrop-blur-md border border-white/10 rounded-lg',
            'shadow-2xl p-2',
          )}
        >
          {/* 标题栏 */}
          <div className="flex items-center justify-between mb-1 px-1">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">
              第 {day} 天事件
            </span>
            <button
              onClick={() => setShowDetails(false)}
              className="text-gray-500 hover:text-gray-300"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          {/* 事件列表 */}
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {sortedEvents.map((event) => {
              const cfg = getEventTypeConfig(event);
              return (
                <div
                  key={event.id}
                  className={cn(
                    'flex items-center gap-2 p-1.5 rounded',
                    'hover:bg-white/5 text-xs',
                    event.triggered && 'opacity-40',
                  )}
                >
                  <span
                    className={cn(
                      'w-2 h-2 rounded-full shrink-0',
                      cfg.dotColor,
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-gray-300 truncate block">
                      {event.id.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[9px] text-gray-500">
                      {cfg.label}
                      {event.triggered && ' (已触发)'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarDay;
