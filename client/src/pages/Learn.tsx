import { Link } from 'react-router-dom';
import { ACTS } from '../content/acts';

const DOWNLOADS = [
  {
    label: 'Complete Series — Long-Form PDF',
    file: '/downloads/FreeMarketWatch_Education_SixActs_v1.2.pdf',
    tag: 'PDF',
    note: 'Full six-act series, formatted for reading',
  },
  {
    label: 'Overview Deck — All 6 Acts',
    file: '/downloads/FMW_Overview_SingleSession_v1.2.pptx',
    tag: 'PPTX',
    note: 'Single-session presentation covering all six acts',
  },
  {
    label: 'Act 1 — Why Money Exists',
    file: '/downloads/FMW_Session1_v1.2.pptx',
    tag: 'PPTX',
    note: 'Standalone deck for Act 1',
  },
  {
    label: 'Act 2 — What Makes Good Money',
    file: '/downloads/FMW_Session2_v1.2.pptx',
    tag: 'PPTX',
    note: 'Standalone deck for Act 2',
  },
  {
    label: 'Act 3 — The Blast Radius',
    file: '/downloads/FMW_Session3_v1.2.pptx',
    tag: 'PPTX',
    note: 'Standalone deck for Act 3',
  },
  {
    label: 'Act 4 — Hard Money Changes Everything',
    file: '/downloads/FMW_Session4_v1.2.pptx',
    tag: 'PPTX',
    note: 'Standalone deck for Act 4',
  },
  {
    label: 'Act 5 — Bitcoin',
    file: '/downloads/FMW_Session5_v1.2.pptx',
    tag: 'PPTX',
    note: 'Standalone deck for Act 5',
  },
  {
    label: 'Act 6 — What Comes Next',
    file: '/downloads/FMW_Session6_v1.2.pptx',
    tag: 'PPTX',
    note: 'Standalone deck for Act 6',
  },
];

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

        {/* Downloads section */}
        <div style={{ marginTop: 64 }}>
          <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', marginBottom: 40 }} />

          <div style={{ marginBottom: 24 }}>
            <div style={{
              fontFamily: 'var(--font-data)',
              fontSize: 11,
              color: 'var(--thm-green)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: 10,
            }}>
              Downloads
            </div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 20,
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.01em',
              marginBottom: 8,
            }}>
              Take the series with you
            </div>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: 14,
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              maxWidth: 520,
            }}>
              The full education series is available as a long-form PDF for reading and as
              individual presentation decks for teaching — one deck per act, plus an
              overview deck covering all six.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {DOWNLOADS.map(({ label, file, tag, note }) => (
              <a
                key={file}
                href={file}
                download
                style={{ textDecoration: 'none' }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: '14px 20px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 10,
                    transition: 'border-color 0.15s, background 0.15s',
                    cursor: 'pointer',
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
                  <span style={{
                    fontFamily: 'var(--font-data)',
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    padding: '3px 8px',
                    borderRadius: 4,
                    border: tag === 'PDF'
                      ? '1px solid rgba(248,113,113,0.4)'
                      : '1px solid rgba(96,165,250,0.4)',
                    background: tag === 'PDF'
                      ? 'rgba(248,113,113,0.1)'
                      : 'rgba(96,165,250,0.1)',
                    color: tag === 'PDF' ? '#f87171' : '#60a5fa',
                    flexShrink: 0,
                  }}>
                    {tag}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 14,
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      lineHeight: 1.3,
                    }}>
                      {label}
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 12,
                      color: 'var(--text-muted)',
                      marginTop: 2,
                    }}>
                      {note}
                    </div>
                  </div>
                  <span style={{
                    fontFamily: 'var(--font-data)',
                    fontSize: 12,
                    color: 'var(--thm-green)',
                    flexShrink: 0,
                  }}>
                    ↓
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
