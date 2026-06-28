import React, { useState, useEffect, useCallback } from 'react';
import { useGame } from '@/game/engine/GameContext';
import { cn } from '@/lib/utils';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  delay: number;
}

const TitleScreen: React.FC = () => {
  const { state, dispatch, newGame } = useGame();
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  const playthroughCount = state?.playthrough?.current ?? 0;
  const maxUnlocked = state?.playthrough?.maxUnlocked ?? 1;

  // 生成粒子背景
  useEffect(() => {
    const generated: Particle[] = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.6 + 0.2,
      speed: Math.random() * 0.5 + 0.1,
      delay: Math.random() * 5,
    }));
    setParticles(generated);
    setTimeout(() => setFadeIn(true), 100);
    setTimeout(() => setShowMenu(true), 1500);
  }, []);

  const handleNewGame = useCallback(() => {
    dispatch({ type: 'NEW_GAME', payload: undefined });
  }, [dispatch]);

  const handleContinue = useCallback(() => {
    // 继续游戏——可以通过外部传入保存状态，这里简化处理
    dispatch({ type: 'SET_FLAG', payload: { key: '_screen', value: 'exploration' } });
  }, [dispatch]);

  const handleSelectPlaythrough = useCallback(
    (pt: number) => {
      dispatch({ type: 'SET_FLAG', payload: { key: '_selected_playthrough', value: pt } });
      dispatch({ type: 'NEW_GAME', payload: undefined });
    },
    [dispatch],
  );

  const periodLabels: Record<string, string> = {
    morning: '早晨',
    afternoon: '下午',
    evening: '傍晚',
    night: '深夜',
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e]">
      {/* 粒子背景层 */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-white/60"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: 0,
              animation: `particle-float ${3 + p.speed * 2}s ease-in-out ${p.delay}s infinite alternate`,
              boxShadow: `0 0 ${p.size * 3}px ${p.size}px rgba(255,255,255,0.1)`,
            }}
          />
        ))}
        {/* 额外星光粒子 */}
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={`star-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: '2px',
              height: '2px',
              opacity: 0,
              background: '#fff',
              animation: `star-twinkle ${1.5 + Math.random() * 2}s ease-in-out ${Math.random() * 3}s infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* 暗色遮罩渐变 */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0f0c29]/80" />

      {/* 主内容 */}
      <div
        className={cn(
          'relative z-10 flex flex-col items-center justify-center min-h-screen px-4 transition-all duration-1000',
          fadeIn ? 'opacity-100' : 'opacity-0',
        )}
      >
        {/* 装饰性上划线 */}
        <div className="mb-6 flex items-center gap-4">
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-purple-400/50 to-transparent" />
          <span className="text-xs tracking-[0.3em] text-purple-300/60 uppercase">TSF · Reality · CYOA</span>
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-purple-400/50 to-transparent" />
        </div>

        {/* 主标题 */}
        <h1
          className={cn(
            'font-title text-6xl md:text-8xl text-center leading-tight',
            'bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 bg-clip-text text-transparent',
            'drop-shadow-[0_0_30px_rgba(168,85,247,0.3)]',
            'mb-2 tracking-wider',
          )}
        >
          常識改変の街
        </h1>

        {/* 副标题 */}
        <p className="font-game text-sm md:text-base text-purple-200/70 tracking-[0.5em] mb-10">
          在那個常識被改寫的街道上——你還能保持自我嗎？
        </p>

        {/* 装饰分隔线 */}
        <div className="flex items-center gap-3 mb-12">
          <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-pink-400/40 to-transparent" />
          <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-purple-400/40 to-transparent" />
          <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />
        </div>

        {/* 菜单按钮 */}
        <div
          className={cn(
            'flex flex-col items-center gap-4 transition-all duration-700',
            showMenu ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
          )}
        >
          {/* 开始新游戏 */}
          <button
            onClick={handleNewGame}
            className={cn(
              'group relative w-64 px-8 py-3.5 rounded-lg overflow-hidden',
              'border border-purple-500/30 bg-purple-500/10',
              'hover:bg-purple-500/20 hover:border-purple-400/50',
              'transition-all duration-300',
            )}
          >
            <span className="relative z-10 font-game text-lg text-purple-200 group-hover:text-white tracking-wider">
              开始新游戏
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-500/10 to-purple-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </button>

          {/* 继续游戏 */}
          <button
            onClick={handleContinue}
            className={cn(
              'w-64 px-8 py-3 rounded-lg',
              'border border-white/10 bg-white/5',
              'hover:bg-white/10 hover:border-white/20',
              'transition-all duration-300',
              'font-game text-sm text-gray-300 hover:text-white tracking-wider',
            )}
          >
            继续游戏
          </button>

          {/* 周目选择（playthrough > 1） */}
          {maxUnlocked > 1 && (
            <div className="mt-4 w-64">
              <p className="text-xs text-gray-500 mb-2 text-center tracking-wider">
                选择周目
              </p>
              <div className="flex gap-2 justify-center">
                {Array.from({ length: maxUnlocked }, (_, i) => i + 1).map((pt) => (
                  <button
                    key={pt}
                    onClick={() => handleSelectPlaythrough(pt)}
                    className={cn(
                      'w-10 h-10 rounded-full text-sm transition-all duration-200',
                      pt === playthroughCount
                        ? 'bg-purple-500/40 border-purple-400 text-purple-200 border'
                        : 'bg-white/5 border-white/10 text-gray-400 border hover:bg-white/10 hover:text-white',
                    )}
                  >
                    {pt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 底部信息 */}
        <div className="absolute bottom-8 flex flex-col items-center gap-2">
          {playthroughCount > 0 && (
            <p className="text-xs text-gray-500 tracking-wider">
              当前周目：第 {playthroughCount} 周目
            </p>
          )}
          <p className="text-[10px] text-gray-600 tracking-widest">
            TSF Reality CYOA v1.0.0
          </p>
          <p className="text-[10px] text-gray-700">
            制作：常識改変プロジェクト
          </p>
        </div>
      </div>

      {/* 关键帧动画 —— 通过 style 标签注入 */}
      <style>{`
        @keyframes particle-float {
          0% { opacity: 0; transform: translateY(0) scale(0.5); }
          50% { opacity: 0.6; transform: translateY(-20px) scale(1); }
          100% { opacity: 0.2; transform: translateY(-40px) scale(0.8); }
        }
        @keyframes star-twinkle {
          0% { opacity: 0; transform: scale(0.5); }
          100% { opacity: 0.8; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default TitleScreen;
