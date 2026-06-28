// ============================================================================
// SafetyRulesBook.tsx — TSF Reality CYOA 安全规则手册
// 可翻页的"安全规则手册"组件，模仿游戏内道具/书籍样式
// ============================================================================

import React, { useState, useMemo } from 'react';
import { useGame } from '@/game/engine/GameContext';
import { SAFETY_RULES, type SafetyRule } from '@/game/data/safetyRules';
import { cn } from '@/lib/utils';

const RULES_PER_PAGE = 5;
const TOTAL_PAGES = Math.ceil(SAFETY_RULES.length / RULES_PER_PAGE);

const CATEGORY_COLORS: Record<string, { border: string; bg: string; badge: string; label: string }> = {
  warning: {
    border: 'border-yellow-600/40',
    bg: 'bg-yellow-900/20',
    badge: 'bg-yellow-600/60 text-yellow-100',
    label: '警告',
  },
  danger: {
    border: 'border-orange-600/40',
    bg: 'bg-orange-900/20',
    badge: 'bg-orange-600/60 text-orange-100',
    label: '危险',
  },
  deadly: {
    border: 'border-red-600/40',
    bg: 'bg-red-900/20',
    badge: 'bg-red-600/60 text-red-100',
    label: '致命',
  },
};

interface SafetyRulesBookProps {
  isOpen: boolean;
  onClose: () => void;
}

