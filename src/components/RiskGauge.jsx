import React from 'react'

export default function RiskGauge({ score, size = 64 }) {
  const color = score >= 75 ? 'var(--red)' : score >= 45 ? 'var(--amber)' : 'var(--green)'
  const glow  = score >= 75 ? 'rgba(255,23,68,0.5)' : score >= 45 ? 'rgba(255,171,0,0.5)' : 'rgba(0,230,118,0.5)'
  const r = (size / 2) - 7
  const cx = size / 2, cy = size / 2
  const circ = 2 * Math.PI * r
  const arc = circ * 0.75
  const filled = arc * (score / 100)
  const id = `grad-${size}-${score}`
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor={score >= 75 ? '#ff6b00' : score >= 45 ? '#ff6b00' : 'var(--cyan)'} />
        </linearGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border)" strokeWidth="4"
        strokeDasharray={`${arc} ${circ}`} strokeLinecap="round"
        transform={`rotate(-135 ${cx} ${cy})`} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={`url(#${id})`} strokeWidth="4"
        strokeDasharray={`${filled} ${circ - filled}`} strokeLinecap="round"
        transform={`rotate(-135 ${cx} ${cy})`}
        style={{ filter: `drop-shadow(0 0 4px ${glow})` }} />
      <text x={cx} y={cy + 5} textAnchor="middle" fill={color}
        fontSize={size * 0.2} fontWeight="700" fontFamily="var(--font-mono)">
        {score}
      </text>
    </svg>
  )
}
