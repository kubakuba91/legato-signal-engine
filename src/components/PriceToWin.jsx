import { useState } from 'react';
import { C } from '../constants/colors.js';

const fmt = n => '$' + Math.round(n).toLocaleString();
const fmtK = n => n >= 1000 ? `$${Math.round(n / 1000)}K` : fmt(n);

function computeSim(employer) {
  const monthly = parseFloat(employer.costPerEmployee.replace(/[^0-9.]/g, ''));
  const annual = monthly * employer.fte * 12;
  const s = employer.score;

  const pWin = Math.min(48, Math.round(20 + s * 0.2));
  const bWin = Math.min(72, Math.round(40 + s * 0.25));
  const aWin = Math.min(90, Math.round(60 + s * 0.2));

  const pComm = Math.round(annual * 0.88 * 0.0704 / 100) * 100;
  const bComm = Math.round(annual * 0.82 * 0.0508 / 100) * 100;
  const aComm = Math.round(annual * 0.78 * 0.0455 / 100) * 100;

  const ev    = Math.round((bWin / 100) * bComm / 1000) * 1000;
  const evLow = Math.round((pWin / 100) * pComm / 1000) * 1000;
  const evHigh= Math.round((aWin / 100) * aComm / 1000) * 1000;

  const similar = Math.round(100 + s * 0.8);
  const confLabel = s >= 90 ? 'High' : s >= 80 ? 'Medium' : 'Low';
  const confScore = (0.5 + s * 0.004).toFixed(2);

  const whyPoints = [
    `${employer.fte} FTE ${employer.industry.toLowerCase()} firm with ${employer.headcount} growth`,
    `${employer.carrier} plan at ${employer.costPerEmployee.replace('/mo', ' PEPM')}`,
    employer.planYearEnd ? `Renewal window: ${employer.planYearEnd}` : null,
    `Pricing above 15% savings reduces win probability sharply`,
  ].filter(Boolean);

  const topSignal = employer.signals[0];
  const guidanceMap = {
    'Workforce': 'Lead with workforce flexibility + cost containment',
    'Financial': 'Lead with cost savings + financial benchmarking',
    'Labor':     'Lead with labor cost reduction story',
    'Intent':    'Lead with ROI comparison vs current plan',
    'Regulatory':'Lead with compliance support + cost savings',
  };
  const brokerGuidance = guidanceMap[topSignal] ?? 'Lead with cost savings + workforce flexibility';

  return { pWin, bWin, aWin, pComm, bComm, aComm, ev, evLow, evHigh, similar, confLabel, confScore, whyPoints, brokerGuidance };
}

function catmullToBezierPath(pts) {
  if (pts.length < 2) return '';
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(i + 2, pts.length - 1)];
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