const SafetyRulesBook: React.FC<SafetyRulesBookProps> = ({ isOpen, onClose }) => {
  const { state } = useGame();
  const [page, setPage] = useState(0);
  const [showCover, setShowCover] = useState(true);

  const completedNodes: string[] = state.flags?.completed_nodes ?? [];
  const erosionLevel = state.erosionLevel ?? 0;

  // Determine which rules are violated
  const violatedRules = useMemo(() => {
    const violated = new Set<number>();
    for (const rule of SAFETY_RULES) {
      // Rule is violated if its nodeId is in completedNodes
      // OR if the setFlag from effects exists in state.flags
      if (completedNodes.includes(rule.nodeId)) {
        violated.add(rule.id);
        continue;
      }
      if (rule.effects.setFlag && state.flags?.[rule.effects.setFlag]) {
        violated.add(rule.id);
        continue;
      }
      // If the rule has an erosion effect and player erosion meets or exceeds it
      if (rule.effects.erosion && erosionLevel >= rule.effects.erosion) {
        violated.add(rule.id);
      }
    }
    return violated;
  }, [completedNodes, erosionLevel, state.flags]);

  // Paginated rules for current page
  const currentRules = useMemo(() => {
    const start = page * RULES_PER_PAGE;
    return SAFETY_RULES.slice(start, start + RULES_PER_PAGE);
  }, [page]);

  const handlePrevPage = () => {
    if (page > 0) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < TOTAL_PAGES - 1) setPage(page + 1);
  };

  const handleOpenBook = () => {
    setShowCover(false);
    setPage(0);
  };

  const handleCloseBook = () => {
    setShowCover(true);
    setPage(0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      {/* Book container */}
      <div className="relative w-[520px] max-h-[85vh] overflow-hidden rounded-xl
        bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100
        border-2 border-amber-700/50 shadow-2xl shadow-amber-900/30
        font-serif">

        {/* Decorative corner ornaments */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber-700/30 rounded-tl" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-amber-700/30 rounded-tr" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-amber-700/30 rounded-bl" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-amber-700/30 rounded-br" />

        {/* Close button */}
        <button
          onClick={handleCloseBook}
          className="absolute top-3 right-3 z-10 w-7 h-7 flex items-center justify-center
            rounded-full bg-amber-200/60 text-amber-800 text-xs
            hover:bg-amber-300/80 transition-colors border border-amber-600/30"
        >
          ✕
        </button>

        {showCover ? (
          /* ── Cover Page ── */
          <div className="flex flex-col items-center justify-center px-10 py-16 min-h-[480px]">
            {/* Decorative line */}
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-amber-700/40 to-transparent mb-6" />

            {/* Emblem */}
            <div className="w-20 h-20 rounded-full border-2 border-amber-700/40 flex items-center justify-center mb-6
              bg-gradient-to-br from-amber-200 to-amber-300/50">
              <span className="text-3xl text-amber-800/70">&#9997;</span>
            </div>

            <h1 className="text-3xl font-bold text-amber-900 tracking-wider mb-2 text-center"
              style={{ fontFamily: "'Times New Roman', 'Noto Serif SC', serif" }}>
              TSF 生存安全须知
            </h1>

            <div className="w-48 h-px bg-gradient-to-r from-transparent via-amber-700/40 to-transparent my-4" />

            <p className="text-sm text-amber-700/80 tracking-widest mb-1">—— 共 50 条规则 ——</p>
            <p className="text-[10px] text-amber-600/60 mb-8">请熟读并牢记</p>

            <button
              onClick={handleOpenBook}
              className="px-8 py-2.5 rounded-lg bg-amber-700/80 text-amber-50 text-sm tracking-wider
                hover:bg-amber-800 transition-colors shadow-md border border-amber-600/50
                active:scale-95 transform"
            >
              打开手册
            </button>

            {/* Decorative line */}
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-amber-700/40 to-transparent mt-6" />

            <p className="text-[9px] text-amber-500/50 mt-4 italic">
              遵守规则是生存的第一要务
            </p>
          </div>
        ) : (
          /* ── Content Pages ── */
          <div className="px-8 py-6 min-h-[480px] flex flex-col">
            {/* Page header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-amber-600/60 font-mono tracking-wider">
                  规则手册
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-600/40" />
                <span className="text-[10px] text-amber-600/60 font-mono tracking-wider">
                  第 {page + 1} / {TOTAL_PAGES} 页
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-amber-700/30 via-amber-700/20 to-transparent mb-4" />

            {/* Rule cards */}
            <div className="flex-1 space-y-2.5">
              {currentRules.map((rule) => {
                const isViolated = violatedRules.has(rule.id);
                const catColor = CATEGORY_COLORS[rule.category];

                return (
                  <div
                    key={rule.id}
                    className={cn(
                      'relative px-3.5 py-2.5 rounded-lg border transition-all',
                      catColor.border,
                      catColor.bg,
                      isViolated && 'opacity-50 bg-gray-300/30 border-gray-400/30',
                    )}
                  >
                    {/* Rule number + category badge */}
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          'w-5 h-5 flex items-center justify-center rounded-full text-[9px] font-bold font-mono',
                          isViolated ? 'bg-gray-400/40 text-gray-500' : 'bg-amber-700/30 text-amber-800',
                        )}>
                          {rule.id}
                        </span>
                        <span className={cn(
                          'text-xs font-bold tracking-wider',
                          isViolated ? 'text-gray-500' : 'text-amber-900',
                        )}
                          style={{ fontFamily: "'Times New Roman', 'Noto Serif SC', serif" }}
                        >
                          {rule.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {isViolated && (
                          <span className="text-xs text-gray-500">&#10003;</span>
                        )}
                        <span className={cn(
                          'px-1.5 py-0.5 rounded text-[8px] tracking-wider font-bold',
                          isViolated ? 'bg-gray-400/40 text-gray-500' : catColor.badge,
                        )}>
                          {catColor.label}
                        </span>
                      </div>
                    </div>

                    {/* Rule content */}
                    <p className={cn(
                      'text-[10px] leading-relaxed',
                      isViolated ? 'text-gray-500 line-through' : 'text-amber-800/80',
                    )}
                      style={{ fontFamily: "'Times New Roman', 'Noto Serif SC', serif" }}
                    >
                      {rule.content}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-amber-700/30 via-amber-700/20 to-transparent my-3" />

            {/* Page navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrevPage}
                disabled={page === 0}
                className={cn(
                  'px-4 py-1.5 rounded-md text-xs tracking-wider transition-all border',
                  page === 0
                    ? 'text-amber-400/30 border-amber-400/20 cursor-not-allowed'
                    : 'text-amber-700 border-amber-600/40 hover:bg-amber-200/50',
                )}
              >
                &#8592; 上一页
              </button>

              <div className="flex items-center gap-1">
                <span className="text-[9px] text-amber-600/50 font-mono">
                  违反: {violatedRules.size}/{SAFETY_RULES.length}
                </span>
              </div>

              <button
                onClick={handleNextPage}
                disabled={page >= TOTAL_PAGES - 1}
                className={cn(
                  'px-4 py-1.5 rounded-md text-xs tracking-wider transition-all border',
                  page >= TOTAL_PAGES - 1
                    ? 'text-amber-400/30 border-amber-400/20 cursor-not-allowed'
                    : 'text-amber-700 border-amber-600/40 hover:bg-amber-200/50',
                )}
              >
                下一页 &#8594;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SafetyRulesBook;
