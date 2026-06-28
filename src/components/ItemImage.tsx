// ============================================================================
// ItemImage — 道具图标组件
// 将道具 ID 映射为对应的 SVG 图标，支持三种尺寸
// ============================================================================

import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { getItemImage } from './ItemImageIndex';

// ─── 尺寸映射 ────────────────────────────────────────────────────────

const SIZE_MAP = {
  sm: 32,
  md: 48,
  lg: 64,
} as const;

type SizeKey = 'sm' | 'md' | 'lg';

// ─── Props ───────────────────────────────────────────────────────────

interface ItemImageProps {
  /** 道具 ID，用于查找对应的 SVG 图标 */
  itemId: string;
  /** 额外 CSS 类名 */
  className?: string;
  /** 图标尺寸：sm(32px) | md(48px) | lg(64px)，默认 md */
  size?: SizeKey;
  /** 是否显示为圆形裁剪 */
  rounded?: boolean;
  /** 点击回调 */
  onClick?: () => void;
  /** 提示文字 */
  tooltip?: string;
}

// ─── 颜色工具箱：为不同道具分配背景色 ──────────────────────────────

const ITEM_BG_COLORS: Record<string, string> = {
  phone: 'bg-gradient-to-br from-indigo-900/40 to-blue-900/30',
  camera: 'bg-gradient-to-br from-gray-800/50 to-gray-900/40',
  flashlight: 'bg-gradient-to-br from-amber-900/40 to-yellow-900/30',
  recorder: 'bg-gradient-to-br from-red-900/30 to-gray-900/40',
  notebook: 'bg-gradient-to-br from-amber-950/40 to-stone-900/30',
  badge: 'bg-gradient-to-br from-yellow-900/40 to-amber-900/30',
  key: 'bg-gradient-to-br from-amber-900/40 to-orange-900/30',
  photo: 'bg-gradient-to-br from-purple-900/30 to-pink-900/30',
  mirror: 'bg-gradient-to-br from-slate-800/40 to-gray-900/30',
  compass: 'bg-gradient-to-br from-emerald-900/30 to-teal-900/30',
};

const DEFAULT_BG = 'bg-gradient-to-br from-gray-800/40 to-gray-900/30';

function getItemBg(itemId: string): string {
  return ITEM_BG_COLORS[itemId] ?? DEFAULT_BG;
}

// ─── 组件 ────────────────────────────────────────────────────────────

const ItemImage: React.FC<ItemImageProps> = ({
  itemId,
  className,
  size = 'md',
  rounded = false,
  onClick,
  tooltip,
}) => {
  const pixelSize = SIZE_MAP[size];

  const svgIcon = useMemo(
    () => getItemImage(itemId, pixelSize),
    [itemId, pixelSize],
  );

  const containerStyle = useMemo(
    () => ({
      width: pixelSize,
      height: pixelSize,
      minWidth: pixelSize,
      minHeight: pixelSize,
    }),
    [pixelSize],
  );

  return (
    <div
      title={tooltip}
      onClick={onClick}
      style={containerStyle}
      className={cn(
        // 基础布局
        'inline-flex items-center justify-center',
        // 背景与装饰
        getItemBg(itemId),
        'border border-white/5',
        // 圆角控制
        rounded ? 'rounded-full' : 'rounded-lg',
        // 点击交互
        onClick && 'cursor-pointer hover:scale-110 active:scale-95 transition-transform duration-150',
        // 外部类名
        className,
      )}
      role={onClick ? 'button' : 'img'}
      aria-label={`道具图标: ${itemId}`}
    >
      {svgIcon}
    </div>
  );
};

// ─── 快捷变体组件 ────────────────────────────────────────────────────

/**
 * 小尺寸道具图标（32x32）
 */
export const ItemImageSm: React.FC<Omit<ItemImageProps, 'size'>> = (props) => (
  <ItemImage {...props} size="sm" />
);

/**
 * 中等尺寸道具图标（48x48）
 */
export const ItemImageMd: React.FC<Omit<ItemImageProps, 'size'>> = (props) => (
  <ItemImage {...props} size="md" />
);

/**
 * 大尺寸道具图标（64x64）
 */
export const ItemImageLg: React.FC<Omit<ItemImageProps, 'size'>> = (props) => (
  <ItemImage {...props} size="lg" />
);

// ─── 道具图标列表组件 ───────────────────────────────────────────────

interface ItemImageListProps {
  itemIds: string[];
  size?: SizeKey;
  className?: string;
  selectedId?: string;
  onSelect?: (itemId: string) => void;
}

/**
 * 道具图标列表 — 横向排列多个道具图标
 */
export const ItemImageList: React.FC<ItemImageListProps> = ({
  itemIds,
  size = 'md',
  className,
  selectedId,
  onSelect,
}) => (
  <div className={cn('flex flex-wrap gap-2', className)}>
    {itemIds.map((id) => (
      <div key={id} className="flex flex-col items-center gap-1">
        <ItemImage
          itemId={id}
          size={size}
          onClick={onSelect ? () => onSelect(id) : undefined}
          className={cn(
            selectedId === id && 'ring-2 ring-amber-400/50 border-amber-400/40',
          )}
        />
      </div>
    ))}
  </div>
);

export default ItemImage;
