import { useState } from 'react';
import { C } from '../constants/colors.js';
import SignalTag from './ui/SignalTag.jsx';
import PriorityDot from './ui/PriorityDot.jsx';

const STATE_GRID = [
  {a:'ME',r:0,c:10},{a:'VT',r:1,c:9},{a:'NH',r:1,c:10},
  {a:'WA',r:2,c:1},{a:'ID',r:2,c:2},{a:'MT',r:2,c:3},{a:'ND',r:2,c:4},{a:'MN',r:2,c:5},{a:'WI',r:2,c:6},{a:'MI',r:2,c:7},{a:'NY',r:2,c:8},{a:'MA',r:2,c:9},{a:'RI',r:2,c:10},
  {a:'OR',r:3,c:1},{a:'NV',r:3,c:2},{a:'WY',r:3,c:3},{a:'SD',r:3,c:4},{a:'IA',r:3,c:5},{a:'IN',r:3,c:6},{a:'OH',r:3,c:7},{a:'PA',r:3,c:8},{a:'NJ',r:3,c:9},{a:'CT',r:3,c:10},
  {a:'CA',r:4,c:1},{a:'UT',r:4,c:2},{a:'CO',r:4,c:3},{a:'NE',r:4,c:4},{a:'MO',r:4,c:5},{a:'KY',r:4,c:6},{a:'WV',r:4,c:7},{a:'VA',r:4,c:8},{a:'MD',r:4,c:9},{a:'DE',r:4,c:10},
  {a:'AZ',r:5,c:2},{a:'NM',r:5,c:3},{a:'KS',r:5,c:4},{a:'AR',r:5,c:5},{a:'TN',r:5,c:6},{a:'NC',r:5,c:7},{a:'SC',r:5,c:8},{a:'DC',r:5,c:9},
  {a:'HI',r:6,c:1},{a:'TX',r:6,c:3},{a:'OK',r:6,c:4},{a:'LA',r:6,c:5},{a:'MS',r:6,c:6},{a:'AL',r:6,c:7},{a:'GA',r:6,c:8},{a:'FL',r:6,c:9},
  {a:'AK',r:7,c:0},
];

const STATE_NAMES = {
  AK:'Alaska',AL:'Alabama',AR:'Arkansas',AZ:'Arizona',CA:'California',CO:'Colorado',CT:'Connecticut',
  DC:'D.C.',DE:'Delaware',FL:'Florida',GA:'Georgia',HI:'Hawaii',IA:'Iowa',ID:'Idaho',IL:'Illinois',
  IN:'Indiana',KS:'Kansas',KY:'Kentucky',LA:'Louisiana',MA:'Massachusetts',MD:'Maryland',ME:'Maine',
  MI:'Michigan',MN:'Minnesota',MO:'Missouri',MS:'Mississippi',MT:'Montana',NC:'North Carolina',
  ND:'North Dakota',NE:'Nebraska',NH:'New Hampshire',NJ:'New Jersey',NM:'New Mexico',NV:'Nevada',
  NY:'New York',OH:'Ohio',OK:'Oklahoma',OR:'Oregon',PA:'Pennsylvania',RI:'Rhode Island',
  SC:'South Carolina',SD:'South Dakota',TN:'Tennessee',TX:'Texas',UT:'Utah',VA:'Virginia',
  VT:'Vermont',WA:'Washington',WI:'Wisconsin',WV:'West Virginia',WY:'Wyoming',
};

