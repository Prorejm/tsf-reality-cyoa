// ============================================================================
// Item Image Registry — 道具图片注册表
// 将道具 ID 映射到对应的 SVG 渲染函数
// 便于统一管理和扩展新道具
// ============================================================================

import React from 'react';

// ─── 渲染器类型 ──────────────────────────────────────────────────────

type ItemImageRenderer = (size: number, className?: string) => React.ReactNode;

// ─── 注册表 ──────────────────────────────────────────────────────────

const itemImageRegistry: Record<string, ItemImageRenderer> = {};

// ==================== 注册道具 SVG 渲染器 =============================

// ── 1. 手机/智能手机 ────────────────────────────────────────────────
itemImageRegistry['phone'] = (size, className) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* 手机外壳 */}
    <rect x="14" y="4" width="36" height="56" rx="5" ry="5" fill="#1a1a2e" stroke="#4a4a6a" strokeWidth="1.5" />
    {/* 屏幕 */}
    <rect x="17" y="10" width="30" height="44" rx="2" fill="#0d0d1a" />
    {/* 屏幕渐变光晕 */}
    <rect x="17" y="10" width="30" height="44" rx="2" fill="url(#phone-screen-grad)" opacity="0.6" />
    {/* 屏幕内容：时间 */}
    <text x="32" y="20" textAnchor="middle" fill="#8af" fontSize="4" fontFamily="monospace">10:30</text>
    {/* 屏幕内容：应用图标行 */}
    <rect x="20" y="24" width="8" height="8" rx="1.5" fill="#4f8cff" opacity="0.8" />
    <rect x="31" y="24" width="8" height="8" rx="1.5" fill="#34c759" opacity="0.8" />
    <rect x="20" y="35" width="8" height="8" rx="1.5" fill="#ff9500" opacity="0.8" />
    <rect x="31" y="35" width="8" height="8" rx="1.5" fill="#ff3b30" opacity="0.8" />
    {/* 底部Home条 */}
    <rect x="25" y="48" width="14" height="2" rx="1" fill="#333" />
    {/* 听筒 */}
    <rect x="28" y="6" width="8" height="1.5" rx="0.75" fill="#333" />
    {/* 渐变色定义 */}
    <defs>
      <linearGradient id="phone-screen-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#4f8cff" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.15" />
      </linearGradient>
    </defs>
  </svg>
);

// ── 2. 相机 ─────────────────────────────────────────────────────────
itemImageRegistry['camera'] = (size, className) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* 机身 */}
    <rect x="8" y="20" width="48" height="32" rx="4" fill="#2a2a3a" stroke="#555" strokeWidth="1.5" />
    {/* 顶部突出（取景器/闪光灯区域） */}
    <path d="M18 20 L18 15 L28 15 L30 20 Z" fill="#2a2a3a" stroke="#555" strokeWidth="1.2" />
    {/* 闪光灯 */}
    <rect x="38" y="22" width="10" height="4" rx="1" fill="#ffd60a" opacity="0.7" />
    {/* 主镜头外圈 */}
    <circle cx="32" cy="36" r="12" fill="#1a1a2a" stroke="#666" strokeWidth="1.5" />
    {/* 主镜头内圈 */}
    <circle cx="32" cy="36" r="8" fill="#0d0d1a" stroke="#444" strokeWidth="1" />
    {/* 镜头玻璃 */}
    <circle cx="32" cy="36" r="5" fill="url(#lens-grad)" />
    {/* 镜头反光 */}
    <ellipse cx="30" cy="34" rx="2" ry="1.5" fill="white" opacity="0.2" />
    {/* 快门按钮 */}
    <circle cx="44" cy="42" r="3" fill="#ff3b30" opacity="0.8" />
    <defs>
      <radialGradient id="lens-grad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#4f8cff" stopOpacity="0.4" />
        <stop offset="60%" stopColor="#1a1a3a" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#0a0a1a" />
      </radialGradient>
    </defs>
  </svg>
);

