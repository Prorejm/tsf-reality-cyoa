import { useState, useEffect, useCallback } from 'react'
import { GameProvider, useGame } from '@/game/engine/GameContext'
import { type GameState } from '@/game/engine/types'

// Screens
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
  | 'title'
  | 'exploration'
  | 'dialogue'
  | 'observation'
  | 'puzzle'
  | 'journal'
  | 'inventory'
  | 'calendar'
  | 'map'
  | 'affinity'
  | 'ending'
  | 'phone'

interface ScreenTransition {
  current: ScreenId
  previous: ScreenId | null
  isTransitioning: boolean
}

// ========== Game Router ==========
function GameRouter({ screen, onNavigate }: { screen: ScreenId; onNavigate: (s: ScreenId, data?: any) => void }) {
  const { state } = useGame()

  const screenProps = { onNavigate, state }

  switch (screen) {
    case 'title':
      return <TitleScreen onNavigate={onNavigate} />
    case 'exploration':
      return <ExplorationScreen onNavigate={onNavigate} />
    case 'dialogue':
      return <DialogueScreen onNavigate={onNavigate} />
    case 'observation':
      return <ObservationScreen onNavigate={onNavigate} />
    case 'puzzle':
      return <PuzzleScreen onNavigate={onNavigate} />
    case 'journal':
      return <JournalScreen onNavigate={onNavigate} />
    case 'inventory':
      return <InventoryScreen onNavigate={onNavigate} />
    case 'calendar':
      return <CalendarScreen onNavigate={onNavigate} />
    case 'map':
      return <MapScreen onNavigate={onNavigate} />
    case 'affinity':
      return <AffinityScreen onNavigate={onNavigate} />
    case 'ending':
      return <EndingScreen onNavigate={onNavigate} />
    case 'phone':
      return <PhoneScreen onClose={() => onNavigate('exploration')} />
    default:
      return <TitleScreen onNavigate={onNavigate} />
  }
}

// ========== Main App Shell ==========
function AppShell() {
  const { state, dispatch } = useGame()
  const [screen, setScreen] = useState<ScreenId>('title')
  const [transition, setTransition] = useState<ScreenTransition>({
    current: 'title',
    previous: null,
    isTransitioning: false,
  })

  // Day transition effect
  const [dayTransition, setDayTransition] = useState<{
    active: boolean
    day: number
    specialDate?: string
  }>({ active: false, day: 0 })

  // Reality break effect
  const [realityBreak, setRealityBreak] = useState<{
    active: boolean
    intensity: 'mild' | 'moderate' | 'severe'
  }>({ active: false, intensity: 'mild' })

  // Screen navigation with transition
  const navigate = useCallback((target: ScreenId, _data?: any) => {
    setTransition(prev => ({
      current: target,
      previous: prev.current,
      isTransitioning: false,
    }))
    setScreen(target)
  }, [])

  // Detect day change from game state
  useEffect(() => {
    if (state.time.day > 0 && transition.current === 'exploration') {
      // Check if day just changed (periodAction reset can indicate this)
      if (state.time.periodAction === 0 && state.time.period === 'morning') {
        setDayTransition({
          active: true,
          day: state.time.day,
          specialDate: state.time.specialDate ?? undefined,
        })
      }
    }
  }, [state.time.day, state.time.period, state.time.periodAction, transition.current])

  // Handle day transition complete
  const handleDayTransitionComplete = useCallback(() => {
    setDayTransition({ active: false, day: 0 })
  }, [])

  // Check for bad end trigger
  useEffect(() => {
    if (state.cognition.erosionLevel >= 90 && screen === 'exploration') {
      // Trigger bad end flow - will go through narrative
      setRealityBreak({ active: true, intensity: 'severe' })
    }
  }, [state.cognition.erosionLevel, screen])

  // Determine if perception toggle should show
  const showPerceptionToggle = screen === 'exploration' || screen === 'observation' || screen === 'dialogue'

  return (
    <div className="relative min-h-screen">
      {/* Main game content */}
      <div className={`screen-transition ${!transition.isTransitioning ? 'screen-active' : 'screen-enter'}`}>
        <GameRouter screen={screen} onNavigate={navigate} />
      </div>

      {/* Perception toggle (shown on main gameplay screens) */}
      {showPerceptionToggle && <PerceptionToggle />}

      {/* Day transition overlay */}
      {dayTransition.active && (
        <DayTransition
          day={dayTransition.day}
          specialDate={dayTransition.specialDate}
          onComplete={handleDayTransitionComplete}
        />
      )}

      {/* Reality break effect */}
      {realityBreak.active && (
        <RealityBreak
          intensity={realityBreak.intensity}
          onComplete={() => setRealityBreak({ active: false, intensity: 'mild' })}
        />
      )}
    </div>
  )
}

// ========== Root App ==========
export default function App() {
  return (
    <GameProvider>
      <AppShell />
    </GameProvider>
  )
}
