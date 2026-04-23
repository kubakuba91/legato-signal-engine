import { C } from '../../constants/colors.js';

export default function StatusBadge({ status, accent }) {
  const map = {
    routed:  { bg: 'rgba(0,201,167,0.1)',  text: accent,  label: 'Routed' },
    new:     { bg: 'rgba(79,158,240,0.1)', text: C.blue,  label: 'New' },
    pending: { bg: 'rgba(245,158,11,0.1)', text: C.amber, label: 'Pending' },
  };
  const s = map[status] ?? map.new;
  return (
    <span style={{
      fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 3,
      background: s.bg, color: s.text, letterSpacing: '0.05em', textTransform: 'uppercase',
    }}>
      {s.label}
    </span>
  );
}
