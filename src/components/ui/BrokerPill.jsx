import { C } from '../../constants/colors.js';

export default function BrokerPill({ broker }) {
  if (!broker) {
    return <span style={{ color: C.text3, fontSize: 12 }}>Unassigned</span>;
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{
        width: 22, height: 22, borderRadius: '50%',
        background: broker.color + '22', border: `1px solid ${broker.color}44`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 9, fontWeight: 700, color: broker.color, fontFamily: 'DM Mono',
      }}>
        {broker.initials}
      </div>
      <span style={{ fontSize: 12, color: C.text2 }}>{broker.name}</span>
    </div>
  );
}
