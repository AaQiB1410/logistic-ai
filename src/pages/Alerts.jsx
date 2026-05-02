import React, { useState } from 'react'
import { ALERTS, CONTAINERS } from '../data/containers'
import RiskGauge from '../components/RiskGauge'
import DetailPanel from './DetailPanel'

export default function Alerts() {
  const [selectedContainer, setSelectedContainer] = useState(null)

  const handleSelect = (containerId) => {
    const c = CONTAINERS.find(x => x.id === containerId)
    setSelectedContainer(c === selectedContainer ? null : c)
  }

  return (
    <div className="alerts-split">
      {/* Left: Alerts feed */}
      <div>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20,
          flexWrap: 'wrap', gap: 12,
        }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 20, fontWeight: 700,
          }}>
            Live Alert Feed
          </h2>
          <div style={{ display: 'flex', gap: 10 }}>
            <span className="badge badge-critical">
              {ALERTS.filter(a => a.sev === 'CRITICAL').length} CRITICAL
            </span>
            <span className="badge badge-warning">
              {ALERTS.filter(a => a.sev === 'WARNING').length} WARNING
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ALERTS.map(a => {
            const color =
              a.sev === 'CRITICAL' ? 'var(--red)' :
              a.sev === 'WARNING' ? 'var(--amber)' :
              'var(--cyan)'
            const bgAlpha =
              a.sev === 'CRITICAL' ? '255,23,68' :
              a.sev === 'WARNING' ? '255,171,0' :
              '0,212,255'
            const isSelected = selectedContainer?.id === a.container

            return (
              <div
                key={a.id}
                onClick={() => handleSelect(a.container)}
                style={{
                  padding: '16px 18px',
                  background: isSelected
                    ? `rgba(${bgAlpha}, 0.1)`
                    : `rgba(${bgAlpha}, 0.04)`,
                  borderLeft: `3px solid ${color}`,
                  borderTop: '1px solid transparent',
                  borderRight: `1px solid rgba(${bgAlpha}, ${isSelected ? '0.3' : '0.12'})`,
                  borderBottom: `1px solid rgba(${bgAlpha}, ${isSelected ? '0.3' : '0.12'})`,
                  borderRadius: '0 var(--r-md) var(--r-md) 0',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className={`badge badge-${a.sev.toLowerCase()}`}>{a.sev}</span>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11, color: 'var(--cyan)',
                    }}>
                      {a.container}
                    </span>
                  </div>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11, color: 'var(--text3)',
                  }}>
                    {a.time}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>{a.msg}</div>
                <div style={{ fontSize: 11, color, marginTop: 6 }}>
                  Click to view container details →
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Right: Risk ranking + detail */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Risk ranking */}
        <div className="card">
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10, color: 'var(--text3)',
            letterSpacing: '1.5px', marginBottom: 16,
          }}>
            RISK RANKING
          </div>
          {[...CONTAINERS].sort((a, b) => b.riskScore - a.riskScore).map((c, i) => (
            <div
              key={c.id}
              onClick={() => handleSelect(c.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 0',
                borderBottom: i < CONTAINERS.length - 1 ? '1px solid var(--border2)' : 'none',
                cursor: 'pointer',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 12, color: 'var(--text3)',
                width: 16, flexShrink: 0,
              }}>
                {i + 1}
              </div>
              <RiskGauge score={c.riskScore} size={48} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11, color: 'var(--cyan)',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {c.id}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{c.cargo}</div>
              </div>
              <span className={`badge badge-${c.status.toLowerCase()}`}>
                {c.status}
              </span>
            </div>
          ))}
        </div>

        {/* Detail panel */}
        {selectedContainer && (
          <DetailPanel container={selectedContainer} onClose={() => setSelectedContainer(null)} />
        )}
      </div>
    </div>
  )
}
