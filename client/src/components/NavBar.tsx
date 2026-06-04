import { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const LENS_SUBNAV = [
  { to: '/lens/fiat',       label: 'Why the Fiat Lens Distorts',    badge: '1' },
  { to: '/lens/thm',        label: 'The THM Lens',                  badge: '2' },
  { to: '/lens/investing',  label: 'Investing Through the THM Lens', badge: '3' },
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

const linkStyle = (isActive: boolean): React.CSSProperties => ({
  fontFamily: 'var(--font-data)',
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: '0.1em',
  textDecoration: 'none',
  color: isActive ? 'var(--thm-green)' : 'var(--text-secondary)',
  borderBottom: isActive ? '2px solid var(--thm-green)' : '2px solid transparent',
  paddingBottom: 2,
  transition: 'color 0.15s',
});

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [lensOpen, setLensOpen] = useState(false);
  const lensTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMobile = useIsMobile();
  const location = useLocation();

  const lensActive = location.pathname.startsWith('/lens');

  function handleLensEnter() {
    if (lensTimeoutRef.current) clearTimeout(lensTimeoutRef.current);
    setLensOpen(true);
  }

  function handleLensLeave() {
    lensTimeoutRef.current = setTimeout(() => setLensOpen(false), 180);
  }

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

        {/* Desktop nav */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <NavLink to="/" end style={({ isActive }) => linkStyle(isActive)}>
              DASHBOARD
            </NavLink>

            {/* THE LENS with dropdown */}
            <div
              style={{ position: 'relative' }}
              onMouseEnter={handleLensEnter}
              onMouseLeave={handleLensLeave}
            >
              <NavLink
                to="/lens"
                style={{
                  ...linkStyle(lensActive),
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                THE LENS
                <span style={{
                  fontSize: 8,
                  display: 'inline-block',
                  transition: 'transform 0.15s',
                  transform: lensOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  marginBottom: 1,
                }}>
                  ▾
                </span>
              </NavLink>

              {lensOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 16px)',
                    right: 0,
                    background: 'rgba(6,8,16,0.98)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 10,
                    padding: '8px 0',
                    minWidth: 268,
                    boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
                    zIndex: 300,
                  }}
                  onMouseEnter={handleLensEnter}
                  onMouseLeave={handleLensLeave}
                >
                  <div style={{
                    fontFamily: 'var(--font-data)',
                    fontSize: 9,
                    letterSpacing: '0.12em',
                    color: 'var(--text-faint)',
                    textTransform: 'uppercase',
                    padding: '8px 20px 4px',
                  }}>
                    Components
                  </div>
                  {LENS_SUBNAV.map(({ to, label, badge }) => {
                    const isActive = location.pathname === to || location.pathname.startsWith(to + '/');
                    return (
                      <NavLink
                        key={to}
                        to={to}
                        onClick={() => setLensOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          padding: '10px 20px',
                          textDecoration: 'none',
                          background: isActive ? 'rgba(168,255,120,0.05)' : 'transparent',
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(168,255,120,0.07)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = isActive ? 'rgba(168,255,120,0.05)' : 'transparent'; }}
                      >
                        <div style={{
                          fontFamily: 'var(--font-data)',
                          fontSize: 9,
                          fontWeight: 700,
                          color: 'var(--text-faint)',
                          letterSpacing: '0.08em',
                          flexShrink: 0,
                          width: 14,
                        }}>
                          {badge}
                        </div>
                        <div style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: 13,
                          color: isActive ? 'var(--thm-green)' : 'var(--text-secondary)',
                          lineHeight: 1.4,
                        }}>
                          {label}
                        </div>
                      </NavLink>
                    );
                  })}
                  <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '6px 0 2px' }} />
                  <NavLink
                    to="/lens"
                    onClick={() => setLensOpen(false)}
                    style={{
                      display: 'block',
                      padding: '8px 20px',
                      fontFamily: 'var(--font-data)',
                      fontSize: 10,
                      letterSpacing: '0.08em',
                      color: 'var(--thm-green)',
                      textDecoration: 'none',
                    }}
                  >
                    The Lens overview →
                  </NavLink>
                </div>
              )}
            </div>

            <NavLink to="/about" style={({ isActive }) => linkStyle(isActive)}>
              ABOUT
            </NavLink>
            <NavLink to="/contact" style={({ isActive }) => linkStyle(isActive)}>
              CONTACT
            </NavLink>
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
          <NavLink
            to="/"
            end
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
            DASHBOARD
          </NavLink>

          {/* THE LENS parent link */}
          <NavLink
            to="/lens"
            onClick={() => setMenuOpen(false)}
            style={{
              display: 'block',
              padding: '12px 40px',
              fontFamily: 'var(--font-data)',
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: '0.1em',
              textDecoration: 'none',
              color: lensActive ? 'var(--thm-green)' : 'var(--text-secondary)',
              borderLeft: lensActive ? '2px solid var(--thm-green)' : '2px solid transparent',
            }}
          >
            THE LENS
          </NavLink>

          {/* Lens sub-items */}
          {LENS_SUBNAV.map(({ to, label, badge }) => {
            const isActive = location.pathname === to || location.pathname.startsWith(to + '/');
            return (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 40px 8px 60px',
                  textDecoration: 'none',
                  color: isActive ? 'var(--thm-green)' : 'var(--text-muted)',
                  borderLeft: isActive ? '2px solid var(--thm-green)' : '2px solid transparent',
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-data)',
                  fontSize: 9,
                  color: 'var(--text-faint)',
                  flexShrink: 0,
                }}>
                  {badge}
                </span>
                <span style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 13,
                  lineHeight: 1.4,
                }}>
                  {label}
                </span>
              </NavLink>
            );
          })}

          <NavLink
            to="/about"
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
            ABOUT
          </NavLink>

          <NavLink
            to="/contact"
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
            CONTACT
          </NavLink>
        </div>
      )}
    </nav>
  );
}
