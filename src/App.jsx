import { useState } from 'react';
import { C } from './constants/colors.js';
import { employers as initialEmployers } from './data/employers.js';
import Sidebar, { navItems } from './components/Sidebar.jsx';
import TopBar from './components/TopBar.jsx';
import StatCards from './components/StatCards.jsx';
import LeadTable from './components/LeadTable.jsx';
import DetailPanel from './components/DetailPanel.jsx';
import MapView from './components/MapView.jsx';

const DEFAULT_ACCENT = '#00C9A7';
const DEFAULT_DENSITY = 'comfortable';
const DEFAULT_PANEL_POS = 'right';

export default function App() {
  const [nav, setNav] = useState('feed');
  const [selectedId, setSelectedId] = useState(1);
  const [accent, setAccent] = useState(DEFAULT_ACCENT);
  const [density, setDensity] = useState(DEFAULT_DENSITY);
  const [panelPos, setPanelPos] = useState(DEFAULT_PANEL_POS);
  const [employerData, setEmployerData] = useState(initialEmployers);

  const selectedEmployer = employerData.find(e => e.id === selectedId) ?? null;

  const handleAssign = (employerId, broker) => {
    setEmployerData(prev =>
      prev.map(e => e.id === employerId ? { ...e, broker, status: 'routed' } : e)
    );
  };

  const navLabel = navItems.find(n => n.id === nav)?.label ?? '';

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Sidebar active={nav} onNav={id => { setNav(id); setSelectedId(null); }} accent={accent} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar accent={accent} navLabel={navLabel} />

        {nav === 'feed' && <StatCards accent={accent} />}

        {nav === 'map' ? (
          <MapView employers={employerData} accent={accent} />
        ) : nav === 'feed' ? (
          <div style={{
            flex: 1, overflow: 'hidden', display: 'flex',
            flexDirection: panelPos === 'right' ? 'row' : 'column',
            paddingBottom: panelPos === 'bottom' ? 0 : 18,
          }}>
            <LeadTable
              accent={accent}
              density={density}
              selectedId={selectedId}
              onSelect={setSelectedId}
              employers={employerData}
              panelOpen={!!selectedEmployer}
            />
            {selectedEmployer && panelPos === 'right' && (
              <div style={{
                width: 500, borderLeft: `1px solid ${C.border}`,
                background: C.bg1, overflowY: 'auto', flexShrink: 0,
              }}>
                <DetailPanel
                  employer={selectedEmployer}
                  accent={accent}
                  onClose={() => setSelectedId(null)}
                  onAssign={b => handleAssign(selectedEmployer.id, b)}
                />
              </div>
            )}
            {selectedEmployer && panelPos === 'bottom' && (
              <div style={{ flexShrink: 0, overflowY: 'auto', maxHeight: 'min(340px, 45vh)', marginTop: 10, marginBottom: 10 }}>
                <DetailPanel
                  employer={selectedEmployer}
                  accent={accent}
                  onClose={() => setSelectedId(null)}
                  onAssign={b => handleAssign(selectedEmployer.id, b)}
                />
              </div>
            )}
          </div>
        ) : (
          /* Coming soon page for all other nav items */
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12, background: C.bg2,
              border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 22, color: C.text3,
            }}>
              {navItems.find(n => n.id === nav)?.icon}
            </div>
            <div style={{ fontSize: 15, fontWeight: 500, color: C.text }}>{navLabel}</div>
            <div style={{ fontSize: 12, color: C.text3 }}>Coming soon</div>
            <div style={{
              marginTop: 4, fontSize: 11, color: C.text3, padding: '5px 12px',
              background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 20, fontFamily: 'DM Mono',
            }}>
              In development
            </div>
          </div>
        )}
      </div>

      {/* Tweaks panel */}
      <TweaksPanel
        accent={accent} density={density} panelPos={panelPos}
        onAccent={setAccent} onDensity={setDensity} onPanelPos={setPanelPos}
      />
    </div>
  );
}

function TweaksPanel({ accent, density, panelPos, onAccent, onDensity, onPanelPos }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', bottom: 20, right: open ? 296 : 20,
          width: 36, height: 36, borderRadius: 8, background: C.bg2,
          border: `1px solid ${C.border2}`, color: C.text2, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'right 0.2s', zIndex: 10000, fontSize: 16,
        }}
        title="Tweaks"
      >
        ⚙
      </button>

      {open && (
        <div style={{
          position: 'fixed', bottom: 20, right: 20, width: 260,
          background: C.bg1, border: `1px solid ${C.border}`,
          borderRadius: 8, padding: 16, zIndex: 9999,
          display: 'flex', flexDirection: 'column', gap: 14,
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }}>
          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: C.text3, fontWeight: 600 }}>
            Tweaks
          </div>

          <TweakRow label="Accent color">
            <select
              value={accent}
              onChange={e => onAccent(e.target.value)}
              style={selectStyle}
            >
              <option value="#00C9A7">Teal (default)</option>
              <option value="#4F9EF0">Blue</option>
              <option value="#A78BFA">Violet</option>
              <option value="#F59E0B">Amber</option>
            </select>
          </TweakRow>

          <TweakRow label="Data density">
            <select
              value={density}
              onChange={e => onDensity(e.target.value)}
              style={selectStyle}
            >
              <option value="comfortable">Comfortable</option>
              <option value="compact">Compact</option>
            </select>
          </TweakRow>

          <TweakRow label="Panel position">
            <select
              value={panelPos}
              onChange={e => onPanelPos(e.target.value)}
              style={selectStyle}
            >
              <option value="right">Right sidebar</option>
              <option value="bottom">Below table</option>
            </select>
          </TweakRow>
        </div>
      )}
    </>
  );
}

function TweakRow({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ fontSize: 12, color: C.text2 }}>{label}</div>
      {children}
    </div>
  );
}

const selectStyle = {
  width: '100%', background: C.bg, border: `1px solid ${C.border}`,
  color: C.text, borderRadius: 4, fontFamily: 'DM Sans', fontSize: 12, padding: '5px 8px',
};
