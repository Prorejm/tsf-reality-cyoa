import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useGame } from '@/game/engine/GameContext';
import type { PuzzleId, PuzzleState } from '@/game/engine/types';
import { cn } from '@/lib/utils';

interface PuzzleData {
  id: PuzzleId;
  name: string;
  description: string;
  goal: string;
  type: 'riddle' | 'pattern' | 'logic' | 'memory' | 'investigation';
  difficulty: number;
  hints: string[];
  timeLimit: number;
  maxAttempts: number;
}

const MOCK_PUZZLES: Record<string, PuzzleData> = {
  puzzle_shrine_gate: {
    id: 'puzzle_shrine_gate',
    name: '神社鸟居的封印',
    description: '鸟居上刻着一道古老的封印。要解开它，你需要按正确的顺序触碰那些符文。',
    goal: '按正确的顺序触碰四个符文',
    type: 'pattern',
    difficulty: 2,
    hints: [
      '观察符文的发光顺序——它们留下的余晖就是答案。',
      '从最暗的符文开始，到最亮的结束。',
      '试着从下往上触摸它们。',
    ],
    timeLimit: 0,
    maxAttempts: 5,
  },
  puzzle_library_code: {
    id: 'puzzle_library_code',
    name: '图书馆的暗码锁',
    description: '禁书区的门上有三道转轮锁，每道转轮上都刻着神话文字。',
    goal: '根据线索推断出正确的三字密码',
    type: 'riddle',
    difficulty: 3,
    hints: [
      '线索在桌上那本翻开的书里。',
      '第一个字母对应"蛇"的拉丁名。',
      '正确的组合会让你听到锁簧弹开的声音。',
    ],
    timeLimit: 120,
    maxAttempts: 3,
  },
};

const PERIOD_LABELS: Record<string, string> = {
  morning: '早晨',
  afternoon: '下午',
  evening: '傍晚',
  night: '深夜',
};

const DIFFICULTY_LABELS: Record<number, string> = {
  1: '简单',
  2: '普通',
  3: '困难',
  4: '极难',
  5: ' impossible',
};

