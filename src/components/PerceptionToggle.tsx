import React, { useEffect, useCallback, useState } from 'react';
import { useGame } from '@/game/engine/GameContext';
import { cn } from '@/lib/utils';

export const PerceptionToggle: React.FC = () => {
  const { state, dispatch } = useGame();
  const [flickering, setFlickering] = useState(false);
  
  const mode = state.perceptionMode ?? 'resident';
  const isTruth = mode === 'truth';

  const toggle = useCallback(() => {
    setFlickering(true);
    dispatch({ type: 'SWITCH_PERCEPTION' });
    setTimeout(() => setFlickering(false), 800);
  }, [dispatch]);

  useEffect(() => {
    if (flickering) {
      document.body.classList.add('perception-flicker');
      return () => document.body.classList.remove('perception-flicker');
    }
  }, [flickering]);

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        onClick={toggle}
        className={cn(
          'px-4 py-2 rounded-full text-xs font-bold tracking-wider transition-all duration-500',
          'border backdrop-blur-sm shadow-lg',
          'hover:scale-105 active:scale-95',
          isTruth
            ? 'bg-blue-900/60 border-blue-400/40 text-blue-200 shadow-blue-500/20'
            : 'bg-gray-800/60 border-gray-600/40 text-gray-300 shadow-gray-900/20',
          flickering && 'animate-pulse',
        )}
      >
        <div className="flex items-center gap-2">
          <span className={cn(
            'w-2 h-2 rounded-full transition-colors',
            isTruth ? 'bg-blue-400' : 'bg-gray-500',
          )} />
          <span>{isTruth ? '真实' : '常识'}</span>
        </div>
      </button>
    </div>
  );
};

export default PerceptionToggle;
