import { Link } from 'react-router-dom';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  Tooltip, ReferenceLine, CartesianGrid,
} from 'recharts';
import { useTHMChartData } from '../hooks/useTHMChartData';
import type { THMVariantPoint, GapSeriesPoint } from '../hooks/useTHMChartData';

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

// Chart 1 — The Three THM Lines, log scale
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
                thm_cpi:   'THM — CPI',
                thm_m2gdp: 'THM — M2/GDP',
                thm_m2raw: 'THM — Raw M2',
                dollar:    'Dollar (1913)',
              };
              return [value.toFixed(0), labels[name] ?? name];
            }}
          />
          <ReferenceLine
            x={1971}
            stroke="rgba(255,255,255,0.15)"
            strokeDasharray="4 4"
            label={{ value: '1971', position: 'top', fill: 'var(--text-faint)', fontFamily: 'var(--font-data)', fontSize: 9 }}
          />
          {/* Dollar flat line at 100 */}
          <Line dataKey="dollar"    stroke="rgba(255,255,255,0.2)" dot={false} strokeWidth={1} strokeDasharray="4 4" name="dollar" />
          <Line dataKey="thm_cpi"   stroke="#60a5fa" dot={false} strokeWidth={1.5} name="thm_cpi" />
          <Line dataKey="thm_m2gdp" stroke="#a8ff78" dot={false} strokeWidth={1.5} name="thm_m2gdp" />
          <Line dataKey="thm_m2raw" stroke="#f7931a" dot={false} strokeWidth={1.5} name="thm_m2raw" />
        </LineChart>
      </ResponsiveContainer>
      <div style={{
        display: 'flex',
        gap: 20,
        flexWrap: 'wrap',
        marginTop: 12,
        fontFamily: 'var(--font-data)',
        fontSize: 10,
        color: 'var(--text-muted)',
        letterSpacing: '0.04em',
      }}>
        {[
          { color: '#60a5fa', label: 'THM — Inflation Index (CPI)' },
          { color: '#a8ff78', label: 'THM — M2/GDP' },
          { color: '#f7931a', label: 'THM — Raw M2 (Austrian)' },
          { color: 'rgba(255,255,255,0.3)', label: 'Dollar held as cash' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 20, height: 1.5, background: color }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

// Chart 2 — Purchasing power of the 1913 dollar (THM inverted), linear scale
function Chart2({ data }: { data: THMVariantPoint[] }) {
  const chartData = data.map((d) => ({
    year: d.year,
    pp_cpi:    100 / d.thm_cpi * 100,
    pp_m2gdp:  100 / d.thm_m2gdp * 100,
    pp_m2raw:  100 / d.thm_m2raw * 100,
  }));

  // Find endpoint values for labels
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
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => String(v)}
            interval={9}
          />
          <YAxis
            tick={{ fontFamily: 'var(--font-data)', fontSize: 10, fill: 'var(--text-faint)' }}
            tickLine={false}
            axisLine={false}
            width={44}
            tickFormatter={(v: number) => `${v.toFixed(v < 1 ? 2 : 0)}¢`}
          />
          <Tooltip
            contentStyle={chartTooltipStyle}
            labelStyle={{ fontFamily: 'var(--font-data)', fontSize: 10, color: 'var(--text-muted)', marginBottom: 6 }}
            formatter={(value: number, name: string) => {
              const labels: Record<string, string> = {
                pp_cpi:   'CPI method',
                pp_m2gdp: 'M2/GDP method',
                pp_m2raw: 'Raw M2 method',
              };
              return [`${value.toFixed(3)}¢`, labels[name] ?? name];
            }}
          />
          <ReferenceLine
            x={1971}
            stroke="rgba(255,255,255,0.15)"
            strokeDasharray="4 4"
            label={{ value: '1971', position: 'top', fill: 'var(--text-faint)', fontFamily: 'var(--font-data)', fontSize: 9 }}
          />
          <Line dataKey="pp_cpi"   stroke="#60a5fa" dot={false} strokeWidth={1.5} name="pp_cpi" />
          <Line dataKey="pp_m2gdp" stroke="#a8ff78" dot={false} strokeWidth={1.5} name="pp_m2gdp" />
          <Line dataKey="pp_m2raw" stroke="#f7931a" dot={false} strokeWidth={1.5} name="pp_m2raw" />
        </LineChart>
      </ResponsiveContainer>
      {endLabels.length > 0 && (
        <div style={{
          display: 'flex',
          gap: 20,
          flexWrap: 'wrap',
          marginTop: 8,
          fontFamily: 'var(--font-data)',
          fontSize: 10,
          color: 'var(--text-muted)',
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

// Chart 3 — M2 index vs GDP index vs M2/GDP ratio (all 1913 = 100)
function Chart3({ data }: { data: GapSeriesPoint[] }) {
  return (
    <div style={{ margin: '12px 0 28px' }}>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
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
                m2_index:    'M2 Index',
                gdp_index:   'Real GDP Index',
                ratio_index: 'M2/GDP Ratio',
              };
              return [value.toFixed(0), labels[name] ?? name];
            }}
          />
          <ReferenceLine
            x={1971}
            stroke="rgba(255,255,255,0.15)"
            strokeDasharray="4 4"
            label={{ value: '1971', position: 'top', fill: 'var(--text-faint)', fontFamily: 'var(--font-data)', fontSize: 9 }}
          />
          <Line dataKey="m2_index"    stroke="#f7931a" dot={false} strokeWidth={1.5} name="m2_index" />
          <Line dataKey="gdp_index"   stroke="#60a5fa" dot={false} strokeWidth={1.5} name="gdp_index" />
          <Line dataKey="ratio_index" stroke="#a8ff78" dot={false} strokeWidth={1.5} strokeDasharray="5 3" name="ratio_index" />
        </LineChart>
      </ResponsiveContainer>
      <div style={{
        display: 'flex',
        gap: 20,
        flexWrap: 'wrap',
        marginTop: 12,
        fontFamily: 'var(--font-data)',
        fontSize: 10,
        color: 'var(--text-muted)',
        letterSpacing: '0.04em',
      }}>
        {[
          { color: '#f7931a', label: 'M2 Index (1913 = 100)', dashed: false },
          { color: '#60a5fa', label: 'Real GDP Index (1913 = 100)', dashed: false },
          { color: '#a8ff78', label: 'M2/GDP Ratio (1913 = 100)', dashed: true },
        ].map(({ color, label, dashed }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="20" height="4">
              <line
                x1="0" y1="2" x2="20" y2="2"
                stroke={color}
                strokeWidth="1.5"
                strokeDasharray={dashed ? '5 3' : undefined}
              />
            </svg>
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LearnTHM() {
  const { data, loading, error } = useTHMChartData();

  return (
    <div style={{ paddingTop: 56 }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 40px 80px' }}>

        {/* Back link */}
        <div style={{ marginBottom: 32 }}>
          <Link
            to="/learn"
            style={{
              fontFamily: 'var(--font-data)',
              fontSize: 11,
              color: 'var(--text-muted)',
              textDecoration: 'none',
              letterSpacing: '0.06em',
            }}
          >
            ← Learn
          </Link>
        </div>

        {/* Title */}
        <div style={{
          fontFamily: 'var(--font-data)',
          fontSize: 11,
          color: 'var(--thm-green)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: 12,
        }}>
          Methodology
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 32,
          fontWeight: 800,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
          marginBottom: 8,
          lineHeight: 1.2,
        }}>
          THM — The Benchmark That Changes Everything
        </h1>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: 14,
          color: 'var(--text-muted)',
          marginBottom: 12,
          lineHeight: 1.5,
        }}>
          How we calculate the fixed ruler, why it's hard, and why the question matters
        </p>
        <div style={{
          fontFamily: 'var(--font-data)',
          fontSize: 11,
          color: 'var(--text-faint)',
          fontStyle: 'italic',
          marginBottom: 48,
        }}>
          This page is different from the rest of the site. Most pages show you data and explain
          what it means. This one shows you a genuine open question — one we've wrestled with and
          haven't fully resolved. We think you deserve to see the work.
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
          any honest benchmark. An asset praised as a safe haven may have quietly failed at its
          only job.
        </p>
        <p style={prose}>
          This is the founding problem of FreeMarketWatch. <strong style={{ color: 'var(--text-primary)' }}>Fiat
          money is a distorted lens. You cannot understand what anything is truly worth until you
          have a fixed ruler to measure it against.</strong>
        </p>
        <p style={prose}>
          THM — Theoretical Hard Money — is that ruler.
        </p>
        <p style={prose}>
          THM answers a specific question: <em>if money had been honest — if it had held its
          purchasing power and grown only with real economic productivity — where would that
          benchmark be today?</em>
        </p>
        <p style={prose}>
          Everything above the THM line on our charts is genuinely gaining purchasing power.
          Everything below it is losing ground, no matter what the dollar price says. Assets that
          look like winners in fiat terms often look very different when measured against THM. That
          difference is the reality that fiat obscures.
        </p>
        <p style={prose}>
          No other financial site uses this benchmark. We think that is a problem. Understanding
          what anything is truly worth requires it.
        </p>
        <p style={prose}>
          But THM is only as good as the methodology behind it. Which is where this conversation
          gets hard.
        </p>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '40px 0 0' }} />

        {/* Section 2 */}
        <h2 style={h2}>The central problem: what is the right measure of debasement?</h2>
        <p style={prose}>
          To calculate where THM should be today, we need to know how much the dollar has been
          debased since we started measuring. That sounds straightforward. It isn't.
        </p>
        <p style={prose}>
          There are three fundamentally different ways to answer that question. Each is grounded
          in a different theory of what money is and what debasement means. Each produces a
          different THM line. And each has a genuine intellectual case behind it.
        </p>

        {/* Approach 1 */}
        <h3 style={h3}>Approach 1: Inflation indexes <span style={dataRef}>(what we currently use)</span></h3>
        <p style={prose}>
          Inflation indexes — CPI, Truflation, the MIT Billion Prices Project — measure debasement
          by tracking what a basket of goods costs over time. When that basket costs more dollars,
          the dollar has lost purchasing power.
        </p>
        <p style={prose}>
          These are philosophically the same approach. CPI uses a government-defined basket and
          government survey methodology. Truflation uses real-time private price data and publishes
          its methodology openly. Both are asking: what does stuff cost now versus then?
        </p>
        <p style={prose}>
          <strong style={{ color: 'var(--text-primary)' }}>The case for this approach:</strong> It's
          intuitive. It maps directly to lived experience. When people say "my dollar doesn't go as
          far," they mean roughly what CPI is measuring. Over 111 years, CPI says the 1913 dollar
          is worth about <span style={dataRef}>3 cents today</span>.
        </p>
        <div style={problem}>
          <div style={problemLabel}>The honest problem</div>
          Inflation indexes are not facts. They are calculations built on thousands of judgment
          calls: which goods go in the basket (changed dramatically since 1913), hedonic adjustment
          (when a car gets more features, its measured price is reduced — suppressing inflation),
          substitution (when beef gets expensive and people buy chicken, the basket shifts —
          suppressing inflation), and geometric weighting (a 1996 methodology change alone reduced
          measured CPI by an estimated 0.5–1% per year going forward). Independent measures like
          Truflation and the MIT Billion Prices Project consistently show inflation running 1–3%
          higher than official CPI. The bias runs in one direction — downward — and it is set by
          the same government that benefits financially from understating it.
        </div>
        <p style={{ ...prose, marginTop: 16 }}>
          CPI is not useless. But when you use it to define THM, you are accepting the government's
          answer to a question the government has a financial interest in understating. A THM built
          on CPI is probably set too low — it clears a bar that is easier than the honest one.
        </p>

        {/* Approach 2 */}
        <h3 style={h3}>Approach 2: M2 adjusted for real economic output <span style={dataRef}>(M2/GDP)</span></h3>
        <p style={prose}>
          This approach starts from a different theory. Instead of measuring what stuff costs, it
          measures how much the money supply has grown above what the real economy needed.
        </p>
        <p style={prose}>
          The logic: a larger economy needs more money to facilitate more transactions. If real GDP
          doubles and the money supply stays flat, prices fall by half. So to keep prices stable,
          the money supply needs to grow in line with GDP — and under this philosophy, that growth
          is not debasement. Debasement is the money growth <em>above</em> real output growth —
          the excess that dilutes existing holders without backing new production.
        </p>
        <p style={prose}>
          <strong style={{ color: 'var(--text-primary)' }}>The calculation over 111 years:</strong>
        </p>
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          borderRadius: 8,
          padding: '16px 20px',
          marginBottom: 20,
          fontFamily: 'var(--font-data)',
          fontSize: 12,
          lineHeight: 1.9,
          color: 'var(--text-secondary)',
        }}>
          <div>M2 grew at <span style={{ color: 'var(--thm-green)', fontWeight: 700 }}>6.6% per year</span></div>
          <div>Real GDP grew at <span style={{ color: 'var(--thm-green)', fontWeight: 700 }}>3.0% per year</span></div>
          <div>Excess M2 growth — pure debasement by this measure: <span style={{ color: 'var(--thm-green)', fontWeight: 700 }}>3.5% per year</span></div>
          <div>CPI inflation over the same period: <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>3.2% per year</span></div>
        </div>
        <p style={prose}>
          Those last two numbers are nearly identical. M2/GDP and CPI converge to almost the same
          answer over 111 years — 2.3 cents vs 3.1 cents for the 1913 dollar. That convergence is
          the validation: two completely different methods, measuring from different angles, arriving
          at the same place.
        </p>
        <blockquote style={callout}>
          M2/GDP is, implicitly, the framework behind the Federal Reserve's own 2% inflation target.
          The Fed targeted 2% debasement per year and delivered 3.5%. The overshoot is 75%.
        </blockquote>
        <p style={prose}>
          The Fed's reasoning: potential real GDP growth is roughly 2–3% per year. The money supply
          should grow roughly in line with that. Therefore: target 2% inflation. In other words, the
          Fed is explicitly targeting money growth of approximately real GDP growth plus 2%. M2/GDP
          measures how much money growth <em>actually</em> exceeded real output. They targeted 2%
          excess. The actual number over 111 years was 3.5%.
        </p>
        <div style={problem}>
          <div style={problemLabel}>The honest problem</div>
          M2/GDP embeds a Keynesian assumption — that a growing economy genuinely <em>needs</em>{' '}
          proportionally more money. Austrian economics explicitly disputes this. Under the Austrian
          view, a fixed money supply works perfectly well in a growing economy. Prices simply fall
          as productivity improves. The GDP adjustment is not neutral — it is accepting a
          philosophical position in a genuine debate.
        </div>

        {/* Approach 3 */}
        <h3 style={h3}>Approach 3: Raw M2 <span style={dataRef}>(the purist Austrian view)</span></h3>
        <p style={prose}>
          The third approach strips away all assumptions. M2 is the total count of dollars in
          existence. When that number grows, each existing dollar represents a smaller fraction of
          the total. That is debasement. All of it, not just the part above GDP growth.
        </p>
        <p style={prose}>
          <strong style={{ color: 'var(--text-primary)' }}>The case for this approach:</strong> It
          is the Austrian economics argument in its most precise form. The quantity of money doesn't
          determine the welfare of an economy — a fixed supply works fine, the price system adjusts.
          So any growth in the money supply above zero is a dilution of existing holders. M2 is a
          fact, not a calculation. It requires no basket decisions, no hedonic adjustments, no GDP
          deflator methodology. If there are 1,200 times as many dollars as in 1913, each dollar is
          worth 1/1,200th of what it was. That is the math.
        </p>
        <p style={prose}>
          From this site's own thesis — that monetary debasement is the root cause of the
          distortions we chart — raw M2 is the philosophically consistent deflator.
        </p>
        <div style={problem}>
          <div style={problemLabel}>The honest problem</div>
          Run the numbers and the result fails the smell test. Raw M2 grew approximately{' '}
          <strong>1,200 times</strong> since 1913. The implied purchasing power of the 1913 dollar
          is <strong>0.09 cents</strong> — not 3 cents as CPI suggests, but less than a tenth of a
          cent. People can observably buy things with dollars. That observable reality doesn't match
          0.09 cents.
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '40px 0 0' }} />

        {/* Section 3 */}
        <h2 style={h2}>What the gap between M2 and M2/GDP is actually telling us</h2>
        <p style={prose}>
          The difference between raw M2 and M2/GDP is almost exactly equal to real GDP growth —
          roughly 3% per year, compounded over 111 years. That gap is not noise. It is a signal.
          And it has a precise economic interpretation.
        </p>
        <p style={prose}>
          Under a fixed money supply in a growing economy — which is what Austrian economics
          prescribes — prices would fall as more goods are produced per dollar. The rate of that
          price decline would equal the rate of real output growth. This is healthy, natural
          deflation: more abundance per unit of money.
        </p>
        <p style={prose}>
          The gap between raw M2 and M2/GDP is <em>exactly that deflation</em> — the purchasing
          power gains that would have accrued to money holders in a hard money world, as economic
          growth made everything progressively cheaper.
        </p>
        <blockquote style={callout}>
          Raw M2 says the dollar was diluted 1,200-fold. But 56-fold of that dilution was "paid
          back" through real economic growth that made goods cheaper. The net dilution felt in
          observable purchasing power was 33-fold — which is what CPI and M2/GDP both show.
        </blockquote>
        <p style={prose}>
          The quantity theory of money makes this precise: if the money supply is fixed and real
          output grows at 3%/yr, prices must fall at 3%/yr. The gap between raw M2 and M2/GDP
          is exactly that 3%/yr price decline — the productivity deflation that should have
          happened but was confiscated by money creation instead.
        </p>
        <p style={prose}>
          Over 111 years, US real GDP growth of 3%/yr breaks down approximately as:
        </p>
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          borderRadius: 8,
          padding: '16px 20px',
          marginBottom: 20,
          fontFamily: 'var(--font-data)',
          fontSize: 12,
          lineHeight: 1.9,
          color: 'var(--text-secondary)',
        }}>
          <div>Productivity growth (more output per worker): <span style={{ color: 'var(--thm-green)' }}>~1.5–2%/yr</span></div>
          <div>Labor force growth (more workers): <span style={{ color: 'var(--thm-green)' }}>~1–1.2%/yr</span></div>
          <div>Capital deepening (more tools per worker): <span style={{ color: 'var(--thm-green)' }}>~0.5%/yr</span></div>
        </div>
        <p style={prose}>
          Under a fixed money supply, all three would produce falling prices, not just the
          productivity component. The "natural" deflation rate in a healthy growing economy
          isn't just productivity — it's total real output growth. Historically that has been
          around 3% per year. The original THM assumption of 2% annual productivity growth was
          a reasonable estimate. The data suggests the honest number is closer to 3%.
        </p>

        {/* Charts */}
        <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '40px 0 0' }} />
        <h2 style={h2}>The three approaches in the data</h2>
        <p style={prose}>
          The charts below show what each approach produces when run from 1913 to the present.
          The divergence is intentional — it shows you the range of honest disagreement about
          where the benchmark should be.
        </p>

        <ChartLabel title="Chart 1 — The Three THM Lines (1913–present, log scale) · Index: 1913 = 100" />
        {loading && <ChartLoading />}
        {error && <ChartError msg={`Chart data unavailable: ${error}`} />}
        {data && <Chart1 data={data.thm_variants} />}

        <ChartLabel title="Chart 2 — Purchasing Power of the 1913 Dollar" />
        {loading && <ChartLoading />}
        {error && <ChartError msg={`Chart data unavailable: ${error}`} />}
        {data && <Chart2 data={data.thm_variants} />}

        <ChartLabel title="Chart 3 — The Productivity Deflation Gap" />
        {loading && <ChartLoading />}
        {error && <ChartError msg={`Chart data unavailable: ${error}`} />}
        {data && <Chart3 data={data.gap_series} />}

        {/* Summary table */}
        <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '40px 0 0' }} />
        <h2 style={h2}>The three approaches side by side</h2>

        <div style={{ overflowX: 'auto', margin: '24px 0' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontFamily: 'var(--font-display)',
            fontSize: 13,
          }}>
            <thead>
              <tr>
                {['Approach', '1913 dollar today', 'Theory of debasement', 'Problem'].map((h) => (
                  <th key={h} style={{
                    textAlign: 'left',
                    padding: '10px 14px',
                    background: 'var(--bg-surface)',
                    fontFamily: 'var(--font-data)',
                    fontSize: 10,
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    borderBottom: '1px solid var(--border-default)',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                {
                  approach: 'CPI / Truflation',
                  value: '~3 cents',
                  theory: 'Debasement = price rises measured by basket',
                  problem: 'Government has interest in understating; basket choices are judgment calls',
                },
                {
                  approach: 'M2/GDP',
                  value: '~2.3 cents',
                  theory: 'Debasement = money growth above real output',
                  problem: 'Embeds Keynesian assumption that growing economies need more money',
                },
                {
                  approach: 'Raw M2 (Austrian)',
                  value: '~0.09 cents',
                  theory: 'Debasement = any money growth; fixed supply is correct',
                  problem: 'Fails observable reality check; gap explained by natural productivity deflation',
                },
              ].map((row, i) => (
                <tr key={row.approach} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                  <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-primary)', fontWeight: 600 }}>{row.approach}</td>
                  <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-subtle)', color: 'var(--thm-green)', fontFamily: 'var(--font-data)', fontSize: 12 }}>{row.value}</td>
                  <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>{row.theory}</td>
                  <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: 12 }}>{row.problem}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p style={prose}>
          The THM line moves higher as you move down this table. The more honest the deflator by
          the site's own thesis, the higher the bar — and the harder any asset has to work to
          clear it.
        </p>

        {/* Two true things */}
        <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '40px 0 0' }} />
        <h2 style={h2}>Two things that are both true and measuring different things</h2>
        <p style={prose}>
          <strong style={{ color: 'var(--text-primary)' }}>Dilution of monetary share</strong>{' '}
          (raw M2): your 1913 dollar now represents 1/1,200th of the total money stock it once
          did. This is what happened to you as a money <em>holder</em>. It is real. It is the
          Cantillon effect operating at full scale.
        </p>
        <p style={prose}>
          <strong style={{ color: 'var(--text-primary)' }}>Loss of purchasing power over goods</strong>{' '}
          (CPI/M2/GDP): your 1913 dollar now buys about 1/33rd of the goods it once did. This
          is what you <em>feel</em> at the grocery store. It is also real. It is partly offset by
          the economic growth that made goods cheaper — the productivity deflation that should
          have been yours but was largely confiscated by money creation.
        </p>
        <p style={prose}>
          Both numbers are true. They are measuring different aspects of the same theft. The first
          tells you how much was taken. The second tells you how much you actually lost after the
          economy grew around you.
        </p>
        <p style={prose}>
          The difference between them — roughly 36-fold — is the economic growth of the past 111
          years. Growth that, under sound money, would have compounded silently in your purchasing
          power. Instead it was largely captured by those closest to the money creation.
        </p>
        <p style={prose}>
          That is the story this site tells. THM is how we tell it with data.
        </p>

        {/* Where we are */}
        <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '40px 0 0' }} />
        <h2 style={h2}>Where we are — and what we're asking</h2>
        <p style={prose}>
          We currently use CPI because it produces a THM line legible alongside real-world asset
          performance and is most familiar to readers encountering this framework for the first time.
        </p>
        <p style={prose}>
          We think this understates true debasement. The philosophical home of this site is closer
          to the Austrian view. But we haven't resolved the gap between what the Austrian view
          implies and what observable reality shows — other than the productivity deflation
          explanation above, which we find compelling but not yet definitive.
        </p>
        <p style={prose}>
          We are considering showing all three THM lines simultaneously as a toggle on the charts —
          so readers can see not just the benchmark, but the range of honest disagreement about
          where it should be.
        </p>
        <p style={prose}>
          <strong style={{ color: 'var(--text-primary)' }}>We are also genuinely asking for your
          input.</strong> This is not a rhetorical invitation. The methodology of THM is an open
          question, and serious readers who have thought carefully about monetary economics may
          see things we haven't. If you have a view on which approach is most honest, on what
          Austrian economics actually implies for THM calculation, or on whether the productivity
          deflation explanation closes the gap — we want to hear it.
        </p>

        <div style={{ marginTop: 32 }}>
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

        {/* Footer note */}
        <div style={{
          marginTop: 64,
          paddingTop: 24,
          borderTop: '1px solid var(--border-subtle)',
          fontFamily: 'var(--font-data)',
          fontSize: 11,
          color: 'var(--text-faint)',
          lineHeight: 1.7,
        }}>
          <div>Methodology — Version 2.0 — May 2026</div>
          <div>Current THM: CPI-based, 2% annual productivity growth assumption</div>
          <div>Under review: M2/GDP basis, 3% natural deflation rate</div>
          <div>Source data: Federal Reserve FRED, BLS, BEA, Friedman &amp; Schwartz</div>
        </div>

      </div>
    </div>
  );
}
