import React, { useState } from 'react'
import { CONTAINERS_DEFAULT } from '../data/containers'
import ContainerCard from '../components/ContainerCard'
import DetailPanel from './DetailPanel'

const EMPTY_FORM = { id:'', line:'', cargo:'', cargoIcon:'📦', origin:'', dest:'', temp:'', tempRangeMin:'', tempRangeMax:'', humidity:'60', etaDays:'7' }
const CARGO_TYPES = [
  ['Pharmaceuticals','💊'],['Frozen Seafood','🐟'],['Fresh Produce','🥦'],
  ['Vaccine Cold Chain','💉'],['Dairy Products','🥛'],['Temperature Sensors','🌡️'],
  ['Chemical Reagents','⚗️'],['Frozen Meat','🥩'],['Wine & Spirits','🍷'],['Other','📦'],
]
const LINES = ['MSC','Hapag-Lloyd','CMA CGM','Evergreen','OOCL','Yang Ming','Maersk','Cosco','ZIM','ONE']

export default function Dashboard({ containers: containersProp, setContainers: setContainersProp } = {}) {
  // App currently renders <Dashboard /> without props, so fall back to mock data.
  // If parent components provide containers + setter, we use those instead.
  const [internalContainers, internalSetContainers] = useState(CONTAINERS_DEFAULT)
  const containers = containersProp ?? internalContainers
  const setContainers = setContainersProp ?? internalSetContainers
  const [selected,  setSelected]  = useState(null)
  const [filter,    setFilter]    = useState('ALL')
  const [showModal, setShowModal] = useState(false)
  const [form,      setForm]      = useState(EMPTY_FORM)
  const [formErr,   setFormErr]   = useState('')

  const critical = containers.filter(c => c.status==='CRITICAL').length
  const warning  = containers.filter(c => c.status==='WARNING').length
  const ok       = containers.filter(c => c.status==='OK').length
  const avgRisk  = containers.length ? Math.round(containers.reduce((a,c) => a+c.riskScore, 0) / containers.length) : 0
  const totalVal = containers.reduce((a,c) => a+c.cargoValue, 0)
  const totalLoss = containers.reduce((a,c) => a+c.financialLoss, 0)

  const filtered = filter==='ALL' ? containers : containers.filter(c => c.status===filter)

  const handleAdd = () => {
    if (!form.id || !form.line || !form.cargo || !form.origin || !form.dest) {
      setFormErr('Please fill all required fields.'); return
    }
    const temp = parseFloat(form.temp) || 4
    const min  = parseFloat(form.tempRangeMin) || 2
    const max  = parseFloat(form.tempRangeMax) || 8
    const ok   = temp >= min && temp <= max
    const riskScore = ok ? Math.floor(Math.random()*30+10) : Math.floor(Math.random()*30+50)
    const newC = {
      id: form.id.toUpperCase(), line: form.line, cargo: form.cargo,
      cargoIcon: CARGO_TYPES.find(c=>c[0]===form.cargo)?.[1]||'📦',
      origin: form.origin, dest: form.dest,
      location: 'En Route', lat: 20+Math.random()*20, lng: Math.random()*100,
      eta: new Date(Date.now()+parseInt(form.etaDays)*86400000).toISOString().slice(0,10),
      etaDays: parseInt(form.etaDays)||7,
      temp, tempRange: [min, max], humidity: parseInt(form.humidity)||60,
      riskScore, status: riskScore>=75?'CRITICAL':riskScore>=45?'WARNING':'OK', delay: 0,
      cargoWeight: 5000, cargoValue: 500000,
      issues: ok ? [] : [`Temperature ${temp.toFixed(1)}°C outside safe range ${min}–${max}°C`],
      rec: { idealTemp:`${min}°C to ${max}°C`, spoilage:ok?'LOW':'MODERATE', delay:'None expected', action:'Monitor conditions closely.' },
      aiReasoning: {
        summary: `Newly added shipment. Initial AI assessment based on cargo type and temperature profile.`,
        factors: [
          { label:'Temperature Compliance', score:ok?15:65, detail:ok?`Within safe range ${min}–${max}°C`:`Outside safe range — deviation detected` },
          { label:'Route Assessment', score:20, detail:'Baseline risk applied. Awaiting live telemetry.' },
        ],
      },
      decisionActions: [{ priority:1, action:'Initialize live telemetry monitoring', urgency:'TODAY' }],
      tempHistory: Array.from({length:9},()=>temp+(Math.random()-0.5)*0.5),
      riskHistory: Array.from({length:9},()=>riskScore+(Math.random()-0.5)*5),
      spoilagePct: ok?5:20, financialLoss: ok?0:50000, wasteKg: ok?0:500, co2Saved: 1000,
    }
    setContainers(prev => [...prev, newC])
    setShowModal(false)
    setForm(EMPTY_FORM)
    setFormErr('')
    setSelected(newC)
    setFilter('ALL')
  }

  const inp = (field) => ({ value: form[field], onChange: e => setForm(f => ({...f, [field]:e.target.value})), className:'input' })

  return (
    <div>
      {/* Metrics */}
      <div className="metrics-grid">
        {[
          { l:'TOTAL', v:containers.length, c:'var(--cyan)' },
          { l:'CRITICAL', v:critical, c:'var(--red)' },
          { l:'WARNING', v:warning, c:'var(--amber)' },
          { l:'NOMINAL', v:ok, c:'var(--green)' },
          { l:'AVG RISK', v:avgRisk, c:avgRisk>=50?'var(--amber)':'var(--green)' },
          { l:'CARGO VALUE', v:`$${(totalVal/1000000).toFixed(1)}M`, c:'var(--cyan)' },
        ].map(m => (
          <div key={m.l} className="card" style={{ textAlign:'center', padding:'16px 8px' }}>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:24, fontWeight:700, color:m.c, textShadow:`0 0 20px ${m.c}40` }}>{m.v}</div>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'var(--text3)', letterSpacing:'1px', marginTop:6 }}>{m.l}</div>
          </div>
        ))}
      </div>

      {/* Risk loss banner if any */}
      {totalLoss > 0 && (
        <div style={{
          display:'flex', alignItems:'center', gap:12, padding:'12px 20px',
          background:'rgba(255,23,68,0.06)', border:'1px solid rgba(255,23,68,0.2)',
          borderRadius:'var(--r-md)', marginBottom:20,
          flexWrap:'wrap',
        }}>
          <span style={{ color:'var(--red)', fontSize:18 }}>⚠</span>
          <span style={{ fontSize:13, color:'var(--text)' }}>
            Total estimated financial risk across fleet:{' '}
            <span style={{ color:'var(--red)', fontFamily:'var(--font-mono)', fontWeight:700 }}>
              ${(totalLoss/1000000).toFixed(2)}M
            </span>
          </span>
          <span style={{ marginLeft:'auto', fontSize:12, color:'var(--text3)' }}>Based on current risk models</span>
        </div>
      )}

      {/* Toolbar */}
      <div style={{ display:'flex', gap:8, marginBottom:20, flexWrap:'wrap', alignItems:'center' }}>
        {[{v:'ALL',l:'All',n:containers.length},{v:'CRITICAL',l:'Critical',n:critical},{v:'WARNING',l:'Warning',n:warning},{v:'OK',l:'Nominal',n:ok}].map(f => (
          <button key={f.v} onClick={() => setFilter(f.v)} style={{
            padding:'7px 16px',
            background: filter===f.v ? 'rgba(0,229,255,0.1)' : 'transparent',
            border: filter===f.v ? '1px solid rgba(0,229,255,0.3)' : '1px solid var(--border)',
            borderRadius:'var(--r-sm)', cursor:'pointer', transition:'all 0.2s',
            color: filter===f.v ? 'var(--cyan)' : 'var(--text2)',
            fontFamily:'var(--font-display)', fontWeight:500, fontSize:13,
            display:'flex', alignItems:'center', gap:6,
          }}>
            {f.l}
            <span style={{ background:'var(--navy3)', padding:'1px 7px', borderRadius:10, fontSize:11, fontFamily:'var(--font-mono)' }}>{f.n}</span>
          </button>
        ))}
        <button className="btn btn-primary dashboard-add-btn" onClick={() => setShowModal(true)} style={{ marginLeft:'auto', padding:'7px 18px', fontSize:13 }}>
          + Add Shipment
        </button>
      </div>

      {/* Grid + detail */}
      <div className="dashboard-split">
        <div className={`dashboard-cards-grid${selected ? ' compact' : ''}`}>
          {filtered.map(c => (
            <ContainerCard key={c.id} container={c} onClick={c => setSelected(c.id===selected?.id ? null : c)} selected={c.id===selected?.id}/>
          ))}
        </div>
        {selected && (
          <div className="detail-sticky-wrap">
            <DetailPanel container={selected} onClose={() => setSelected(null)}/>
          </div>
        )}
      </div>

      {/* ADD SHIPMENT MODAL */}
      {showModal && (
        <div style={{
          position:'fixed', inset:0, background:'rgba(2,13,24,0.85)', backdropFilter:'blur(8px)',
          zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20,
        }} onClick={e => e.target===e.currentTarget && setShowModal(false)}>
          <div className="card" style={{ width:'100%', maxWidth:560, maxHeight:'90vh', overflowY:'auto', border:'1px solid rgba(0,229,255,0.2)', boxShadow:'var(--glow-cyan)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <div>
                <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:18 }}>Add New Shipment</div>
                <div style={{ fontSize:12, color:'var(--text2)', marginTop:3 }}>Register container for AI monitoring</div>
              </div>
              <button className="btn btn-ghost" onClick={() => setShowModal(false)} style={{ padding:'5px 12px' }}>✕</button>
            </div>

            <div className="modal-form-grid">
              <div>
                <label style={{ fontSize:11, color:'var(--text3)', display:'block', marginBottom:5, fontFamily:'var(--font-mono)', letterSpacing:'1px' }}>CONTAINER ID *</label>
                <input {...inp('id')} placeholder="e.g. MAEU1234567" style={{ background:'var(--navy3)', border:'1px solid var(--border)', borderRadius:'var(--r-md)', padding:'10px 14px', color:'var(--text)', fontSize:13, width:'100%', outline:'none', fontFamily:'var(--font-mono)' }}/>
              </div>
              <div>
                <label style={{ fontSize:11, color:'var(--text3)', display:'block', marginBottom:5, fontFamily:'var(--font-mono)', letterSpacing:'1px' }}>SHIPPING LINE *</label>
                <select {...inp('line')} style={{ background:'var(--navy3)', border:'1px solid var(--border)', borderRadius:'var(--r-md)', padding:'10px 14px', color:form.line?'var(--text)':'var(--text3)', fontSize:13, width:'100%', outline:'none' }}>
                  <option value="">Select line</option>
                  {LINES.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize:11, color:'var(--text3)', display:'block', marginBottom:5, fontFamily:'var(--font-mono)', letterSpacing:'1px' }}>CARGO TYPE *</label>
                <select {...inp('cargo')} style={{ background:'var(--navy3)', border:'1px solid var(--border)', borderRadius:'var(--r-md)', padding:'10px 14px', color:form.cargo?'var(--text)':'var(--text3)', fontSize:13, width:'100%', outline:'none' }}>
                  <option value="">Select cargo</option>
                  {CARGO_TYPES.map(([n,i]) => <option key={n} value={n}>{i} {n}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize:11, color:'var(--text3)', display:'block', marginBottom:5, fontFamily:'var(--font-mono)', letterSpacing:'1px' }}>ETA (days)</label>
                <input {...inp('etaDays')} type="number" min="1" max="60" placeholder="7" style={{ background:'var(--navy3)', border:'1px solid var(--border)', borderRadius:'var(--r-md)', padding:'10px 14px', color:'var(--text)', fontSize:13, width:'100%', outline:'none' }}/>
              </div>
              <div>
                <label style={{ fontSize:11, color:'var(--text3)', display:'block', marginBottom:5, fontFamily:'var(--font-mono)', letterSpacing:'1px' }}>ORIGIN *</label>
                <input {...inp('origin')} placeholder="e.g. Hamburg, DE" style={{ background:'var(--navy3)', border:'1px solid var(--border)', borderRadius:'var(--r-md)', padding:'10px 14px', color:'var(--text)', fontSize:13, width:'100%', outline:'none' }}/>
              </div>
              <div>
                <label style={{ fontSize:11, color:'var(--text3)', display:'block', marginBottom:5, fontFamily:'var(--font-mono)', letterSpacing:'1px' }}>DESTINATION *</label>
                <input {...inp('dest')} placeholder="e.g. New York, US" style={{ background:'var(--navy3)', border:'1px solid var(--border)', borderRadius:'var(--r-md)', padding:'10px 14px', color:'var(--text)', fontSize:13, width:'100%', outline:'none' }}/>
              </div>
              <div>
                <label style={{ fontSize:11, color:'var(--text3)', display:'block', marginBottom:5, fontFamily:'var(--font-mono)', letterSpacing:'1px' }}>CURRENT TEMP (°C)</label>
                <input {...inp('temp')} type="number" step="0.1" placeholder="e.g. 4.0" style={{ background:'var(--navy3)', border:'1px solid var(--border)', borderRadius:'var(--r-md)', padding:'10px 14px', color:'var(--text)', fontSize:13, width:'100%', outline:'none' }}/>
              </div>
              <div>
                <label style={{ fontSize:11, color:'var(--text3)', display:'block', marginBottom:5, fontFamily:'var(--font-mono)', letterSpacing:'1px' }}>HUMIDITY (%)</label>
                <input {...inp('humidity')} type="number" min="0" max="100" placeholder="60" style={{ background:'var(--navy3)', border:'1px solid var(--border)', borderRadius:'var(--r-md)', padding:'10px 14px', color:'var(--text)', fontSize:13, width:'100%', outline:'none' }}/>
              </div>
              <div>
                <label style={{ fontSize:11, color:'var(--text3)', display:'block', marginBottom:5, fontFamily:'var(--font-mono)', letterSpacing:'1px' }}>MIN SAFE TEMP (°C)</label>
                <input {...inp('tempRangeMin')} type="number" step="0.1" placeholder="e.g. 2" style={{ background:'var(--navy3)', border:'1px solid var(--border)', borderRadius:'var(--r-md)', padding:'10px 14px', color:'var(--text)', fontSize:13, width:'100%', outline:'none' }}/>
              </div>
              <div>
                <label style={{ fontSize:11, color:'var(--text3)', display:'block', marginBottom:5, fontFamily:'var(--font-mono)', letterSpacing:'1px' }}>MAX SAFE TEMP (°C)</label>
                <input {...inp('tempRangeMax')} type="number" step="0.1" placeholder="e.g. 8" style={{ background:'var(--navy3)', border:'1px solid var(--border)', borderRadius:'var(--r-md)', padding:'10px 14px', color:'var(--text)', fontSize:13, width:'100%', outline:'none' }}/>
              </div>
            </div>

            {formErr && <div style={{ color:'var(--red)', fontSize:12, marginTop:12 }}>⚠ {formErr}</div>}

            <div style={{ display:'flex', gap:10, marginTop:20 }}>
              <button className="btn btn-ghost" onClick={() => setShowModal(false)} style={{ flex:1, justifyContent:'center' }}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAdd} style={{ flex:2, justifyContent:'center' }}>⚡ Add & Start Monitoring</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
