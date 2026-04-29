import React from 'react'

export default function MiniChart({ data, color = 'var(--cyan)', label = '', height = 80, showArea = true }) {
  if (!data || data.length < 2) return null
  const W = 280, H = height
  const min = Math.min(...data), max = Math.max(...data)
  const range = max - min || 1
  const pad = { t: 8, b: 20, l: 32, r: 8 }
  const w = W - pad.l - pad.r, h = H - pad.t - pad.b
  const pts = data.map((v, i) => ({
    x: pad.l + (i / (data.length - 1)) * w,
    y: pad.t + (1 - (v - min) / range) * h,
  }))
  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaD = pathD + ` L ${pts[pts.length-1].x} ${pad.t+h} L ${pts[0].x} ${pad.t+h} Z`
  const gradId = `chart-grad-${label.replace(/\s/g,'')}-${Math.random().toString(36).slice(2,6)}`
  const ticks = [min, (min+max)/2, max]
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow:'visible' }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {ticks.map((t, i) => {
        const y = pad.t + (1 - (t - min) / range) * h
        return (
          <g key={i}>
            <line x1={pad.l} y1={y} x2={W-pad.r} y2={y} stroke="var(--border)" strokeWidth="0.5" strokeDasharray="3,4"/>
            <text x={pad.l-4} y={y+4} textAnchor="end" fill="var(--text3)" fontSize="9" fontFamily="var(--font-mono)">{typeof t==='number'?t.toFixed(1):t}</text>
          </g>
        )
      })}
      {/* X labels */}
      {data.map((_, i) => {
        if (i % 2 !== 0 && i !== data.length-1) return null
        return (
          <text key={i} x={pts[i].x} y={H-2} textAnchor="middle" fill="var(--text3)" fontSize="9" fontFamily="var(--font-mono)">
            {`T-${data.length-1-i}`}
          </text>
        )
      })}
      {/* Area */}
      {showArea && <path d={areaD} fill={`url(#${gradId})`}/>}
      {/* Line */}
      <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"
        style={{ filter:`drop-shadow(0 0 4px ${color})` }}/>
      {/* Dots */}
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="2.5" fill={color}
          style={{ filter:`drop-shadow(0 0 3px ${color})`, opacity: i===pts.length-1?1:0.6 }}/>
      ))}
    </svg>
  )
}
