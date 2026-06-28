import { StrictMode, Component, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// ========== 错误边界 ==========
class GameErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: { componentStack?: string }) {
    console.error('[Game Error]', error, info.componentStack)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
            color: 'rgba(255,255,255,0.9)',
            fontFamily: "'Noto Sans SC', sans-serif",
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: '#fca5a5',
              marginBottom: '1rem',
            }}
          >
            エラーが発生しました
          </div>
          <div
            style={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: '0.85rem',
              marginBottom: '0.5rem',
              maxWidth: 400,
              lineHeight: 1.6,
            }}
          >
            {this.state.error?.message || '予期しないエラーが発生しました'}
          </div>
          <button
            onClick={this.handleRetry}
            style={{
              marginTop: '1.5rem',
              padding: '0.75rem 2rem',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 8,
              color: '#fff',
              cursor: 'pointer',
              fontSize: '0.95rem',
            }}
          >
            再読み込み
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

// ========== 隐藏启动画面 + 挂载 React ==========
const rootEl = document.getElementById('root')

// 用 requestAnimationFrame 确保 React 已准备好再隐藏 splash
function hideSplash() {
  const splash = document.getElementById('splash-screen')
  if (splash) {
    splash.classList.add('fade-out')
    setTimeout(() => {
      splash.style.display = 'none'
    }, 600)
  }
}

if (rootEl) {
  const root = createRoot(rootEl)
  root.render(
    <StrictMode>
      <GameErrorBoundary>
        <App />
      </GameErrorBoundary>
    </StrictMode>,
  )

  // 监听 React 渲染完成
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      hideSplash()
    })
  })
}
