import { useState } from 'react';
import { C } from '../../constants/colors.js';
import { BROKERS } from '../../data/employers.js';

export default function BrokerPicker({ accent, onAssign, onCancel }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{
      position: 'absolute', top: '100%', left: 0, marginTop: 6, zIndex: 100,
      width: 240, background: C.bg2, border: `1px solid ${C.border2}`,
      borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.5)', overflow: 'hidden',
    }}>
      <div style={{ padding: '8px 12px', borderBottom: `1px solid ${C.border}`, fontSize: 10, color: C.text3, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Select broker
      </div>
      {BROKERS.map(b => (
        <div
          key={b.name}
          onClick={() => onAssign(b)}
          onMouseEnter={() => setHovered(b.name)}
          onMouseLeave={() => setHovered(null)}
          style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
            cursor: 'pointer', background: hovered === b.name ? C.bg3 : 'transparent',
            transition: 'background 0.1s',
          }}
        >
          <div style={{
            width: 26, height: 26, borderRadius: '50%',
            background: b.color + '22', border: `1px solid ${b.color}55`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontWeight: 700, color: b.color, fontFamily: 'DM Mono', flexShrink: 0,
          }}>
            {b.initials}
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 500, color: C.text }}>{b.name}</div>
            <div style={{ fontSize: 10, color: C.text3 }}>{b.region}</div>
          </div>
          {hovered === b.name && (
            <div style={{ marginLeft: 'auto', fontSize: 10, color: accent }}>Assign →</div>
          )}
        </div>
      ))}
      <div style={{ padding: '8px 12px', borderTop: `1px solid ${C.border}` }}>
        <button onClick={onCancel} style={{ fontSize: 11, color: C.text3, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans' }}>
          Cancel
        </button>
      </div>
    </div>
  );
}
