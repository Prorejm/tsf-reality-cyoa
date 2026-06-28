import React from 'react';
import { useGame } from '@/game/engine/GameContext';
import { cn } from '@/lib/utils';

// ─── Scene name display mapping ─────────────────────────────────
const SCENE_NAMES: Record<string, string> = {
  home_bedroom: '🏠 自家卧室',
  town_center: '🏪 商店街',
  shrine: '⛩️ 神社',
  hospital: '🏥 医院',
  school: '🏫 学校',
  alley_night: '🌃 小巷',
  town_hall: '🏛️ 市政厅',
};

// All scenes in defined order
const ALL_SCENES = [
  'home_bedroom',
  'town_center',
  'shrine',
  'hospital',
  'school',
  'alley_night',
  'town_hall',
] as const;

/**
 * Determine which scene IDs are unlocked for a given day.
 *
 * Rules:
 *   D1   → home_bedroom
 *   D2+  → town_center, shrine
 *   D3+  → hospital
 *   D4+  → school
 *   D5+  → alley_night
 *   D6+  → town_hall
 */
function getUnlockedScenes(day: number): Set<string> {
  const unlocked = new Set<string>();

  // D1 always
  unlocked.add('home_bedroom');

  // D2+
  if (day >= 2) {
    unlocked.add('town_center');
    unlocked.add('shrine');
  }

  // D3+
  if (day >= 3) {
    unlocked.add('hospital');
  }

  // D4+
  if (day >= 4) {
    unlocked.add('school');
  }

  // D5+
  if (day >= 5) {
    unlocked.add('alley_night');
  }

  // D6+
  if (day >= 6) {
    unlocked.add('town_hall');
  }

  return unlocked;
}

/**
 * SceneSelector — A horizontally scrollable scene-selection bar.
 *
 * - Shows all scenes with unlock status based on current day
 * - Current scene is highlighted with a golden border
 * - Unlocked scenes are purple; locked ones are gray with a lock icon
 * - Clicking an unlocked scene dispatches SET_SCENE
 * - Fixed position below the status bar (sticky top)
 */
const SceneSelector: React.FC = () => {
  const { state, dispatch } = useGame();

  const day = state.currentDay ?? 1;
  const currentScene = state.currentScene ?? 'home_bedroom';
  const unlockedScenes = getUnlockedScenes(day);

  const handleSceneClick = (sceneId: string) => {
    if (unlockedScenes.has(sceneId) && sceneId !== currentScene) {
      dispatch({ type: 'SET_SCENE', payload: sceneId });
    }
  };

  return (
    <div className="sticky top-[36px] z-30 bg-gray-900/80 backdrop-blur-sm border-b border-white/5 overflow-x-auto">
      <div className="flex gap-1.5 px-3 py-2 min-w-max">
        {ALL_SCENES.map((sceneId) => {
          const isUnlocked = unlockedScenes.has(sceneId);
          const isCurrent = sceneId === currentScene;

          return (
            <button
              key={sceneId}
              onClick={() => handleSceneClick(sceneId)}
              disabled={!isUnlocked}
              className={cn(
                'px-2.5 py-1.5 rounded-lg text-[11px] font-game tracking-wider whitespace-nowrap transition-all select-none',
                // Current scene: golden border + glow
                isCurrent &&
                  'border border-amber-400/60 bg-amber-500/15 text-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.2)]',
                // Unlocked, not current: purple
                !isCurrent &&
                  isUnlocked &&
                  'border border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 hover:border-purple-400/50 cursor-pointer',
                // Locked: grayed out
                !isUnlocked &&
                  'border border-gray-700/30 bg-gray-800/30 text-gray-600 cursor-not-allowed',
              )}
            >
              {isUnlocked ? (
                SCENE_NAMES[sceneId]
              ) : (
                <>
                  🔒{' '}
                  {SCENE_NAMES[sceneId].replace(/^[^\s]+\s/, '')}
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SceneSelector;
