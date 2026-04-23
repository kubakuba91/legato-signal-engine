import { useState, useEffect } from 'react';
import { C } from '../constants/colors.js';

export default function TopBar({ accent, navLabel }) {
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setPulse(p => !p), 1400);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{
      height: 52, background: C.bg1, borderBottom: `1px solid ${C.border}`,
      display: 'flex', alignItems: 'center', padding: '0 20px', gap: 16, flexShrink: 0,
    }}>
      <div style={{ flex: 1, fontSize: 13, fontWeight: 500, color: C.text }}>{navLabel}</div>

      {/* Live indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ position: 'relative', width: 8, height: 8 }}>
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%', background: accent,
            opacity: pulse ? 0.3 : 0, transition: 'opacity 0.7s', transform: 'scale(2)',
          }} />
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: accent }} />
        </div>
        <span style={{ fontSize: 11, color: C.text2, fontFamily: 'DM Mono' }}>Live signals</span>
      </div>

      <div style={{ width: 1, height: 20, background: C.border }} />
      <div style={{ fontSize: 11, color: C.text3, fontFamily: 'DM Mono' }}>Apr 23, 2026</div>

      {/* Avatar */}
      <div style={{
        width: 30, height: 30, borderRadius: '50%', background: C.bg3,
        border: `1px solid ${C.border2}`, display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: 11, fontWeight: 600, color: C.text2, cursor: 'pointer',
      }}>
        JD
      </div>
    </div>
  );
}
