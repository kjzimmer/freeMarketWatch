import { Link } from 'react-router-dom';

const prose: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 15,
  lineHeight: 1.8,
  color: 'var(--text-secondary)',
  marginBottom: 20,
};

const sectionHead: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 20,
  fontWeight: 700,
  color: 'var(--text-primary)',
  marginBottom: 16,
  marginTop: 48,
};

const dataRef: React.CSSProperties = {
  fontFamily: 'var(--font-data)',
  fontSize: 12,
  color: 'var(--thm-green)',
};

export default function About() {
  return (
    <div style={{ paddingTop: 56 }}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '48px 40px 80px' }}>

        {/* Title */}
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 32,
          fontWeight: 800,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
          marginBottom: 8,
        }}>
          About FreeMarketWatch
        </h1>
        <p style={{
          fontFamily: 'var(--font-data)',
          fontSize: 12,
          color: 'var(--text-muted)',
          letterSpacing: '0.06em',
          marginBottom: 48,
        }}>
          Why this site exists and how to read what it shows
        </p>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', marginBottom: 0 }} />

        {/* Section 1 */}
        <h2 style={sectionHead}>Why This Site Exists</h2>
        <p style={prose}>
          Most financial charts show you prices in dollars. But the dollar is a broken measuring stick — it
          loses purchasing power every year, roughly 3–4% on average by official measures. So a stock that
          "went up 50%" might have only kept pace with inflation, or even lost real value.
        </p>
        <p style={prose}>
          But it's actually worse than that. In a genuinely productive economy, prices don't stay flat —
          they fall. As technology improves and production becomes more efficient, the same money should buy
          more over time. That deflationary pressure is the natural reward of a growing economy, and it's
          what happened during the industrial revolution under hard money.
        </p>
        <p style={prose}>
          Fiat money doesn't just take that reward away — it reverses it. So the true gap between what your
          money should be doing and what it's actually doing isn't just the 3–4% of official inflation. It's
          that plus the purchasing power gains you never received.
        </p>
        <p style={prose}>
          This site makes that gap visible. Every chart is measured against{' '}
          <span style={{ color: 'var(--thm-green)', fontFamily: 'var(--font-data)', fontSize: 13 }}>THM</span>
          {' '}— Theoretical Hard Money — a benchmark representing the purchasing power an honest monetary
          system would deliver: ~2% per year of real gain, reflecting natural economic productivity.
          Everything above THM is genuinely outpacing what sound money would give you. Everything below it
          is losing ground — by more than most people realize.
        </p>
        <p style={prose}>
          When you look at financial markets through this lens, the picture changes dramatically. Most things
          that appear to gain value are actually losing it against the benchmark. A handful of highly
          productive assets genuinely outperform. And hard money — money that can't be inflated away — sits
          at the top of the chart.
        </p>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '40px 0 0' }} />

        {/* Section 2 */}
        <h2 style={sectionHead}>How to Read the Charts</h2>

        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          borderRadius: 10,
          padding: '20px 24px',
          marginBottom: 20,
        }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 14,
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: 8,
          }}>
            The index <span style={dataRef}>(start = 100)</span>
          </div>
          <p style={{ ...prose, marginBottom: 0 }}>
            Every chart starts everything at 100 — regardless of actual price. This lets you compare a $2
            commodity with a $500 stock on the same scale. What matters is how much it changed, not what
            it costs.
          </p>
        </div>

        <div style={{
          background: 'rgba(168,255,120,0.04)',
          border: '1px solid var(--border-accent)',
          borderRadius: 10,
          padding: '20px 24px',
          marginBottom: 20,
        }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 14,
            fontWeight: 700,
            color: 'var(--thm-green)',
            marginBottom: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}>
            <svg width="20" height="8" viewBox="0 0 20 8">
              <line x1="0" y1="4" x2="20" y2="4" stroke="#a8ff78" strokeWidth="2" strokeDasharray="5 3" />
            </svg>
            The THM line (dashed green)
          </div>
          <p style={{ ...prose, marginBottom: 0 }}>
            THM stands for Theoretical Hard Money — a benchmark representing what money would look like if it
            held its purchasing power and grew with economic productivity (~2% per year). Everything above this
            line is gaining real purchasing power. Everything below it is losing.
          </p>
        </div>

        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          borderRadius: 10,
          padding: '20px 24px',
          marginBottom: 20,
        }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 14,
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: 8,
          }}>
            The timeframes <span style={dataRef}>(1Y / 5Y / 10Y)</span>
          </div>
          <p style={{ ...prose, marginBottom: 0 }}>
            Short timeframes are noisy. The 10-year view is where the real story becomes visible — the slow,
            compounding effect of monetary debasement on everything from currencies to savings to the cost of
            everyday life.
          </p>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '40px 0 0' }} />

        {/* Section 3 */}
        <h2 style={sectionHead}>What You're Seeing in Each Panel</h2>

        {[
          {
            label: 'World Currencies',
            body: 'How major currencies — the euro, yen, pound, yuan, and dollar — have held or lost purchasing power over time. The dollar is included as baseline reference. All compared against THM.',
          },
          {
            label: 'Risk-Off Assets',
            body: 'Instruments traditionally considered "safe" — gold (GLD), long-term treasuries (TLT), and inflation-protected bonds (TIPS). The question this panel answers: do traditional safe havens actually protect your purchasing power?',
          },
          {
            label: 'Mag 7 / Risk-On Assets',
            body: 'The most productive public companies in the world — Apple, Microsoft, Google, Amazon, Nvidia, Meta, and Tesla. Which ones actually outrun inflation? Which ones only appear to, because of loose money?',
          },
        ].map(({ label, body }) => (
          <div key={label} style={{ marginBottom: 24 }}>
            <div style={{
              fontFamily: 'var(--font-data)',
              fontSize: 11,
              fontWeight: 700,
              color: 'var(--thm-green)',
              letterSpacing: '0.08em',
              marginBottom: 6,
              textTransform: 'uppercase',
            }}>
              {label}
            </div>
            <p style={{ ...prose, marginBottom: 0 }}>{body}</p>
          </div>
        ))}

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '40px 0 0' }} />

        {/* Section 4 */}
        <h2 style={sectionHead}>A Note on the Data</h2>
        <p style={prose}>
          Price and FX data comes from{' '}
          <span style={dataRef}>FRED (Federal Reserve Economic Data)</span>,{' '}
          <span style={dataRef}>CryptoCompare</span>, and{' '}
          <span style={dataRef}>Yahoo Finance</span>. All series are updated daily.
        </p>
        <p style={prose}>
          Purchasing power is calculated using CPI (Consumer Price Index) as the deflator. CPI is an
          imperfect measure — it understates the cost of housing, excludes assets, and is subject to
          methodological revision. But it is the best widely-available, long-running dataset we have. The
          charts acknowledge this limitation by showing the methodology behind every series.
        </p>
        <p style={prose}>
          The THM 2% figure is theoretically motivated: it represents the approximate rate at which
          productive economies have historically seen the cost of goods decline as technology improves and
          output grows. It is a benchmark, not a guarantee. Click "METHOD" on any chart panel to see the
          full methodology.
        </p>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '40px 0 0' }} />

        {/* Section 5 */}
        <h2 style={sectionHead}>What's Next</h2>
        <p style={prose}>
          The education series walks through the full story — from why money exists, to what makes it good
          or dangerous, to why Bitcoin represents a structural solution to the problem that ended every
          previous hard money system.
        </p>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 8 }}>
          <Link
            to="/learn"
            style={{
              fontFamily: 'var(--font-data)',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.06em',
              color: 'var(--thm-green)',
              textDecoration: 'none',
              padding: '10px 20px',
              border: '1px solid var(--border-accent)',
              borderRadius: 8,
              background: 'var(--thm-green-dim)',
              display: 'inline-block',
            }}
          >
            Start the education series →
          </Link>
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
            Get in touch →
          </Link>
        </div>

      </div>
    </div>
  );
}
