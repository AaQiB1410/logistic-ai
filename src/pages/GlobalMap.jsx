import React, { useState } from 'react'
import { latLngToSvg } from '../data/containers'

// Simplified world map path data (simplified continents as SVG paths)
const LAND_PATHS = [
  // North America
  "M 120,80 L 175,70 L 210,85 L 230,100 L 220,130 L 195,155 L 175,160 L 155,150 L 130,120 L 115,100 Z",
  // South America
  "M 185,175 L 215,170 L 235,185 L 240,220 L 225,270 L 200,290 L 185,270 L 175,230 L 178,200 Z",
  // Europe
  "M 420,65 L 460,58 L 490,65 L 480,85 L 460,90 L 440,88 L 425,78 Z",
  // Africa
  "M 440,130 L 490,120 L 520,140 L 530,180 L 510,230 L 480,250 L 455,240 L 440,200 L 435,160 Z",
  // Asia main
  "M 490,60 L 620,50 L 720,75 L 740,100 L 720,120 L 680,130 L 620,120 L 570,110 L 530,90 L 500,75 Z",
  // South Asia
  "M 560,120 L 610,118 L 620,140 L 600,160 L 570,155 L 555,135 Z",
  // Southeast Asia
  "M 640,140 L 690,135 L 710,155 L 695,170 L 665,168 L 645,155 Z",
  // Australia
  "M 680,240 L 740,230 L 775,250 L 770,290 L 740,305 L 700,295 L 680,270 Z",
  // UK/Islands
  "M 430,70 L 440,67 L 445,75 L 436,80 Z",
  // Japan
  "M 730,90 L 745,85 L 748,95 L 735,100 Z",
]

const ROUTE_LINES = [
  // Rotterdam -> Dubai
  { from: [35.5, 18.2], to: [25.1, 55.2], color: 'rgba(255,23,68,0.4)' },
  // Shanghai -> Hamburg
  { from: [18.2, 115.8], to: [53.5, 10.0], color: 'rgba(255,171,0,0.4)' },
  // Buenos Aires -> Felixstowe
  { from: [-12.4, -28.6], to: [51.9, 1.3], color: 'rgba(0,230,118,0.3)' },
  // Kaohsiung -> LA
  { from: [28.1, 168.4], to: [33.7, -118.2], color: 'rgba(0,230,118,0.3)' },
  // Antwerp -> Singapore
  { from: [5.3, 72.1], to: [1.3, 103.8], color: 'rgba(255,171,0,0.4)' },
  // Osaka -> Oakland
  { from: [38.2, 148.9], to: [37.8, -122.3], color: 'rgba(0,230,118,0.3)' },
]