function WinChart({ sim, accent }) {
  const W = 296, H = 178;
  const ml = 34, mr = 6, mt = 34, mb = 32;
  const cw = W - ml - mr;
  const ch = H - mt - mb;

  const sMin = 10, sMax = 26;
  const toX = s => ml + ((s - sMin) / (sMax - sMin)) * cw;
  const toY = p => mt + ch - (p / 100) * ch;

  const curvePts = [
    [sMin, 2], [11, 10], [12, sim.pWin], [15, (sim.pWin + sim.bWin) / 2],
    [18, sim.bWin], [21, (sim.bWin + sim.aWin) / 2],
    [24, sim.aWin], [sMax, Math.min(sim.aWin + 1, 92)],
  ].map(([s, p]) => [toX(s), toY(p)]);

  const path = catmullToBezierPath(curvePts);

  const zones = [
    { s0: 10, s1: 15.5, fill: C.red + '18',  label: 'Premium',    sub: 'Low savings',    col: C.red },
    { s0: 15.5, s1: 21, fill: C.blue + '12', label: 'Balanced',   sub: 'Optimal range',  col: C.blue },
    { s0: 21, s1: 26,   fill: C.teal + '10', label: 'Aggressive', sub: 'High savings',   col: C.teal },
  ];

  const dots = [
    { s: 12, p: sim.pWin, color: C.red,  anchor: 'start',  dx: 6,  dy: -7 },
    { s: 18, p: sim.bWin, color: accent, anchor: 'middle', dx: 0,  dy: -8 },
    { s: 24, p: sim.aWin, color: C.teal, anchor: 'middle', dx: 0,  dy: -8 },
  ];

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible', display: 'block' }}>
      {zones.map(z => (
        <rect key={z.label} x={toX(z.s0)} y={mt} width={toX(z.s1) - toX(z.s0)} height={ch} fill={z.fill} />
      ))}
      {zones.map(z => {
        const mx = (toX(z.s0) + toX(z.s1)) / 2;
        return (
          <g key={z.label + '_t'}>
            <text x={mx} y={mt - 18} textAnchor="middle" fontSize="8" fontWeight="600" fill={z.col} fontFamily="DM Sans, sans-serif">{z.label}</text>
            <text x={mx} y={mt - 7}  textAnchor="middle" fontSize="7" fill={z.col + '99'} fontFamily="DM Sans, sans-serif">{z.sub}</text>
          </g>
        );
      })}

      {[0, 25, 50, 75, 100].map(p => (
        <g key={p}>
          <line x1={ml} y1={toY(p)} x2={ml + cw} y2={toY(p)} stroke={C.border} strokeWidth="0.4" />
          <text x={ml - 4} y={toY(p) + 3} textAnchor="end" fontSize="7" fill={C.text3} fontFamily="DM Mono, monospace">{p}%</text>
        </g>
      ))}

      {[10, 12, 14, 16, 18, 20, 22, 24, 26].map(s => (
        <g key={s}>
          <line x1={toX(s)} y1={mt + ch} x2={toX(s)} y2={mt + ch + 4} stroke={C.border} strokeWidth="0.5" />
          <text x={toX(s)} y={mt + ch + 13} textAnchor="middle" fontSize="7" fill={C.text3} fontFamily="DM Mono, monospace">{s}%</text>
        </g>
      ))}

      <text x={(ml + W - mr) / 2} y={H - 2} textAnchor="middle" fontSize="7" fill={C.text3} fontFamily="DM Sans, sans-serif">
        Savings vs Current Plan (%)
      </text>

      {/* Industry average dashed */}
      <line x1={toX(sMin)} y1={toY(50)} x2={toX(sMax)} y2={toY(50)}
        stroke={C.text3} strokeWidth="1" strokeDasharray="4,3" />

      {/* Curve */}
      <path d={path} fill="none" stroke={accent} strokeWidth="1.8" strokeLinecap="round" />

      {/* Dots */}
      {dots.map((d, i) => (
        <g key={i}>
          <circle cx={toX(d.s)} cy={toY(d.p)} r="4.5" fill={d.color} stroke={C.bg1} strokeWidth="1.5" />
          <text x={toX(d.s) + d.dx} y={toY(d.p) + d.dy} textAnchor={d.anchor} fontSize="9" fontWeight="700"
            fill={d.color} fontFamily="DM Mono, monospace">
            {d.p}%
          </text>
        </g>
      ))}

      <line x1={ml} y1={mt} x2={ml} y2={mt + ch} stroke={C.border2} strokeWidth="0.5" />
      <line x1={ml} y1={mt + ch} x2={ml + cw} y2={mt + ch} stroke={C.border2} strokeWidth="0.5" />
    </svg>
  );
}

const SCENARIO_ICONS = {
  Premium: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M6 1l1.5 3 3.5.5-2.5 2.5.5 3.5L6 9l-3 1.5.5-3.5L1 4.5 4.5 4z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  ),
  Balanced: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4 6l1.5 1.5L8 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Aggressive: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2 10l3-4 2 2 3-6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

