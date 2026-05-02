import React, { useState } from 'react'
import RiskGauge from '../components/RiskGauge'
import TempBar from '../components/TempBar'
import MiniChart from '../components/MiniChart'
import { simulateRisk } from '../data/containers'

const URGENCY_STYLE = {
  IMMEDIATE: { bg:'rgba(255,23,68,0.1)',  border:'rgba(255,23,68,0.3)',  color:'var(--red)',   dot:'var(--red)' },
  URGENT:    { bg:'rgba(255,171,0,0.1)',  border:'rgba(255,171,0,0.3)',  color:'var(--amber)', dot:'var(--amber)' },
  TODAY:     { bg:'rgba(0,229,255,0.06)', border:'rgba(0,229,255,0.2)',  color:'var(--cyan)',  dot:'var(--cyan)' },
  'THIS WEEK': { bg:'rgba(0,230,118,0.06)', border:'rgba(0,230,118,0.18)', color:'var(--green)', dot:'var(--green)' },
}

function SectionHead({ icon, label }) {
  return (
    <div className="section-label" style={{ marginBottom:14, marginTop:4 }}>
      <span>{icon}</span> {label}
    </div>
  )
}

export default function DetailPanel({ container: c, onClose }) {
  const [tempDelta, setTempDelta]   = useState(0)
  const [delayDelta, setDelayDelta] = useState(0)
  const [simActive, setSimActive]   = useState(false)

  if (!c) return null

  const statusColor = c.status==='CRITICAL' ? 'var(--red)' : c.status==='WARNING' ? 'var(--amber)' : 'var(--green)'
  const borderColor = c.status==='CRITICAL' ? 'rgba(255,23,68,0.3)' : c.status==='WARNING' ? 'rgba(255,171,0,0.22)' : 'var(--border)'

  const sim = simActive ? simulateRisk(c, tempDelta, delayDelta) : null

  const fmt = n => n>=1000000 ? `$${(n/1000000).toFixed(2)}M` : n>=1000 ? `$${(n/1000).toFixed(0)}k` : `$${n}`

  return (
    <div className="card" style={{ borderColor, maxHeight:'88vh', overflowY:'auto' }}>
      {/* Status bar */}
      <div style={{
        position:'absolute', top:0, left:0, right:0, height:2, borderRadius:'var(--r-lg) var(--r-lg) 0 0',
        background: c.status==='CRITICAL' ? 'var(--grad-danger)' : c.status==='WARNING' ? 'var(--grad-warn)' : 'var(--grad-ok)',
      }}/>

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20, marginTop:4 }}>
        <div>
          <div style={{ fontFamily:'var(--font-mono)', fontSize:18, fontWeight:600, color:'var(--cyan)', letterSpacing:'0.5px' }}>{c.id}</div>
          <div style={{ fontSize:12, color:'var(--text2)', marginTop:5 }}>{c.line} · {c.origin} → {c.dest}</div>
        </div>
        <button className="btn btn-ghost" onClick={onClose} style={{ padding:'5px 14px', fontSize:12 }}>✕</button>
      </div>

      {/* KPI row */}
      <div className="detail-kpi-grid">
        {[
          { l:'RISK SCORE', v:c.riskScore, c:c.riskScore>=75?'var(--red)':c.riskScore>=45?'var(--amber)':'var(--green)' },
          { l:'TEMPERATURE', v:`${c.temp.toFixed(1)}°C`, c:c.temp>=c.tempRange[0]&&c.temp<=c.tempRange[1]?'var(--cyan)':'var(--red)' },
          { l:'HUMIDITY', v:`${c.humidity}%`, c:'var(--cyan)' },
          { l:'ETA', v:`+${c.etaDays}d`, c:c.delay>0?'var(--amber)':'var(--green)' },
        ].map(m => (
          <div key={m.l} style={{ background:'var(--navy3)', borderRadius:'var(--r-md)', padding:'12px 10px', textAlign:'center' }}>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:20, fontWeight:700, color:m.c, lineHeight:1 }}>{m.v}</div>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'var(--text3)', letterSpacing:'1px', marginTop:6 }}>{m.l}</div>
          </div>
        ))}
      </div>

      {/* ── AI REASONING ── */}
      <SectionHead icon="🧠" label="AI EXPLAINABILITY — WHY THIS RISK SCORE"/>
      <div style={{ background:'rgba(0,229,255,0.03)', border:'1px solid rgba(0,229,255,0.12)', borderRadius:'var(--r-md)', padding:16, marginBottom:20 }}>
        <div style={{ fontSize:13, color:'var(--text)', lineHeight:1.6, marginBottom:14, fontStyle:'italic', borderLeft:'2px solid var(--cyan)', paddingLeft:12 }}>
          {c.aiReasoning.summary}
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {c.aiReasoning.factors.map((f, i) => {
            const fc = f.score>=70?'var(--red)':f.score>=45?'var(--amber)':'var(--green)'
            return (
              <div key={i} style={{ padding:'10px 12px', background:'var(--navy3)', borderRadius:'var(--r-md)' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                  <span style={{ fontFamily:'var(--font-display)', fontWeight:600, fontSize:13 }}>{f.label}</span>
                  <span style={{ fontFamily:'var(--font-mono)', fontSize:11, color:fc, fontWeight:700 }}>{f.score}/100</span>
                </div>
                <div style={{ height:3, background:'var(--border)', borderRadius:2, marginBottom:8, overflow:'hidden' }}>
                  <div className="risk-factor-bar" style={{
                    height:'100%', width:`${f.score}%`,
                    background: f.score>=70?'var(--grad-danger)':f.score>=45?'var(--grad-warn)':'var(--grad-ok)',
                    animationDelay:`${i*0.1}s`,
                  }}/>
                </div>
                <div style={{ fontSize:12, color:'var(--text2)', lineHeight:1.5 }}>{f.detail}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── TREND CHARTS ── */}
      <SectionHead icon="📈" label="TREND ANALYSIS — LAST 9 READINGS"/>
      <div className="detail-chart-row">
        <div style={{ background:'var(--navy3)', borderRadius:'var(--r-md)', padding:14 }}>
          <div style={{ fontSize:11, color:'var(--text2)', marginBottom:8, fontFamily:'var(--font-display)', fontWeight:600 }}>Temperature Trend</div>
          <MiniChart data={c.tempHistory} color={c.status==='CRITICAL'?'var(--red)':'var(--cyan)'} label="temp"/>
        </div>
        <div style={{ background:'var(--navy3)', borderRadius:'var(--r-md)', padding:14 }}>
          <div style={{ fontSize:11, color:'var(--text2)', marginBottom:8, fontFamily:'var(--font-display)', fontWeight:600 }}>Risk Score Trend</div>
          <MiniChart data={c.riskHistory} color={c.riskScore>=75?'var(--red)':c.riskScore>=45?'var(--amber)':'var(--green)'} label="risk"/>
        </div>
      </div>

      {/* ── BUSINESS IMPACT ── */}
      <SectionHead icon="💼" label="BUSINESS IMPACT ASSESSMENT"/>
      <div className="detail-kpi-grid">
        {[
          { l:'Financial Loss', v:fmt(c.financialLoss), c:c.financialLoss>0?'var(--red)':'var(--green)', icon:'💸' },
          { l:'Spoilage Risk', v:`${c.spoilagePct}%`, c:c.spoilagePct>=30?'var(--red)':c.spoilagePct>=10?'var(--amber)':'var(--green)', icon:'⚗️' },
          { l:'Waste Volume', v:`${c.wasteKg.toLocaleString()} kg`, c:'var(--amber)', icon:'♻️' },
          { l:'CO₂ Saved', v:`${c.co2Saved.toLocaleString()} kg`, c:'var(--green)', icon:'🌱' },
        ].map(m => (
          <div key={m.l} style={{ background:'var(--navy3)', borderRadius:'var(--r-md)', padding:12, textAlign:'center' }}>
            <div style={{ fontSize:18, marginBottom:6 }}>{m.icon}</div>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:14, fontWeight:700, color:m.c }}>{m.v}</div>
            <div style={{ fontSize:10, color:'var(--text3)', marginTop:4 }}>{m.l}</div>
          </div>
        ))}
      </div>

      {/* ── SCENARIO SIMULATION ── */}
      <SectionHead icon="🔬" label="SCENARIO SIMULATION"/>
      <div style={{ background:'rgba(124,58,255,0.04)', border:'1px solid rgba(124,58,255,0.18)', borderRadius:'var(--r-md)', padding:18, marginBottom:20 }}>
        <div className="detail-sim-controls">
          <div>
            <div style={{ fontSize:12, color:'var(--text2)', marginBottom:8, fontFamily:'var(--font-display)', fontWeight:600 }}>
              🌡️ Temperature Shift: <span style={{ color:'var(--cyan)', fontFamily:'var(--font-mono)' }}>
                {tempDelta>=0?'+':''}{tempDelta}°C
              </span>
            </div>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
              {[-2,-1,0,1,2,3,4].map(v => (
                <button key={v} onClick={()=>setTempDelta(v)} style={{
                  padding:'5px 10px', borderRadius:'var(--r-sm)', fontSize:11, fontFamily:'var(--font-mono)',
                  cursor:'pointer', transition:'all 0.2s',
                  background: tempDelta===v ? 'rgba(124,58,255,0.3)' : 'var(--navy4)',
                  border: tempDelta===v ? '1px solid rgba(124,58,255,0.6)' : '1px solid var(--border)',
                  color: tempDelta===v ? '#a78bfa' : 'var(--text2)',
                }}>{v>=0?'+':''}{v}°C</button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize:12, color:'var(--text2)', marginBottom:8, fontFamily:'var(--font-display)', fontWeight:600 }}>
              ⏱️ Delay Added: <span style={{ color:'var(--cyan)', fontFamily:'var(--font-mono)' }}>+{delayDelta}d</span>
            </div>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
              {[0,1,2,3,5,7].map(v => (
                <button key={v} onClick={()=>setDelayDelta(v)} style={{
                  padding:'5px 10px', borderRadius:'var(--r-sm)', fontSize:11, fontFamily:'var(--font-mono)',
                  cursor:'pointer', transition:'all 0.2s',
                  background: delayDelta===v ? 'rgba(124,58,255,0.3)' : 'var(--navy4)',
                  border: delayDelta===v ? '1px solid rgba(124,58,255,0.6)' : '1px solid var(--border)',
                  color: delayDelta===v ? '#a78bfa' : 'var(--text2)',
                }}>{v===0?'None':`+${v}d`}</button>
              ))}
            </div>
          </div>
        </div>

        <button onClick={()=>setSimActive(!simActive)} className="btn" style={{
          width:'100%', justifyContent:'center', marginBottom: sim ? 16 : 0,
          background: simActive ? 'rgba(124,58,255,0.2)' : 'linear-gradient(135deg,rgba(124,58,255,0.4),rgba(0,229,255,0.2))',
          border:'1px solid rgba(124,58,255,0.4)', color:'#c4b5fd',
        }}>
          {simActive ? '↺ Reset Simulation' : '▶ Run Simulation'}
        </button>

        {sim && (
          <div className="animate-fade-in detail-kpi-grid detail-kpi-grid--tight">
            {[
              { l:'New Risk Score', v:sim.newRisk, c:sim.newRisk>=75?'var(--red)':sim.newRisk>=45?'var(--amber)':'var(--green)', delta:`was ${c.riskScore}` },
              { l:'Spoilage Prob.', v:`${sim.newSpoilage}%`, c:sim.newSpoilage>=30?'var(--red)':'var(--amber)', delta:`was ${c.spoilagePct}%` },
              { l:'Projected Loss', v:fmt(sim.newLoss), c:'var(--red)', delta:`was ${fmt(c.financialLoss)}` },
              { l:'New Temp', v:`${sim.newTemp.toFixed(1)}°C`, c:sim.newTemp>=c.tempRange[0]&&sim.newTemp<=c.tempRange[1]?'var(--green)':'var(--red)', delta:`was ${c.temp.toFixed(1)}°C` },
            ].map(m => (
              <div key={m.l} style={{ background:'rgba(124,58,255,0.08)', border:'1px solid rgba(124,58,255,0.2)', borderRadius:'var(--r-md)', padding:12, textAlign:'center' }}>
                <div style={{ fontFamily:'var(--font-mono)', fontSize:17, fontWeight:700, color:m.c }}>{m.v}</div>
                <div style={{ fontSize:9, color:'var(--text3)', marginTop:3, fontFamily:'var(--font-mono)' }}>{m.delta}</div>
                <div style={{ fontSize:10, color:'var(--text3)', marginTop:5 }}>{m.l}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── DECISION ENGINE ── */}
      <SectionHead icon="⚡" label="AI DECISION ENGINE — PRIORITIZED ACTIONS"/>
      <div style={{ background:'linear-gradient(135deg, rgba(0,229,255,0.04), rgba(124,58,255,0.04))', border:'1px solid rgba(0,229,255,0.15)', borderRadius:'var(--r-md)', padding:16, marginBottom:20 }}>
        {c.decisionActions.map((a, i) => {
          const us = URGENCY_STYLE[a.urgency] || URGENCY_STYLE.TODAY
          return (
            <div key={i} style={{
              display:'flex', gap:12, alignItems:'center',
              padding:'10px 14px', borderRadius:'var(--r-md)',
              marginBottom: i<c.decisionActions.length-1 ? 8 : 0,
              background: us.bg, border:`1px solid ${us.border}`,
            }}>
              <div style={{
                width:26, height:26, borderRadius:'50%', flexShrink:0,
                background:`${us.bg}`, border:`2px solid ${us.border}`,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontFamily:'var(--font-mono)', fontSize:11, fontWeight:700, color:us.color,
              }}>{a.priority}</div>
              <div style={{ flex:1, fontSize:13, color:'var(--text)', lineHeight:1.4 }}>{a.action}</div>
              <span style={{
                padding:'2px 8px', borderRadius:4, fontSize:9, fontFamily:'var(--font-mono)',
                fontWeight:700, letterSpacing:'0.5px', background:us.bg, border:`1px solid ${us.border}`, color:us.color,
                flexShrink:0,
              }}>{a.urgency}</span>
            </div>
          )
        })}
      </div>

      {/* ── CARGO + ENV ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:20 }}>
        <div style={{ background:'var(--navy3)', borderRadius:'var(--r-md)', padding:14 }}>
          <SectionHead icon="📦" label="CARGO DETAILS"/>
          {[['Cargo Type',c.cargo],['Shipping Line',c.line],['Origin',c.origin],['Destination',c.dest],['Position',c.location],['ETA',c.eta],['Cargo Value',`$${(c.cargoValue/1000000).toFixed(2)}M`]].map(([k,v]) => (
            <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'5px 0', borderBottom:'1px solid var(--border2)', fontSize:12 }}>
              <span style={{ color:'var(--text3)' }}>{k}</span>
              <span style={{ color:'var(--text)', fontWeight:500, textAlign:'right', maxWidth:'55%' }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ background:'var(--navy3)', borderRadius:'var(--r-md)', padding:14 }}>
          <SectionHead icon="🌡️" label="ENVIRONMENT"/>
          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:11, color:'var(--text2)', marginBottom:6 }}>Temperature Monitor</div>
            <TempBar temp={c.temp} range={c.tempRange}/>
            <div style={{ fontSize:10, color:'var(--text3)', marginTop:4 }}>Safe: {c.tempRange[0]}°C to {c.tempRange[1]}°C</div>
          </div>
          <div style={{ marginBottom:12 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5, fontSize:11, color:'var(--text2)' }}>
              <span>Humidity</span>
              <span style={{ fontFamily:'var(--font-mono)', color:'var(--cyan)', fontWeight:600 }}>{c.humidity}%</span>
            </div>
            <div style={{ height:6, background:'var(--border)', borderRadius:3, overflow:'hidden' }}>
              <div style={{ height:'100%', width:`${c.humidity}%`, background:'linear-gradient(90deg,var(--cyan3),var(--cyan))', borderRadius:3 }}/>
            </div>
          </div>
          <div style={{ display:'flex', justifyContent:'center', marginTop:16 }}>
            <RiskGauge score={c.riskScore} size={80}/>
          </div>
        </div>
      </div>

      {/* Issues */}
      {c.issues.length>0 && (
        <>
          <SectionHead icon="⚠️" label={`ACTIVE ISSUES (${c.issues.length})`}/>
          {c.issues.map((iss, i) => (
            <div key={i} style={{
              display:'flex', gap:10, padding:'10px 14px', marginBottom:8, borderRadius:'var(--r-md)', fontSize:12,
              background:`rgba(${c.status==='CRITICAL'?'255,23,68':'255,171,0'},0.06)`,
              border:`1px solid rgba(${c.status==='CRITICAL'?'255,23,68':'255,171,0'},0.2)`,
            }}>
              <span style={{ color:statusColor, flexShrink:0 }}>⚠</span>
              <span style={{ color:'var(--text)', lineHeight:1.5 }}>{iss}</span>
            </div>
          ))}
        </>
      )}

      {/* AI Rec */}
      <div style={{ background:'rgba(0,229,255,0.03)', border:'1px solid rgba(0,229,255,0.12)', borderRadius:'var(--r-md)', padding:16 }}>
        <SectionHead icon="💡" label="AI RECOMMENDATION"/>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:12 }}>
          {[{l:'Ideal Temp',v:c.rec.idealTemp,icon:'🌡️'},{l:'Spoilage',v:c.rec.spoilage,icon:'⚗️'},{l:'Delay Risk',v:c.rec.delay,icon:'⏱️'}].map(item => (
            <div key={item.l} style={{ background:'var(--navy3)', borderRadius:'var(--r-md)', padding:12 }}>
              <div style={{ fontSize:10, color:'var(--text3)', marginBottom:5 }}>{item.icon} {item.l}</div>
              <div style={{ fontSize:13, fontWeight:500, color:'var(--text)', lineHeight:1.4 }}>{item.v}</div>
            </div>
          ))}
        </div>
        <div style={{ background:'var(--navy3)', borderRadius:'var(--r-md)', padding:14, fontSize:13, color:'var(--text)', lineHeight:1.65 }}>
          <span style={{ color:'var(--cyan)', fontWeight:600 }}>Suggested Action: </span>{c.rec.action}
        </div>
      </div>
    </div>
  )
}
