import React, { useState } from 'react'
import { SHIPPING_LINES } from '../data/containers'
import MiniChart from '../components/MiniChart'

const RATING_COLOR = r => {
  if (r.startsWith('A')) return 'var(--green)'
  if (r.startsWith('B')) return 'var(--cyan)'
  if (r.startsWith('C')) return 'var(--amber)'
  return 'var(--red)'
}

// Mock monthly performance data per line
const PERF_DATA = {
  'MSC':         [62,68,71,74,80,81,85,87,87],
  'OOCL':        [44,50,55,58,61,65,68,71,74],
  'Hapag-Lloyd': [40,44,48,50,52,56,58,60,62],
  'CMA CGM':     [30,28,27,29,28,30,31,33,34],
  'Yang Ming':   [35,32,30,29,28,27,28,29,29],
  'Evergreen':   [25,22,20,19,18,17,17,18,18],
}

export default function Intelligence({ containers }) {
  const [selectedLine, setSelectedLine] = useState(null)

  const totalValue = containers.reduce((a,c) => a+c.cargoValue, 0)
  const totalLoss  = containers.reduce((a,c) => a+c.financialLoss, 0)
  const totalWaste = containers.reduce((a,c) => a+c.wasteKg, 0)
  const totalCO2   = containers.reduce((a,c) => a+c.co2Saved, 0)
  const avgRisk    = Math.round(containers.reduce((a,c) => a+c.riskScore, 0) / containers.length)

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:28 }}>

      {/* Fleet financial summary */}
      <div>
        <div className="section-label">FLEET FINANCIAL INTELLIGENCE</div>
        <div className="intel-metrics-grid">
          {[
            { l:'Total Cargo Value', v:`$${(totalValue/1000000).toFixed(1)}M`, c:'var(--cyan)', icon:'💰' },
            { l:'Estimated Loss Exposure', v:`$${(totalLoss/1000000).toFixed(2)}M`, c:totalLoss>500000?'var(--red)':'var(--amber)', icon:'💸' },
            { l:'Spoilage Weight', v:`${(totalWaste/1000).toFixed(1)}t`, c:'var(--amber)', icon:'♻️' },
            { l:'CO₂ Offset', v:`${(totalCO2/1000).toFixed(1)}t`, c:'var(--green)', icon:'🌱' },
            { l:'Fleet Avg Risk', v:`${avgRisk}/100`, c:avgRisk>=50?'var(--amber)':'var(--green)', icon:'⚡' },
          ].map(m => (
            <div key={m.l} className="card" style={{ textAlign:'center', padding:'18px 12px' }}>
              <div style={{ fontSize:28, marginBottom:8 }}>{m.icon}</div>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:20, fontWeight:700, color:m.c }}>{m.v}</div>
              <div style={{ fontSize:11, color:'var(--text3)', marginTop:6 }}>{m.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping Line Comparison */}
      <div>
        <div className="section-label">SHIPPING LINE PERFORMANCE SCORECARD</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14 }} className="grid-3">
          {SHIPPING_LINES.map(line => {
            const rc = RATING_COLOR(line.rating)
            const isSelected = selectedLine === line.name
            return (
              <div key={line.name} className="card hover-lift" onClick={() => setSelectedLine(isSelected ? null : line.name)}
                style={{ cursor:'pointer', borderColor: isSelected ? 'rgba(0,229,255,0.4)' : 'var(--border)', transition:'all 0.2s' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
                  <div>
                    <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:16 }}>{line.name}</div>
                    <div style={{ fontSize:11, color:'var(--text3)', marginTop:3 }}>{line.containers} container{line.containers>1?'s':''} tracked</div>
                  </div>
                  <div style={{
                    background: `rgba(${rc==='var(--green)'?'0,230,118':rc==='var(--amber)'?'255,171,0':'255,23,68'},0.12)`,
                    border: `2px solid ${rc}`,
                    borderRadius:8, padding:'4px 12px',
                    fontFamily:'var(--font-display)', fontWeight:800, fontSize:20, color:rc,
                    textShadow:`0 0 12px ${rc}`,
                  }}>{line.rating}</div>
                </div>

                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:14 }}>
                  {[
                    { l:'Avg Risk', v:line.avgRisk, c:line.avgRisk>=75?'var(--red)':line.avgRisk>=45?'var(--amber)':'var(--green)' },
                    { l:'On-Time Rate', v:line.onTimeRate, c:parseInt(line.onTimeRate)>=80?'var(--green)':'var(--amber)' },
                    { l:'Delay Rate', v:line.delayRate, c:parseInt(line.delayRate)>=50?'var(--red)':'var(--amber)' },
                    { l:'Critical', v:line.critical, c:line.critical>0?'var(--red)':'var(--green)' },
                  ].map(m => (
                    <div key={m.l} style={{ background:'var(--navy3)', borderRadius:'var(--r-sm)', padding:'8px 10px' }}>
                      <div style={{ fontFamily:'var(--font-mono)', fontSize:15, fontWeight:700, color:m.c }}>{m.v}</div>
                      <div style={{ fontSize:10, color:'var(--text3)', marginTop:3 }}>{m.l}</div>
                    </div>
                  ))}
                </div>

                {/* Trend indicator */}
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ fontSize:16 }}>
                    {line.trend==='up' ? '📈' : line.trend==='down' ? '📉' : '➡️'}
                  </span>
                  <span style={{ fontSize:12, color:'var(--text2)' }}>
                    {line.trend==='up' ? 'Improving performance' : line.trend==='down' ? 'Declining performance' : 'Stable performance'}
                  </span>
                </div>

                {/* Risk trend sparkline */}
                {PERF_DATA[line.name] && (
                  <div style={{ marginTop:12 }}>
                    <MiniChart
                      data={PERF_DATA[line.name]}
                      color={line.avgRisk>=75?'var(--red)':line.avgRisk>=45?'var(--amber)':'var(--green)'}
                      label={line.name} height={60}
                    />
                  </div>
                )}

                {/* Alerts */}
                {line.critical>0 && (
                  <div style={{ marginTop:10, padding:'6px 10px', background:'rgba(255,23,68,0.08)', border:'1px solid rgba(255,23,68,0.2)', borderRadius:'var(--r-sm)', fontSize:11, color:'var(--red)' }}>
                    ⚡ {line.critical} critical container — immediate action required
                  </div>
                )}
                {line.warning>0 && !line.critical && (
                  <div style={{ marginTop:10, padding:'6px 10px', background:'rgba(255,171,0,0.08)', border:'1px solid rgba(255,171,0,0.2)', borderRadius:'var(--r-sm)', fontSize:11, color:'var(--amber)' }}>
                    ⚠ {line.warning} container in warning state — monitor closely
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Risk distribution chart (SVG bar chart) */}
      <div>
        <div className="section-label">RISK SCORE DISTRIBUTION</div>
        <div className="card">
          <div style={{ overflowX:'auto' }}>
            <svg width="100%" viewBox="0 0 760 180" style={{ minWidth:500 }}>
              {containers.map((c, i) => {
                const color = c.riskScore>=75?'var(--red)':c.riskScore>=45?'var(--amber)':'var(--green)'
                const barW = 80, gap = 20
                const x = i*(barW+gap)+40
                const maxH = 120
                const barH = (c.riskScore/100)*maxH
                const y = 20 + maxH - barH
                return (
                  <g key={c.id}>
                    <rect x={x} y={y} width={barW} height={barH} rx="4"
                      fill={color} opacity="0.7"
                      style={{ filter:`drop-shadow(0 0 8px ${color})` }}
                    />
                    <text x={x+barW/2} y={y-6} textAnchor="middle" fill={color} fontSize="11" fontWeight="700" fontFamily="var(--font-mono)">{c.riskScore}</text>
                    <text x={x+barW/2} y={155} textAnchor="middle" fill="var(--text3)" fontSize="9" fontFamily="var(--font-mono)">{c.id.slice(0,8)}</text>
                    <text x={x+barW/2} y={168} textAnchor="middle" fill="var(--text3)" fontSize="9" fontFamily="var(--font-mono)">{c.id.slice(8)}</text>
                  </g>
                )
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* Cargo type breakdown */}
      <div>
        <div className="section-label">CARGO TYPE RISK MATRIX</div>
        <div className="card">
          <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>CARGO TYPE</th><th>CONTAINER</th><th>SHIPPING LINE</th>
                <th>TEMP STATUS</th><th>RISK SCORE</th><th>FINANCIAL EXPOSURE</th><th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {[...containers].sort((a,b) => b.riskScore-a.riskScore).map(c => (
                <tr key={c.id}>
                  <td style={{ color:'var(--text)' }}>{c.cargoIcon} {c.cargo}</td>
                  <td style={{ fontFamily:'var(--font-mono)', color:'var(--cyan)', fontSize:12 }}>{c.id}</td>
                  <td style={{ color:'var(--text2)' }}>{c.line}</td>
                  <td style={{ fontFamily:'var(--font-mono)', fontSize:11, color:c.temp>=c.tempRange[0]&&c.temp<=c.tempRange[1]?'var(--green)':'var(--red)' }}>
                    {c.temp.toFixed(1)}°C {c.temp>=c.tempRange[0]&&c.temp<=c.tempRange[1]?'✓':'⚠'}
                  </td>
                  <td>
                    <span style={{
                      fontFamily:'var(--font-mono)', fontWeight:700, fontSize:13,
                      color:c.riskScore>=75?'var(--red)':c.riskScore>=45?'var(--amber)':'var(--green)',
                    }}>{c.riskScore}</span>
                  </td>
                  <td style={{ fontFamily:'var(--font-mono)', color:c.financialLoss>0?'var(--amber)':'var(--green)', fontSize:12 }}>
                    ${(c.financialLoss/1000).toFixed(0)}k
                  </td>
                  <td><span className={`badge badge-${c.status.toLowerCase()}`}>{c.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </div>
  )
}