// ── 3. 手电筒 ──────────────────────────────────────────────────────
itemImageRegistry['flashlight'] = (size, className) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* 手电筒筒身 */}
    <rect x="22" y="14" width="20" height="28" rx="3" fill="#333" stroke="#555" strokeWidth="1.5" />
    {/* 握把纹路 */}
    <line x1="22" y1="20" x2="42" y2="20" stroke="#444" strokeWidth="0.8" />
    <line x1="22" y1="24" x2="42" y2="24" stroke="#444" strokeWidth="0.8" />
    <line x1="22" y1="28" x2="42" y2="28" stroke="#444" strokeWidth="0.8" />
    {/* 灯头 */}
    <rect x="18" y="42" width="28" height="6" rx="2" fill="#444" stroke="#666" strokeWidth="1" />
    {/* 灯泡 */}
    <ellipse cx="32" cy="45" rx="4" ry="2" fill="#ffe066" opacity="0.9" />
    {/* 光束 */}
    <path d="M20 48 L2 64 L62 64 L44 48 Z" fill="url(#beam-grad)" opacity="0.4" />
    {/* 开关 */}
    <rect x="29" y="12" width="6" height="4" rx="1" fill="#ff9500" />
    <defs>
      <linearGradient id="beam-grad" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stopColor="#ffe066" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#ffe066" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

// ── 4. 录音机 ──────────────────────────────────────────────────────
itemImageRegistry['recorder'] = (size, className) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* 机身 */}
    <rect x="6" y="16" width="52" height="32" rx="4" fill="#222" stroke="#555" strokeWidth="1.5" />
    {/* 左侧磁带轮 */}
    <circle cx="22" cy="32" r="10" fill="#1a1a2a" stroke="#444" strokeWidth="1" />
    <circle cx="22" cy="32" r="5" fill="#333" stroke="#555" strokeWidth="0.8" />
    {/* 右侧磁带轮 */}
    <circle cx="42" cy="32" r="10" fill="#1a1a2a" stroke="#444" strokeWidth="1" />
    <circle cx="42" cy="32" r="5" fill="#333" stroke="#555" strokeWidth="0.8" />
    {/* 磁带 */}
    <path d="M22 28 Q32 22 42 28" fill="none" stroke="#666" strokeWidth="0.8" />
    <path d="M22 36 Q32 42 42 36" fill="none" stroke="#666" strokeWidth="0.8" />
    {/* 麦克风 */}
    <rect x="28" y="14" width="8" height="4" rx="1.5" fill="#555" stroke="#777" strokeWidth="0.8" />
    {/* 按钮行 */}
    <rect x="10" y="40" width="8" height="4" rx="1" fill="#ff3b30" opacity="0.7" />
    <rect x="22" y="40" width="8" height="4" rx="1" fill="#555" />
    <rect x="34" y="40" width="8" height="4" rx="1" fill="#555" />
    {/* 指示灯 */}
    <circle cx="48" cy="42" r="2" fill="#34c759" opacity="0.8" />
  </svg>
);

// ── 5. 笔记本 ──────────────────────────────────────────────────────
itemImageRegistry['notebook'] = (size, className) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* 封底 */}
    <rect x="10" y="8" width="44" height="48" rx="2" fill="#1a1208" stroke="#8b7355" strokeWidth="1.5" />
    {/* 封面 */}
    <rect x="12" y="10" width="42" height="46" rx="1.5" fill="#2a1f0e" stroke="#a0896a" strokeWidth="1" />
    {/* 书脊 */}
    <rect x="10" y="8" width="6" height="48" rx="1" fill="#4a3520" stroke="#6b5540" strokeWidth="0.8" />
    {/* 内页（右侧） */}
    <rect x="18" y="12" width="34" height="42" rx="1" fill="#f5f0e0" />
    {/* 书写线 */}
    <line x1="22" y1="20" x2="48" y2="20" stroke="#d4cbb8" strokeWidth="0.5" />
    <line x1="22" y1="26" x2="48" y2="26" stroke="#d4cbb8" strokeWidth="0.5" />
    <line x1="22" y1="32" x2="48" y2="32" stroke="#d4cbb8" strokeWidth="0.5" />
    <line x1="22" y1="38" x2="48" y2="38" stroke="#d4cbb8" strokeWidth="0.5" />
    <line x1="22" y1="44" x2="48" y2="44" stroke="#d4cbb8" strokeWidth="0.5" />
    {/* 书写内容（短横线模拟文字） */}
    <line x1="22" y1="20" x2="36" y2="20" stroke="#555" strokeWidth="0.8" />
    <line x1="22" y1="26" x2="40" y2="26" stroke="#555" strokeWidth="0.8" />
    <line x1="22" y1="32" x2="32" y2="32" stroke="#555" strokeWidth="0.8" />
    <line x1="22" y1="38" x2="44" y2="38" stroke="#555" strokeWidth="0.8" />
    {/* 书签 */}
    <rect x="44" y="10" width="8" height="12" rx="1" fill="#c41e3a" opacity="0.8" />
  </svg>
);

