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
          Version 3.0 · May 2026
        </p>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', marginBottom: 0 }} />

        <h2 style={sectionHead}>Why this site exists</h2>
        <p style={prose}>
          FreeMarketWatch is built on two premises.
        </p>
        <p style={prose}>
          <strong style={{ color: 'var(--text-primary)' }}>First:</strong> purchasing power is the
          only honest lens for understanding any currency or asset. Nominal prices, dollar returns,
          percentage gains — all measure distance with a ruler that shrinks a little every year. The
          only question that matters is: does this asset let you buy more or less over time?
        </p>
        <p style={prose}>
          <strong style={{ color: 'var(--text-primary)' }}>Second:</strong> THM — Theoretical Hard
          Money — represents what Bitcoin would look like as a mature monetary standard, with the
          adoption phase factored out. Bitcoin has the right monetary properties: fixed supply, no
          controlling authority, no political convenience. But it is in an adoption phase that makes
          its current price reflect speculation as much as monetary properties. THM is our best
          estimate of where Bitcoin arrives when that adoption is complete — the end state, not the
          transition.
        </p>
        <p style={prose}>
          Against that benchmark, the picture of which assets genuinely preserve value changes
          dramatically from what standard financial analysis shows.
        </p>
        <p style={prose}>
          The dashed green line on every chart is THM. Everything is measured against it.
        </p>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '40px 0 0' }} />

        <h2 style={sectionHead}>What this site is building toward</h2>
        <p style={prose}>
          Providing a different lens on existing markets is the first purpose of this site. It is
          largely built.
        </p>
        <p style={prose}>
          The second purpose is larger and less finished: developing the framework for how investors
          should think and act in a world where hard money is the standard. What changes when your
          base currency holds value? What information actually matters? What does a genuinely
          THM-native investment analysis look like?
        </p>
        <p style={prose}>
          This is territory the standard financial literature has not mapped, because that literature
          was built for a fiat world and takes fiat assumptions for granted. We are developing it
          openly, in public, as the site grows.
        </p>
        <p style={prose}>
          Both purposes live in <strong style={{ color: 'var(--text-primary)' }}>The Lens</strong> —
          the intellectual foundation of the site. Three components, honest about what is established
          and what is still being worked through.
        </p>
        <div style={{ marginTop: 16, marginBottom: 8 }}>
          <Link
            to="/lens"
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
            Explore The Lens →
          </Link>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '40px 0 0' }} />

        <h2 style={sectionHead}>How to read the charts</h2>

        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          borderRadius: 10,
          padding: '20px 24px',
          marginBottom: 16,
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
            Every chart starts everything at 100 — regardless of actual price. This lets you compare
            a $2 commodity with a $500 stock on the same scale. What matters is how much it changed,
            not what it costs.
          </p>
        </div>

        <div style={{
          background: 'rgba(168,255,120,0.04)',
          border: '1px solid var(--border-accent)',
          borderRadius: 10,
          padding: '20px 24px',
          marginBottom: 16,
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
            The THM line (dashed green) — the fixed ruler
          </div>
          <p style={{ ...prose, marginBottom: 8 }}>
            THM represents what money would look like if it had held its purchasing power since 1913.
            We calculate it using M2 adjusted for real economic output — the money supply growth above
            what the growing economy actually needed. This is the most defensible measure of pure
            monetary debasement we have found.
          </p>
          <p style={{ ...prose, marginBottom: 8 }}>
            Everything above this line is genuinely gaining purchasing power. Everything below it is
            losing ground — regardless of what the dollar price says.
          </p>
          <Link
            to="/lens/thm"
            style={{ ...dataRef, textDecoration: 'none' }}
          >
            How we define THM →
          </Link>
        </div>

        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          borderRadius: 10,
          padding: '20px 24px',
          marginBottom: 16,
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
            Short timeframes are noisy. The 10-year view is where the real story becomes visible —
            the slow, compounding effect of monetary debasement on everything from currencies to
            savings to the cost of daily life.
          </p>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '40px 0 0' }} />

        <h2 style={sectionHead}>What you are seeing in each panel</h2>

        {[
          {
            label: 'World Currencies',
            body: 'How major currencies have held — or lost — purchasing power against THM. The dollar is the world reserve currency and the primary instrument of debasement. Other currencies are largely measured against the dollar — which means they are measured against a shrinking ruler measuring against another shrinking ruler. THM gives you the fixed reference point.',
          },
          {
            label: 'Risk-Off Assets',
            body: 'Instruments traditionally considered safe — gold, bonds, money market instruments. Do they actually protect purchasing power against THM over time? The answer is more complicated than conventional wisdom suggests.',
          },
          {
            label: 'Mag 7 / Risk-On',
            body: 'The most productive public companies. Which genuinely outrun monetary debasement? Which only appear to because we are measuring in a shrinking currency? This is the central question Component 3 of The Lens is developing.',
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

        <h2 style={sectionHead}>A note on the data and methodology</h2>
        <p style={prose}>
          Data sources: <span style={dataRef}>Federal Reserve FRED</span>, <span style={dataRef}>CryptoCompare</span>,{' '}
          <span style={dataRef}>Yahoo Finance</span>.
        </p>
        <p style={prose}>
          THM is calculated using the M2/GDP ratio — excess money supply growth above real economic
          output, base year 1913. All assets on the dashboard are deflated using the same M2/GDP
          series — making the benchmark and the deflator theoretically consistent. When THM and USD
          purchasing power are both M2/GDP-adjusted, they are exact inverses of each other, as they
          should be.
        </p>
        <p style={prose}>
          We acknowledge this is not the only defensible answer. The full methodology discussion —
          including the case for raw M2 as the philosophically purest measure, and why we did not
          adopt it — is in Component 2 of The Lens.{' '}
          <Link to="/lens/thm" style={{ ...dataRef, textDecoration: 'none' }}>Read the THM methodology →</Link>
        </p>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '40px 0 0' }} />

        <h2 style={sectionHead}>What is next</h2>
        <p style={prose}>
          <strong style={{ color: 'var(--text-primary)' }}>The Lens Component 3</strong> — the
          investing framework under hard money assumptions — is being developed actively. It will
          include both theoretical content and eventual dashboard tools showing the information THM
          investors actually need.
        </p>
        <p style={prose}>
          <strong style={{ color: 'var(--text-primary)' }}>More instruments</strong> — additional
          currencies, commodities, and asset classes are being added to the dashboard.
        </p>
        <p style={prose}>
          <strong style={{ color: 'var(--text-primary)' }}>Your feedback</strong> — this site is
          better with serious readers who push back. If an argument is wrong, an analysis is off,
          or a question deserves more development:
        </p>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 8 }}>
          <Link
            to="/lens"
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
            Explore The Lens →
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
            Contact us →
          </Link>
        </div>

        <div style={{
          marginTop: 64,
          paddingTop: 24,
          borderTop: '1px solid var(--border-subtle)',
          fontFamily: 'var(--font-data)',
          fontSize: 11,
          color: 'var(--text-faint)',
          lineHeight: 1.7,
        }}>
          <div>FreeMarketWatch · freemarketwatch.world</div>
          <div>Not financial advice.</div>
          <div>Version 3.0 — May 2026</div>
        </div>

      </div>
    </div>
  );
}
