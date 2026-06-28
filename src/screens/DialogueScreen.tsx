import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
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

const NPC_NAME_MAP: Record<string, string> = {
  kitsune_miko: '狐鈴', alraune_florist: '花音', slime_clerk: '小翠',
  vampire_doctor: '血月', succubus_bartender: '夜魅',
  dragon_mayor: '龙映', doll_shop_owner: '偶人', werewolf_detective: '老狼',
};

const AFFINITY_LABELS: Record<number, string> = {
  0: '陌生人', 1: '认识', 2: '友好', 3: '信任', 4: '亲密', 5: '羁绊',
};

// NPC dialogue pools
const NPC_DIALOGUES: Record<string, DialogueLine[]> = {
  kitsune_miko: [
    { id: 'km1', speaker: '狐鈴', residentText: '欢迎来到神社。你看起来……有些迷茫？', truthText: '你能看到那些东西对吧？我就知道你不是普通人。' },
    { id: 'km2', speaker: '狐鈴', residentText: '这里的樱花一年四季都开着呢，很美吧。', truthText: '这些樱花不是真的——它们是"常识"的一部分。但很美，不是吗？' },
    { id: 'km3', speaker: '狐鈴', residentText: '如果有空的话，可以常来坐坐。', truthText: '小心那些太"正常"的人。他们可能是被同化得最彻底的。' },
  ],
  alraune_florist: [
    { id: 'af1', speaker: '花音', residentText: '欢迎光临！今天的花特别新鲜哦。', truthText: '你喜欢这些花吗？它们是我用自己的……方式培育的。' },
    { id: 'af2', speaker: '花音', residentText: '这朵玫瑰很适合你。', truthText: '闭上眼睛闻一闻——你能感觉到吗？这些花在"呼吸"着什么。' },
  ],
  slime_clerk: [
    { id: 'sc1', speaker: '小翠', residentText: '欢、欢迎光临！需要什么帮助吗？', truthText: '你不觉得我的同事们都怪怪的吗？我是说……比我还怪。' },
    { id: 'sc2', speaker: '小翠', residentText: '老板说今天有特价商品哦。', truthText: '那些"特价商品"……别买。相信我。' },
  ],
};