// ── 6. 徽章 ────────────────────────────────────────────────────────
itemImageRegistry['badge'] = (size, className) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* 盾牌外形 */}
    <path d="M32 4 L52 14 L52 32 Q52 48 32 60 Q12 48 12 32 L12 14 Z" fill="url(#badge-grad)" stroke="#d4a843" strokeWidth="1.5" />
    {/* 星形 */}
    <path d="M32 16 L35.5 26 L46 26 L37.5 33 L40.5 44 L32 38 L23.5 44 L26.5 33 L18 26 L28.5 26 Z" fill="#d4a843" opacity="0.6" />
    {/* 中心文字 */}
    <circle cx="32" cy="32" r="10" fill="none" stroke="#d4a843" strokeWidth="0.8" opacity="0.5" />
    <text x="32" y="35" textAnchor="middle" fill="#d4a843" fontSize="6" fontWeight="bold" fontFamily="serif">S</text>
    <defs>
      <linearGradient id="badge-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#8b7530" />
        <stop offset="50%" stopColor="#d4a843" />
        <stop offset="100%" stopColor="#6b5a20" />
      </linearGradient>
    </defs>
  </svg>
);

// ── 7. 钥匙 ────────────────────────────────────────────────────────
itemImageRegistry['key'] = (size, className) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* 钥匙柄（圆环） */}
    <circle cx="20" cy="20" r="10" fill="none" stroke="#8b6914" strokeWidth="3" />
    <circle cx="20" cy="20" r="6" fill="none" stroke="#6b4f10" strokeWidth="1.5" />
    {/* 钥匙杆 */}
    <rect x="27" y="18" width="22" height="4" rx="1" fill="#8b6914" />
    {/* 齿 */}
    <rect x="42" y="22" width="3" height="6" rx="0.5" fill="#8b6914" />
    <rect x="36" y="22" width="3" height="8" rx="0.5" fill="#8b6914" />
    <rect x="48" y="22" width="3" height="5" rx="0.5" fill="#8b6914" />
    {/* 氧化/锈蚀效果 */}
    <circle cx="20" cy="20" r="8" fill="#5a7a5a" opacity="0.15" />
  </svg>
);

// ── 8. 照片 ────────────────────────────────────────────────────────
itemImageRegistry['photo'] = (size, className) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* 拍立得相纸框 */}
    <rect x="8" y="6" width="48" height="52" rx="3" fill="#f0f0f0" stroke="#ccc" strokeWidth="1.5" />
    {/* 照片区域 */}
    <rect x="12" y="10" width="40" height="32" rx="1" fill="url(#photo-grad)" />
    {/* 底部空白（拍立得特征） */}
    <rect x="12" y="44" width="40" height="12" rx="1" fill="#f5f5f5" />
    {/* 照片内容：风景/人物剪影 */}
    <path d="M12 38 L24 26 L32 34 L40 22 L52 38 Z" fill="white" opacity="0.15" />
    {/* 日期戳 */}
    <text x="32" y="52" textAnchor="middle" fill="#999" fontSize="3.5" fontFamily="monospace">2024.06.15</text>
    <defs>
      <linearGradient id="photo-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#667eea" stopOpacity="0.5" />
        <stop offset="50%" stopColor="#764ba2" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#f093fb" stopOpacity="0.3" />
      </linearGradient>
    </defs>
  </svg>
);

