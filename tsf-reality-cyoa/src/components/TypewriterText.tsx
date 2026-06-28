import React, { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

// ─── Props ──────────────────────────────────────────────────────────

interface TypewriterTextProps {
  /** 要显示的文本 */
  text: string;
  /** 打字速度（毫秒/字），默认 40 */
  speed?: number;
  /** 打字完成回调 */
  onComplete?: () => void;
  /** 额外类名 */
  className?: string;
  /** 是否使用真相文本样式 */
  isTruth?: boolean;
  /** 是否使用居民文本样式 */
  isResident?: boolean;
}

// ─── 简单 HTML 剥离与颜色标记解析 ──────────────────────────────────
// 支持 <color=#hex>text</color> 和 <span style="color:...">text</span>

function parseColoredText(raw: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const regex = /<color=#?([0-9a-fA-F]{3,8})>(.*?)<\/color>|<span[^>]*color:\s*(#[0-9a-fA-F]{3,8})[^>]*>(.*?)<\/span>/gs;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(raw)) !== null) {
    // 前面的纯文本
    if (match.index > lastIndex) {
      nodes.push(raw.slice(lastIndex, match.index));
    }

    const color = match[1] ?? match[2] ?? '#fbbf24';
    const content = match[2] ?? match[3] ?? '';
    nodes.push(
      <span key={`c-${key++}`} style={{ color }}>
        {content}
      </span>,
    );

    lastIndex = match.index + match[0].length;
  }

  // 剩余文本
  if (lastIndex < raw.length) {
    nodes.push(raw.slice(lastIndex));
  }

  return nodes;
}

// ─── Component ──────────────────────────────────────────────────────

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  speed = 40,
  onComplete,
  className,
  isTruth = false,
  isResident = false,
}) => {
  const [displayIndex, setDisplayIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 重置文本变化
  useEffect(() => {
    setDisplayIndex(0);
    setCompleted(false);
    setSkipped(false);
  }, [text]);

  // 打字效果
  useEffect(() => {
    if (skipped || displayIndex >= text.length) return;

    timerRef.current = setInterval(() => {
      setDisplayIndex((prev) => {
        if (prev >= text.length) {
          if (timerRef.current) clearInterval(timerRef.current);
          return text.length;
        }
        return prev + 1;
      });
    }, speed);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [text, speed, skipped, displayIndex, text.length]);

  // 完成检测
  useEffect(() => {
    if (displayIndex >= text.length && !completed) {
      setCompleted(true);
      onComplete?.();
    }
  }, [displayIndex, text.length, completed, onComplete]);

  // 自动滚动
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [displayIndex]);

  // 点击跳过
  const handleClick = useCallback(() => {
    if (completed) return;
    setSkipped(true);
    setDisplayIndex(text.length);
  }, [text.length, completed]);

  // 显示内容
  const displayText = skipped ? text : text.slice(0, displayIndex);
  const parsedNodes = parseColoredText(displayText);
  const isTyping = displayIndex < text.length;

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className={cn(
        'typewriter-box cursor-pointer overflow-y-auto max-h-[60vh]',
        isTruth && 'truth-text',
        isResident && 'resident-text',
        className,
      )}
      role="textbox"
      aria-label="叙事文本（点击跳过打字效果）"
    >
      <p className="narrative-text whitespace-pre-wrap break-words">
        {parsedNodes}

        {/* 闪烁光标 */}
        {isTyping && (
          <span
            className={cn(
              'typewriter-cursor inline-block w-[2px] h-[1em] ml-0.5',
              'bg-amber-400/70 animate-typewriter-cursor',
            )}
            aria-hidden="true"
          />
        )}
      </p>

      {/* 点击继续提示 */}
      {completed && (
        <div className="mt-3 text-center">
          <span className="text-xs text-gray-500 animate-pulse">
            - 点击继续 -
          </span>
        </div>
      )}
    </div>
  );
};

export default TypewriterText;