export default function PriceToWin({ employer, accent }) {
  const [showMore, setShowMore] = useState(false);
  const sim = computeSim(employer);

  const scenarioColors = [C.red, C.blue, C.teal];
  const scenarioLabels = ['Premium', 'Balanced', 'Aggressive'];
  const scenarioPcts = [12, 18, 22];
  const scenarioWins = [sim.pWin, sim.bWin, sim.aWin];
  const scenarioComms = [sim.pComm, sim.bComm, sim.aComm];
  const scenarioTags = ['High risk / high reward', 'Max expected value', 'Highest close probability'];
  const scenarioTagDots = [C.red, C.blue, C.teal];

  return (
    <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 18, marginTop: 4 }}>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Price-to-Win Simulation</span>
            <div title="Confidence based on similar deal analysis" style={{
              width: 15, height: 15, borderRadius: '50%', border: `1px solid ${C.border2}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 9, color: C.text3, cursor: 'default', flexShrink: 0,
            }}>?</div>
          </div>
          <div style={{ fontSize: 11, color: C.text3, marginTop: 2 }}>Based on {sim.similar} similar employers</div>
        </div>
        <div style={{
          fontSize: 10, fontWeight: 600, padding: '5px 10px', borderRadius: 6,
          background: accent + '18', color: accent, border: `1px solid ${accent}44`,
          whiteSpace: 'nowrap',
        }}>
          Confidence: {sim.confLabel} ({sim.confScore})
        </div>
      </div>

      {/* Chart + Recommended */}
      <div style={{ marginTop: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: C.text2, marginBottom: 10 }}>
          Win Probability by Savings vs Current Plan
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          {/* Chart */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <WinChart sim={sim} accent={accent} />
          </div>

          {/* Recommended card */}
          <div style={{
            width: 148, flexShrink: 0, background: C.bg2,
            border: `1px solid ${C.border2}`, borderRadius: 8, padding: '12px 14px',
          }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: C.text2, marginBottom: 10, letterSpacing: '0.04em' }}>
              Recommended Price Position
            </div>
            <div style={{ marginBottom: 12 }}>
              <span style={{ fontSize: 26, fontFamily: 'DM Mono', fontWeight: 600, color: C.blue }}>18%</span>
              <span style={{ fontSize: 14, color: C.blue, marginLeft: 5, fontWeight: 500 }}>Savings</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <div style={{ fontSize: 9, color: C.text3, marginBottom: 4 }}>Win Probability</div>
                <div style={{ fontSize: 18, fontFamily: 'DM Mono', fontWeight: 600, color: C.text }}>{sim.bWin}%</div>
              </div>
              <div>
                <div style={{ fontSize: 9, color: C.text3, marginBottom: 4 }}>Expected Commission</div>
                <div style={{ fontSize: 15, fontFamily: 'DM Mono', fontWeight: 600, color: accent }}>{fmt(sim.bComm)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 16, marginTop: 10, paddingLeft: 34 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: accent }} />
            <span style={{ fontSize: 10, color: C.text3 }}>Current recommendation</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 14, height: 1, borderTop: '1px dashed ' + C.text3 }} />
            <span style={{ fontSize: 10, color: C.text3 }}>Industry average</span>
          </div>
        </div>
      </div>

      {/* Scenario comparison */}
      <div style={{ marginTop: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 10 }}>Scenario Comparison</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
          {scenarioLabels.map((label, i) => {
            const col = scenarioColors[i];
            const isRec = i === 1;
            return (
              <div key={label} style={{
                background: C.bg2, border: `1px solid ${isRec ? col + '80' : col + '30'}`,
                borderRadius: 8, padding: '12px 12px 10px',
                position: 'relative',
              }}>
                {isRec && (
                  <div style={{ position: 'absolute', top: 10, right: 10 }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="7" fill={C.blue + '30'} stroke={C.blue} strokeWidth="1"/>
                      <path d="M5 8l2 2 4-4" stroke={C.blue} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <span style={{ color: col }}>{SCENARIO_ICONS[label]}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: col }}>{label}</span>
                </div>
                <div style={{ marginBottom: 10 }}>
                  <span style={{ fontSize: 20, fontFamily: 'DM Mono', fontWeight: 600, color: col }}>{scenarioPcts[i]}%</span>
                  <span style={{ fontSize: 11, color: C.text2, marginLeft: 5 }}>Savings</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 9, color: C.text3, marginBottom: 3 }}>Win Probability</div>
                    <div style={{ fontSize: 15, fontFamily: 'DM Mono', fontWeight: 600, color: C.text }}>{scenarioWins[i]}%</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 9, color: C.text3, marginBottom: 3 }}>Expected Commission</div>
                    <div style={{ fontSize: 12, fontFamily: 'DM Mono', fontWeight: 600, color: accent }}>{fmt(scenarioComms[i])}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, paddingTop: 8, borderTop: `1px solid ${col}22` }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: scenarioTagDots[i], flexShrink: 0 }} />
                  <span style={{ fontSize: 9, color: col }}>{scenarioTags[i]}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginTop: 10 }}>
        {/* Expected Value */}
        <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 8, padding: '12px 12px' }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: C.text2, marginBottom: 8 }}>Expected Value (EV)</div>
          <div style={{ fontSize: 20, fontFamily: 'DM Mono', fontWeight: 600, color: C.text, marginBottom: 4 }}>{fmt(sim.ev)}</div>
          <div style={{ fontSize: 10, color: C.text3, marginBottom: 8 }}>(range: {fmtK(sim.evLow)} – {fmtK(sim.evHigh)})</div>
          <div style={{ fontSize: 9, color: C.text3, lineHeight: 1.4 }}>EV = probability of close × commission across simulated outcomes</div>
        </div>

        {/* Why this works */}
        <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 8, padding: '12px 12px' }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: C.text2, marginBottom: 8 }}>Why this works</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {(showMore ? sim.whyPoints : sim.whyPoints.slice(0, 3)).map((pt, i) => (
              <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ marginTop: 1, flexShrink: 0 }}>
                  <path d="M2 5l2 2 4-4" stroke={accent} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ fontSize: 9, color: C.text2, lineHeight: 1.4 }}>{pt}</span>
              </div>
            ))}
          </div>
          {sim.whyPoints.length > 3 && (
            <button onClick={() => setShowMore(v => !v)} style={{
              marginTop: 8, fontSize: 9, color: accent, background: 'none', border: 'none',
              cursor: 'pointer', fontFamily: 'DM Sans', padding: 0,
              display: 'flex', alignItems: 'center', gap: 3,
            }}>
              {showMore ? 'Show less ∧' : 'Show more ∨'}
            </button>
          )}
        </div>

        {/* Broker guidance */}
        <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 8, padding: '12px 12px' }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: C.text2, marginBottom: 6 }}>Broker Guidance</div>
          <div style={{ fontSize: 9, color: C.text3, marginBottom: 4 }}>Recommended approach</div>
          <div style={{ fontSize: 10, fontWeight: 600, color: accent, marginBottom: 10, lineHeight: 1.4 }}>
            {sim.brokerGuidance}
          </div>
          <div style={{ fontSize: 9, color: C.text3, marginBottom: 4 }}>Risk note</div>
          <div style={{ fontSize: 9, color: C.text2, lineHeight: 1.4 }}>
            Pricing above 15% savings reduces win probability sharply in this segment
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
        <button style={{
          flex: 1, fontSize: 11, fontWeight: 500, padding: '8px 12px', borderRadius: 6,
          cursor: 'pointer', fontFamily: 'DM Sans', background: accent, color: C.bg,
          border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <rect x="1" y="1" width="11" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2" fill="none"/>
            <line x1="3.5" y1="4.5" x2="9.5" y2="4.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
            <line x1="3.5" y1="6.5" x2="7.5" y2="6.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
            <line x1="3.5" y1="8.5" x2="8.5" y2="8.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
          </svg>
          Apply Recommended Pricing to Proposal
        </button>
        <button style={{
          fontSize: 11, fontWeight: 500, padding: '8px 12px', borderRadius: 6,
          cursor: 'pointer', fontFamily: 'DM Sans', background: 'transparent',
          color: C.text2, border: `1px solid ${C.border2}`,
          display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
        }}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <circle cx="6.5" cy="6.5" r="4" stroke="currentColor" strokeWidth="1.2" fill="none"/>
            <line x1="6.5" y1="4" x2="6.5" y2="9" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
            <line x1="4" y1="6.5" x2="9" y2="6.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
          </svg>
          Simulate Custom Scenario
        </button>
        <button style={{
          fontSize: 11, fontWeight: 500, padding: '8px 12px', borderRadius: 6,
          cursor: 'pointer', fontFamily: 'DM Sans', background: 'transparent',
          color: C.text2, border: `1px solid ${C.border2}`,
          display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
        }}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <circle cx="4" cy="5" r="2" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M1 11c0-1.66 1.34-3 3-3s3 1.34 3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            <circle cx="10" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M10 8c1.1 0 2 .9 2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          View Similar Deals
        </button>
      </div>
    </div>
  );
}
