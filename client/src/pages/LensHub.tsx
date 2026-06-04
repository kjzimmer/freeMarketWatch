import { Link } from 'react-router-dom';

const prose: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 15,
  lineHeight: 1.8,
  color: 'var(--text-secondary)',
  marginBottom: 16,
};

interface ComponentCardProps {
  number: number;
  badge: string;
  badgeColor: string;
  title: string;
  body: string;
  meta: string;
  cta: string;
  to: string;
}

function ComponentCard({ number, badge, badgeColor, title, body, meta, cta, to }: ComponentCardProps) {
  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          borderRadius: 12,
          padding: '28px 32px',
          transition: 'border-color 0.15s, background 0.15s',
          cursor: 'pointer',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-accent)';
          (e.currentTarget as HTMLElement).style.background = 'rgba(168,255,120,0.02)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-default)';
          (e.currentTarget as HTMLElement).style.background = 'var(--bg-surface)';
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{
            fontFamily: 'var(--font-data)',
            fontSize: 10,
            color: 'var(--text-faint)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}>
            Component {number}
          </div>
          <div style={{
            fontFamily: 'var(--font-data)',
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.08em',
            padding: '3px 8px',
            borderRadius: 4,
            border: `1px solid ${badgeColor}40`,
            background: `${badgeColor}12`,
            color: badgeColor,
            textTransform: 'uppercase',
          }}>
            {badge}
          </div>
        </div>

        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 20,
          fontWeight: 700,
          color: 'var(--text-primary)',
          letterSpacing: '-0.01em',
          marginBottom: 14,
          lineHeight: 1.3,
          flex: 0,
        }}>
          {title}
        </h2>

        <p style={{ ...prose, flex: 1 }}>{body}</p>

        <div style={{
          fontFamily: 'var(--font-data)',
          fontSize: 11,
          color: 'var(--text-muted)',
          letterSpacing: '0.04em',
          marginBottom: 14,
        }}>
          {meta}
        </div>

        <div style={{
          fontFamily: 'var(--font-data)',
          fontSize: 12,
          color: 'var(--thm-green)',
          letterSpacing: '0.04em',
        }}>
          {cta} →
        </div>
      </div>
    </Link>
  );
}

export default function LensHub() {
  return (
    <div style={{ paddingTop: 56 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 40px 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: 56 }}>
          <div style={{
            fontFamily: 'var(--font-data)',
            fontSize: 11,
            color: 'var(--thm-green)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: 16,
          }}>
            The Intellectual Foundation of FreeMarketWatch
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 44,
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-0.03em',
            marginBottom: 20,
            lineHeight: 1.1,
          }}>
            The Lens
          </h1>
          <p style={{ ...prose, maxWidth: 620 }}>
            Every chart on this site looks different from every other financial chart you have seen.
            Not because the data is different — the same markets, the same prices, the same assets.
            Because the lens is different.
          </p>
          <p style={{ ...prose, maxWidth: 620 }}>
            Most financial analysis measures everything in dollars. This site measures everything
            against THM — Theoretical Hard Money — what money would look like if it had been honest.
            That single change in perspective reveals a completely different picture of what is
            gaining value, what is losing it, and why.
          </p>
          <p style={{ ...prose, maxWidth: 620, marginBottom: 0 }}>
            This section develops that lens in full. Where the argument is solid, we say so.
            Where questions remain open, we say that too.
          </p>
        </div>

        {/* Component cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 20,
          marginBottom: 56,
        }}>
          <ComponentCard
            number={1}
            badge="Established"
            badgeColor="#4ade80"
            title="Why the Fiat Lens Distorts"
            body="The monetary system most people take for granted is not a neutral backdrop to economic life. It is an active force — redistributing wealth, distorting incentives, funding wars, and making the future harder to plan for than it should be. This six-act series takes you from the origin of money to the case for Bitcoin, building the argument from first principles."
            meta="Six acts · ~30 minutes total"
            cta="Start with Act 1"
            to="/lens/fiat"
          />
          <ComponentCard
            number={2}
            badge="Established · Open questions"
            badgeColor="#f59e0b"
            title="The THM Lens"
            body="THM — Theoretical Hard Money — is the benchmark that defines this site. Understanding it requires answering a question that serious economists have argued about for over a century: what is the right measure of monetary debasement? We have worked through three approaches, adopted the one we find most defensible, and published our reasoning openly — including the questions we have not resolved."
            meta="The methodology, the math, and the honest limits of what we know"
            cta="Read the THM discussion"
            to="/lens/thm"
          />
          <ComponentCard
            number={3}
            badge="In development"
            badgeColor="#60a5fa"
            title="Investing Through the THM Lens"
            body="If the fiat lens distorts financial reality — and we believe it does — then the entire framework of modern investing needs to be reconsidered. What are you actually trying to do when hard money is the base? What information matters? What doesn't? This component is being developed openly. The theory comes first. The dashboard tools follow once the framework is clear."
            meta="First principles of investing under hard money assumptions"
            cta="Read the framework"
            to="/lens/investing"
          />
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', marginBottom: 40 }} />

        {/* How this section is organized */}
        <div style={{ maxWidth: 680 }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 18,
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: 16,
          }}>
            How this section is organized
          </h2>
          <p style={prose}>
            Components 1 and 2 present arguments we are confident in, with honest acknowledgment
            of what remains uncertain. Component 3 is more speculative — we are reasoning from
            first principles into territory the financial literature has not mapped. We flag the
            difference clearly throughout.
          </p>
          <p style={{ ...prose, marginBottom: 20 }}>
            If you find an argument wrong, incomplete, or worth extending —
          </p>
          <Link
            to="/contact"
            style={{
              fontFamily: 'var(--font-data)',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.06em',
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              padding: '10px 20px',
              border: '1px solid var(--border-default)',
              borderRadius: 8,
              display: 'inline-block',
            }}
          >
            We want to hear it →
          </Link>
        </div>

      </div>
    </div>
  );
}
