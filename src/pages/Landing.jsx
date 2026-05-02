import React from 'react'

const FEATURES = [
  {
    icon: '🛰️',
    title: 'Real-Time Tracking',
    desc: 'Live container telemetry across 50+ shipping lines. GPS position, ETA, and route deviation alerts.',
  },
  {
    icon: '🧠',
    title: 'AI Risk Engine',
    desc: 'Machine learning models predict spoilage, delays, and customs holds before they happen.',
  },
  {
    icon: '🌡️',
    title: 'Cold Chain Monitor',
    desc: 'Continuous temperature and humidity monitoring for pharma, vaccines, seafood, and produce.',
  },
  {
    icon: '⚡',
    title: 'Instant Decisions',
    desc: 'AI-generated recommended actions for every risk scenario, optimised per cargo type.',
  },
  {
    icon: '🚢',
    title: 'Multi-Line Coverage',
    desc: 'MSC, Hapag-Lloyd, CMA CGM, Evergreen, OOCL and 45 more integrated shipping lines.',
  },
  {
    icon: '📊',
    title: 'Risk Analytics',
    desc: 'Historical performance data, carrier scorecards, and predictive delay modelling.',
  },
]

const STATS = [
  { v: '2.4M+', l: 'Containers Tracked' },
  { v: '99.97%', l: 'Uptime SLA' },
  { v: '50+', l: 'Shipping Lines' },
  { v: '87%', l: 'Risk Reduction' },
]

export default function Landing({ onEnter }) {
  return (
    <div>
      {/* ── HERO ── */}
      <section
        className="grid-bg"
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(48px, 12vw, 80px) clamp(16px, 4vw, 32px)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Radial glow */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 90% 70% at 50% 40%, rgba(0,60,100,0.45), transparent)',
        }} />

        {/* Decorative orbit rings */}
        <svg
          style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none', opacity: 0.06 }}
          width="900" height="900" viewBox="0 0 900 900"
        >
          <circle cx="450" cy="450" r="200" fill="none" stroke="var(--cyan)" strokeWidth="1" />
          <circle cx="450" cy="450" r="320" fill="none" stroke="var(--cyan)" strokeWidth="0.5" strokeDasharray="4 8" />
          <circle cx="450" cy="450" r="420" fill="none" stroke="var(--cyan)" strokeWidth="0.5" />
        </svg>

        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1, maxWidth: 820 }}>
          <div className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(0,212,255,0.08)',
              border: '1px solid rgba(0,212,255,0.2)',
              borderRadius: 20, padding: '6px 18px',
              marginBottom: 36,
              fontFamily: 'var(--font-mono)',
              fontSize: 11, color: 'var(--cyan)', letterSpacing: '2px',
            }}>
              ⚡ AI-POWERED DECISION INTELLIGENCE
            </span>
          </div>

          <h1
            className="animate-fade-up"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(42px, 7vw, 72px)',
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-2px',
              marginBottom: 28,
              animationDelay: '0.2s',
            }}
          >
            Global Logistics<br />
            <span style={{
              color: 'var(--cyan)',
              textShadow: '0 0 60px rgba(0,212,255,0.4)',
            }}>
              Risk Intelligence
            </span>
          </h1>

          <p
            className="animate-fade-up"
            style={{
              fontSize: 18, color: 'var(--text2)', lineHeight: 1.75,
              maxWidth: 580, margin: '0 auto 48px',
              animationDelay: '0.3s',
            }}
          >
            Real-time AI decision support for cold chain, pharmaceuticals,
            and temperature-sensitive cargo across 50+ shipping lines worldwide.
          </p>

          <div
            className="animate-fade-up"
            style={{
              display: 'flex', gap: 16, justifyContent: 'center',
              flexWrap: 'wrap', marginBottom: 80,
              animationDelay: '0.4s',
            }}
          >
            <button className="btn btn-primary" onClick={onEnter} style={{ fontSize: 16, padding: '14px 36px' }}>
              Launch Dashboard →
            </button>
            <button className="btn btn-secondary" style={{ fontSize: 16, padding: '14px 32px' }}>
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div
            className="animate-fade-up landing-stats-grid"
            style={{
              animationDelay: '0.5s',
            }}
          >
            {STATS.map(s => (
              <div
                key={s.l}
                className="card"
                style={{ padding: '20px 12px', textAlign: 'center' }}
              >
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 28, fontWeight: 800, color: 'var(--cyan)',
                  textShadow: '0 0 20px rgba(0,212,255,0.3)',
                }}>{s.v}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 6 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: 'clamp(48px, 10vw, 100px) clamp(16px, 4vw, 32px)', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="section-label">PLATFORM CAPABILITIES</div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: 700, letterSpacing: '-1px',
          }}>
            Every decision, <span style={{ color: 'var(--cyan)' }}>intelligently automated</span>
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 20,
        }}
          className="grid-3"
        >
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="card hover-lift animate-fade-up"
              style={{
                animationDelay: `${0.1 * i}s`,
                borderTop: '2px solid var(--border)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderTopColor = 'var(--cyan)'
                e.currentTarget.style.boxShadow = 'var(--glow-cyan)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderTopColor = 'var(--border)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 16 }}>{f.icon}</div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 17, fontWeight: 700,
                marginBottom: 10, color: 'var(--text)',
              }}>
                {f.title}
              </div>
              <div style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.65 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        padding: 'clamp(48px, 10vw, 100px) clamp(16px, 4vw, 32px)',
        background: 'var(--navy2)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        textAlign: 'center',
      }}>
        <div className="section-label">GET STARTED</div>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(28px, 4vw, 48px)',
          fontWeight: 700, letterSpacing: '-1px',
          marginBottom: 20,
        }}>
          Ready to eliminate logistics risk?
        </h2>
        <p style={{ color: 'var(--text2)', fontSize: 17, marginBottom: 40, maxWidth: 500, margin: '0 auto 40px' }}>
          Join 300+ logistics operators who trust LogisticAI to protect their most sensitive cargo.
        </p>
        <button className="btn btn-primary" onClick={onEnter} style={{ fontSize: 16, padding: '16px 44px' }}>
          Open the Dashboard →
        </button>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        padding: 'clamp(24px, 5vw, 40px) clamp(16px, 4vw, 32px)',
        borderTop: '1px solid var(--border2)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 12,
        fontSize: 12,
        color: 'var(--text3)',
      }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--cyan)', fontSize: 14 }}>
          LogisticAI
        </div>
        <div>© 2025 LogisticAI Inc. · Global Risk Intelligence Platform · Hackathon MVP</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text3)' }}>
          v1.0.0-beta
        </div>
      </footer>
    </div>
  )
}
