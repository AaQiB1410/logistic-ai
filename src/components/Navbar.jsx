import React from 'react'

const TABS = [
  { id: 'dashboard', label: '📦 Fleet' },
  { id: 'map',       label: '🌍 Global Map' },
  { id: 'alerts',    label: '🚨 Alerts' },
  { id: 'intel',     label: '📊 Intelligence' },
  { id: 'ai',        label: '⚡ AI Assistant' },
  { id: 'model',     label: '🧠 AI Model' },
]

export default function Navbar({ tab, setTab, criticalCount, onHome }) {
  return (
    <nav className="nav">
      {/* Logo */}
      <div className="nav-brand" onClick={onHome} style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' }}>
        <div style={{
          width:36, height:36,
          background:'var(--grad-brand)',
          borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:18, boxShadow:'0 4px 20px rgba(0,229,255,0.25)',
        }}>⚡</div>
        <div>
          <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:16, letterSpacing:'-0.3px' }}>
            <span style={{ background:'var(--grad-brand)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>CargoMind</span>
            <span style={{ color:'var(--text)', marginLeft:4 }}>AI</span>
          </div>
          <div style={{ fontFamily:'var(--font-mono)', fontSize:8, color:'var(--text3)', letterSpacing:'2px', lineHeight:1 }}>
            RISK INTELLIGENCE PLATFORM
          </div>
        </div>
      </div>

      {/* Nav tabs — horizontal scroll on narrow viewports */}
      <div className="nav-tabs-scroll" aria-label="Primary navigation">
        {TABS.map(t => (
          <button
            key={t.id}
            type="button"
            className="nav-tab-btn"
            data-active={tab === t.id}
            onClick={() => setTab(t.id)}
          >
            {t.label}
            {t.id==='alerts' && criticalCount>0 && (
              <span style={{
                position:'absolute', top:-4, right:-4,
                background:'var(--red)', color:'#fff',
                borderRadius:'50%', width:14, height:14,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:9, fontWeight:700, fontFamily:'var(--font-mono)',
              }}>{criticalCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* Right */}
      <div className="nav-meta">
        <div className="nav-meta-time">
          {new Date().toUTCString().slice(17,25)} UTC
        </div>
        {criticalCount>0 && (
          <span className="animate-blink" style={{
            background:'linear-gradient(135deg,rgba(255,23,68,0.2),rgba(255,107,0,0.15))',
            border:'1px solid rgba(255,23,68,0.4)',
            color:'var(--red)', borderRadius:6, padding:'3px 10px',
            fontFamily:'var(--font-mono)', fontSize:10, fontWeight:700, letterSpacing:'0.5px',
          }}>⚡ {criticalCount} CRITICAL</span>
        )}
        <div style={{ width:8, height:8, borderRadius:'50%', background:'var(--green)', animation:'pulse-dot 2s ease-in-out infinite' }}/>
      </div>
    </nav>
  )
}