// ── 9. 镜子 ────────────────────────────────────────────────────────
itemImageRegistry['mirror'] = (size, className) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* 椭圆形镜面 */}
    <ellipse cx="32" cy="26" rx="18" ry="22" fill="url(#mirror-grad)" stroke="#c0c0c0" strokeWidth="2" />
    {/* 镜面高光 */}
    <ellipse cx="28" cy="20" rx="6" ry="8" fill="white" opacity="0.15" />
    <ellipse cx="36" cy="32" rx="3" ry="5" fill="white" opacity="0.08" />
    {/* 把手 */}
    <rect x="28" y="46" width="8" height="14" rx="3" fill="#c0c0c0" stroke="#a0a0a0" strokeWidth="1" />
    {/* 把手装饰 */}
    <circle cx="32" cy="52" r="2" fill="#a0a0a0" opacity="0.5" />
    {/* 镜框装饰 */}
    <ellipse cx="32" cy="26" rx="16" ry="20" fill="none" stroke="#d4d4d4" strokeWidth="0.5" opacity="0.3" />
    <defs>
      <linearGradient id="mirror-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#e8e8f0" stopOpacity="0.6" />
        <stop offset="30%" stopColor="#b8c6db" stopOpacity="0.4" />
        <stop offset="70%" stopColor="#f5f7fa" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#c9d6ff" stopOpacity="0.3" />
      </linearGradient>
    </defs>
  </svg>
);

// ── 10. 指南针 ─────────────────────────────────────────────────────
itemImageRegistry['compass'] = (size, className) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* 外壳 */}
    <circle cx="32" cy="32" r="28" fill="#1a1a2a" stroke="#8b7355" strokeWidth="2" />
    {/* 内圈 */}
    <circle cx="32" cy="32" r="24" fill="#0d0d1a" stroke="#6b5a40" strokeWidth="1" />
    {/* 刻度 */}
    <circle cx="32" cy="32" r="20" fill="none" stroke="#555" strokeWidth="0.5" />
    {/* 方向标记 */}
    <text x="32" y="14" textAnchor="middle" fill="#ff4444" fontSize="6" fontWeight="bold" fontFamily="serif">N</text>
    <text x="32" y="54" textAnchor="middle" fill="#888" fontSize="5" fontFamily="serif">S</text>
    <text x="12" y="35" textAnchor="middle" fill="#888" fontSize="5" fontFamily="serif">W</text>
    <text x="52" y="35" textAnchor="middle" fill="#888" fontSize="5" fontFamily="serif">E</text>
    {/* 指针 - 北（红色） */}
    <polygon points="32,14 28,32 32,30 36,32" fill="#ff4444" />
    {/* 指针 - 南（灰色） */}
    <polygon points="32,50 28,32 32,34 36,32" fill="#888" />
    {/* 中心铆钉 */}
    <circle cx="32" cy="32" r="2.5" fill="#8b7355" />
    <circle cx="32" cy="32" r="1.5" fill="#d4a843" />
  </svg>
);

// ── 默认占位图标 ──────────────────────────────────────────────────
itemImageRegistry['default'] = (size, className) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect x="4" y="4" width="56" height="56" rx="8" fill="#2a2a3a" stroke="#555" strokeWidth="1.5" />
    <circle cx="32" cy="28" r="8" fill="#555" />
    <path d="M12 52 L24 38 L32 46 L40 34 L52 52 Z" fill="#555" />
  </svg>
);

// ─── 导出类型 ────────────────────────────────────────────────────────

export type { ItemImageRenderer };

// ─── 导出获取函数 ────────────────────────────────────────────────────

/**
 * 根据道具 ID 和尺寸获取对应的 SVG 图标
 * @param itemId - 道具 ID
 * @param size - 图标尺寸（像素）
 * @param className - 额外 CSS 类名
 * @returns SVG React 节点，若未找到则返回默认占位图标
 */
export function getItemImage(
  itemId: string,
  size: number,
  className?: string,
): React.ReactNode {
  const renderer = itemImageRegistry[itemId];
  if (renderer) {
    return renderer(size, className);
  }
  // 回退到默认图标
  return itemImageRegistry['default']?.(size, className);
}

/**
 * 检查某个道具 ID 是否有注册的 SVG 渲染器
 */
export function hasItemImage(itemId: string): boolean {
  return itemId in itemImageRegistry;
}

/**
 * 获取所有已注册的道具 ID 列表
 */
export function getRegisteredItemIds(): string[] {
  return Object.keys(itemImageRegistry).filter((id) => id !== 'default');
}

export default itemImageRegistry;
