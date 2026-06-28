import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import type { DiscoveryEntry, ClueCategory } from '@/game/engine/types';
import { BookOpen, Eye, EyeOff, Quote, Hash } from 'lucide-react';

// ─── 分类配色映射 ───────────────────────────────────────────────────

const CATEGORY_STYLES: Record<
  ClueCategory,
  { bg: string; text: string; border: string; label: string }
> = {
  reality_anomaly: {
    bg: 'bg-purple-900/30',
    text: 'text-purple-300',
    border: 'border-purple-700/30',
    label: '现实异常',
  },
  identity_trace: {
    bg: 'bg-blue-900/30',
    text: 'text-blue-300',
    border: 'border-blue-700/30',
    label: '身份痕迹',
  },
  monster_lore: {
    bg: 'bg-green-900/30',
    text: 'text-green-300',
    border: 'border-green-700/30',
    label: '魔物料考',
  },
  organization: {
    bg: 'bg-red-900/30',
    text: 'text-red-300',
    border: 'border-red-700/30',
    label: '组织情报',
  },
  historical: {
    bg: 'bg-amber-900/30',
    text: 'text-amber-300',
    border: 'border-amber-700/30',
    label: '历史记录',
  },
  personal: {
    bg: 'bg-cyan-900/30',
    text: 'text-cyan-300',
    border: 'border-cyan-700/30',
    label: '私人线索',
  },
  forbidden: {
    bg: 'bg-rose-900/40',
    text: 'text-rose-300',
    border: 'border-rose-700/40',
    label: '禁忌知识',
  },
};

// ─── Props ──────────────────────────────────────────────────────────

interface DiscoveryLogProps {
  /** 发现物条目 */
  entry: DiscoveryEntry;
  /** 是否默认显示真相描述 */
  showTruth?: boolean;
}

// ─── Component ──────────────────────────────────────────────────────

export const DiscoveryLog: React.FC<DiscoveryLogProps> = ({
  entry,
  showTruth = false,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [truthRevealed, setTruthRevealed] = useState(showTruth);

  const categoryStyle = CATEGORY_STYLES[entry.category] ?? CATEGORY_STYLES.reality_anomaly;

  return (
    <div
      className={cn(
        'rounded-lg border transition-all duration-300',
        'bg-black/40 backdrop-blur-sm',
        categoryStyle.border,
        'hover:bg-black/50',
        entry.isCritical && 'ring-1 ring-amber-500/20',
      )}
    >
      {/* 头部 */}
      <div className="p-3 space-y-2">
        {/* 第一行：分类标签 + 日期 + 关键标记 */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* 分类标签 */}
          <span
            className={cn(
              'text-[10px] font-semibold px-1.5 py-0.5 rounded',
              'uppercase tracking-wider',
              categoryStyle.bg,
              categoryStyle.text,
            )}
          >
            {categoryStyle.label}
          </span>

          {/* 发现日期 */}
          {entry.discoveredOnDay > 0 && (
            <span className="text-[10px] text-gray-500 font-mono flex items-center gap-0.5">
              <Hash className="w-2.5 h-2.5" />
              Day {entry.discoveredOnDay}
            </span>
          )}

          {/* 关键标记 */}
          {entry.isCritical && (
            <span
              className={cn(
                'text-[10px] font-bold px-1.5 py-0.5 rounded',
                'bg-amber-900/30 text-amber-400 border border-amber-700/30',
              )}
            >
              关键
            </span>
          )}

          {/* 未读标记 */}
          {!entry.read && (
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          )}
        </div>

        {/* 标题 */}
        <h3
          className={cn(
            'text-sm font-semibold leading-snug',
            'text-gray-100',
          )}
        >
          {entry.name}
        </h3>

        {/* 描述 */}
        <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
          {entry.description}
        </p>

        {/* 操作按钮 */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className={cn(
              'text-[10px] flex items-center gap-1',
              'text-gray-400 hover:text-gray-200 transition-colors',
            )}
          >
            <BookOpen className="w-3 h-3" />
            {showDetails ? '收起' : '详细'}
          </button>

          {/* 真相切换（如果有不同版本内容） */}
          {entry.content && (
            <button
              onClick={() => setTruthRevealed(!truthRevealed)}
              className={cn(
                'text-[10px] flex items-center gap-1 transition-colors',
                truthRevealed
                  ? 'text-amber-400 hover:text-amber-300'
                  : 'text-gray-400 hover:text-gray-200',
              )}
            >
              {truthRevealed ? (
                <Eye className="w-3 h-3" />
              ) : (
                <EyeOff className="w-3 h-3" />
              )}
              {truthRevealed ? '真相' : '常识'}
            </button>
          )}
        </div>
      </div>

      {/* 展开详情 */}
      {showDetails && (
        <div className="border-t border-white/5 p-3 space-y-2">
          {/* 详细内容 */}
          <div
            className={cn(
              'text-xs leading-relaxed p-2 rounded',
              truthRevealed
                ? 'text-amber-200/90 bg-amber-900/10 border border-amber-700/20'
                : 'text-gray-300 bg-white/[0.02] border border-white/5',
            )}
          >
            <div className="flex items-center gap-1 mb-1 text-[10px] text-gray-500">
              <Quote className="w-2.5 h-2.5" />
              {truthRevealed ? '真实记录' : '常识记载'}
            </div>
            {entry.content}
          </div>

          {/* 相关线索 */}
          {entry.relatedClues && entry.relatedClues.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                关联线索
              </span>
              <div className="flex flex-wrap gap-1">
                {entry.relatedClues.map((clueId) => (
                  <span
                    key={clueId}
                    className={cn(
                      'text-[10px] px-1.5 py-0.5 rounded',
                      'bg-gray-800/50 text-gray-400 border border-white/5',
                    )}
                  >
                    {clueId}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 来源信息 */}
          {entry.discoveredInScene && (
            <div className="text-[10px] text-gray-600">
              发现于: {entry.discoveredInScene}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DiscoveryLog;
