import React from 'react'
export default function TempBar({ temp, range }) {
  const [min, max] = range
  const span = max - min
  const extMin = min - span * 0.5, extMax = max + span * 0.5, extSpan = extMax - extMin
  const clipped = Math.max(extMin, Math.min(extMax, temp))
  const pct = ((clipped - extMin) / extSpan) * 100
  const safePct = ((min - extMin) / extSpan) * 100
  const safeWidth = (span / extSpan) * 100
  const ok = temp >= min && temp <= max
  const color = ok ? 'var(--cyan)' : 'var(--red)'
  return (
    <div>
      <div className="temp-track">
        <div className="temp-safe-zone" style={{ left:`${safePct}%`, width:`${safeWidth}%` }} />
        <div className="temp-cursor" style={{ left:`calc(${pct}% - 1.5px)`, background:color, boxShadow:`0 0 8px ${color}` }} />
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', fontSize:10 }}>
        <span style={{ color:'var(--text3)', fontFamily:'var(--font-mono)' }}>{min}°C</span>
        <span style={{ color, fontFamily:'var(--font-mono)', fontWeight:600 }}>{temp.toFixed(1)}°C</span>
        <span style={{ color:'var(--text3)', fontFamily:'var(--font-mono)' }}>{max}°C</span>
      </div>
    </div>
  )
}
