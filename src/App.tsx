import { useState, useEffect, useCallback, memo } from 'react'
import { GameProvider, useGame } from '@/game/engine/GameContext'

import TitleScreen from '@/screens/TitleScreen'
import ExplorationScreen from '@/screens/ExplorationScreen'
import DialogueScreen from '@/screens/DialogueScreen'
import ObservationScreen from '@/screens/ObservationScreen'
import PuzzleScreen from '@/screens/PuzzleScreen'
import JournalScreen from '@/screens/JournalScreen'
import InventoryScreen from '@/screens/InventoryScreen'
import CalendarScreen from '@/screens/CalendarScreen'
import MapScreen from '@/screens/MapScreen'
import AffinityScreen from '@/screens/AffinityScreen'
import EndingScreen from '@/screens/EndingScreen'
import PhoneScreen from '@/screens/PhoneScreen'

import { DayTransition } from '@/components/DayTransition'
import { RealityBreak } from '@/components/RealityBreak'
import { PerceptionToggle } from '@/components/PerceptionToggle'

export type ScreenId =
  | 'title' | 'exploration' | 'dialogue' | 'observation' | 'puzzle'
  | 'journal' | 'inventory' | 'calendar' | 'map' | 'affinity' | 'ending' | 'phone'

// Maps GameAction SET_FLAG _screen values to ScreenId
function detectScreenFromFlags(flags: Record<string, any>): ScreenId | null {
  const target = flags['_screen']
  if (!target || typeof target !== 'string') return null
  
  const validScreens: ScreenId[] = [
    'title', 'exploration', 'dialogue', 'observation', 'puzzle',
    'journal', 'inventory', 'calendar', 'map', 'affinity', 'ending', 'phone'
  ]
  return validScreens.includes(target as ScreenId) ? (target as ScreenId) : null
}

// ===== 游戏路由（缓存优化） =====
const GameRouter = memo(function GameRouter({ screen, onNavigate }: { screen: ScreenId; onNavigate: (s: ScreenId) => void }) {
  switch (screen) {
    case 'title': return <TitleScreen onNavigate={onNavigate} />
    case 'exploration': return <ExplorationScreen onNavigate={onNavigate} />
    case 'dialogue': return <DialogueScreen onNavigate={onNavigate} />
    case 'observation': return <ObservationScreen onNavigate={onNavigate} />
    case 'puzzle': return <PuzzleScreen onNavigate={onNavigate} />
    case 'journal': return <JournalScreen onNavigate={onNavigate} />
    case 'inventory': return <InventoryScreen onNavigate={onNavigate} />
    case 'calendar': return <CalendarScreen onNavigate={onNavigate} />
    case 'map': return <MapScreen onNavigate={onNavigate} />
    case 'affinity': return <AffinityScreen onNavigate={onNavigate} />
    case 'ending': return <EndingScreen onNavigate={onNavigate} />
    case 'phone': return <PhoneScreen onClose={() => onNavigate('exploration')} />
    default: return <TitleScreen onNavigate={onNavigate} />
  }
})

// ===== 主外壳 =====
function AppShell() {
  const { state, dispatch } = useGame()
  const [screen, setScreen] = useState<ScreenId>('title')
  const [prevScreen, setPrevScreen] = useState<ScreenId | null>(null)

  // === 双重导航系统 ===
  // 1. 直接回调 (onNavigate) — 用于 TitleScreen → Exploration
  const navigate = useCallback((target: ScreenId) => {
    setPrevScreen(screen)
    setScreen(target)
  }, [screen])

  // 2. 状态驱动导航 — 监听 state.flags._screen (用于其他屏幕)
  useEffect(() => {
    const newScreen = detectScreenFromFlags(state.flags)
    if (newScreen && newScreen !== screen) {
      setPrevScreen(screen)
      setScreen(newScreen)
      // Reset the flag to prevent re-triggering
      dispatch({ type: 'SET_FLAG', payload: { key: '_screen', value: undefined } })
    }
  }, [state.flags, screen, dispatch])

  // Day transition
  const [dayTrans, setDayTrans] = useState<{ active: boolean; day: number }>({ active: false, day: 0 })

  useEffect(() => {
    if (state.currentDay > 0 && screen === 'exploration' && state.currentPeriod === 'morning') {
      const prev = prevScreen === 'exploration' ? null : prevScreen
      if (prev || state.currentDay > 1) {
        setDayTrans({ active: true, day: state.currentDay })
      }
    }
  }, [state.currentDay, state.currentPeriod, screen, prevScreen])

  // Reality break
  const [realityBreak, setRealityBreak] = useState<{ active: boolean; intensity: 'mild' | 'moderate' | 'severe' }>({ active: false, intensity: 'mild' })

  useEffect(() => {
    if (state.erosionLevel >= 80 && screen === 'exploration') {
      setRealityBreak({ active: true, intensity: state.erosionLevel >= 90 ? 'severe' : 'moderate' })
    }
  }, [state.erosionLevel, screen])

  const showPerceptionToggle = screen === 'exploration' || screen === 'observation' || screen === 'dialogue'

  return (
    <div className="relative min-h-screen">
      <GameRouter screen={screen} onNavigate={navigate} />
      {showPerceptionToggle && <PerceptionToggle />}
      {dayTrans.active && (
        <DayTransition day={dayTrans.day} onComplete={() => setDayTrans({ active: false, day: 0 })} />
      )}
      {realityBreak.active && (
        <RealityBreak
          intensity={realityBreak.intensity}
          onComplete={() => setRealityBreak({ active: false, intensity: 'mild' })}
        />
      )}
    </div>
  )
}

// ===== 根组件 =====
export default function App() {
  return (
    <GameProvider>
      <AppShell />
    </GameProvider>
  )
}
