import React, { useState, useRef, useEffect, useCallback } from 'react'
import { CONTAINERS } from '../data/containers'
import DetailPanel from './DetailPanel'

const QUICK_PROMPTS = [
  'Is MSCU7843291 at risk?',
  'What temperature should seafood be stored at?',
  'Which container needs immediate action?',
  'Vaccine cold chain requirements?',
  'What action should I take for critical containers?',
  'Explain the delay risk for OOLU9987543',
]

const SYSTEM_PROMPT = `You are LogisticAI, an expert AI assistant for global logistics risk management. You specialize in cold chain logistics, cargo safety, pharmaceutical supply chains, and shipping risk assessment.

Current fleet telemetry:
${CONTAINERS.map(c =>
  `- ${c.id} (${c.line}): ${c.cargo} from ${c.origin} to ${c.dest}. ` +
  `Temp: ${c.temp}°C (safe range: ${c.tempRange[0]} to ${c.tempRange[1]}°C). ` +
  `Humidity: ${c.humidity}%. Risk score: ${c.riskScore}/100. Status: ${c.status}. ` +
  `ETA: +${c.etaDays} days. Delay: ${c.delay}h. ` +
  `Issues: ${c.issues.join('; ') || 'None'}.`
).join('\n')}

Respond concisely (2-4 sentences). Be specific, data-driven, and action-oriented. Reference actual container IDs and data when relevant. Prioritise critical risks.`

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Hello. I'm LogisticAI, your global risk intelligence assistant. I have live access to your fleet of 6 containers. I can analyse shipment risks, recommend immediate actions, and answer questions about cargo safety protocols. What would you like to know?",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedContainer, setSelectedContainer] = useState(null)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || loading) return
    const userText = text.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userText }])
    setLoading(true)

    // Build conversation history for the API
    const history = messages
      .slice(1) // skip the initial greeting
      .map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.text }))
    history.push({ role: 'user', content: userText })

    try {
      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: history,
        }),
      })
      const data = await resp.json()
      const reply = data.content?.map(b => b.text || '').join('') || 'Unable to process request.'
      setMessages(prev => [...prev, { role: 'assistant', text: reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Connection error. Please try again.' }])
    }
    setLoading(false)
  }, [messages, loading])

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <div className="ai-split">
      {/* Chat */}
      <div className="card ai-chat-panel">
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          paddingBottom: 16, borderBottom: '1px solid var(--border)', marginBottom: 16,
        }}>
          <div style={{
            width: 38, height: 38,
            background: 'linear-gradient(135deg, var(--cyan), var(--cyan3))',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, flexShrink: 0,
          }}>
            ⚡
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>
              LogisticAI Assistant
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontFamily: 'var(--font-mono)', fontSize: 10,
              color: 'var(--green)', letterSpacing: '0.5px',
            }}>
              <div style={{
                width: 5, height: 5, borderRadius: '50%',
                background: 'var(--green)',
                boxShadow: '0 0 6px var(--green)',
              }} />
              ONLINE · AI-POWERED · FLEET-AWARE
            </div>
          </div>
        </div>

        {/* Quick prompts */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
          {QUICK_PROMPTS.map(q => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              disabled={loading}
              style={{
                fontSize: 11, padding: '4px 12px',
                background: 'var(--navy3)',
                border: '1px solid var(--border)',
                borderRadius: 20,
                color: 'var(--text2)',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-body)',
                transition: 'all 0.2s',
                opacity: loading ? 0.5 : 1,
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.borderColor = 'var(--cyan3)' }}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              {q.length > 32 ? q.slice(0, 30) + '…' : q}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div style={{
          flex: 1, overflowY: 'auto',
          display: 'flex', flexDirection: 'column', gap: 12,
          paddingRight: 4, marginBottom: 14,
        }}>
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              {m.role === 'assistant' && (
                <div style={{
                  width: 28, height: 28, flexShrink: 0,
                  background: 'rgba(0,212,255,0.1)',
                  border: '1px solid rgba(0,212,255,0.2)',
                  borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, marginRight: 8, marginTop: 2,
                }}>
                  ⚡
                </div>
              )}
              <div
                className={m.role === 'user' ? 'bubble-user' : 'bubble-ai'}
                style={{
                  maxWidth: '78%',
                  padding: '10px 14px',
                  fontSize: 13, lineHeight: 1.65,
                  color: 'var(--text)',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex' }}>
              <div style={{
                width: 28, height: 28, flexShrink: 0,
                background: 'rgba(0,212,255,0.1)',
                border: '1px solid rgba(0,212,255,0.2)',
                borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, marginRight: 8,
              }}>
                ⚡
              </div>
              <div
                className="bubble-ai"
                style={{ padding: '12px 16px', display: 'flex', gap: 5, alignItems: 'center' }}
              >
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    style={{
                      width: 7, height: 7, borderRadius: '50%',
                      background: 'var(--cyan)',
                      animation: `pulse-dot 1.2s ${i * 0.2}s ease-in-out infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <div className="ai-chat-input-row">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask about shipment risk, cargo protocols, or recommended actions… (Enter to send)"
            className="input"
            rows={2}
            style={{ flex: 1, resize: 'none', lineHeight: 1.5 }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            className="btn"
            style={{
              background: loading || !input.trim()
                ? 'var(--navy3)'
                : 'linear-gradient(135deg, var(--cyan), var(--cyan2))',
              color: loading || !input.trim() ? 'var(--text3)' : 'var(--navy)',
              border: 'none',
              padding: '0 20px',
              fontSize: 18,
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              flexShrink: 0,
              alignSelf: 'stretch',
              borderRadius: 'var(--r-md)',
            }}
          >
            →
          </button>
        </div>
      </div>

      {/* Right sidebar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* High-risk containers */}
        <div className="card">
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10, color: 'var(--text3)',
            letterSpacing: '1.5px', marginBottom: 14,
          }}>
            HIGH-RISK CONTAINERS
          </div>
          {CONTAINERS.filter(c => c.status !== 'OK').map(c => (
            <div
              key={c.id}
              onClick={() => setSelectedContainer(c === selectedContainer ? null : c)}
              style={{
                padding: '12px 14px',
                background: c === selectedContainer ? 'var(--navy4)' : 'var(--navy3)',
                borderRadius: 'var(--r-md)',
                marginBottom: 10,
                cursor: 'pointer',
                border: `1px solid ${c.status === 'CRITICAL' ? 'rgba(255,23,68,0.25)' : 'rgba(255,171,0,0.2)'}`,
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--cyan)' }}>
                  {c.id}
                </span>
                <span className={`badge badge-${c.status.toLowerCase()}`}>{c.status}</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 6 }}>
                {c.cargo} · {c.line}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text3)', lineHeight: 1.5 }}>
                {c.rec.action.slice(0, 80)}…
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); sendMessage(`What action should I take for container ${c.id}?`) }}
                style={{
                  marginTop: 8,
                  background: 'none',
                  border: 'none',
                  color: 'var(--cyan)',
                  fontSize: 11,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  padding: 0,
                }}
              >
                Ask AI about this → 
              </button>
            </div>
          ))}
        </div>

        {selectedContainer && (
          <DetailPanel container={selectedContainer} onClose={() => setSelectedContainer(null)} />
        )}
      </div>
    </div>
  )
}