const PuzzleScreen: React.FC = () => {
  const { state, dispatch } = useGame();

  const puzzleId: PuzzleId =
    ((state?.narrative?.flags?.['_puzzle_id'] as string) as PuzzleId) ??
    'puzzle_shrine_gate';
  const puzzle = MOCK_PUZZLES[puzzleId] ?? MOCK_PUZZLES['puzzle_shrine_gate'];
  const puzzleState: PuzzleState =
    (state?.puzzles?.[puzzleId] as PuzzleState) ?? 'unlocked';

  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [currentHint, setCurrentHint] = useState('');
  const [puzzleResult, setPuzzleResult] = useState<'none' | 'success' | 'failure'>('none');
  const [timer, setTimer] = useState(puzzle.timeLimit);
  const [userInput, setUserInput] = useState('');
  const [selectedPattern, setSelectedPattern] = useState<number[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [patternOrder] = useState(() =>
    Array.from({ length: 4 }, (_, i) => i).sort(() => Math.random() - 0.5),
  );

  // 计时器
  useEffect(() => {
    if (puzzle.timeLimit > 0 && puzzleResult === 'none' && puzzleState === 'unlocked') {
      timerRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            handleFail();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [puzzle.timeLimit, puzzleResult, puzzleState]);

  const handleFail = useCallback(() => {
    setPuzzleResult('failure');
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // 使用提示
  const handleUseHint = useCallback(() => {
    if (hintsUsed >= puzzle.hints.length) return;
    setHintsUsed((prev) => prev + 1);
    setCurrentHint(puzzle.hints[hintsUsed]);
    setShowHint(true);
    setTimeout(() => setShowHint(false), 5000);
  }, [hintsUsed, puzzle.hints]);

  // 提交解谜
  const handleSubmit = useCallback(() => {
    setAttempts((prev) => prev + 1);

    // 简化判定：故意让某些谜题在特定尝试次数后成功
    let success = false;
    if (puzzle.type === 'riddle' && userInput.toLowerCase() === 'serpens') {
      success = true;
    } else if (puzzle.type === 'pattern' && selectedPattern.length === 4) {
      success = selectedPattern.every((v, i) => v === i);
    } else if (attempts >= 2) {
      // 保底：多次尝试后自动成功
      success = true;
    }

    if (success) {
      setPuzzleResult('success');
      if (timerRef.current) clearInterval(timerRef.current);

      dispatch({
        type: 'SET_FLAG',
        payload: { key: `puzzle_${puzzleId}_solved`, value: true },
      });

      dispatch({
        type: 'APPLY_AWARENESS',
        payload: { amount: 5, reason: `解开谜题「${puzzle.name}」` },
      });
    } else {
      if (attempts >= puzzle.maxAttempts - 1) {
        handleFail();
      }
    }
  }, [puzzle, puzzleId, userInput, selectedPattern, attempts, dispatch, handleFail]);

  // 模式谜题的符文选择
  const handlePatternSelect = useCallback(
    (index: number) => {
      if (selectedPattern.includes(index)) {
        setSelectedPattern((prev) => prev.filter((v) => v !== index));
      } else {
        setSelectedPattern((prev) => [...prev, index]);
      }
    },
    [selectedPattern],
  );

  const handleBack = useCallback(() => {
    dispatch({
      type: 'SET_FLAG',
      payload: { key: '_screen', value: 'exploration' },
    });
  }, [dispatch]);

  const remainingHints = puzzle.hints.length - hintsUsed;

  return (
    <div className="game-container min-h-screen flex flex-col">
      {/* 顶部 */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handleBack}
          className="text-xs text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded bg-white/5 border border-white/10"
        >
          返回探索
        </button>
        <div className="flex items-center gap-3">
          {puzzle.timeLimit > 0 && (
            <span
              className={cn(
                'text-xs font-mono',
                timer < 30 ? 'text-red-400' : 'text-gray-400',
              )}
            >
              {formatTime(timer)}
            </span>
          )}
          <span className="text-xs text-gray-500">
            尝试次数：{attempts}/{puzzle.maxAttempts}
          </span>
          <span className="text-xs text-gray-500">
            难度：{DIFFICULTY_LABELS[puzzle.difficulty] ?? puzzle.difficulty}
          </span>
        </div>
      </div>

      {/* 谜题描述 */}
      <div className="game-panel mb-4">
        <h3 className="font-title text-xl text-purple-200 mb-1">{puzzle.name}</h3>
        <p className="narrative-text text-sm text-gray-300 mb-2">{puzzle.description}</p>
        <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded">
          <p className="text-xs text-amber-300/80">
            <span className="font-bold">目标：</span>
            {puzzle.goal}
          </p>
        </div>
      </div>

      {/* 谜题内容 */}
      <div className="game-panel flex-1 mb-4">
        {puzzleResult === 'none' && puzzleState !== 'solved' && (
          <div>
            {/* 谜语型 */}
            {puzzle.type === 'riddle' && (
              <div>
                <p className="text-xs text-gray-400 mb-3">
                  "在图书馆的尘埃中，蛇的拉丁名是打开知识之门的钥匙……"
                </p>
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="输入你的答案……"
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-gray-100 placeholder:text-gray-600 focus:border-purple-400/30 focus:outline-none mb-3"
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                />
              </div>
            )}

            {/* 模式型 */}
            {puzzle.type === 'pattern' && (
              <div>
                <p className="text-xs text-gray-400 mb-3">
                  触碰符文，按正确的顺序点亮它们：
                </p>
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {patternOrder.map((val, idx) => (
                    <button
                      key={idx}
                      onClick={() => handlePatternSelect(idx)}
                      className={cn(
                        'w-full aspect-square rounded-lg text-2xl transition-all duration-200',
                        selectedPattern.includes(idx)
                          ? 'bg-amber-500/30 border-amber-400 text-amber-200 border shadow-[0_0_12px_rgba(251,191,36,0.2)]'
                          : 'bg-white/5 border-white/10 text-gray-400 border hover:bg-white/10',
                      )}
                    >
                      {String.fromCharCode(0x4e00 + idx)}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  已选择：{selectedPattern.length}/4
                </p>
              </div>
            )}

            {/* 提交按钮 */}
            <button
              onClick={handleSubmit}
              disabled={
                (puzzle.type === 'riddle' && !userInput.trim()) ||
                (puzzle.type === 'pattern' && selectedPattern.length !== 4)
              }
              className="choice-button mt-4 disabled:opacity-30"
            >
              提交答案
            </button>
          </div>
        )}

        {/* 成功 */}
        {puzzleResult === 'success' && (
          <div className="text-center py-8">
            <p className="text-3xl text-green-400 mb-3">✦ 解谜成功 ✦</p>
            <p className="narrative-text text-sm text-gray-200 mb-4">
              你解开了「{puzzle.name}」！封尘已久的知识在你面前展开……
            </p>
            <button
              onClick={handleBack}
              className="px-6 py-2 bg-green-500/10 border border-green-500/20 text-green-300 rounded hover:bg-green-500/20 transition-all"
            >
              返回探索
            </button>
          </div>
        )}

        {/* 失败 */}
        {puzzleResult === 'failure' && (
          <div className="text-center py-8">
            <p className="text-3xl text-red-400 mb-3">✧ 解谜失败 ✧</p>
            <p className="narrative-text text-sm text-gray-300 mb-4">
              锁没有打开。也许你需要更多线索才能解开它。
            </p>
            <button
              onClick={handleBack}
              className="px-6 py-2 bg-red-500/10 border border-red-500/20 text-red-300 rounded hover:bg-red-500/20 transition-all"
            >
              暂时放弃
            </button>
          </div>
        )}
      </div>

      {/* 提示系统 */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleUseHint}
          disabled={remainingHints <= 0 || puzzleResult !== 'none'}
          className={cn(
            'text-xs px-3 py-1.5 rounded transition-all',
            remainingHints > 0
              ? 'bg-blue-500/10 border border-blue-500/20 text-blue-300 hover:bg-blue-500/20'
              : 'bg-gray-500/5 border border-gray-500/10 text-gray-600 cursor-not-allowed',
          )}
        >
          使用提示 ({remainingHints})
        </button>
        {showHint && (
          <div className="flex-1 ml-3 p-2 bg-blue-500/5 border border-blue-500/10 rounded">
            <p className="text-xs text-blue-200/80">{currentHint}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PuzzleScreen;