export default function GlobalMap({ containers, onSelect }) {
  const [hovered, setHovered] = useState(null)
  const [tooltip, setTooltip] = useState(null)

  const W = 960, H = 480

  return (
    <div>
      <div className="map-page-head">
        <div>
          <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:18 }}>Live Fleet Positions</div>
          <div style={{ fontSize:12, color:'var(--text2)', marginTop:3 }}>
            {containers.length} containers tracked globally · Click a dot to view details
          </div>
        </div>
        <div style={{ display:'flex', gap:16, fontSize:12, flexWrap:'wrap', alignItems:'center' }}>
          {[{c:'var(--red)',l:'Critical'},{c:'var(--amber)',l:'Warning'},{c:'var(--green)',l:'Nominal'}].map(i=>(
            <div key={i.l} style={{ display:'flex', alignItems:'center', gap:6 }}>
              <div style={{ width:10, height:10, borderRadius:'50%', background:i.c, boxShadow:`0 0 8px ${i.c}` }}/>
              <span style={{ color:'var(--text2)' }}>{i.l}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding:0, overflow:'hidden', position:'relative' }}>
        {/* Map background gradient */}
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 100% 80% at 50% 50%, rgba(0,40,80,0.4), transparent)', pointerEvents:'none' }}/>

        <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display:'block', background:'var(--navy)' }}>
          {/* Grid lines */}
          {[0,1,2,3,4].map(i => (
            <line key={`h${i}`} x1="0" y1={H*i/4} x2={W} y2={H*i/4} stroke="var(--border2)" strokeWidth="0.5"/>
          ))}
          {[0,1,2,3,4,5,6].map(i => (
            <line key={`v${i}`} x1={W*i/6} y1="0" x2={W*i/6} y2={H} stroke="var(--border2)" strokeWidth="0.5"/>
          ))}

          {/* Land masses */}
          {LAND_PATHS.map((d, i) => (
            <path key={i} d={d} fill="var(--navy4)" stroke="var(--navy5)" strokeWidth="1"/>
          ))}

          {/* Route lines */}
          {ROUTE_LINES.map((r, i) => {
            const from = latLngToSvg(r.from[0], r.from[1])
            const to   = latLngToSvg(r.to[0],   r.to[1])
            // Curved path
            const mx = (from.x + to.x) / 2
            const my = Math.min(from.y, to.y) - 40
            return (
              <path key={i}
                d={`M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`}
                fill="none" stroke={r.color} strokeWidth="1.5"
                strokeDasharray="6 4"
              />
            )
          })}

          {/* Container dots */}
          {containers.map(c => {
            const pos = latLngToSvg(c.lat, c.lng)
            const color = c.status==='CRITICAL' ? 'var(--red)' : c.status==='WARNING' ? 'var(--amber)' : 'var(--green)'
            const isHov = hovered === c.id
            return (
              <g key={c.id} style={{ cursor:'pointer' }}
                onClick={() => onSelect(c)}
                onMouseEnter={(e) => { setHovered(c.id); setTooltip({ c, x:pos.x, y:pos.y }) }}
                onMouseLeave={() => { setHovered(null); setTooltip(null) }}
              >
                {/* Pulse ring */}
                <circle cx={pos.x} cy={pos.y} r={isHov ? 22 : 16}
                  fill="none" stroke={color} strokeWidth="1" opacity="0.3"
                  style={c.status!=='OK'?{animation:'glow-pulse 2s ease-in-out infinite'}:{}}
                />
                <circle cx={pos.x} cy={pos.y} r={isHov ? 14 : 10}
                  fill="none" stroke={color} strokeWidth="1" opacity="0.5"
                />
                {/* Main dot */}
                <circle cx={pos.x} cy={pos.y} r={isHov ? 7 : 5}
                  fill={color}
                  style={{ filter:`drop-shadow(0 0 6px ${color})` }}
                />
                {/* Label */}
                {isHov && (
                  <text x={pos.x} y={pos.y - 22} textAnchor="middle"
                    fill="var(--text)" fontSize="10" fontFamily="var(--font-mono)"
                    style={{ filter:'drop-shadow(0 1px 2px rgba(0,0,0,0.9))' }}>
                    {c.id}
                  </text>
                )}
              </g>
            )
          })}
        </svg>

        {/* Tooltip */}
        {tooltip && (() => {
          const c = tooltip.c
          const pos = latLngToSvg(c.lat, c.lng)
          return (
            <div style={{
              position:'absolute',
              left: `${(pos.x/960)*100}%`,
              top: `${(pos.y/480)*100}%`,
              transform:'translate(-50%, -120%)',
              background:'var(--card2)', border:`1px solid rgba(0,229,255,0.25)`,
              borderRadius:'var(--r-md)', padding:'12px 16px',
              fontSize:12, pointerEvents:'none', zIndex:10, whiteSpace:'nowrap',
              boxShadow:'0 8px 32px rgba(0,0,0,0.5)',
            }}>
              <div style={{ fontFamily:'var(--font-mono)', color:'var(--cyan)', fontWeight:600, marginBottom:4 }}>{c.id}</div>
              <div style={{ color:'var(--text2)' }}>{c.cargoIcon} {c.cargo}</div>
              <div style={{ color:'var(--text2)' }}>📍 {c.location}</div>
              <div style={{ color:'var(--text2)' }}>🌡️ {c.temp.toFixed(1)}°C · ETA +{c.etaDays}d</div>
              <div style={{ display:'flex', justifyContent:'space-between', marginTop:6, gap:12 }}>
                <span className={`badge badge-${c.status.toLowerCase()}`}>{c.status}</span>
                <span style={{ fontFamily:'var(--font-mono)', fontSize:11, color:c.riskScore>=75?'var(--red)':c.riskScore>=45?'var(--amber)':'var(--green)' }}>
                  Risk: {c.riskScore}/100
                </span>
              </div>
            </div>
          )
        })()}
      </div>

      {/* Container summary cards below map */}
      <div className="map-summary-cards">
        {containers.map(c => {
          const color = c.status==='CRITICAL'?'var(--red)':c.status==='WARNING'?'var(--amber)':'var(--green)'
          return (
            <div key={c.id} className="card hover-lift" onClick={() => onSelect(c)} style={{
              cursor:'pointer', padding:'12px 14px',
              borderColor: c.status==='CRITICAL'?'rgba(255,23,68,0.3)':c.status==='WARNING'?'rgba(255,171,0,0.2)':'var(--border)',
            }}>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--cyan)', marginBottom:4 }}>{c.id}</div>
              <div style={{ fontSize:11, color:'var(--text3)', marginBottom:8 }}>{c.cargoIcon} {c.cargo}</div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span className={`badge badge-${c.status.toLowerCase()}`}>{c.status}</span>
                <span style={{ fontFamily:'var(--font-mono)', fontSize:11, color }}>{c.riskScore}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
