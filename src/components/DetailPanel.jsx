import { useState } from 'react';
import { C } from '../constants/colors.js';
import BrokerPicker from './ui/BrokerPicker.jsx';

export default function DetailPanel({ employer, accent, onClose, onAssign }) {
  const [showPicker, setShowPicker] = useState(false);

  const cards = [
    { label: 'Plan year end',    value: employer.planYearEnd },
    { label: 'Cost / employee',  value: employer.costPerEmployee },
    { label: 'Current carrier',  value: employer.carrier },
    { label: 'Headcount trend',  value: employer.headcount },
  ];

  return (
    <div style={{ background: C.bg1, borderTop: `1px solid ${C.border}`, padding: '20px 24px', flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{employer.name}</div>
                <div style={{ fontSize: 12, color: C.text3, marginTop: 3 }}>
                  {employer.location} · {employer.fte} FTE · {employer.industry}
                </div>
              </div>
              {/* Score badge */}
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                background: C.bg2, border: `1px solid ${accent}44`,
                borderRadius: 6, padding: '6px 14px', flexShrink: 0,
              }}>
                <div style={{ fontSize: 22, fontFamily: 'DM Mono', fontWeight: 600, color: accent, lineHeight: 1 }}>
                  {employer.score}
                </div>
                <div style={{ fontSize: 9, color: C.text3, marginTop: 3, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  score
                </div>
              </div>
            </div>

            {/* Broker assignment + close */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <div style={{ position: 'relative' }}>
                {!employer.broker ? (
                  <button
                    onClick={() => setShowPicker(p => !p)}
                    style={{
                      fontSize: 11, fontWeight: 500, padding: '5px 10px', borderRadius: 5, cursor: 'pointer',
                      fontFamily: 'DM Sans', background: C.amber + '18', color: C.amber,
                      border: `1px solid ${C.amber}44`, display: 'flex', alignItems: 'center', gap: 5,
                    }}
                  >
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                      <circle cx="5" cy="4" r="2.2" stroke="currentColor" strokeWidth="1.3"/>
                      <path d="M1 11c0-2.21 1.79-4 4-4s4 1.79 4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                      <line x1="9.5" y1="7" x2="9.5" y2="11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                      <line x1="7.5" y1="9" x2="11.5" y2="9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                    Assign broker
                  </button>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 3 }}>
                    <div style={{ fontSize: 9, color: C.text3, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      Assigned to
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: '50%',
                        background: employer.broker.color + '22', border: `1px solid ${employer.broker.color}55`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 9, fontWeight: 700, color: employer.broker.color, fontFamily: 'DM Mono',
                      }}>
                        {employer.broker.initials}
                      </div>
                      <span style={{ fontSize: 11, color: C.text2 }}>{employer.broker.name}</span>
                      <button
                        onClick={() => setShowPicker(p => !p)}
                        style={{ fontSize: 10, color: C.text3, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans' }}
                      >
                        Change
                      </button>
                    </div>
                  </div>
                )}
                {showPicker && (
                  <BrokerPicker
                    accent={accent}
                    onAssign={b => { onAssign(b); setShowPicker(false); }}
                    onCancel={() => setShowPicker(false)}
                  />
                )}
              </div>
              <button
                onClick={onClose}
                style={{ background: 'none', border: 'none', color: C.text3, cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: '2px 6px' }}
              >
                ×
              </button>
            </div>
          </div>

          {/* 2×2 detail cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 18 }}>
            {cards.map(c => (
              <div key={c.label} style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 7, padding: '14px 16px' }}>
                <div style={{ fontSize: 10, color: C.text3, marginBottom: 8, letterSpacing: '0.04em' }}>{c.label}</div>
                <div style={{ fontSize: 16, fontFamily: 'DM Mono', fontWeight: 500, color: C.text }}>{c.value}</div>
              </div>
            ))}
          </div>

          {/* Signal sources */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, color: C.text3, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
              Signal breakdown
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {employer.sources.map(s => (
                <div key={s.name} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 10px',
                  background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 5,
                }}>
                  <span style={{ fontSize: 13, flexShrink: 0, marginTop: 1 }}>{s.icon}</span>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: accent, fontFamily: 'DM Mono' }}>{s.name}</span>
                    <span style={{ fontSize: 11, color: C.text2, marginLeft: 8 }}>{s.found}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {['Draft outreach', 'Find similar', 'Apollo contacts'].map((label, i) => (
              <button
                key={label}
                style={{
                  fontSize: 12, fontWeight: 500, padding: '7px 14px', borderRadius: 5, cursor: 'pointer',
                  fontFamily: 'DM Sans',
                  background: i === 0 ? accent : 'transparent',
                  color: i === 0 ? '#0B1929' : C.text2,
                  border: i === 0 ? 'none' : `1px solid ${C.border2}`,
                  transition: 'opacity 0.15s',
                }}
                onMouseEnter={e => { e.target.style.opacity = '0.8'; }}
                onMouseLeave={e => { e.target.style.opacity = '1'; }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
