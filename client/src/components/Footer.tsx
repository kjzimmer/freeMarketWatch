import { Link } from 'react-router-dom';

const FOOTER_LINKS = [
  { to: '/', label: 'Dashboard' },
  { to: '/learn', label: 'Learn' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-subtle)',
      marginTop: 64,
      padding: '24px 40px',
    }}>
      <div style={{
        maxWidth: 1600,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        fontFamily: 'var(--font-data)',
        fontSize: 11,
        color: 'var(--text-muted)',
        letterSpacing: '0.05em',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          <span>© 2026 FreeMarketWatch · Not financial advice</span>
          <div style={{ display: 'flex', gap: 20 }}>
            {FOOTER_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                style={{
                  color: 'var(--text-muted)',
                  textDecoration: 'none',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
        <span>Data updated daily</span>
      </div>
    </footer>
  );
}
