import { Link } from 'react-router-dom';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  Tooltip, ReferenceLine, CartesianGrid,
} from 'recharts';
import { useTHMChartData } from '../hooks/useTHMChartData';
import type { THMVariantPoint, GapSeriesPoint, Chart4Point } from '../hooks/useTHMChartData';

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

const h3: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 17,
  fontWeight: 700,
  color: 'var(--text-primary)',
  marginBottom: 12,
  marginTop: 32,
};

const callout: React.CSSProperties = {
  borderLeft: '3px solid var(--thm-green)',
  paddingLeft: 20,
  margin: '28px 0',
  fontFamily: 'var(--font-display)',
  fontSize: 16,
  fontStyle: 'italic',
  lineHeight: 1.7,
  color: 'var(--text-primary)',
};

const dataRef: React.CSSProperties = {
  fontFamily: 'var(--font-data)',
  fontSize: 13,
  color: 'var(--thm-green)',
};

const problem: React.CSSProperties = {
  background: 'rgba(248,113,113,0.05)',
  border: '1px solid rgba(248,113,113,0.2)',
  borderRadius: 8,
  padding: '14px 18px',
  fontFamily: 'var(--font-display)',
  fontSize: 14,
  color: 'var(--text-secondary)',
  lineHeight: 1.7,
  marginTop: 16,
  marginBottom: 8,
};

const problemLabel: React.CSSProperties = {
  fontFamily: 'var(--font-data)',
  fontSize: 10,
  fontWeight: 700,
  color: '#f87171',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  marginBottom: 6,
};

const chartTooltipStyle: React.CSSProperties = {
  background: 'rgba(10,12,18,0.95)',
  border: '1px solid var(--border-accent)',
  borderRadius: 8,
  padding: '10px 14px',
  fontFamily: 'var(--font-data)',
};

function ChartLabel({ title }: { title: string }) {
  return (
    <div style={{
      fontFamily: 'var(--font-data)',
      fontSize: 10,
      color: 'var(--thm-green)',
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      marginBottom: 8,
      marginTop: 40,
    }}>
      {title}
    </div>
  );
}

function ChartLoading() {
  return (
    <div style={{
      height: 320,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px dashed var(--border-default)',
      borderRadius: 10,
      margin: '12px 0 28px',
      fontFamily: 'var(--font-data)',
      fontSize: 11,
      color: 'var(--text-muted)',
      letterSpacing: '0.06em',
    }}>
      Loading…
    </div>
  );
}

function ChartError({ msg }: { msg: string }) {
  return (
    <div style={{
      height: 120,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px dashed rgba(248,113,113,0.3)',
      borderRadius: 10,
      margin: '12px 0 28px',
      fontFamily: 'var(--font-data)',
      fontSize: 11,
      color: '#f87171',
    }}>
      {msg}
    </div>
  );
}

