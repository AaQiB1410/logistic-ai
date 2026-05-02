import React, { useState } from 'react'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Alerts from './pages/Alerts'
import AIAssistant from './pages/AIAssistant'
import GlobalMap from './pages/GlobalMap'
import Intelligence from './pages/Intelligence'
import { ALERTS, CONTAINERS_DEFAULT } from './data/containers'

const PAGE_TITLES = {
  dashboard: '📦 Fleet Overview',
  map:       '🌍 Global Fleet Map',
  alerts:    '🚨 Live Alerts',
  intel:     '📊 Risk Intelligence',
  ai:        '⚡ AI Risk Assistant',
  model:     '🧠 AI Model Inspector',
}

export default function App() {
  const [page, setPage]   = useState('landing')
  const [tab,  setTab]    = useState('dashboard')
  const [containers, setContainers] = useState(CONTAINERS_DEFAULT)

  const criticalCount = ALERTS.filter(a => a.sev === 'CRITICAL').length

  const goHome = () => setPage('landing')
  const enterApp = () => { setPage('app'); setTab('dashboard') }

  if (page === 'landing') {
    return <Landing onEnter={enterApp} />
  }

  return (
    <div style={{ minHeight: '100%', flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      <Navbar
        tab={tab}
        setTab={setTab}
        criticalCount={criticalCount}
        onHome={goHome}
      />

      {/* Page heading */}
      <header className="app-page-header">
        <h1>{PAGE_TITLES[tab]}</h1>
        <div className="app-page-header-meta">
          Last updated:{' '}
          {new Date().toLocaleString('en-US', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
          })}{' '}
          UTC
        </div>
      </header>

      <main className="main-content">
        {tab === 'dashboard' && (
          <Dashboard containers={containers} setContainers={setContainers} />
        )}
        {tab === 'map' && (
          <GlobalMap
            containers={containers}
            onSelect={c => {
              setTab('dashboard')
              // optional: could lift selected state up later
            }}
          />
        )}
        {tab === 'alerts' && <Alerts />}
        {tab === 'intel' && <Intelligence containers={containers} />}
        {tab === 'ai' && <AIAssistant />}
        {tab === 'model' && (
          <div style={{ padding: 24 }}>
            <div className="section-label">AI MODEL INSIGHTS</div>
            <div className="card" style={{ maxWidth: 720 }}>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.7 }}>
                This demo uses a mock risk engine to simulate how temperature excursions, route delays,
                and cargo type impact overall spoilage probability and financial loss. In a production
                setup, this view would describe your deployed model versions, feature inputs, and live
                performance metrics.
              </p>
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer-bar">
        <span>LogisticAI Risk Intelligence Platform</span>
        <span>© 2025 · Hackathon MVP v1.0.0</span>
        <span style={{ color: 'var(--green)' }}>● SYSTEM ONLINE</span>
      </footer>
    </div>
  )
}
