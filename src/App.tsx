import { useState, useEffect, useCallback, lazy, Suspense, type FC } from 'react'
import { GameProvider, useGame } from '@/game/engine/GameContext';

// Direct imports for type safety (code-split via manual chunks)
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

type ScreenId =
  | 'title' | 'exploration' | 'dialogue' | 'observation' | 'puzzle'
  | 'journal' | 'inventory' | 'calendar' | 'map' | 'affinity' | 'ending' | 'phone'

// ===== 游戏路由 =====
function GameRouter({ screen, onNavigate }: { screen: ScreenId; onNavigate: (s: ScreenId) => void }) {
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
}

// ===== 主外壳 =====
function AppShell() {
  const { state } = useGame()
  const [screen, setScreen] = useState<ScreenId>('title')
  const navigate = useCallback((target: ScreenId) => setScreen(target), [])

  const [dayTrans, setDayTrans] = useState<{ active: boolean; day: number }>({ active: false, day: 0 })
  const [realityBreak, setRealityBreak] = useState<{ active: boolean; intensity: 'mild' | 'moderate' | 'severe' }>({ active: false, intensity: 'mild' })

  useEffect(() => {
    if (state.currentDay > 0 && screen === 'exploration' && state.currentPeriod === 'morning') {
      setDayTrans({ active: true, day: state.currentDay })
    }
  }, [state.currentDay, state.currentPeriod, screen])

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
        <RealityBreak intensity={realityBreak.intensity} onComplete={() => setRealityBreak({ active: false, intensity: 'mild' })} />
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
