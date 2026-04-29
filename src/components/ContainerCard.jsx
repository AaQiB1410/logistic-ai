import React from 'react'
import RiskGauge from './RiskGauge'
import TempBar from './TempBar'

const BORDER = { CRITICAL:'rgba(255,23,68,0.35)', WARNING:'rgba(255,171,0,0.28)', OK:'var(--border)' }
const GLOW   = { CRITICAL:'0 0 28px rgba(255,23,68,0.12)', WARNING:'0 0 24px rgba(255,171,0,0.08)', OK:'none' }

export default function ContainerCard({ container: c, onClick, selected }) {
  return (
    <div className="card hover-lift" onClick={() => onClick(c)} style={{
      borderColor: selected ? 'rgba(0,229,255,0.45)' : BORDER[c.status],
      boxShadow: selected ? '0 0 36px rgba(0,229,255,0.18)' : GLOW[c.status],
      cursor:'pointer', transition:'all 0.2s ease',
    }}>
      {/* Status strip */}
      <div style={{
        position:'absolute', top:0, left:0, right:0, height:2, borderRadius:'var(--r-lg) var(--r-lg) 0 0',
        background: c.status==='CRITICAL' ? 'var(--grad-danger)' : c.status==='WARNING' ? 'var(--grad-warn)' : 'var(--grad-ok)',
      }}/>

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14, marginTop:4 }}>
        <div>
          <div style={{ fontFamily:'var(--font-mono)', fontSize:13, fontWeight:600, color:'var(--cyan)', letterSpacing:'0.5px' }}>{c.id}</div>
          <div style={{ fontSize:11, color:'var(--text2)', marginTop:3 }}>{c.line} · {c.cargo}</div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:8 }}>
          <span className={`badge badge-${c.status.toLowerCase()}`}>
            {c.status==='CRITICAL'?'⚡':c.status==='WARNING'?'⚠':'✓'} {c.status}
          </span>
          <RiskGauge score={c.riskScore} size={58}/>
        </div>
      </div>

      <div style={{ fontSize:12, color:'var(--text2)', marginBottom:10 }}>
        <span style={{ color:'var(--text3)' }}>📍 </span>{c.location}
      </div>

      <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:12 }}>
        <span style={{ background:'var(--navy3)', padding:'3px 8px', borderRadius:'var(--r-sm)', fontSize:11, color:'var(--text2)' }}>
          {c.cargoIcon} {c.cargo}
        </span>
        <span style={{ background:'var(--navy3)', padding:'3px 8px', borderRadius:'var(--r-sm)', fontSize:11, color:'var(--text2)' }}>
          ETA +{c.etaDays}d
        </span>
        {c.delay>0 && <span style={{ background:'rgba(255,171,0,0.08)', border:'1px solid rgba(255,171,0,0.2)', padding:'3px 8px', borderRadius:'var(--r-sm)', fontSize:11, color:'var(--amber)' }}>+{c.delay}h delay</span>}
      </div>

      <TempBar temp={c.temp} range={c.tempRange}/>

      {/* Business impact mini row */}
      <div style={{ display:'flex', gap:12, marginTop:12, paddingTop:12, borderTop:'1px solid var(--border2)' }}>
        <div style={{ fontSize:10, color:'var(--text3)' }}>
          💸 <span style={{ color: c.financialLoss>0?'var(--amber)':'var(--green)', fontFamily:'var(--font-mono)' }}>
            ${(c.financialLoss/1000).toFixed(0)}k risk
          </span>
        </div>
        <div style={{ fontSize:10, color:'var(--text3)' }}>
          📦 <span style={{ color:'var(--text2)', fontFamily:'var(--font-mono)' }}>
            {c.spoilagePct}% spoilage
          </span>
        </div>
      </div>
    </div>
  )
}
