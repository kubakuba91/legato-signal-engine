import { C } from '../constants/colors.js';

export const navItems = [
  {
    id: 'feed', label: 'Lead Feed',
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="2" width="14" height="2" rx="1" fill="currentColor"/><rect x="1" y="6" width="10" height="2" rx="1" fill="currentColor"/><rect x="1" y="10" width="12" height="2" rx="1" fill="currentColor"/><rect x="1" y="14" width="8" height="2" rx="1" fill="currentColor"/></svg>,
  },
  {
    id: 'map', label: 'Map View',
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 1L1 3v11l5-2 4 2 5-2V1l-5 2-4-2z" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinejoin="round"/><line x1="6" y1="1" x2="6" y2="12" stroke="currentColor" strokeWidth="1.3"/><line x1="10" y1="3" x2="10" y2="14" stroke="currentColor" strokeWidth="1.3"/></svg>,
  },
  {
    id: 'sources', label: 'Signal Sources',
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2" fill="currentColor"/><path d="M4.5 11.5A4.97 4.97 0 013 8a5 5 0 015-5 5 5 0 015 5 4.97 4.97 0 01-1.5 3.5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round"/><path d="M2 14A7.96 7.96 0 011 8a7 7 0 017-7 7 7 0 017 7 7.96 7.96 0 01-1 6" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round"/></svg>,
  },
  {
    id: 'analytics', label: 'Analytics',
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="9" width="3" height="6" rx="1" fill="currentColor"/><rect x="6" y="5" width="3" height="10" rx="1" fill="currentColor"/><rect x="11" y="1" width="3" height="14" rx="1" fill="currentColor"/></svg>,
  },
  {
    id: 'brokers', label: 'Brokers',
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.4"/><path d="M1 14c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><circle cx="12" cy="5" r="2" stroke="currentColor" strokeWidth="1.4"/><path d="M12 9c1.86 0 3 1.34 3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  },
  {
    id: 'campaigns', label: 'Campaigns',
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 10V6l6-4 6 4v4l-6 4-6-4z" stroke="currentColor" strokeWidth="1.4" fill="none"/><path d="M8 2v12M2 6l6 4 6-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  },
  {
    id: 'reports', label: 'Reports',
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="1" width="10" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.4" fill="none"/><line x1="5" y1="5" x2="9" y2="5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><line x1="5" y1="8" x2="9" y2="8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><line x1="5" y1="11" x2="7" y2="11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><polygon points="11,10 15,10 13,14" fill="currentColor"/></svg>,
  },
];

export default function Sidebar({ active, onNav, accent }) {
  return (
    <div style={{
      width: 196, background: C.bg1, borderRight: `1px solid ${C.border}`,
      display: 'flex', flexDirection: 'column', flexShrink: 0, padding: '0 0 16px',
    }}>
      {/* Logo */}
      <div style={{ padding: '18px 16px 16px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, background: accent + '18', border: `1px solid ${accent}44`,
            borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: accent }} />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.text, letterSpacing: '-0.01em' }}>Legato</div>
            <div style={{ fontSize: 9, color: C.text3, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Signal Engine</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '10px 8px' }}>
        {navItems.map(item => {
          const isActive = item.id === active;
          return (
            <button
              key={item.id}
              onClick={() => onNav(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                padding: '8px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
                background: isActive ? accent + '15' : 'transparent',
                color: isActive ? accent : C.text3,
                fontSize: 13, fontWeight: isActive ? 500 : 400,
                fontFamily: 'DM Sans', marginBottom: 2,
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = C.bg3; e.currentTarget.style.color = C.text2; }}}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.text3; }}}
            >
              <span style={{ opacity: isActive ? 1 : 0.7 }}>{item.icon}</span>
              {item.label}
              {isActive && <div style={{ marginLeft: 'auto', width: 3, height: 3, borderRadius: '50%', background: accent }} />}
            </button>
          );
        })}
      </nav>

      {/* Apollo sync card */}
      <div style={{ margin: '0 8px', padding: '10px 12px', background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: accent }} />
          <span style={{ fontSize: 10, fontWeight: 600, color: C.text2, letterSpacing: '0.04em' }}>Apollo sync</span>
        </div>
        <div style={{ fontFamily: 'DM Mono', fontSize: 18, fontWeight: 500, color: C.text }}>1,847</div>
        <div style={{ fontSize: 10, color: C.text3, marginTop: 2 }}>contacts enriched this week</div>
        <div style={{ marginTop: 8, height: 2, background: C.bg3, borderRadius: 1 }}>
          <div style={{ width: '62%', height: '100%', background: accent + '88', borderRadius: 1 }} />
        </div>
        <div style={{ fontSize: 9, color: C.text3, marginTop: 4 }}>Last sync: 4 min ago</div>
      </div>
    </div>
  );
}