const DialogueScreen: React.FC = () => {
  const { state, dispatch } = useGame();

  // === Flat state access ===
  const npcId: NpcId = (state.flags?.['_dialogue_npc'] as string) ?? 'kitsune_miko';
  const perceptionMode = state.perceptionMode ?? 'resident';
  const isTruth = perceptionMode === 'truth';
  const npcRelation = state.npcRelations?.[npcId];
  const affinity = npcRelation?.affinity ?? 0;

  // Dialogue content (memoized by NPC)
  const dialogueLines = useMemo(() => {
    const base = NPC_DIALOGUES[npcId] ?? [
      { id: 'gen1', speaker: NPC_NAME_MAP[npcId] ?? npcId, residentText: '你好。有什么事吗？', truthText: '……你看到了真实的我？有意思。' },
      { id: 'gen2', speaker: NPC_NAME_MAP[npcId] ?? npcId, residentText: '今天天气不错。', truthText: '不要相信你看到的一切。' },
    ];
    // Extra line at high affinity
    if (affinity > 20) {
      return [...base, { id: 'aff_ext', speaker: NPC_NAME_MAP[npcId] ?? npcId, residentText: '你是个好人，我一直这么觉得。', truthText: '我能信任你吗？在这个一切都可能被改写的地方……' }];
    }
    return base;
  }, [npcId, affinity]);

  const choices: DialogueChoice[] = [
    { id: 'c1', text: '继续听她说下去', effects: [{ target: 'npcAffinity', operation: 'add', value: 2 }] },
    { id: 'c2', text: '问一些关于这座城市的问题', effects: [{ target: 'awareness', operation: 'add', value: 3 }] },
    { id: 'c3', text: '（观察对方身上的异常之处）', effects: [{ target: 'awareness', operation: 'add', value: 5 }, { target: 'erosion', operation: 'add', value: 2 }] },
  ];

  const [step, setStep] = useState<'typing' | 'choices' | 'transitioning'>('typing');
  const [lineIndex, setLineIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);

  const currentLine = dialogueLines[lineIndex];

  // Typewriter: reset on new line
  useEffect(() => {
    if (!currentLine) return;
    setStep('typing');
    setDisplayed('');
    setSelectedChoice(null);

    const fullText = isTruth && currentLine.truthText ? currentLine.truthText : currentLine.residentText;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(fullText.slice(0, i));
      if (i >= fullText.length) {
        clearInterval(interval);
        setStep('choices');
      }
    }, 30);
    return () => clearInterval(interval);
  }, [lineIndex, isTruth, currentLine?.id]);

  const navigateBack = useCallback(() => {
    dispatch({ type: 'SET_FLAG', payload: { key: '_screen', value: 'exploration' } });
  }, [dispatch]);

  const handleChoice = useCallback((choice: DialogueChoice, idx: number) => {
    setSelectedChoice(idx);
    setStep('transitioning');

    if (choice.effects) {
      choice.effects.forEach(eff => {
        if (eff.target === 'npcAffinity') {
          dispatch({ type: 'MODIFY_NPC_AFFINITY', payload: { npcId, amount: eff.value as number } });
        } else if (eff.target === 'awareness') {
          dispatch({ type: 'APPLY_AWARENESS', payload: { amount: eff.value as number, reason: `对话: ${NPC_NAME_MAP[npcId]}` } });
        } else if (eff.target === 'erosion') {
          dispatch({ type: 'APPLY_EROSION', payload: { amount: eff.value as number, reason: `对话: ${NPC_NAME_MAP[npcId]}` } });
        }
      });
    }

    // Next line or back to exploration
    setTimeout(() => {
      if (lineIndex < dialogueLines.length - 1) {
        setLineIndex(i => i + 1);
      } else {
        navigateBack();
      }
    }, 600);
  }, [dispatch, npcId, lineIndex, dialogueLines.length, navigateBack]);

  if (!currentLine) {
    return (
      <div className="game-container min-h-screen flex items-center justify-center">
        <p className="text-gray-500">对话已结束。</p>
        <button onClick={navigateBack} className="mt-4 text-xs text-purple-300 hover:text-white">返回探索</button>
      </div>
    );
  }

  const fullText = isTruth && currentLine.truthText ? currentLine.truthText : currentLine.residentText;

  return (
    <div className="game-container min-h-screen flex flex-col bg-gradient-to-b from-gray-900 via-purple-950/30 to-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 p-4 pb-0">
        <button onClick={navigateBack} className="text-xs text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded bg-white/5 border border-white/10">
          ← 返回探索
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">好感 Lv.{Math.floor(affinity / 20)}</span>
          <div className="w-16 h-1.5 rounded-full bg-gray-700 overflow-hidden">
            <div className="h-full bg-pink-500 rounded-full transition-all" style={{ width: `${affinity}%` }} />
          </div>
        </div>
      </div>

      {/* NPC Portrait Area */}
      <div className="px-4">
        <div className="flex items-center gap-4 p-4 bg-black/40 rounded-xl border border-white/5">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 border border-purple-400/20 flex items-center justify-center shrink-0">
            <span className="font-title text-2xl text-purple-300">{NPC_NAME_MAP[npcId]?.charAt(0) ?? '?'}</span>
          </div>
          <div>
            <h3 className="font-game text-lg text-purple-200">{NPC_NAME_MAP[npcId] ?? npcId}</h3>
            <p className="text-xs text-gray-500">{isTruth ? '【真相】' : '【居民】'}</p>
          </div>
        </div>
      </div>

      {/* Dialogue display */}
      <div className="flex-1 px-4 pt-4">
        <div className="typewriter-box min-h-[140px] p-4 rounded-xl bg-black/40 border border-white/5">
          <p className="text-xs text-purple-300/60 mb-2 font-bold tracking-wider">{currentLine.speaker}</p>
          <p className={cn('narrative-text leading-relaxed', isTruth && 'text-blue-200', !isTruth && 'text-gray-200')}>
            {displayed}
            {step === 'typing' && <span className="animate-pulse text-purple-400">▌</span>}
          </p>
        </div>
      </div>

      {/* Choices */}
      <div className="px-4 pb-20">
        {step === 'choices' && (
          <div className="flex flex-col gap-2 mt-4">
            <p className="text-[10px] text-gray-500 tracking-wider mb-1">▸ 你的回应</p>
            {choices.map((choice, idx) => (
              <button
                key={choice.id}
                onClick={() => handleChoice(choice, idx)}
                disabled={selectedChoice !== null}
                className={cn(
                  'w-full text-left px-4 py-3 rounded-lg text-sm transition-all',
                  'border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20',
                  selectedChoice === idx ? 'opacity-40' : 'text-gray-200',
                )}
              >
                <span>{choice.text}</span>
                {choice.effects && (
                  <span className="ml-2 text-[10px] text-gray-500">
                    {choice.effects.filter(e => e.target !== 'npcAffinity').map(e =>
                      e.target === 'awareness' ? `[认知+${e.value}]` : `[侵蚀+${e.value}]`
                    ).join(' ')}
                  </span>
                )}
              </button>
            ))}
            {lineIndex < dialogueLines.length - 1 && (
              <button onClick={() => setLineIndex(i => i + 1)} className="text-xs text-gray-500 hover:text-gray-300 self-center mt-1">
                继续 →
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur-md border-t border-white/5 px-4 py-3">
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-gray-500">{lineIndex + 1} / {dialogueLines.length}</span>
          <span className="text-[10px] text-gray-500">{affinity}/100 · {AFFINITY_LABELS[Math.min(Math.floor(affinity / 20), 5)]}</span>
          <button onClick={navigateBack} className="text-[10px] text-purple-300/60 hover:text-purple-200">終了</button>
        </div>
      </div>
    </div>
  );
};

export default DialogueScreen;
