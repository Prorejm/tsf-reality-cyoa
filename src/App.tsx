import { useState, useEffect, useCallback, lazy, Suspense } from 'react'
import { GameProvider, useGame } from '@/game/engine/GameContext'

// ===== 懒加载屏幕组件 =====
const TitleScreen = lazy(() => import('@/screens/TitleScreen'))
const ExplorationScreen = lazy(() => import('@/screens/ExplorationScreen'))
const DialogueScreen = lazy(() => import('@/screens/DialogueScreen'))
const ObservationScreen = lazy(() => import('@/screens/ObservationScreen'))
const PuzzleScreen = lazy(() => import('@/screens/PuzzleScreen'))
const JournalScreen = lazy(() => import('@/screens/JournalScreen'))
const InventoryScreen = lazy(() => import('@/screens/InventoryScreen'))
const CalendarScreen = lazy(() => import('@/screens/CalendarScreen'))
const MapScreen = lazy(() => import('@/screens/MapScreen'))
const AffinityScreen = lazy(() => import('@/screens/AffinityScreen'))
const EndingScreen = lazy(() => import('@/screens/EndingScreen'))
const PhoneScreen = lazy(() => import('@/screens/PhoneScreen'))

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

// ===== 加载占位 =====
function ScreenFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-2 border-pink-400/30 border-t-pink-400 rounded-full animate-spin" />
    </div>
  )
}

// ===== 游戏路由（懒加载） =====
function GameRouter({ screen, onNavigate }: { screen: ScreenId; onNavigate: (s: ScreenId) => void }) {
  const { state } = useGame()

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

// ===== 主外壳 =====
function AppShell() {
  const { state } = useGame()
  const [screen, setScreen] = useState<ScreenId>('title')

  const navigate = useCallback((target: ScreenId) => {
    setScreen(target)
  }, [])

  // 天数切换动画
  const [dayTrans, setDayTrans] = useState<{ active: boolean; day: number; specialDate?: string }>({
    active: false, day: 0,
  })

  // 侵蚀 ≥90 → BAD END 触发器
  const [realityBreak, setRealityBreak] = useState<{ active: boolean; intensity: 'mild' | 'moderate' | 'severe' }>({
    active: false, intensity: 'mild',
  })

  // 监听天数变化
  useEffect(() => {
    if (state.time.day > 0 && screen === 'exploration' && state.time.period === 'morning' && state.time.periodAction === 0) {
      setDayTrans({ active: true, day: state.time.day, specialDate: state.time.specialDate ?? undefined })
    }
  }, [state.time.day, state.time.period, state.time.periodAction, screen])

  // BAD END 触发
  useEffect(() => {
    if (state.cognition.erosionLevel >= 90 && screen === 'exploration') {
      setRealityBreak({ active: true, intensity: 'severe' })
    }
  }, [state.cognition.erosionLevel, screen])

  const showPerceptionToggle = screen === 'exploration' || screen === 'observation' || screen === 'dialogue'

  return (
    <div className="relative min-h-screen">
      <Suspense fallback={<ScreenFallback />}>
        <GameRouter screen={screen} onNavigate={navigate} />
      </Suspense>

      {showPerceptionToggle && <PerceptionToggle />}

      {dayTrans.active && (
        <DayTransition
          day={dayTrans.day}
          specialDate={dayTrans.specialDate}
          onComplete={() => setDayTrans({ active: false, day: 0 })}
        />
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
