import React, { useState, useCallback, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { InventoryItem } from '@/game/engine/types';
import { Package, MoreVertical, Trash2, ArrowUpFromLine, Hand } from 'lucide-react';

// ─── Props ──────────────────────────────────────────────────────────

interface InventorySlotProps {
  /** 当前物品（空槽位时不传） */
  item?: InventoryItem;
  /** 选中物品回调 */
  onSelect?: (item: InventoryItem) => void;
  /** 是否高亮 TSF 触发物 */
  glowActive?: boolean;
  /** 是否处于选中状态 */
  isSelected?: boolean;
}

// ─── 稀有度边框映射 ─────────────────────────────────────────────────

const rarityBorders: Record<string, string> = {
  common: 'border-white/5',
  uncommon: 'border-green-700/30',
  rare: 'border-blue-700/40',
  legendary: 'border-purple-700/50 shadow-[0_0_8px_rgba(168,85,247,0.2)]',
  unique: 'border-amber-700/50 shadow-[0_0_10px_rgba(251,191,36,0.3)]',
};

// ─── 上下文菜单操作 ─────────────────────────────────────────────────

interface ContextAction {
  label: string;
  action: 'use' | 'discard' | 'equip';
  icon: React.ReactNode;
  condition?: (item: InventoryItem) => boolean;
}

const CONTEXT_ACTIONS: ContextAction[] = [
  {
    label: '使用',
    action: 'use',
    icon: <Hand className="w-3 h-3" />,
    condition: (item) => item.category === 'consumable' || !!item.useEffect,
  },
  {
    label: '装备',
    action: 'equip',
    icon: <ArrowUpFromLine className="w-3 h-3" />,
    condition: (item) => item.category === 'equipment',
  },
  {
    label: '丢弃',
    action: 'discard',
    icon: <Trash2 className="w-3 h-3" />,
    condition: (item) => item.droppable !== false,
  },
];

// ─── Component ──────────────────────────────────────────────────────

export const InventorySlot: React.FC<InventorySlotProps> = ({
  item,
  onSelect,
  glowActive = false,
  isSelected = false,
}) => {
  const [contextOpen, setContextOpen] = useState(false);
  const [contextPos, setContextPos] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  const isEmpty = !item;

  // 点击外部关闭菜单
  useEffect(() => {
    if (!contextOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setContextOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [contextOpen]);

  // 右键/长按打开菜单
  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      if (isEmpty) return;
      e.preventDefault();
      setContextPos({ x: e.clientX, y: e.clientY });
      setContextOpen(true);
    },
    [isEmpty],
  );

  const handleContextAction = useCallback(
    (action: string) => {
      setContextOpen(false);
      // 父组件通过 onSelect 处理具体操作
      if (item) onSelect?.(item);
    },
    [item, onSelect],
  );

  const isTSFTrigger =
    item?.category === 'special' &&
    (item as any).triggerConfig !== undefined;

  return (
    <div className="relative">
      {/* 格子主体 */}
      <button
        onClick={() => {
          if (!isEmpty) onSelect?.(item!);
        }}
        onContextMenu={handleContextMenu}
        disabled={isEmpty}
        className={cn(
          // 尺寸和布局
          'w-full aspect-square rounded-lg border-2',
          'flex flex-col items-center justify-center gap-1',
          'transition-all duration-200 relative',
          // 基础样式
          'bg-black/40 backdrop-blur-sm',
          // 空状态
          isEmpty
            ? 'border-white/5 cursor-default opacity-30'
            : 'cursor-pointer hover:bg-white/5',
          // 稀有度边框
          !isEmpty && (rarityBorders[item!.rarity ?? 'common']),
          // TSF 高亮
          isTSFTrigger && glowActive && 'item-glow border-amber-500/40',
          // 选中状态
          isSelected && 'ring-2 ring-amber-400/50 border-amber-400/40',
        )}
      >
        {isEmpty ? (
          // 空槽位占位
          <Package className="w-5 h-5 text-white/10" />
        ) : (
          <>
            {/* 图标区域 */}
            <div className="w-8 h-8 rounded-md bg-white/5 flex items-center justify-center">
              {item.icon ? (
                <img
                  src={item.icon}
                  alt={item.name}
                  className="w-6 h-6 object-contain"
                  draggable={false}
                />
              ) : (
                <Package className="w-5 h-5 text-gray-500" />
              )}
            </div>

            {/* 名称 */}
            <span
              className={cn(
                'text-[10px] text-gray-300 truncate max-w-full px-0.5',
                isTSFTrigger && 'text-amber-300/80',
              )}
            >
              {item.name}
            </span>

            {/* 堆叠数 */}
            {item.quantity > 1 && (
              <span
                className={cn(
                  'absolute top-1 right-1',
                  'text-[9px] font-mono px-1 rounded',
                  'bg-gray-900/80 text-gray-400',
                )}
              >
                x{item.quantity}
              </span>
            )}

            {/* TSF 标记 */}
            {isTSFTrigger && (
              <span
                className={cn(
                  'absolute top-1 left-1',
                  'w-2 h-2 rounded-full',
                  glowActive
                    ? 'bg-amber-400 animate-pulse'
                    : 'bg-amber-600',
                )}
              />
            )}
          </>
        )}
      </button>

      {/* 右键上下文菜单 */}
      {contextOpen && !isEmpty && item && (
        <div
          ref={menuRef}
          className={cn(
            'fixed z-[200] min-w-[120px] py-1 rounded-lg',
            'bg-gray-900/95 backdrop-blur-md border border-white/10',
            'shadow-2xl',
          )}
          style={{ left: contextPos.x, top: contextPos.y }}
        >
          {CONTEXT_ACTIONS.filter(
            (act) => !act.condition || act.condition(item!),
          ).map((act) => (
            <button
              key={act.action}
              onClick={() => handleContextAction(act.action)}
              className={cn(
                'w-full flex items-center gap-2 px-3 py-1.5 text-xs',
                'text-gray-300 hover:text-white hover:bg-white/5',
                'transition-colors',
              )}
            >
              {act.icon}
              {act.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default InventorySlot;
