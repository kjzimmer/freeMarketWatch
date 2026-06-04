import { Link } from 'react-router-dom';
import type { PanelGroup } from '../types';

interface DrillDownModalProps {
  group: PanelGroup;
  onClose: () => void;
}

const METHODOLOGY: Record<PanelGroup, {
  title: string;
  sources: { name: string; detail: string }[];
  calculation: string;
  limitations: string;
}> = {
  currency: {
    title: 'World Currencies — Methodology',
    sources: [
      { name: 'M2/GDP deflator', detail: 'FRED M2SL + GDPC1 — annual, interpolated to monthly' },
      { name: 'USD/EUR', detail: 'FRED DEXUSEU — daily spot rate' },
      { name: 'USD/JPY', detail: 'FRED DEXJPUS — daily spot rate' },
      { name: 'USD/GBP', detail: 'FRED DEXUSUK — daily spot rate' },
      { name: 'USD/CNY', detail: 'FRED DEXCHUS — daily spot rate' },
      { name: 'Bitcoin', detail: 'CryptoCompare daily OHLCV — back to 2010' },
    ],
    calculation: `USD Purchasing Power: 100 × (M2GDP_start / M2GDP_t)
  where M2GDP_t = M2_t / GDP_t (interpolated to monthly)
The dollar loses purchasing power as M2 grows faster than real output. This line slopes downward — the steeper the slope, the faster real debasement.

Other Currencies: 100 × (FX_start / FX_t) × (M2GDP_start / M2GDP_t)
Exchange rate movement vs USD multiplied by the USD's own purchasing power change (M2/GDP basis). A currency that strengthens against the dollar while monetary debasement continues does well. Most fiat currencies fail both tests simultaneously.

THM (benchmark): 100 × (M2GDP_t / M2GDP_start)
  = 100 × (M2_t / GDP_t) / (M2_start / GDP_start)
THM and USD are exact inverses: USD × THM = 100² at every point. Everything above THM is genuinely gaining purchasing power; everything below is losing it.`,
    limitations: `Foreign currency purchasing power is calculated using US M2/GDP as the deflator — a scope decision rather than a theoretical one. Each currency has its own money supply and real output, and a fully consistent implementation would use each country's own M2/GDP ratio. That research is noted as future work.

FX data is priced in USD. This means all purchasing power calculations pass through the dollar as an intermediary.`,
  },
  riskoff: {
    title: 'Risk-Off Assets — Methodology',
    sources: [
      { name: 'TLT', detail: 'iShares 20+ Year Treasury Bond ETF — Yahoo Finance v8 API' },
      { name: 'GLD', detail: 'SPDR Gold Shares ETF — Yahoo Finance v8 API' },
      { name: 'TIPS', detail: 'iShares TIPS Bond ETF — Yahoo Finance v8 API' },
      { name: 'MM', detail: 'FRED TB3MS — 3-month T-bill rate (data pending)' },
      { name: 'M2/GDP deflator', detail: 'FRED M2SL + GDPC1 — annual, interpolated to monthly' },
    ],
    calculation: `All ETF/Asset Purchasing Power: 100 × (price_t / price_start) × (M2GDP_start / M2GDP_t)
  where M2GDP_t = M2_t / GDP_t (interpolated to monthly)
The adjusted closing price (split and dividend adjusted) is used to capture total return. This is then deflated by M2/GDP to convert nominal return into real purchasing power — the same deflator used for the THM benchmark.

Gold (GLD) represents the traditional hard money store of value. Its real performance against THM reveals whether it truly preserves purchasing power against monetary debasement.

Long Treasuries (TLT) represent the "safe haven" bond allocation. In a period of rising rates and persistent money growth, the result is instructive.

TIPS are explicitly inflation-linked. Whether they keep pace with THM — the M2/GDP debasement benchmark — is the question.`,
    limitations: `ETF prices include management fees which slightly drag returns relative to holding the underlying asset directly. GLD's expense ratio (~0.40%/yr) means it slightly underperforms spot gold over long periods. These fees are included in the comparison — the chart shows what an investor actually received.

Money Market (MM) and Cash data are pending — rate series require additional conversion logic to produce a price index.`,
  },
  riskon: {
    title: 'Risk-On Assets (Mag 7) — Methodology',
    sources: [
      { name: 'AAPL, MSFT, GOOGL, AMZN, NVDA, META, TSLA', detail: 'Yahoo Finance v8 chart API — adjusted close, daily, 10 years' },
      { name: 'Bitcoin', detail: 'CryptoCompare daily OHLCV — back to 2010' },
      { name: 'M2/GDP deflator', detail: 'FRED M2SL + GDPC1 — annual, interpolated to monthly' },
    ],
    calculation: `Equity Real Return: 100 × (price_t / price_start) × (M2GDP_start / M2GDP_t)
  where M2GDP_t = M2_t / GDP_t (interpolated to monthly)
Adjusted closing prices (accounting for splits and dividends) are deflated by M2/GDP to yield real purchasing power. An equity "beats hard money" if its real return exceeds THM — using the same M2/GDP debasement benchmark.

The Mag 7 are selected as the most productive public companies in history by market capitalization. The question is not whether they are good businesses — they clearly are — but whether their equity returns constitute genuine purchasing power gains or nominal-price growth that partially reflects dollar debasement.

Log scale is recommended for this panel: NVDA's outsized return over 10 years compresses all other lines to near-zero on a linear scale.`,
    limitations: `Past equity performance is highly concentrated in a handful of winners. Survivorship bias is significant — these are the companies that won. A basket of all large-cap equities would show substantially lower returns.

Dividends are included via adjusted close price. Tax treatment of dividends is not accounted for — after-tax real returns would be lower for taxable accounts.`,
  },
};

