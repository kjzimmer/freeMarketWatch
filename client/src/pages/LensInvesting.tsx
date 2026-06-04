import { Link } from 'react-router-dom';

const prose: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 15,
  lineHeight: 1.8,
  color: 'var(--text-secondary)',
  marginBottom: 20,
};

const h2: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 22,
  fontWeight: 700,
  color: 'var(--text-primary)',
  letterSpacing: '-0.01em',
  marginBottom: 16,
  marginTop: 52,
};

const callout: React.CSSProperties = {
  borderLeft: '3px solid #60a5fa',
  paddingLeft: 20,
  margin: '28px 0',
  fontFamily: 'var(--font-display)',
  fontSize: 16,
  fontStyle: 'italic',
  lineHeight: 1.7,
  color: 'var(--text-primary)',
};

export default function LensInvesting() {
  return (
    <div style={{ paddingTop: 56 }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 40px 80px' }}>

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
        <div style={{
          fontFamily: 'var(--font-data)',
          fontSize: 11,
          color: '#60a5fa',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: 12,
        }}>
          The Lens · Component 3 of 3 · In Development
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
          Investing Through the THM Lens
        </h1>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: 15,
          color: 'var(--text-muted)',
          fontStyle: 'italic',
          marginBottom: 32,
        }}>
          First principles of investing under hard money assumptions
        </p>

        {/* Epistemic status note */}
        <div style={{
          background: 'rgba(96,165,250,0.05)',
          border: '1px solid rgba(96,165,250,0.25)',
          borderRadius: 8,
          padding: '16px 20px',
          marginBottom: 48,
          fontFamily: 'var(--font-display)',
          fontSize: 14,
          color: 'var(--text-secondary)',
          lineHeight: 1.7,
        }}>
          <span style={{ fontWeight: 700, color: '#60a5fa', fontFamily: 'var(--font-data)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
            Epistemic status
          </span>
          This is the most speculative component of The Lens. We are reasoning from first principles
          into territory the standard financial literature has not mapped — because that literature was
          built for a fiat world and largely takes fiat assumptions for granted. We flag where arguments
          are solid and where they are exploratory. The dashboard implications are work in progress.
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', marginBottom: 0 }} />

        {/* Section 1 */}
        <h2 style={h2}>The base position changes</h2>
        <p style={prose}>
          In a fiat world, you cannot stand still. Holding cash means losing purchasing power every
          year — roughly 3% under CPI, probably more under honest measures. The entire architecture
          of modern investing is built around this problem: how do I deploy capital to at least
          preserve what I have, let alone grow it?
        </p>
        <p style={prose}>
          This creates a permanent pressure to invest, to take risk, to chase yield. Not because
          every investor is greedy — because the monetary system punishes inaction. Every dollar
          sitting still is a dollar being slowly stolen.
        </p>
        <p style={prose}>
          Under hard money, this changes completely.
        </p>
        <p style={prose}>
          Your base position — holding THM — already preserves your purchasing power. You do not
          need to invest to stay whole. You need to invest only when you see a genuine opportunity
          to do better than THM. The pressure to deploy capital into mediocre opportunities
          disappears. Patience becomes rational. Waiting for the right opportunity is not a failure
          — it is the correct strategy.
        </p>
        <p style={prose}>
          This inversion is not minor. It restructures the entire logic of what investing is for.
        </p>

        <blockquote style={callout}>
          In a fiat world, the investor's question is: how do I beat inflation? In a THM world,
          the question is: what opportunity is genuinely worth leaving the safety of hard money for?
        </blockquote>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '40px 0 0' }} />

        {/* Section 2 */}
        <h2 style={h2}>What you are actually looking for</h2>
        <p style={prose}>
          If your base position already holds value, the only rational reason to invest is genuine
          value creation — enterprises that produce real output above the THM baseline. Not
          inflation-driven asset appreciation. Not financial engineering. Not leverage amplifying a
          fiat tailwind. Actual productive enterprise.
        </p>
        <p style={prose}>
          This reframes equity fundamentally. In a fiat world, equity has two components: a claim
          on future productive output, and an inflation hedge — companies hold real assets that
          appreciate with the money supply. In a THM world, the inflation hedge component disappears.
          Equity becomes purely a claim on genuine productive output above the hard money baseline.
        </p>
        <p style={prose}>
          The question for every investment simplifies to:
        </p>
        <blockquote style={callout}>
          Will this enterprise generate real value — measured in THM — above what hard money returns
          by simply holding its value?
        </blockquote>
        <p style={prose}>
          If yes: the investment makes sense. If no — if the return is driven by monetary tailwinds,
          financial engineering, or leverage rather than genuine productivity — it does not. This is
          a much higher bar than fiat investing sets. Most of what passes for investment returns in
          a fiat world does not clear it.
        </p>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '40px 0 0' }} />

        {/* Section 3 */}
        <h2 style={h2}>How debt works differently</h2>
        <p style={prose}>
          This is one of the most important behavioral differences between fiat and hard money worlds,
          and it runs in a direction most people do not immediately recognize.
        </p>
        <p style={prose}>
          <strong style={{ color: 'var(--text-primary)' }}>In a fiat world:</strong> Debt is
          systematically subsidized. Interest rates are suppressed below their natural market level.
          Money loses value over time, so you repay loans with cheaper dollars than you borrowed.
          The real burden of debt shrinks as years pass. Borrowing is rational even for marginal
          opportunities, because the monetary system tilts the math in the borrower's favor.
          The result: record levels of consumer, corporate, and government debt.
        </p>
        <p style={prose}>
          <strong style={{ color: 'var(--text-primary)' }}>In a hard money world:</strong> Debt is
          genuinely expensive. Interest rates are set by the actual supply and demand for savings.
          Money holds its value, so you repay loans with dollars of equal or greater purchasing
          power than you borrowed. Borrowing is only rational when the productive return on the
          borrowed capital clearly and reliably exceeds the full real cost of the debt.
        </p>
        <p style={prose}>
          For investors, the implication is direct: in a THM world, a company's debt load is a
          serious signal in a way it is not in a fiat world. High leverage that looks manageable
          when rates are suppressed and inflation is eroding the real burden looks very different
          when neither of those tailwinds exists.
        </p>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '40px 0 0' }} />

        {/* Section 4 */}
        <h2 style={h2}>Time horizon and what becomes attractive</h2>
        <p style={prose}>
          Hard money lowers time preference — the degree to which people value the present over the
          future. When your savings hold value, the future feels real and worth investing in. When
          they erode, the future feels discounted.
        </p>
        <p style={prose}>
          Under hard money, long-duration genuine value creation becomes rational again in a way
          fiat systematically discourages. A company building infrastructure that pays off over 30
          years. A research enterprise whose returns compound over decades. A community investment
          in education or physical capital with generational payoffs. These look very different when
          you are not being punished for patience.
        </p>
        <p style={prose}>
          In fiat terms, the discount rate applied to future cash flows reflects — partly — the
          expected debasement of the currency those flows are denominated in. Strip that out and
          long-duration assets become more attractive relative to short-duration ones.
        </p>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '40px 0 0' }} />

        {/* Section 5 */}
        <h2 style={h2}>What information THM investors need</h2>
        <p style={prose}>
          Standard fiat financial analysis asks: nominal revenue growth, P/E relative to peers,
          dividend yield relative to the risk-free rate. Most of these questions are corrupted by
          the fiat lens. Nominal revenue growth includes inflation. P/E ratios are benchmarked
          against a risk-free rate set by central bank policy, not genuine time preference.
        </p>
        <p style={prose}>
          A THM investor needs different questions:
        </p>

        {[
          {
            label: 'Real revenue growth',
            body: 'Is this company producing more output per unit of input, or just riding nominal price increases? Measured against THM, not against CPI.',
          },
          {
            label: 'Return on invested capital above THM',
            body: 'Not above the Fed funds rate. The genuine hurdle is: does this investment beat hard money? If it does not clear that bar, holding THM is the better choice.',
          },
          {
            label: 'Debt load under hard money assumptions',
            body: 'What does this company\'s debt look like if rates normalize to genuine market rates and inflation does not erode the real burden? Many balance sheets that look solid in fiat terms look fragile under these assumptions.',
          },
          {
            label: 'Genuine productivity improvement',
            body: 'Is this company getting better at producing value per unit of input? In a THM world this is the only sustainable source of above-THM returns. Financial engineering, leverage, and inflation tailwinds do not count.',
          },
          {
            label: 'Time horizon of value creation',
            body: 'How far out does this company\'s value creation extend? Under THM assumptions, longer is better — patient capital is rewarded rather than penalized.',
          },
        ].map(({ label, body }) => (
          <div
            key={label}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              borderRadius: 8,
              padding: '16px 20px',
              marginBottom: 12,
            }}
          >
            <div style={{
              fontFamily: 'var(--font-data)',
              fontSize: 11,
              fontWeight: 700,
              color: 'var(--thm-green)',
              letterSpacing: '0.06em',
              marginBottom: 8,
            }}>
              {label}
            </div>
            <p style={{ ...prose, marginBottom: 0, fontSize: 14 }}>{body}</p>
          </div>
        ))}

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '40px 0 0' }} />

        {/* Section 6 */}
        <h2 style={h2}>Dashboard implications — work in progress</h2>
        <p style={prose}>
          The questions above imply a different set of data than standard financial dashboards show.
          We are working through what that looks like.
        </p>
        <p style={prose}>
          What we know the dashboard needs to show eventually:
        </p>
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          borderRadius: 8,
          padding: '16px 20px',
          marginBottom: 20,
          fontFamily: 'var(--font-data)',
          fontSize: 12,
          lineHeight: 2,
          color: 'var(--text-secondary)',
        }}>
          <div>· Asset performance against THM_M2GDP <span style={{ color: 'var(--thm-green)' }}>(already building)</span></div>
          <div>· Real vs nominal revenue growth, adjusted against THM</div>
          <div>· Debt burden under hard money rate assumptions</div>
          <div>· A productivity screen — returns driven by genuine output vs monetary tailwinds</div>
        </div>
        <p style={prose}>
          We do not yet know the right way to present all of this. The theory has to come first.
          The data tools follow. This is an active development area — we will update this section
          as the framework develops.
        </p>
        <p style={{ ...prose, marginBottom: 32 }}>
          If you have a view on what information matters most for THM-based investment analysis —
          we genuinely want to hear it.
        </p>
        <Link
          to="/contact"
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
          Contact us →
        </Link>

        {/* Closing */}
        <div style={{
          marginTop: 64,
          background: 'rgba(96,165,250,0.04)',
          border: '1px solid rgba(96,165,250,0.2)',
          borderRadius: 12,
          padding: '32px 36px',
        }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 18,
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: 16,
            lineHeight: 1.3,
          }}>
            This is where the site is going.
          </div>
          <p style={{ ...prose, marginBottom: 24 }}>
            The dashboard currently shows existing financial markets through the THM lens — a
            different view of what already exists. That is valuable. It shows the distortion clearly.
            The larger question is what financial markets look like when they are built for a hard
            money world rather than adapted to be viewed through a hard money lens. That is the
            territory Component 3 is mapping.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link
              to="/lens"
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
              ← Back to The Lens
            </Link>
            <Link
              to="/"
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
              Explore the dashboard →
            </Link>
          </div>
        </div>

        <div style={{
          marginTop: 48,
          paddingTop: 24,
          borderTop: '1px solid var(--border-subtle)',
          fontFamily: 'var(--font-data)',
          fontSize: 11,
          color: 'var(--text-faint)',
          lineHeight: 1.7,
        }}>
          <div>The Lens · Component 3 · Version 1.0 · May 2026</div>
          <div>Status: Theoretical — actively being developed</div>
        </div>

      </div>
    </div>
  );
}
