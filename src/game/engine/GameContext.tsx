import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  type ReactNode,
  type Dispatch,
} from 'react';
import type { GameState, GameAction, GameConfig } from './types';
import { gameReducer, createInitialState, createNewGameState } from './gameReducer';

// ─── Context Shape ──────────────────────────────────────────────────

interface GameContextValue {
  /** Current game state — read-only snapshot */
  state: GameState;
  /** Dispatch an action to modify state */
  dispatch: Dispatch<GameAction>;
  /** Reset to a brand-new game with optional config */
  newGame: (config?: GameConfig) => void;
  /** Load a previously saved state */
  loadGame: (savedState: GameState) => void;
}

const GameContext = createContext<GameContextValue | null>(null);

// ─── Provider ───────────────────────────────────────────────────────

interface GameProviderProps {
  /** Optional initial config passed to newGame */
  initialConfig?: GameConfig;
  /** Optional preloaded state (e.g. from save file) */
  savedState?: GameState;
  children: ReactNode;
}

/**
 * Root provider for the TSF Reality CYOA game state.
 * Wraps children with a GameContext containing the full game state + dispatch.
 */
export function GameProvider({
  initialConfig,
  savedState,
  children,
}: GameProviderProps): React.ReactElement {
  const [state, dispatch] = useReducer(
    gameReducer,
    savedState ?? createInitialState(initialConfig),
  );

  const newGame = useCallback(
    (config?: GameConfig) => {
      dispatch({ type: 'NEW_GAME', payload: config });
    },
    [dispatch],
  );

  const loadGame = useCallback(
    (savedState: GameState) => {
      dispatch({ type: 'LOAD_GAME', payload: savedState });
    },
    [dispatch],
  );

  const value = useMemo<GameContextValue>(
    () => ({ state, dispatch, newGame, loadGame }),
    [state, dispatch, newGame, loadGame],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

// ─── Hook ───────────────────────────────────────────────────────────

/**
 * Custom hook to access the game context.
 * Must be used inside a <GameProvider>.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { state, dispatch } = useGame();
 *   return <div>{state.currentScene}</div>;
 * }
 * ```
 */
export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error(
      '[useGame] 必须在 <GameProvider> 内部使用 useGame()。',
    );
  }
  return ctx;
}

// ─── Convenience Dispatch Hooks ────────────────────────────────────

/**
 * Dispatch a TIME_ADVANCE action.
 */
export function useAdvanceTime(): () => void {
  const { dispatch } = useGame();
  return useCallback(() => dispatch({ type: 'TIME_ADVANCE' }), [dispatch]);
}

/**
 * Dispatch a SET_SCENE action.
 */
export function useSetScene(): (sceneId: string) => void {
  const { dispatch } = useGame();
  return useCallback(
    (sceneId: string) => dispatch({ type: 'SET_SCENE', payload: sceneId }),
    [dispatch],
  );
}

/**
 * Dispatch an APPLY_EROSION action.
 */
export function useApplyErosion(): (amount: number, reason: string) => void {
  const { dispatch } = useGame();
  return useCallback(
    (amount: number, reason: string) =>
      dispatch({ type: 'APPLY_EROSION', payload: { amount, reason } }),
    [dispatch],
  );
}

/**
 * Dispatch an APPLY_AWARENESS action.
 */
export function useApplyAwareness(): (amount: number, reason: string) => void {
  const { dispatch } = useGame();
  return useCallback(
    (amount: number, reason: string) =>
      dispatch({ type: 'APPLY_AWARENESS', payload: { amount, reason } }),
    [dispatch],
  );
}

/**
 * Dispatch a SET_FLAG action.
 */
export function useSetFlag(): (key: string, value: unknown) => void {
  const { dispatch } = useGame();
  return useCallback(
    (key: string, value: unknown) =>
      dispatch({ type: 'SET_FLAG', payload: { key, value } }),
    [dispatch],
  );
}