export default function MapView({ employers, accent }) {
  const [selectedState, setSelectedState] = useState(null);
  const [hoveredState, setHoveredState] = useState(null);

  const getStateAbbr = loc => loc.split(', ')[1];

  const stateEmps = {};
  employers.forEach(e => {
    const s = getStateAbbr(e.location);
    if (!stateEmps[s]) stateEmps[s] = [];
    stateEmps[s].push(e);
  });

  const TILE = 58, GAP = 4;
  const cols = 11, rows = 8;
  const mapW = cols * (TILE + GAP);
  const mapH = rows * (TILE + GAP);

  const filtered = selectedState
    ? employers.filter(e => getStateAbbr(e.location) === selectedState)
    : employers;

  const getColor = abbr => {
    const emps = stateEmps[abbr];
    if (!emps) return C.bg2;
    const best = Math.max(...emps.map(e => e.score));
    if (best >= 90) return accent + '30';
    if (best >= 80) return C.blue + '25';
    return C.amber + '20';
  };

  const getBorder = abbr => {
    if (selectedState === abbr) return accent;
    if (hoveredState === abbr) return C.border2;
    if (stateEmps[abbr]) return C.border2;
    return C.border;
  };

  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden', padding: '16px 18px', gap: 16 }}>
      {/* Map */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: C.text2, fontWeight: 500 }}>National opportunity map</div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, alignItems: 'center' }}>
            {[
              { label: 'Score 90+', color: accent },
              { label: 'Score 80+', color: C.blue },
              { label: 'Score <80', color: C.amber },
            ].map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: l.color + '60', border: `1px solid ${l.color}` }} />
                <span style={{ fontSize: 10, color: C.text3 }}>{l.label}</span>
              </div>
            ))}
            {selectedState && (
              <button
                onClick={() => setSelectedState(null)}
                style={{
                  fontSize: 10, color: C.text3, background: C.bg2, border: `1px solid ${C.border}`,
                  borderRadius: 4, padding: '3px 8px', cursor: 'pointer', fontFamily: 'DM Sans', marginLeft: 8,
                }}
              >
                Clear filter ×
              </button>
            )}
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <svg
            width="100%" height="100%"
            viewBox={`0 0 ${mapW} ${mapH}`}
            preserveAspectRatio="xMidYMid meet"
            style={{ maxWidth: '100%', maxHeight: '100%' }}
          >
            {STATE_GRID.map(({ a, r, c }) => {
              const x = c * (TILE + GAP);
              const y = r * (TILE + GAP);
              const emps = stateEmps[a] || [];
              const isSelected = selectedState === a;

              return (
                <g
                  key={a}
                  style={{ cursor: emps.length ? 'pointer' : 'default' }}
                  onClick={() => emps.length && setSelectedState(isSelected ? null : a)}
                  onMouseEnter={() => setHoveredState(a)}
                  onMouseLeave={() => setHoveredState(null)}
                >
                  <rect
                    x={x} y={y} width={TILE} height={TILE} rx={4}
                    fill={getColor(a)}
                    stroke={getBorder(a)}
                    strokeWidth={isSelected ? 1.5 : 1}
                    style={{ transition: 'all 0.15s' }}
                  />
                  <text
                    x={x + TILE / 2} y={y + TILE / 2 - (emps.length ? 4 : 0)}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize="9" fontWeight={emps.length ? 600 : 400}
                    fill={emps.length ? (isSelected ? accent : C.text2) : C.text3}
                    fontFamily="DM Mono, monospace"
                  >
                    {a}
                  </text>
                  {emps.length > 0 && (
                    <text
                      x={x + TILE / 2} y={y + TILE / 2 + 8}
                      textAnchor="middle" dominantBaseline="middle"
                      fontSize="10" fontWeight="700"
                      fill={isSelected ? accent : emps[0].score >= 90 ? accent : C.blue}
                      fontFamily="DM Mono, monospace"
                    >
                      {emps.length}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Opportunity list sidebar */}
      <div style={{
        width: 320, background: C.bg1, border: `1px solid ${C.border}`,
        borderRadius: 8, display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0,
      }}>
        <div style={{ padding: '12px 14px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, fontWeight: 500, color: C.text }}>
            {selectedState ? (STATE_NAMES[selectedState] || selectedState) : 'All opportunities'}
          </span>
          <span style={{ fontSize: 10, fontFamily: 'DM Mono', color: C.text3 }}>{filtered.length} employers</span>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filtered.length === 0 && (
            <div style={{ padding: 24, textAlign: 'center', color: C.text3, fontSize: 12 }}>
              No opportunities in this state
            </div>
          )}
          {filtered.map(emp => (
            <div key={emp.id} style={{
              padding: '12px 14px', borderBottom: `1px solid ${C.border}`,
              display: 'flex', gap: 10, alignItems: 'flex-start',
            }}>
              <PriorityDot score={emp.score} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: C.text, marginBottom: 2 }}>{emp.name}</div>
                <div style={{ fontSize: 11, color: C.text3, marginBottom: 6 }}>{emp.location} · {emp.fte} FTE</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  {emp.signals.slice(0, 2).map(s => <SignalTag key={s} label={s} />)}
                  <span style={{ marginLeft: 'auto', fontFamily: 'DM Mono', fontSize: 12, fontWeight: 600, color: emp.score >= 90 ? accent : C.text2 }}>
                    {emp.score}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: '10px 14px', borderTop: `1px solid ${C.border}`, fontSize: 10, color: C.text3 }}>
          Click a state to filter · Highlighted states have active leads
        </div>
      </div>
    </div>
  );
}
