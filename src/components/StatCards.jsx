import { C } from '../constants/colors.js';

export default function StatCards({ accent }) {
  const cards = [
    { label: 'Active signals',    value: '1,284', sub: '+38 today',            color: accent },
    { label: 'Scored employers',  value: '342',   sub: '87 high priority',     color: C.text },
    { label: 'Routed this week',  value: '24',    sub: '8 brokers notified',   color: C.amber },
    { label: 'Outreach opened',   value: '68%',   sub: 'vs 12% industry avg',  color: C.blue },
  ];

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10,
      padding: '14px 18px', flexShrink: 0,
    }}>
      {cards.map(c => (
        <div key={c.label} style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 8, padding: '12px 14px' }}>
          <div style={{ fontSize: 10, color: C.text3, marginBottom: 6, letterSpacing: '0.04em' }}>{c.label}</div>
          <div style={{ fontFamily: 'DM Mono', fontSize: 24, fontWeight: 500, color: c.color, lineHeight: 1 }}>{c.value}</div>
          <div style={{ fontSize: 10, color: C.text3, marginTop: 5 }}>{c.sub}</div>
        </div>
      ))}
    </div>
  );
}
