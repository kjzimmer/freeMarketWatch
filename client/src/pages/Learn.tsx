import { Link } from 'react-router-dom';
import { ACTS } from '../content/acts';

export default function Learn() {
  return (
    <div style={{ paddingTop: 56 }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 40px 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{
            fontFamily: 'var(--font-data)',
            fontSize: 11,
            color: 'var(--thm-green)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: 12,
          }}>
            Education Series
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 32,
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            marginBottom: 12,
            lineHeight: 1.2,
          }}>
            From Trade to Bitcoin: The Case for Sound Money
          </h1>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: 15,
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            maxWidth: 560,
          }}>
            A six-part awareness series. Each act takes about 5 minutes to read. They build on each
            other — start at Act 1 if you're new to these ideas.
          </p>
        </div>

        {/* Act cards grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: 16,
        }}>
          {ACTS.map((act) => (
            <Link
              key={act.n}
              to={`/learn/act/${act.n}`}
              style={{ textDecoration: 'none' }}
            >
              <div
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 12,
                  padding: '24px',
                  height: '100%',
                  transition: 'border-color 0.15s, background 0.15s',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-accent)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(168,255,120,0.03)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-default)';
                  (e.currentTarget as HTMLElement).style.background = 'var(--bg-surface)';
                }}
              >
                <div style={{
                  fontFamily: 'var(--font-data)',
                  fontSize: 10,
                  color: 'var(--thm-green)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: 12,
                }}>
                  Act {act.n} of {ACTS.length}
                </div>

                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 16,
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  lineHeight: 1.4,
                  marginBottom: 10,
                  flex: 1,
                }}>
                  {act.title}
                </div>

                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 13,
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  marginBottom: 20,
                }}>
                  {act.description}
                </div>

                <div style={{
                  fontFamily: 'var(--font-data)',
                  fontSize: 11,
                  color: 'var(--thm-green)',
                  letterSpacing: '0.06em',
                }}>
                  Read →
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
