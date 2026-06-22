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
    label: 'Intro Deck — 45-Minute Presentation',
    file: '/downloads/FMW_Intro45min_v1.2.pptx',
    tag: 'PPTX',
    note: 'Condensed intro presentation for a 45-minute session',
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

const prose: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 15,
  lineHeight: 1.8,
  color: 'var(--text-secondary)',
  marginBottom: 16,
};

export default function LensFiat() {
  return (
    <div style={{ paddingTop: 56 }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 40px 80px' }}>

        {/* Breadcrumb */}
        <div style={{ marginBottom: 32 }}>
          <Link
            to="/lens"
            style={{
              fontFamily: 'var(--font-data)',
              fontSize: 11,
              color: 'var(--text-muted)',
              textDecoration: 'none',
              letterSpacing: '0.06em',
            }}
          >
            ← The Lens
          </Link>
        </div>

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
            The Lens · Component 1 of 3 · Established
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 36,
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            marginBottom: 12,
            lineHeight: 1.15,
          }}>
            Why the Fiat Lens Distorts
          </h1>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: 15,
            color: 'var(--text-muted)',
            fontStyle: 'italic',
            marginBottom: 32,
          }}>
            The case for sound money — built from first principles
          </p>

          {/* Introduction */}
          <p style={prose}>
            You have been looking at financial markets through the wrong lens your entire life.
            Not because you were careless — because almost everyone is using the same lens, it is
            presented as neutral, and nobody told you it wasn't.
          </p>
          <p style={prose}>
            The lens is the dollar. Or the euro, or the yen, or any fiat currency. When you measure
            wealth in a currency that loses value every year, you are measuring distance with a ruler
            that shrinks every time you put it down. The measurements look normal. The comparisons
            look meaningful. But the ruler is lying to you.
          </p>
          <p style={prose}>
            Understanding why requires going back to first principles. Not to monetary policy or
            interest rates — to the actual origin of money. Why it exists. What problem it solves.
            What makes it good or bad. And what happens to every corner of society when money goes wrong.
          </p>
          <p style={prose}>
            This six-act series builds that argument from the ground up. Each act leads to the next.
            By Act 6 you will have arrived at Bitcoin not through hype but through logic — and you
            will understand why the lens on this site is different from every other financial site
            you have used.
          </p>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: 14,
            color: 'var(--text-muted)',
            fontStyle: 'italic',
            marginBottom: 0,
          }}>
            Six acts. About five minutes each. Start at Act 1 if these ideas are new to you.
          </p>
        </div>

        {/* Act cards grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: 16,
          marginBottom: 72,
        }}>
          {ACTS.map((act) => (
            <Link
              key={act.n}
              to={`/lens/fiat/act/${act.n}`}
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

        {/* Closing transition */}
        <div style={{
          background: 'rgba(168,255,120,0.04)',
          border: '1px solid var(--border-accent)',
          borderRadius: 12,
          padding: '32px 36px',
          marginBottom: 48,
        }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 18,
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: 16,
            lineHeight: 1.3,
          }}>
            You have the foundation. Now the lens.
          </div>
          <p style={{ ...prose, marginBottom: 16 }}>
            The six acts explained why fiat money distorts financial reality. The next step is
            understanding the benchmark we use to correct for that distortion — what it is, how we
            calculate it, and why the calculation is harder than it looks.
          </p>
          <p style={{ ...prose, marginBottom: 24 }}>
            Component 2 develops the THM lens in full — including the questions we have not resolved.
          </p>
          <Link
            to="/lens/thm"
            style={{
              fontFamily: 'var(--font-data)',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.06em',
              color: 'var(--thm-green)',
              textDecoration: 'none',
              padding: '10px 22px',
              border: '1px solid var(--border-accent)',
              borderRadius: 8,
              background: 'var(--thm-green-dim)',
              display: 'inline-block',
            }}
          >
            The THM Lens — Component 2 →
          </Link>
        </div>

        {/* Downloads */}
        <div style={{ marginTop: 24 }}>
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
              The full series is available as a long-form PDF and as individual presentation
              decks — one per act, plus an overview deck.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {DOWNLOADS.map(({ label, file, tag, note }) => (
              <a key={file} href={file} download style={{ textDecoration: 'none' }}>
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
                    border: tag === 'PDF' ? '1px solid rgba(248,113,113,0.4)' : '1px solid rgba(96,165,250,0.4)',
                    background: tag === 'PDF' ? 'rgba(248,113,113,0.1)' : 'rgba(96,165,250,0.1)',
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
                  <span style={{ fontFamily: 'var(--font-data)', fontSize: 12, color: 'var(--thm-green)', flexShrink: 0 }}>↓</span>
                </div>
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