export default function DrillDownModal({ group, onClose }: DrillDownModalProps) {
  const m = METHODOLOGY[group];

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-accent)',
          borderRadius: 12,
          padding: 32,
          maxWidth: 580,
          width: '100%',
          maxHeight: '80vh',
          overflowY: 'auto',
          fontFamily: 'var(--font-data)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 24,
        }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 16,
            fontWeight: 700,
            color: 'var(--text-primary)',
            lineHeight: 1.3,
          }}>
            {m.title}
          </h2>
          <button
            onClick={onClose}
            style={{
              color: 'var(--text-muted)',
              fontSize: 18,
              lineHeight: 1,
              padding: '0 4px',
              flexShrink: 0,
              marginLeft: 16,
            }}
          >
            ×
          </button>
        </div>

        {/* Data Sources */}
        <Section title="Data Sources">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {m.sources.map((s) => (
              <div key={s.name} style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
                <span style={{
                  color: 'var(--thm-green)',
                  fontSize: 11,
                  minWidth: 80,
                  flexShrink: 0,
                }}>
                  {s.name}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: 11, lineHeight: 1.5 }}>
                  {s.detail}
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/* Calculation */}
        <Section title="Calculation Method">
          <pre style={{
            whiteSpace: 'pre-wrap',
            fontSize: 11,
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            fontFamily: 'var(--font-data)',
          }}>
            {m.calculation}
          </pre>
        </Section>

        {/* Limitations */}
        <Section title="Limitations & Disclosures">
          <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.7 }}>
            {m.limitations}
          </p>
        </Section>

        {/* Last Updated */}
        <div style={{
          marginTop: 20,
          paddingTop: 16,
          borderTop: '1px solid var(--border-subtle)',
          fontSize: 10,
          color: 'var(--text-faint)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap',
        }}>
          <span>THM and all assets use the same M2/GDP deflator. Data updated daily.</span>
          <Link
            to="/lens/thm"
            onClick={onClose}
            style={{
              fontFamily: 'var(--font-data)',
              fontSize: 10,
              color: 'var(--thm-green)',
              textDecoration: 'none',
              letterSpacing: '0.06em',
              flexShrink: 0,
            }}
          >
            THM methodology →
          </Link>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{
        fontSize: 10,
        color: 'var(--text-muted)',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        marginBottom: 10,
        paddingBottom: 6,
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        {title}
      </div>
      {children}
    </div>
  );
}
