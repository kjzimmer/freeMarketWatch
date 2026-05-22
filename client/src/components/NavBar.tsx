import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/', label: 'DASHBOARD', end: true },
  { to: '/learn', label: 'LEARN', end: false },
  { to: '/about', label: 'ABOUT', end: false },
  { to: '/contact', label: 'CONTACT', end: false },
];

function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < breakpoint);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [breakpoint]);
  return isMobile;
}

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: 56,
      zIndex: 200,
      background: 'rgba(6,8,16,0.92)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-default)',
    }}>
      <div style={{
        maxWidth: 1600,
        margin: '0 auto',
        padding: '0 40px',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Wordmark */}
        <NavLink
          to="/"
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}
          onClick={() => setMenuOpen(false)}
        >
          <div style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: 'var(--thm-green)',
            boxShadow: '0 0 10px var(--thm-green)',
            animation: 'thmPulse 3s ease-in-out infinite',
            flexShrink: 0,
          }} />
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: isMobile ? 16 : 19,
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-0.01em',
          }}>
            FREE MARKET WATCH
          </span>
        </NavLink>

        {/* Desktop nav links */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            {NAV_LINKS.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                style={({ isActive }) => ({
                  fontFamily: 'var(--font-data)',
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  textDecoration: 'none',
                  color: isActive ? 'var(--thm-green)' : 'var(--text-secondary)',
                  borderBottom: isActive ? '2px solid var(--thm-green)' : '2px solid transparent',
                  paddingBottom: 2,
                  transition: 'color 0.15s',
                })}
              >
                {label}
              </NavLink>
            ))}
          </div>
        )}

        {/* Mobile hamburger */}
        {isMobile && (
          <button
            onClick={() => setMenuOpen((v) => !v)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 5,
              padding: '8px 4px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
            aria-label="Toggle menu"
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 22,
                  height: 2,
                  background: menuOpen ? 'var(--thm-green)' : 'var(--text-secondary)',
                  borderRadius: 1,
                  transition: 'background 0.15s',
                }}
              />
            ))}
          </button>
        )}
      </div>

      {/* Mobile dropdown menu */}
      {isMobile && menuOpen && (
        <div style={{
          position: 'absolute',
          top: 56,
          left: 0,
          right: 0,
          background: 'rgba(6,8,16,0.98)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border-default)',
          padding: '8px 0 16px',
        }}>
          {NAV_LINKS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setMenuOpen(false)}
              style={({ isActive }) => ({
                display: 'block',
                padding: '12px 40px',
                fontFamily: 'var(--font-data)',
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: '0.1em',
                textDecoration: 'none',
                color: isActive ? 'var(--thm-green)' : 'var(--text-secondary)',
                borderLeft: isActive ? '2px solid var(--thm-green)' : '2px solid transparent',
              })}
            >
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}
