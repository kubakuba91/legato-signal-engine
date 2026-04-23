import { signalColors, C } from '../../constants/colors.js';

export default function SignalTag({ label }) {
  const col = signalColors[label] || { bg: C.bg3, text: C.text2 };
  return (
    <span style={{
      fontSize: 10, fontWeight: 500, padding: '2px 6px', borderRadius: 3,
      background: col.bg, color: col.text, letterSpacing: '0.02em',
    }}>
      {label}
    </span>
  );
}
