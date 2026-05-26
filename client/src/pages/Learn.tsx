import { Link } from 'react-router-dom';
import { TOPICS } from '../content/topics';

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
            Learn
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
            Understanding Money
          </h1>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: 15,
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            maxWidth: 520,
          }}>
            A growing library of topics on monetary economics, purchasing power,
            and the data behind what this site measures.
          </p>
        </div>

        {/* Topic cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {TOPICS.map((topic) => (
            <Link
              key={topic.slug}
              to={topic.route}
              style={{ textDecoration: 'none' }}
            >
              <div
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 12,
                  padding: '28px 32px',
                  transition: 'border-color 0.15s, background 0.15s',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: 24,
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
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: 'var(--font-data)',
                    fontSize: 10,
                    color: 'var(--thm-green)',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    marginBottom: 10,
                  }}>
                    {topic.tag}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 18,
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    lineHeight: 1.35,
                    marginBottom: 10,
                  }}>
                    {topic.title}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 14,
                    color: 'var(--text-secondary)',
                    lineHeight: 1.65,
                  }}>
                    {topic.description}
                  </div>
                </div>
                <div style={{
                  fontFamily: 'var(--font-data)',
                  fontSize: 12,
                  color: 'var(--thm-green)',
                  letterSpacing: '0.06em',
                  flexShrink: 0,
                  paddingTop: 4,
                }}>
                  {topic.cta}
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
