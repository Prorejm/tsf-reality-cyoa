import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useGame } from '@/game/engine/GameContext';
import type { NpcId } from '@/game/engine/types';
import { cn } from '@/lib/utils';

interface DialogueLine {
  id: string;
  speaker: string;
  residentText: string;
  truthText?: string;
  isPlayer?: boolean;
}

interface DialogueChoice {
  id: string;
  text: string;
  feedback?: string;
  effects?: Array<{ target: string; operation: string; value: any }>;
}

// NPC 中文名映射
const NPC_NAME_MAP: Record<string, string> = {
  kitsune_miko: '狐鈴',
  alraune_florist: '花音',
  slime_clerk: '小翠',
  vampire_doctor: '血月',
  succubus_bartender: '夜魅',
  dragon_mayor: '龙映',
  doll_shop_owner: '偶人',
  werewolf_detective: '老狼',
};

// NPC 好感度等级标签
const AFFINITY_LABELS: Record<number, string> = {
  0: '陌生人',
  1: '认识',
  2: '友好',
  3: '信任',
  4: '亲密',
  5: '羁绊',
};

const DialogueScreen: React.FC = () => {
  const { state, dispatch } = useGame();

  const npcId: NpcId = (state?.narrative?.flags?.['_dialogue_npc'] as string) ?? 'kitsune_miko';
  const perceptionMode = (state as any)?.perceptionMode ?? 'resident';
  const isTruth = perceptionMode === 'truth';

  const npcRelation = state?.npcRelations?.[npcId];
  const affinity = npcRelation?.affinity ?? 0;
  const affinityPoints = npcRelation?.affinityPoints ?? 0;
  const affinityLevel = (npcRelation?.affinity ?? 0) as keyof typeof AFFINITY_LABELS;

  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [showChoices, setShowChoices] = useState(false);
  const [dialogueHistory, setDialogueHistory] = useState<DialogueLine[]>([]);
  const [selectedChoiceIndex, setSelectedChoiceIndex] = useState<number | null>(null);
  const typewriterRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 模拟对话内容（基于NPC和好感度动态生成）
  const dialogueLines: DialogueLine[] = [
    {
      id: 'line_1',
      speaker: NPC_NAME_MAP[npcId] ?? npcId,
      residentText: '欢迎光临。今天需要些什么吗？',
      truthText: '你又来了……也好，至少你没被那些「常识」同化。',
    },
    {
      id: 'line_2',
      speaker: NPC_NAME_MAP[npcId] ?? npcId,
      residentText: '最近天气不错，不是吗？',
      truthText: '你注意到了吗？天空的颜色又变了一点。越来越……假了。',
    },
  ];

  if (affinityPoints > 30) {
    dialogueLines.push({
      id: 'line_3',
      speaker: NPC_NAME_MAP[npcId] ?? npcId,
      residentText: '你是个好人，我一直这么觉得。',
      truthText: '我能信任你吗？在这个一切都可能被改写的地方……',
    });
  }

  const choices: DialogueChoice[] = [
    {
      id: 'choice_1',
      text: '继续听她说下去',
      effects: [{ target: 'npcAffinity', operation: 'add', value: 2 }],
    },
    {
      id: 'choice_2',
      text: '问一些关于这座城市的问题',
      effects: [{ target: 'awareness', operation: 'add', value: 3 }],
    },
    {
      id: 'choice_3',
      text: '（观察对方身上的异常之处）',
      effects: [
        { target: 'awareness', operation: 'add', value: 5 },
        { target: 'erosion', operation: 'add', value: 2 },
      ],
    },
  ];

  const currentLine = dialogueLines[currentLineIndex];

  // 打字机效果
  useEffect(() => {
    if (!currentLine) return;
    const fullText = isTruth && currentLine.truthText ? currentLine.truthText : currentLine.residentText;

    setCharIndex(0);
    setDisplayedText('');
    setShowChoices(false);

    typewriterRef.current = setInterval(() => {
      setCharIndex((prev) => prev + 1);
    }, 35);

    return () => {
      if (typewriterRef.current) clearInterval(typewriterRef.current);
    };
  }, [currentLineIndex, isTruth]);

  useEffect(() => {
    if (!currentLine) return;
    const fullText = isTruth && currentLine.truthText ? currentLine.truthText : currentLine.residentText;

    if (charIndex < fullText.length) {
      setDisplayedText(fullText.slice(0, charIndex + 1));
    } else {
      if (typewriterRef.current) clearInterval(typewriterRef.current);
      setShowChoices(true);
    }
  }, [charIndex, currentLine]);

  const handleChoice = useCallback(
    (choice: DialogueChoice, index: number) => {
      setSelectedChoiceIndex(index);
      setShowChoices(false);

      // 记录对话历史
      const newLine: DialogueLine = {
        id: `player_choice_${Date.now()}`,
        speaker: '你',
        residentText: choice.text,
        isPlayer: true,
      };
      setDialogueHistory((prev) => [...prev, currentLine!, newLine]);

      // 应用选择效果
      if (choice.effects) {
        choice.effects.forEach((eff) => {
          if (eff.target === 'npcAffinity') {
            dispatch({
              type: 'MODIFY_NPC_AFFINITY',
              payload: { npcId, amount: eff.value as number },
            });
          } else if (eff.target === 'awareness') {
            dispatch({
              type: 'APPLY_AWARENESS',
              payload: { amount: eff.value as number, reason: `与 ${NPC_NAME_MAP[npcId]} 的对话` },
            });
          } else if (eff.target === 'erosion') {
            dispatch({
              type: 'APPLY_EROSION',
              payload: { amount: eff.value as number, reason: `与 ${NPC_NAME_MAP[npcId]} 的对话` },
            });
          }
        });
      }

      // 推进到下一段对话或结束
      setTimeout(() => {
        if (currentLineIndex < dialogueLines.length - 1) {
          setCurrentLineIndex((prev) => prev + 1);
          setSelectedChoiceIndex(null);
        } else {
          // 对话结束，返回探索
          dispatch({
            type: 'SET_FLAG',
            payload: { key: '_screen', value: 'exploration' },
          });
        }
      }, 800);
    },
    [dispatch, npcId, currentLineIndex, dialogueLines.length, currentLine],
  );

  const handleBack = useCallback(() => {
    dispatch({
      type: 'SET_FLAG',
      payload: { key: '_screen', value: 'exploration' },
    });
  }, [dispatch]);

  const hasNextLine = currentLineIndex < dialogueLines.length - 1;
  const fullText = currentLine
    ? isTruth && currentLine.truthText
      ? currentLine.truthText
      : currentLine.residentText
    : '';

  return (
    <div className="game-container min-h-screen flex flex-col">
      {/* 顶部信息栏 */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handleBack}
          className="text-xs text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded bg-white/5 border border-white/10"
        >
          返回探索
        </button>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-500">
            好感度 Lv.{affinityLevel}
          </span>
          <span
            className={cn(
              'text-xs',
              affinityPoints > 50 ? 'text-pink-300' : 'text-gray-400',
            )}
          >
            {affinityPoints}/100 · {AFFINITY_LABELS[affinityLevel] ?? '未知'}
          </span>
        </div>
      </div>

      {/* 主对话区 */}
      <div className="flex-1 flex flex-col gap-4">
        {/* 左侧角色信息 */}
        <div className="flex items-center gap-4 p-4 bg-black/40 rounded-lg border border-white/5">
          {/* 角色头像占位 */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 border border-purple-400/20 flex items-center justify-center shrink-0">
            <span className="font-title text-2xl text-purple-300">
              {NPC_NAME_MAP[npcId]?.charAt(0) ?? '?'}
            </span>
          </div>
          <div>
            <h3 className="font-game text-lg text-purple-200">
              {NPC_NAME_MAP[npcId] ?? npcId}
            </h3>
            <p className="text-xs text-gray-500">
              {isTruth ? '【真相视角】' : '【居民视角】'}
            </p>
          </div>
        </div>

        {/* 对话历史 */}
        {dialogueHistory.length > 0 && (
          <div className="max-h-24 overflow-y-auto p-2 bg-black/20 rounded border border-white/5">
            {dialogueHistory.map((line, i) => (
              <p
                key={`${line.id}-${i}`}
                className={cn(
                  'text-xs mb-1',
                  line.isPlayer ? 'text-blue-300/70' : 'text-gray-300/70',
                )}
              >
                <span className="font-semibold">{line.speaker}：</span>
                {line.isPlayer ? line.residentText : line.residentText}
              </p>
            ))}
          </div>
        )}

        {/* 当前对话行 - 打字机效果 */}
        {currentLine && (
          <div className="typewriter-box flex-1 min-h-[120px]">
            <p className="text-xs text-gray-400 mb-2">
              {currentLine.speaker}
            </p>
            <p
              className={cn(
                'narrative-text leading-relaxed',
                isTruth && currentLine.truthText && 'truth-text',
                !isTruth && 'resident-text',
              )}
            >
              {displayedText}
              {charIndex < fullText.length && <span className="typewriter-cursor" />}
            </p>
            {isTruth && currentLine.truthText && (
              <div className="mt-2 p-2 bg-blue-500/5 border border-blue-500/10 rounded">
                <p className="text-[10px] text-blue-300/60">
                  * 这是真相视角下的隐藏内容
                </p>
              </div>
            )}
          </div>
        )}

        {/* 选择支 */}
        {showChoices && (
          <div className="flex flex-col gap-2">
            <p className="text-xs text-gray-500 mb-1">你的回应：</p>
            {choices.map((choice, idx) => (
              <button
                key={choice.id}
                onClick={() => handleChoice(choice, idx)}
                disabled={selectedChoiceIndex !== null}
                className={cn(
                  'choice-button text-sm',
                  selectedChoiceIndex === idx && 'opacity-60',
                )}
              >
                {choice.text}
                {(choice.effects?.some((e) => e.target === 'awareness') ||
                  choice.effects?.some((e) => e.target === 'erosion')) && (
                  <span className="ml-2 text-[10px] text-gray-500">
                    {choice.effects
                      ?.filter((e) => e.target !== 'npcAffinity')
                      .map((e) =>
                        e.target === 'awareness'
                          ? `[认知+${e.value}]`
                          : `[侵蚀+${e.value}]`,
                      )
                      .join(' ')}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* 推进对话按钮 */}
        {showChoices && hasNextLine && (
          <button
            onClick={() => {
              setCurrentLineIndex((prev) => prev + 1);
              setSelectedChoiceIndex(null);
            }}
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors self-center mt-2"
          >
            继续 →
          </button>
        )}
      </div>
    </div>
  );
};

export default DialogueScreen;
