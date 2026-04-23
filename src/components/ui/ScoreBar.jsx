import { useState } from 'react';
import { createPortal } from 'react-dom';
import { C } from '../../constants/colors.js';

export default function ScoreBar({ score, accent, employer }) {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setPos({ x: r.left, y: r.top });
    setShow(true);
  };

  return (
    <div
      style={{ display: 'flex', alignItems: 'center', gap: 8 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setShow(false)}
    >
      <span style={{
        fontFamily: 'DM Mono', fontSize: 13, fontWeight: 500,
        color: score >= 90 ? accent : score >= 80 ? C.text : C.text2,
        minWidth: 24,
      }}>
        {score}
      </span>
      <div style={{ width: 52, height: 3, background: C.bg3, borderRadius: 2, overflow: 'hidden', cursor: 'default' }}>
        <div style={{
          width: `${score}%`, height: '100%',
          background: score >= 90 ? accent : score >= 80 ? C.blue : C.text3,
          borderRadius: 2,
        }} />
      </div>

      {show && employer && createPortal(
        <div style={{
          position: 'fixed', left: pos.x, top: pos.y - 8, transform: 'translateY(-100%)',
          zIndex: 9999, background: C.bg2, border: `1px solid ${C.border2}`,
          borderRadius: 7, padding: '10px 12px', width: 200,
          boxShadow: '0 6px 20px rgba(0,0,0,0.6)', pointerEvents: 'none',
        }}>
          <div style={{ fontSize: 10, color: C.text3, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            Score breakdown
          </div>
          {[
            { label: 'Intent signals',  val: Math.round(score * 0.35), max: 35 },
            { label: 'Financial fit',   val: Math.round(score * 0.28), max: 28 },
            { label: 'Workforce match', val: Math.round(score * 0.22), max: 22 },
            { label: 'Regulatory risk', val: Math.round(score * 0.15), max: 15 },
          ].map(row => (
            <div key={row.label} style={{ marginBottom: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ fontSize: 10, color: C.text2 }}>{row.label}</span>
                <span style={{ fontSize: 10, fontFamily: 'DM Mono', color: C.text }}>
                  {row.val}<span style={{ color: C.text3 }}>/{row.max}</span>
                </span>
              </div>
              <div style={{ height: 2, background: C.bg3, borderRadius: 1 }}>
                <div style={{ width: `${(row.val / row.max) * 100}%`, height: '100%', background: accent, borderRadius: 1 }} />
              </div>
            </div>
          ))}
          <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 10, color: C.text3 }}>Composite</span>
            <span style={{ fontSize: 11, fontFamily: 'DM Mono', fontWeight: 600, color: accent }}>{score}</span>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
