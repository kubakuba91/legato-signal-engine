import { C } from '../../constants/colors.js';

export default function PriorityDot({ score }) {
  const color = score >= 90 ? C.teal : score >= 80 ? C.blue : C.amber;
  return (
    <div style={{ width: 7, height: 7, borderRadius: '50%', background: color, flexShrink: 0 }} />
  );
}