function Chart1({ data }: { data: THMVariantPoint[] }) {
  const chartData = data.map((d) => ({
    year: d.year,
    thm_cpi:   d.thm_cpi,
    thm_m2gdp: d.thm_m2gdp,
    thm_m2raw: d.thm_m2raw,
    dollar:    100,
  }));

  return (
    <div style={{ margin: '12px 0 28px' }}>
      <ResponsiveContainer width="100%" height={360}>
        <LineChart data={chartData} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="year"
            tick={{ fontFamily: 'var(--font-data)', fontSize: 10, fill: 'var(--text-faint)' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => String(v)}
            interval={9}
          />
          <YAxis
            scale="log"
            domain={[80, 'auto']}
            tick={{ fontFamily: 'var(--font-data)', fontSize: 10, fill: 'var(--text-faint)' }}
            tickLine={false}
            axisLine={false}
            width={52}
            tickFormatter={(v: number) => {
              if (v >= 100000) return `${(v / 1000).toFixed(0)}k`;
              if (v >= 1000)   return `${(v / 1000).toFixed(1)}k`;
              return String(Math.round(v));
            }}
          />
          <Tooltip
            contentStyle={chartTooltipStyle}
            labelStyle={{ fontFamily: 'var(--font-data)', fontSize: 10, color: 'var(--text-muted)', marginBottom: 6 }}
            formatter={(value: number, name: string) => {
              const labels: Record<string, string> = {
                thm_cpi:   'THM — Inflation Index',
                thm_m2gdp: 'THM — M2/GDP (primary)',
                thm_m2raw: 'THM — Raw M2 (Austrian)',
                dollar:    'Dollar (1913 = 100)',
              };
              return [value.toFixed(0), labels[name] ?? name];
            }}
          />
          <ReferenceLine
            x={1971}
            stroke="rgba(255,255,255,0.15)"
            strokeDasharray="4 4"
            label={{ value: 'Nixon shock', position: 'top', fill: 'var(--text-faint)', fontFamily: 'var(--font-data)', fontSize: 9 }}
          />
          <Line dataKey="dollar"    stroke="rgba(255,255,255,0.2)"  dot={false} strokeWidth={1}   strokeDasharray="4 4" name="dollar" />
          <Line dataKey="thm_cpi"   stroke="#60a5fa"                dot={false} strokeWidth={1.5} name="thm_cpi" />
          <Line dataKey="thm_m2gdp" stroke="#a8ff78"                dot={false} strokeWidth={2.5} name="thm_m2gdp" />
          <Line dataKey="thm_m2raw" stroke="#f7931a"                dot={false} strokeWidth={1.5} strokeDasharray="6 3" name="thm_m2raw" />
        </LineChart>
      </ResponsiveContainer>
      <div style={{
        display: 'flex', gap: 20, flexWrap: 'wrap', marginTop: 12,
        fontFamily: 'var(--font-data)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.04em',
      }}>
        {[
          { color: '#60a5fa',                 label: 'THM — Inflation Index (CPI)',    dashed: false },
          { color: '#a8ff78',                 label: 'THM — M2/GDP (primary)',         dashed: false, thick: true },
          { color: '#f7931a',                 label: 'THM — Raw M2 (Austrian)',        dashed: true },
          { color: 'rgba(255,255,255,0.3)',   label: 'Dollar held as cash (1913=100)', dashed: true },
        ].map(({ color, label, dashed, thick }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="20" height="4">
              <line x1="0" y1="2" x2="20" y2="2" stroke={color} strokeWidth={thick ? '2.5' : '1.5'} strokeDasharray={dashed ? '6 3' : undefined} />
            </svg>
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

function Chart2({ data }: { data: THMVariantPoint[] }) {
  const chartData = data.map((d) => ({
    year: d.year,
    pp_cpi:   100 / d.thm_cpi * 100,
    pp_m2gdp: 100 / d.thm_m2gdp * 100,
    pp_m2raw: 100 / d.thm_m2raw * 100,
  }));

  const last = chartData[chartData.length - 1];
  const endLabels = last ? [
    { key: 'pp_cpi',   val: last.pp_cpi,   color: '#60a5fa', label: 'CPI' },
    { key: 'pp_m2gdp', val: last.pp_m2gdp, color: '#a8ff78', label: 'M2/GDP' },
    { key: 'pp_m2raw', val: last.pp_m2raw, color: '#f7931a', label: 'Raw M2' },
  ] : [];

  return (
    <div style={{ margin: '12px 0 28px' }}>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData} margin={{ top: 8, right: 80, bottom: 8, left: 0 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="year"
            tick={{ fontFamily: 'var(--font-data)', fontSize: 10, fill: 'var(--text-faint)' }}
            tickLine={false} axisLine={false}
            tickFormatter={(v: number) => String(v)} interval={9}
          />
          <YAxis
            tick={{ fontFamily: 'var(--font-data)', fontSize: 10, fill: 'var(--text-faint)' }}
            tickLine={false} axisLine={false} width={44}
            tickFormatter={(v: number) => `${v.toFixed(v < 1 ? 2 : 0)}¢`}
          />
          <Tooltip
            contentStyle={chartTooltipStyle}
            labelStyle={{ fontFamily: 'var(--font-data)', fontSize: 10, color: 'var(--text-muted)', marginBottom: 6 }}
            formatter={(value: number, name: string) => {
              const labels: Record<string, string> = { pp_cpi: 'CPI method', pp_m2gdp: 'M2/GDP method', pp_m2raw: 'Raw M2 method' };
              return [`${value.toFixed(3)}¢`, labels[name] ?? name];
            }}
          />
          <ReferenceLine x={1971} stroke="rgba(255,255,255,0.15)" strokeDasharray="4 4"
            label={{ value: 'Nixon shock', position: 'top', fill: 'var(--text-faint)', fontFamily: 'var(--font-data)', fontSize: 9 }} />
          <Line dataKey="pp_cpi"   stroke="#60a5fa" dot={false} strokeWidth={1.5} name="pp_cpi" />
          <Line dataKey="pp_m2gdp" stroke="#a8ff78" dot={false} strokeWidth={1.5} name="pp_m2gdp" />
          <Line dataKey="pp_m2raw" stroke="#f7931a" dot={false} strokeWidth={1.5} name="pp_m2raw" />
        </LineChart>
      </ResponsiveContainer>
      {endLabels.length > 0 && (
        <div style={{
          display: 'flex', gap: 20, flexWrap: 'wrap', marginTop: 8,
          fontFamily: 'var(--font-data)', fontSize: 10, color: 'var(--text-muted)',
        }}>
          {endLabels.map(({ key, val, color, label }) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 16, height: 1.5, background: color }} />
              <span>{label}:</span>
              <span style={{ color }}>{val.toFixed(val < 0.01 ? 3 : 2)}¢</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Chart3({ data }: { data: GapSeriesPoint[] }) {
  const last = data[data.length - 1];

  return (
    <div style={{ margin: '12px 0 8px' }}>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="year"
            tick={{ fontFamily: 'var(--font-data)', fontSize: 10, fill: 'var(--text-faint)' }}
            tickLine={false} axisLine={false}
            tickFormatter={(v: number) => String(v)} interval={9}
          />
          <YAxis
            scale="log" domain={[80, 'auto']}
            tick={{ fontFamily: 'var(--font-data)', fontSize: 10, fill: 'var(--text-faint)' }}
            tickLine={false} axisLine={false} width={52}
            tickFormatter={(v: number) => {
              if (v >= 10000) return `${(v / 1000).toFixed(0)}k`;
              if (v >= 1000)  return `${(v / 1000).toFixed(1)}k`;
              return String(Math.round(v));
            }}
          />
          <Tooltip
            contentStyle={chartTooltipStyle}
            labelStyle={{ fontFamily: 'var(--font-data)', fontSize: 10, color: 'var(--text-muted)', marginBottom: 6 }}
            formatter={(value: number, name: string) => {
              const labels: Record<string, string> = {
                m2_index: 'M2 Index', gdp_index: 'Real GDP Index', ratio_index: 'M2/GDP Ratio',
              };
              return [value.toFixed(0), labels[name] ?? name];
            }}
          />
          <ReferenceLine x={1971} stroke="rgba(255,255,255,0.15)" strokeDasharray="4 4"
            label={{ value: 'Nixon shock', position: 'top', fill: 'var(--text-faint)', fontFamily: 'var(--font-data)', fontSize: 9 }} />
          <Line dataKey="m2_index"    stroke="#f7931a" dot={false} strokeWidth={1.5} name="m2_index" />
          <Line dataKey="gdp_index"   stroke="#60a5fa" dot={false} strokeWidth={1.5} name="gdp_index" />
          <Line dataKey="ratio_index" stroke="#a8ff78" dot={false} strokeWidth={1.5} strokeDasharray="5 3" name="ratio_index" />
        </LineChart>
      </ResponsiveContainer>
      <div style={{
        display: 'flex', gap: 20, flexWrap: 'wrap', marginTop: 12,
        fontFamily: 'var(--font-data)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.04em',
      }}>
        {[
          { color: '#f7931a', label: last ? `M2 grew ${(last.m2_index / 100).toFixed(0)}×` : 'M2 Index', dashed: false },
          { color: '#60a5fa', label: last ? `Economy grew ${(last.gdp_index / 100).toFixed(0)}×` : 'Real GDP Index', dashed: false },
          { color: '#a8ff78', label: last ? `Excess: ${(last.ratio_index / 100).toFixed(0)}×` : 'M2/GDP Ratio', dashed: true },
        ].map(({ color, label, dashed }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="20" height="4">
              <line x1="0" y1="2" x2="20" y2="2" stroke={color} strokeWidth="1.5" strokeDasharray={dashed ? '5 3' : undefined} />
            </svg>
            {label}
          </div>
        ))}
      </div>
      <div style={{
        marginTop: 16,
        fontFamily: 'var(--font-display)',
        fontSize: 13,
        color: 'var(--text-muted)',
        fontStyle: 'italic',
        lineHeight: 1.6,
        maxWidth: 580,
      }}>
        The gap between M2 and GDP growth is the natural price deflation that sound money holders
        should have received as the economy grew. Instead it was captured by money creation.
      </div>
    </div>
  );
}

function Chart4({ data }: { data: Chart4Point[] }) {
  const last = data[data.length - 1];

  return (
    <div style={{ margin: '12px 0 28px' }}>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="year"
            tick={{ fontFamily: 'var(--font-data)', fontSize: 10, fill: 'var(--text-faint)' }}
            tickLine={false} axisLine={false}
            tickFormatter={(v: number) => String(v)} interval={9}
          />
          <YAxis
            tick={{ fontFamily: 'var(--font-data)', fontSize: 10, fill: 'var(--text-faint)' }}
            tickLine={false} axisLine={false} width={36}
            tickFormatter={(v: number) => `${v.toFixed(0)}×`}
          />
          <Tooltip
            contentStyle={chartTooltipStyle}
            labelStyle={{ fontFamily: 'var(--font-data)', fontSize: 10, color: 'var(--text-muted)', marginBottom: 6 }}
            formatter={(value: number) => [`${value.toFixed(2)}×`, 'Stolen deflation multiplier']}
          />
          <ReferenceLine x={1971} stroke="rgba(255,255,255,0.15)" strokeDasharray="4 4"
            label={{ value: 'Nixon shock', position: 'top', fill: 'var(--text-faint)', fontFamily: 'var(--font-data)', fontSize: 9 }} />
          <Line dataKey="stolen" stroke="#a8ff78" dot={false} strokeWidth={2} name="stolen" />
        </LineChart>
      </ResponsiveContainer>
      <div style={{
        marginTop: 8,
        fontFamily: 'var(--font-data)',
        fontSize: 10,
        color: 'var(--text-muted)',
        letterSpacing: '0.04em',
      }}>
        "The deflation that should have been yours" · {last ? `${last.stolen.toFixed(0)}× by ${last.year}` : ''}
      </div>
      <div style={{
        marginTop: 12,
        fontFamily: 'var(--font-display)',
        fontSize: 13,
        color: 'var(--text-muted)',
        fontStyle: 'italic',
        lineHeight: 1.6,
        maxWidth: 580,
      }}>
        Grows at ~3%/yr — the real output growth rate. By 2024: ~27× the 1913 value. Every dollar
        of real economic progress since 1913 was, in purchasing power terms, captured upstream rather
        than passed to money holders as cheaper prices.
      </div>
    </div>
  );
}

export default function LensTHM() {
  const { data, loading, error } = useTHMChartData();

  return (
    <div style={{ paddingTop: 56 }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 40px 80px' }}>

        {/* Breadcrumb */}
        <div style={{ marginBottom: 32 }}>
          <Link to="/lens" style={{
            fontFamily: 'var(--font-data)', fontSize: 11,
            color: 'var(--text-muted)', textDecoration: 'none', letterSpacing: '0.06em',
          }}>
            ← The Lens
          </Link>
        </div>

        {/* Header */}
        <div style={{
          fontFamily: 'var(--font-data)', fontSize: 11, color: 'var(--thm-green)',
          letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12,
        }}>
          The Lens · Component 2 of 4
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800,
          color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 12, lineHeight: 1.15,
        }}>
          The THM Lens
        </h1>
        <p style={{
          fontFamily: 'var(--font-display)', fontSize: 15, color: 'var(--text-muted)',
          fontStyle: 'italic', marginBottom: 32,
        }}>
          How we define the fixed ruler — and why the question is genuinely hard
        </p>

        {/* Epistemic status */}
        <div style={{
          background: 'rgba(245,158,11,0.05)',
          border: '1px solid rgba(245,158,11,0.25)',
          borderRadius: 8,
          padding: '16px 20px',
          marginBottom: 48,
          fontFamily: 'var(--font-display)',
          fontSize: 14,
          color: 'var(--text-secondary)',
          lineHeight: 1.7,
        }}>
          <span style={{
            fontWeight: 700, color: '#f59e0b', fontFamily: 'var(--font-data)',
            fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
            display: 'block', marginBottom: 6,
          }}>
            Epistemic status
          </span>
          This component mixes established argument with genuine open questions. The case for using
          THM as a benchmark is solid. The precise calculation of THM involves a methodological debate
          we have not fully resolved. We distinguish clearly between what we are confident in and what
          remains open.
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', marginBottom: 0 }} />

        {/* Section 1 */}
        <h2 style={h2}>Why THM is the whole point of this site</h2>
        <p style={prose}>
          Every financial chart you have ever seen measures value in dollars. Stock up 20%. Currency
          down 8%. Bond yield 4.5%. The dollar is the ruler.
        </p>
        <p style={prose}>
          But the ruler is shrinking. Has been since 1913. And nobody marked the graduations.
        </p>
        <p style={prose}>
          When you measure everything in a currency that loses value every year, you are not seeing
          reality. You are seeing a distorted reflection of it. A stock that "went up 40%" may have
          actually lost purchasing power. A currency that "held steady" may have collapsed against
          any honest benchmark. An asset praised as a safe haven may have quietly failed at its only job.
        </p>
        <p style={prose}>
          This is the founding problem of FreeMarketWatch.{' '}
          <strong style={{ color: 'var(--text-primary)' }}>
            Fiat money is a distorted lens. You cannot understand what anything is truly worth until
            you have a fixed ruler to measure it against.
          </strong>
        </p>
        <p style={prose}>
          THM — Theoretical Hard Money — is that ruler.
        </p>
        <p style={prose}>
          THM answers a specific question:{' '}
          <em>if money had been honest — if it had held its purchasing power and grown only with
          real economic productivity — where would that benchmark be today?</em>
        </p>
        <p style={prose}>
          Everything above the THM line is genuinely gaining purchasing power. Everything below it
          is losing ground, regardless of what the dollar price says. Assets that look like winners
          in fiat terms often look very different when measured against THM. That difference is the
          reality that fiat obscures.
        </p>
        <p style={prose}>
          No other financial site uses this benchmark. We think that is a problem. Understanding what
          anything is truly worth requires it.
        </p>
        <p style={prose}>
          But THM is only as good as the methodology behind it. And the methodology is genuinely
          unsettled. This page is where we work through it openly.
        </p>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '40px 0 0' }} />

        {/* Unified theory section */}
        <h2 style={h2}>The underlying framework</h2>
        <p style={prose}>
          Before examining three ways to calculate THM, it helps to understand what the
          calculation is actually isolating — and what it is not.
        </p>

        <h3 style={h3}>Two observable forces</h3>
        <p style={prose}>
          Every period, two things happen simultaneously in the economy:
        </p>
        <p style={prose}>
          <strong style={{ color: 'var(--text-primary)' }}>Monetary Expansion:</strong>{' '}
          The money supply (M2) grows. More monetary claims are issued. Each existing dollar
          represents a smaller share of total output. This is the Monetary Expansion Factor —
          M2_t / M2_(t−1).
        </p>
        <p style={prose}>
          <strong style={{ color: 'var(--text-primary)' }}>Output Growth:</strong>{' '}
          The real economy expands or contracts. GDP rises with more workers, more capital, more
          productive activity. This is the Output Growth Factor — GDP_t / GDP_(t−1).
        </p>
        <p style={prose}>
          These two forces are observable and separable. One clarification on the labels: the
          Output Growth Factor is simply GDP growth. It does not isolate productivity or
          efficiency — it includes population growth, capital accumulation, government spending,
          and genuine productivity gains alike. We label it Output Growth because that is what the
          math measures, nothing more.
        </p>
        <pre style={{
          background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
          borderRadius: 8, padding: '14px 18px', marginBottom: 20,
          fontFamily: 'var(--font-data)', fontSize: 13, color: 'var(--thm-green)',
          lineHeight: 1.7, overflowX: 'auto',
        }}>
          {`Monetary Expansion Factor(t) = M2_t / M2_(t−1)\nOutput Growth Factor(t)      = GDP_t / GDP_(t−1)\n\nMonetary Intensity:\nMI_t = M2_t / GDP_t\n(monetary claims per unit of real output)\n\nMI rises when money supply grows faster than output.\nMI falls when output grows faster than money supply.`}
        </pre>
        <p style={prose}>
          A note on existing economic concepts: economists familiar with the quantity theory of
          money will recognize that GDP/M2 is broad money velocity. THM is related to velocity
          but the interpretation differs. Velocity is typically framed as money turnover. We frame
          M2/GDP as monetary claims per unit of output — a different lens on the same ratio. We
          flag this because a careful economist will raise it.
        </p>

        <h3 style={h3}>What THM measures</h3>
        <p style={prose}>
          THM is a monetary intensity benchmark. It measures how much monetary claims have grown
          relative to real output — the accumulated excess of Monetary Expansion over Output
          Growth, compounded from 1913.
        </p>
        <pre style={{
          background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
          borderRadius: 8, padding: '14px 18px', marginBottom: 20,
          fontFamily: 'var(--font-data)', fontSize: 13, color: 'var(--thm-green)',
          lineHeight: 1.7, overflowX: 'auto',
        }}>
          {`THM_(t) = THM_(t−1) × (Monetary Expansion Factor / Output Growth Factor)\n\nCompounded from 1913:\nTHM(t) = 100 × (M2_t / GDP_t) / (M2_1913 / GDP_1913)`}
        </pre>
        <p style={prose}>
          This is the formula implemented on the dashboard. The decomposition is not a new model —
          it is a more careful description of what the existing formula computes. M2/GDP is not an
          arbitrary choice. It emerges from the ratio of two observable growth rates. The
          decomposition is the explanation.
        </p>
        <p style={prose}>
          <strong style={{ color: 'var(--text-primary)' }}>What this means for the chart:</strong>{' '}
          THM rises when Monetary Expansion outpaces Output Growth. The rising THM line is the
          accumulated excess. For an asset to genuinely preserve value relative to this benchmark,
          it must keep pace with the rate at which monetary claims have grown above output.
        </p>

        <h3 style={h3}>What THM is — and what it is not</h3>
        <p style={prose}>
          THM stands for Theoretical Hard Money. The name reflects the benchmark's intent: to
          isolate and quantify the monetary-intensity dimension that distinguishes hard money from
          fiat. It is a defensible attempt at that isolation, not a simulation of what hard money
          would have been.
        </p>
        <p style={prose}>
          A hard money system has one defining characteristic: the supply of monetary claims does
          not expand relative to economic output. M2/GDP captures exactly that dimension. Under a
          fixed supply, M2/GDP falls as output grows. Under fiat, it has risen. THM tracks that
          difference — accumulated from 1913.
        </p>
        <p style={prose}>What THM does not claim to be:</p>
        <ul style={{ ...prose, paddingLeft: 20, marginBottom: 16 }}>
          <li>A simulation of what would have happened under a gold standard</li>
          <li>A simulation of what would have happened under Bitcoin</li>
          <li>The closest possible approximation to hard money</li>
          <li>A proof that any particular monetary system is superior</li>
        </ul>
        <p style={prose}>What THM is:</p>
        <ul style={{ ...prose, paddingLeft: 20, marginBottom: 16 }}>
          <li>A benchmark that isolates the monetary-claims-versus-output dimension of hard money</li>
          <li>A transparent, reproducible signal derived from two observable inputs: M2 and GDP</li>
          <li>A Version 1 model that is internally coherent and open to refinement as alternative benchmarks are explored</li>
        </ul>

        <h3 style={h3}>What would happen under a fixed money supply</h3>
        <p style={prose}>
          In a fixed supply world — as Bitcoin's supply is fixed — Monetary Expansion equals 1
          every period. M2 does not grow.
        </p>
        <p style={prose}>
          Output Growth continues. With M2 fixed and GDP rising, Monetary Intensity (M2/GDP)
          falls. THM would <em>decline</em> as GDP grows:
        </p>
        <pre style={{
          background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
          borderRadius: 8, padding: '14px 18px', marginBottom: 20,
          fontFamily: 'var(--font-data)', fontSize: 13, color: 'var(--thm-green)',
          lineHeight: 1.7, overflowX: 'auto',
        }}>
          {`Fixed supply:\nM2 = constant → Monetary Expansion Factor = 1 each period\nGDP grows 3%/yr → Output Growth Factor = 1.03\n\nTHM change each period = 1 / 1.03 ≈ −2.9%/yr`}
        </pre>
        <p style={prose}>
          A falling THM under fixed supply is the correct and expected result — monetary intensity
          declining as output grows against a fixed supply. This is the natural monetary environment
          of a hard money world: more output per unit of money, prices gently falling, purchasing
          power of each unit rising.
        </p>
        <p style={prose}>
          Under fiat, the opposite occurred. Money supply grew faster than output, monetary
          intensity rose, and THM climbed steeply.
        </p>
        <p style={prose}>
          <strong style={{ color: 'var(--text-primary)' }}>Important clarification:</strong>{' '}
          THM as implemented is a debasement benchmark — it rises with monetary intensity. It is
          not a simulation of what a hard money holder accumulates. The name THM refers to the
          monetary standard the benchmark is designed to represent — not to the direction the line
          moves. This distinction is real and worth holding clearly.
        </p>

        <h3 style={h3}>What the Dollar series measures</h3>
        <p style={prose}>
          The Dollar is the exact inverse of THM:
        </p>
        <pre style={{
          background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
          borderRadius: 8, padding: '14px 18px', marginBottom: 20,
          fontFamily: 'var(--font-data)', fontSize: 13, color: 'var(--thm-green)',
          lineHeight: 1.7, overflowX: 'auto',
        }}>
          {`Dollar(t) = 100² / THM(t)`}
        </pre>
        <p style={prose}>
          The gap between THM and the Dollar at any point is precisely and entirely the
          accumulated excess of Monetary Expansion over Output Growth. Not an interpretation
          — a mathematical identity.
        </p>

        <h3 style={h3}>Purchasing power — what the decomposition explores</h3>
        <p style={prose}>
          Monetary intensity (M2/GDP) is one candidate explanation for long-run changes in
          purchasing power — what money can actually buy. This model explores whether changes in
          monetary intensity correspond to observed changes in purchasing power over long periods.
        </p>
        <p style={prose}>
          We do not claim the decomposition proves this relationship. We present it as a research
          question: does this signal correspond to what people actually experienced? The 111-year
          chart is the evidence. The interpretation follows from the data.
        </p>
        <p style={prose}>
          We flag this distinction because a careful economist would raise it correctly: purchasing
          power strictly requires a price index. This decomposition derives from M2 and GDP.
          Whether monetary intensity is a useful proxy for purchasing power is an empirical
          question, not an algebraic one.
        </p>

        <h3 style={h3}>The research question</h3>
        <p style={prose}>
          This decomposition does not prove Austrian economics. It does not claim M2/GDP is the
          only valid measure of debasement. It does not assert that monetary expansion is always
          harmful.
        </p>
        <p style={prose}>
          It asks one empirical question:{' '}
          <strong style={{ color: 'var(--text-primary)' }}>
            does this decomposition produce a stable and interpretable signal across 111 years
            of historical data?
          </strong>
        </p>
        <p style={prose}>
          If Monetary Intensity tracks recognizable monetary events — accelerates after 1971 when
          gold convertibility ended, spikes during COVID money printing, contracts during tight
          money periods — the decomposition has empirical content. If the gap between THM and the
          Dollar corresponds to what people experienced as purchasing power loss, the model is
          useful.
        </p>
        <p style={prose}>
          The charts below show the historical record. The interpretation follows from the data,
          not from the framework.
        </p>

        <h3 style={h3}>What comes next</h3>
        <p style={prose}>
          Version 1 uses M2/GDP as the single benchmark. Alternative benchmarks are the logical
          next step:
        </p>
        <ul style={{ ...prose, paddingLeft: 20, marginBottom: 16 }}>
          <li><strong style={{ color: 'var(--text-primary)' }}>Monetary Base / GDP:</strong> base money instead of M2 — a robustness test on the money definition</li>
          <li><strong style={{ color: 'var(--text-primary)' }}>Total Credit / GDP:</strong> credit expansion may capture debasement effects M2 misses</li>
          <li><strong style={{ color: 'var(--text-primary)' }}>Total Debt / GDP:</strong> how much future output has already been pledged</li>
          <li><strong style={{ color: 'var(--text-primary)' }}>Broad Liquidity / GDP:</strong> shadow banking and offshore dollar effects</li>
        </ul>
        <p style={prose}>
          If multiple benchmarks point in the same direction, the thesis strengthens. If they
          diverge, something important is learned. We treat Version 1 as the foundation, not
          the final word.
        </p>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '40px 0 0' }} />

        {/* Section 2 */}
        <h2 style={h2}>The central problem</h2>
        <p style={prose}>
          To calculate where THM should be today, we need to know how much the dollar has been
          debased since 1913. That sounds straightforward. It isn't.
        </p>
        <p style={prose}>
          There are three fundamentally different ways to answer that question. Each is grounded
          in a different theory of what money is and what debasement means. Each produces a
          different THM line.
        </p>

        {/* Approach 1 */}
        <h3 style={h3}>Approach 1 — Inflation indexes</h3>
        <p style={prose}>
          CPI, Truflation, the MIT Billion Prices Project — all measure debasement by tracking what
          a basket of goods costs over time. When that basket costs more dollars, the dollar has lost
          purchasing power. These are philosophically identical approaches. CPI uses a
          government-defined basket. Truflation uses real-time private data. Both ask: what does
          stuff cost now versus then?
        </p>
        <p style={prose}>
          <strong style={{ color: 'var(--text-primary)' }}>The case for it:</strong> Intuitive. Maps
          to lived experience. Over 111 years, CPI says the 1913 dollar is worth about{' '}
          <span style={dataRef}>3 cents today</span>.
        </p>
        <div style={problem}>
          <div style={problemLabel}>The honest problem</div>
          Inflation indexes are not facts. They are calculations built on thousands of judgment calls:
          hedonic adjustment (when a car gets more features, its measured price is reduced — suppressing
          inflation), substitution (when beef gets expensive and people buy chicken, the basket shifts),
          and geometric weighting (a 1996 methodological change alone reduced measured CPI by an
          estimated 0.5–1%/yr going forward). Independent measures consistently show inflation running
          1–3% higher than official CPI. The bias runs in one direction — downward — and is set by
          the same government that benefits financially from understating it.
        </div>
        <p style={{ ...prose, marginTop: 16 }}>
          When you use CPI to define THM, you are accepting the government's answer to a question the
          government has a financial interest in understating.
        </p>
        <p style={prose}>
          <strong style={{ color: 'var(--text-primary)' }}>THM_CPI produces a benchmark of roughly
          3,200 today (base 100 in 1913).</strong> This is probably the lowest honest estimate of
          where THM should be.
        </p>

        {/* Approach 2 */}
        <h3 style={h3}>Approach 2 — M2 adjusted for real economic output (M2/GDP)</h3>
        <p style={prose}>
          This approach starts from a different theory. Instead of measuring what stuff costs, it
          measures how much the money supply has grown above what the real economy needed.
        </p>
        <p style={prose}>
          A larger economy facilitates more transactions and therefore needs more money. If real GDP
          doubles and the money supply stays flat, prices fall by half — not because money was debased,
          but because the same dollars are now doing twice as much work. That price decline is healthy
          and real, but it is not debasement. Debasement is the money growth{' '}
          <em>above</em> real output growth — the excess that dilutes existing holders without backing
          new production.
        </p>
        <p style={prose}>
          <strong style={{ color: 'var(--text-primary)' }}>The calculation over 111 years:</strong>
        </p>
        <div style={{
          background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
          borderRadius: 8, padding: '16px 20px', marginBottom: 20,
          fontFamily: 'var(--font-data)', fontSize: 12, lineHeight: 1.9, color: 'var(--text-secondary)',
        }}>
          <div>M2 grew at <span style={{ color: 'var(--thm-green)', fontWeight: 700 }}>6.6% per year</span></div>
          <div>Real GDP grew at <span style={{ color: 'var(--thm-green)', fontWeight: 700 }}>3.0% per year</span></div>
          <div>Excess M2 growth — pure debasement by this measure: <span style={{ color: 'var(--thm-green)', fontWeight: 700 }}>3.5%/yr</span></div>
          <div>CPI inflation over the same period: <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>3.2%/yr</span></div>
        </div>
        <p style={prose}>
          Those last two numbers are nearly identical. M2/GDP and CPI converge to similar answers over
          111 years. Two completely different methods, measuring from different angles, arriving at the
          same neighborhood. That convergence is meaningful — it suggests both are capturing the same
          underlying reality.
        </p>
        <blockquote style={callout}>
          M2/GDP is implicitly the framework behind the Federal Reserve's own 2% inflation target.
          They targeted 2% annual debasement and delivered 3.5%. The overshoot is 75%.
        </blockquote>
        <div style={problem}>
          <div style={problemLabel}>The honest problem</div>
          M2/GDP embeds a Keynesian assumption — that a growing economy genuinely <em>needs</em>{' '}
          proportionally more money. Austrian economics explicitly disputes this. Under the Austrian
          view, a fixed money supply works perfectly well in a growing economy. Prices simply fall as
          productivity improves. The GDP adjustment is not neutral — it accepts a philosophical
          position in a genuine debate.
        </div>
        <p style={{ ...prose, marginTop: 16 }}>
          <strong style={{ color: 'var(--text-primary)' }}>THM_M2GDP produces a benchmark of roughly
          4,300 today.</strong> Modestly higher than the CPI-based benchmark — the two approaches
          mostly agree, which strengthens the case that both are measuring the same debasement from
          different angles.
        </p>

        {/* Approach 3 */}
        <h3 style={h3}>Approach 3 — Raw M2: the purist Austrian view</h3>
        <p style={prose}>
          The third approach strips away all assumptions. M2 is the total count of dollars in
          existence. When that number grows, each existing dollar represents a smaller fraction of
          the total. That is debasement. All of it — not just the part above GDP growth.
        </p>
        <p style={prose}>
          <strong style={{ color: 'var(--text-primary)' }}>The case for it:</strong> This is Austrian
          economics stated precisely. The quantity of money does not determine the welfare of an economy
          — a fixed supply works fine, and the price system adjusts. Any growth in the money supply
          above zero is a dilution of existing holders. M2 is a fact, not a calculation. It requires
          no basket decisions, no hedonic adjustments, no GDP deflator methodology.
        </p>
        <p style={prose}>
          From the site's own thesis — that monetary debasement is the root cause of the distortions
          we chart — raw M2 is the philosophically consistent deflator.
        </p>
        <div style={problem}>
          <div style={problemLabel}>The honest problem</div>
          Run the numbers and the result fails the smell test. Raw M2 grew approximately{' '}
          <strong>1,200 times</strong> since 1913. The 1913 dollar is implied to be worth{' '}
          <strong>0.09 cents today</strong>. People can observably buy things with dollars. That
          observable reality does not match 0.09 cents. Something seems wrong. But what?
        </div>
        <p style={{ ...prose, marginTop: 16 }}>
          <strong style={{ color: 'var(--text-primary)' }}>THM_M2RAW produces a benchmark of roughly
          116,000 today</strong> — orders of magnitude above the other two. The chart requires a log
          scale. The gap is not noise. It has a precise economic interpretation.
        </p>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '40px 0 0' }} />

        {/* Gap analysis */}
        <h2 style={h2}>The gap between M2 and M2/GDP — what it is and why it matters</h2>
        <p style={prose}>
          The difference between THM_M2RAW and THM_M2GDP is approximately 27×. That is almost exactly
          equal to real GDP growth since 1913 — how much bigger the economy became in real terms.
        </p>
        <p style={prose}>
          This is not a coincidence. It is the quantity theory of money working exactly as expected.
          Under sound money, the growing economy would have made everything progressively cheaper.
          Money holders would have received that deflation as silently rising purchasing power.
          Instead, money creation captured it. The gap between the two THM lines — 27× over 111
          years — is the cumulative measure of that capture.
        </p>
        <blockquote style={callout}>
          Under a fixed money supply and 3%/yr real output growth, prices must fall 3%/yr.
          The gap between raw M2 and M2/GDP IS that price decline — the natural output deflation
          that a fixed money supply would have produced.
        </blockquote>
        <p style={prose}>
          This also reframes the smell-test problem with raw M2. The 1913 dollar is not worth 0.09
          cents in purchasing power over goods, because the economy grew 27× and that growth offset
          the monetary dilution in observable price terms. The two statements are both true:
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, margin: '24px 0' }}>
          {[
            {
              color: '#f7931a',
              label: 'Your monetary share was diluted 1,200×',
              sub: 'raw M2. This is what happened to you as a money holder. It is real. It is the Cantillon effect at full scale.',
            },
            {
              color: '#a8ff78',
              label: 'Your purchasing power over goods fell 33×',
              sub: 'CPI/M2GDP. This is what you feel at the grocery store. It is partly offset by economic growth that made goods cheaper — deflation that should have been yours but was captured by money creation.',
            },
          ].map(({ color, label, sub }) => (
            <div key={label} style={{
              background: 'var(--bg-surface)', border: `1px solid ${color}30`,
              borderRadius: 8, padding: '14px 18px',
            }}>
              <div style={{ fontFamily: 'var(--font-data)', fontSize: 12, color, fontWeight: 700, marginBottom: 6 }}>{label}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{sub}</div>
            </div>
          ))}
        </div>
        <p style={prose}>
          The difference between 1,200× dilution and 33× purchasing power loss is 111 years of
          economic growth. Growth that, under sound money, would have compounded silently in your
          purchasing power. Instead it was largely captured upstream by those closest to money creation
          — the Cantillon effect operating at civilizational scale.
        </p>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '40px 0 0' }} />

        {/* Eurodollar */}
        <h2 style={h2}>A fourth dimension: M2 only counts domestic dollars</h2>
        <p style={prose}>
          Raw M2 measures the US domestic money supply. But the dollar is the world reserve currency.
          A significant fraction of all dollars in existence are held outside the United States — in
          foreign central bank reserves, in eurodollar markets, in dollar-denominated trade contracts,
          in the savings of people in dollarizing economies.
        </p>
        <p style={prose}>
          Estimates of offshore dollar holdings vary, but most serious estimates put physical dollar
          currency held abroad at 50–65% of all currency in circulation. The eurodollar market —
          dollar-denominated credit created outside the US banking system entirely — is enormous and
          largely unmeasured. These are dollars that the Federal Reserve did not directly create but
          that exist and circulate and dilute the value of every other dollar.
        </p>
        <p style={prose}>
          <strong style={{ color: 'var(--text-primary)' }}>What this means for THM:</strong> Even raw
          M2 understates true debasement under the strict Austrian view. There are more dollars than
          M2 counts. The true dollar supply is larger than any official measure captures.
        </p>
        <p style={prose}>
          This is intellectually important because it means the 0.09 cents figure from raw M2 is
          actually an <em>upper bound</em> on purchasing power retention — the true answer under
          strict Austrian accounting is worse. We cannot calculate it precisely because the data does
          not exist cleanly. The eurodollar system was built without that visibility, partly by design.
        </p>
        <p style={prose}>
          We note this not to produce a fourth THM calculation — we cannot — but to be honest that
          our most aggressive measure is still a floor, not a ceiling.
        </p>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '40px 0 0' }} />

        {/* Charts */}
        <h2 style={h2}>The three approaches in the data</h2>
        <p style={prose}>
          The charts below show what each approach produces when run from 1913 to the present.
          The divergence is intentional — it shows the range of honest disagreement about where
          the benchmark should be.
        </p>

        <ChartLabel title="Chart 1 — The Three THM Lines (1913–present, log scale) · Index: 1913 = 100" />
        {loading && <ChartLoading />}
        {error && <ChartError msg={`Chart data unavailable: ${error}`} />}
        {data && <Chart1 data={data.thm_variants} />}

        <ChartLabel title="Chart 2 — Purchasing Power of the 1913 Dollar" />
        {loading && <ChartLoading />}
        {error && <ChartError msg={`Chart data unavailable: ${error}`} />}
        {data && <Chart2 data={data.thm_variants} />}

        <ChartLabel title="Chart 3 — The Output Deflation Gap (1913–present, log scale)" />
        {loading && <ChartLoading />}
        {error && <ChartError msg={`Chart data unavailable: ${error}`} />}
        {data && <Chart3 data={data.gap_series} />}

        <ChartLabel title="Chart 4 — The Stolen Deflation (1913–present, linear)" />
        {loading && <ChartLoading />}
        {error && <ChartError msg={`Chart data unavailable: ${error}`} />}
        {data && data.chart4 && <Chart4 data={data.chart4} />}

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '40px 0 0' }} />

        {/* Summary table */}
        <h2 style={h2}>The three approaches side by side</h2>
        <div style={{ overflowX: 'auto', margin: '24px 0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-display)', fontSize: 13 }}>
            <thead>
              <tr>
                {['Approach', 'THM index 2024', 'Dollar worth today', 'Theory', 'Problem'].map((h) => (
                  <th key={h} style={{
                    textAlign: 'left', padding: '10px 14px',
                    background: 'var(--bg-surface)',
                    fontFamily: 'var(--font-data)', fontSize: 10, fontWeight: 700,
                    color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase',
                    borderBottom: '1px solid var(--border-default)',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { approach: 'CPI',             index: '~3,200',   value: '~3 cents',     theory: 'Debasement = price rises via basket survey',     problem: 'Govt has interest in understating; judgment-laden' },
                { approach: 'M2/GDP',          index: '~4,300',   value: '~2.3 cents',   theory: 'Debasement = money growth above real output',     problem: 'Embeds Keynesian assumption re: money demand' },
                { approach: 'Raw M2 (Austrian)', index: '~116,000', value: '~0.09 cents', theory: 'Debasement = any money growth; fixed supply correct', problem: 'Fails smell test — gap explained by output deflation' },
                { approach: 'True supply (eurodollar)', index: 'Unmeasurable', value: '< 0.09 cents', theory: 'Total global dollar dilution', problem: 'Data does not exist' },
              ].map((row, i) => (
                <tr key={row.approach} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                  <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-primary)', fontWeight: 600 }}>{row.approach}</td>
                  <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-subtle)', color: 'var(--thm-green)', fontFamily: 'var(--font-data)', fontSize: 12 }}>{row.index}</td>
                  <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-subtle)', color: 'var(--thm-green)', fontFamily: 'var(--font-data)', fontSize: 12 }}>{row.value}</td>
                  <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', fontSize: 13 }}>{row.theory}</td>
                  <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: 12 }}>{row.problem}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Foreign currency scope note */}
        <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '40px 0 0' }} />
        <h2 style={h2}>A note on foreign currencies</h2>
        <p style={prose}>
          The GDP/M2 framework applies in principle to every currency — each has its own money supply
          and its own real output. A fully consistent implementation would calculate purchasing power
          for the euro, yen, and pound using their own GDP/M2 ratios.
        </p>
        <p style={prose}>
          In practice, we use market exchange rates to bring foreign currencies into the comparison.
          This is a scope decision, not a theoretical one. Building consistent GDP/M2-based purchasing
          power series for multiple currencies with different central bank reporting conventions,
          different monetary aggregate definitions, and different GDP measurement methodologies is a
          significant research project. The currency panel shows how major currencies perform against
          THM when converted at market rates — a meaningful and honest comparison, even if it does not
          decompose each currency's internal monetary dynamics.
        </p>
        <p style={prose}>
          The theoretical extension to GDP/M2-based cross-currency comparison is noted here as
          future research.
        </p>

        {/* What we currently do */}
        <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '40px 0 0' }} />
        <h2 style={h2}>What we currently do, and why we're not sure it's right</h2>
        <p style={prose}>
          We currently use CPI because it produces a THM line legible alongside real-world asset
          performance and is most familiar to readers. We believe it understates true debasement.
          The philosophical home of this site is closer to the Austrian view.
        </p>
        <p style={prose}>
          We are building charts to show all three THM lines simultaneously so readers can see the
          full range of honest disagreement. We intend to offer a toggle on the dashboard charts
          allowing readers to choose which benchmark they find most defensible.
        </p>
        <p style={prose}>
          We do not think there is a definitively correct answer. We think the honest thing is to
          show you the range and explain what each assumes.
        </p>

        {/* Open dialog */}
        <div style={{
          marginTop: 48,
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          borderRadius: 12,
          padding: '28px 32px',
        }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 18,
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: 14,
          }}>
            What we'd like your input on
          </div>
          <p style={{ ...prose, marginBottom: 20 }}>
            This is a genuine open question. If you have a view — on which measure is most honest,
            on what Austrian economics implies for THM calculation, on the eurodollar problem, or on
            the output deflation explanation — we want to hear it.
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
            Share your view →
          </Link>
        </div>

        {/* Bitcoin framing section */}
        <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '40px 0 0' }} />
        <h2 style={h2}>Why THM and Bitcoin are the same question</h2>
        <p style={prose}>
          THM did not emerge from abstract theory. It emerged from a specific question: if Bitcoin
          is the right answer to monetary debasement, what does the destination look like?
        </p>
        <p style={prose}>
          Bitcoin has the properties of sound money: fixed supply of 21 million, no controlling
          authority, issuance that cannot be changed by political convenience. In the long run,
          these properties should make it the hardest money ever created.
        </p>
        <p style={prose}>
          But Bitcoin is currently in an adoption phase. Its price reflects not just its monetary
          properties but the speculation, volatility, and uncertainty of a new monetary technology
          finding its place in the world. Using current Bitcoin as a benchmark would make every
          other asset appear worthless — not because they are, but because Bitcoin's adoption curve
          dominates the chart.
        </p>
        <p style={prose}>
          THM factors out the adoption phase. It asks: what would Bitcoin look like if adoption were
          complete — if the world had already accepted it as the monetary standard and the speculative
          premium had been fully realized? A currency with fixed supply, value growing only with real
          economic productivity, no debasement.
        </p>
        <p style={prose}>
          That is THM. Not Bitcoin today. Bitcoin arrived.
        </p>
        <p style={prose}>
          When you look at the 10-year charts on this site and see Bitcoin approaching or tracking
          the THM line over long windows, you are seeing evidence that the two are converging. The
          adoption phase is shortening the gap. THM is where it ends.
        </p>

        {/* Closing transition */}
        <div style={{
          marginTop: 40,
          background: 'rgba(168,255,120,0.04)',
          border: '1px solid var(--border-accent)',
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
            The lens is defined. Now how to use it.
          </div>
          <p style={{ ...prose, marginBottom: 24 }}>
            You understand what THM is, why it matters, and why calculating it precisely is genuinely
            contested. The dashboard shows markets measured against the THM benchmark we have adopted —
            M2/GDP-based, without a productivity addition, with full acknowledgment of its limits.
            Component 3 takes the next step: given this lens, how should an investor think?
          </p>
          <Link
            to="/lens/investing"
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
            Investing Through the THM Lens — Component 3 →
          </Link>
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
          <div>Research section — Version 3.0 — May 2026</div>
          <div>Current dashboard THM: M2/GDP-based, no productivity addition</div>
          <div>Source data: Federal Reserve FRED, BLS, BEA, Friedman &amp; Schwartz</div>
        </div>

      </div>
    </div>
  );
}
