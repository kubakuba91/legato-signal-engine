import { useState } from 'react';
import { C } from '../constants/colors.js';
import ScoreBar from './ui/ScoreBar.jsx';
import SignalTag from './ui/SignalTag.jsx';
import BrokerPill from './ui/BrokerPill.jsx';
import StatusBadge from './ui/StatusBadge.jsx';
import PriorityDot from './ui/PriorityDot.jsx';

const FILTERS = ['All', 'High priority', 'New signals', 'Unrouted', 'Routed'];

export default function LeadTable({ accent, density, selectedId, onSelect, employers, panelOpen, newIds = new Set() }) {
  const [filter, setFilter] = useState('All');
  const rowPad = density === 'compact' ? '8px 12px' : '13px 16px';
  const cols = panelOpen
    ? '28px 1fr 90px 200px 140px 80px'
    : '28px 1.6fr 90px 1fr 180px 100px';

  const filtered = employers.filter(e => {
    if (filter === 'All')          return true;
    if (filter === 'High priority') return e.score >= 85;
    if (filter === 'New signals')  return e.status === 'new';
    if (filter === 'Unrouted')     return !e.broker;
    if (filter === 'Routed')       return !!e.broker;
    return true;
  });

  return (
    <div style={{
      flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column',
      margin: '0 18px', background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 8,
    }}>
      {/* Filter chips */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '10px 14px', borderBottom: `1px solid ${C.border}` }}>
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              fontSize: 11, fontWeight: 500, padding: '4px 10px', borderRadius: 5,
              cursor: 'pointer', border: 'none',
              background: filter === f ? accent + '18' : 'transparent',
              color: filter === f ? accent : C.text3,
              fontFamily: 'DM Sans', transition: 'all 0.12s',
            }}
          >
            {f}
          </button>
        ))}
        <div style={{ marginLeft: 'auto', fontSize: 10, color: C.text3, fontFamily: 'DM Mono' }}>
          {filtered.length} employers
        </div>
      </div>

      {/* Column headers */}
      <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 0, padding: '6px 16px', borderBottom: `1px solid ${C.border}` }}>
        {['', 'Employer', 'Score', 'Signals', 'Assigned to', 'Status'].map(h => (
          <div key={h} style={{ fontSize: 10, color: C.text3, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{h}</div>
        ))}
      </div>

      {/* Rows */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filtered.map(emp => {
          const isSelected = selectedId === emp.id;
          const isNew = newIds.has(emp.id);
          return (
            <div
              key={emp.id}
              onClick={() => onSelect(isSelected ? null : emp.id)}
              style={{
                display: 'grid', gridTemplateColumns: cols,
                padding: rowPad, borderBottom: `1px solid ${C.border}`,
                cursor: 'pointer', alignItems: 'center',
                background: isNew ? accent + '14' : isSelected ? accent + '08' : 'transparent',
                borderLeft: `2px solid ${isSelected ? accent : isNew ? accent : 'transparent'}`,
                transition: 'background 1.5s, border-color 1.5s',
              }}
              onMouseEnter={e => { if (!isSelected && !isNew) e.currentTarget.style.background = C.bg2; }}
              onMouseLeave={e => { if (!isSelected && !isNew) e.currentTarget.style.background = 'transparent'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <PriorityDot score={emp.score} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{emp.name}</span>
                  {isNew && (
                    <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 3, background: accent + '25', color: accent, letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'DM Mono' }}>
                      New
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 11, color: C.text3, marginTop: 2 }}>{emp.location} · {emp.fte} FTE · {emp.industry}</div>
              </div>
              <div>
                <ScoreBar score={emp.score} accent={accent} employer={emp} />
              </div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {emp.signals.map(s => <SignalTag key={s} label={s} />)}
              </div>
              <div>
                <BrokerPill broker={emp.broker} />
              </div>
              <div>
                <StatusBadge status={emp.status} accent={accent} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
