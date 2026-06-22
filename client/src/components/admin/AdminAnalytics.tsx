import { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts';
import { apiFetch } from '../../lib/apiFetch';

type Range = 7 | 14 | 30;

interface DailyRow {
  date: string;
  uniques: number;
  requests: number;
  pageViews: number;
  bytes: number;
}

interface AnalyticsData {
  daily: DailyRow[];
  totals: { uniques: number; requests: number; pageViews: number; bytes: number };
  countries: { country: string; requests: number }[];
  source: string;
  range: number;
}

function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return String(n);
}

function fmtBytes(b: number): string {
  if (b >= 1e9) return (b / 1e9).toFixed(1) + ' GB';
  if (b >= 1e6) return (b / 1e6).toFixed(1) + ' MB';
  return (b / 1e3).toFixed(1) + ' KB';
}

function fmtDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-default)',
      borderRadius: 10,
      padding: '20px 24px',
    }}>
      <div style={{
        fontFamily: 'var(--font-data)',
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.1em',
        color: 'var(--text-faint)',
        textTransform: 'uppercase',
        marginBottom: 8,
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: 'var(--font-data)',
        fontSize: 28,
        fontWeight: 700,
        color: 'var(--text-primary)',
        letterSpacing: '-0.02em',
        lineHeight: 1,
      }}>
        {value}
      </div>
      {sub && (
        <div style={{
          fontFamily: 'var(--font-data)',
          fontSize: 11,
          color: 'var(--text-faint)',
          marginTop: 6,
        }}>
          {sub}
        </div>
      )}
    </div>
  );
}

function PlaceholderSection({ title, note }: { title: string; note: string }) {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 10,
      padding: '20px 24px',
    }}>
      <div style={{
        fontFamily: 'var(--font-data)',
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.1em',
        color: 'var(--text-faint)',
        textTransform: 'uppercase',
        marginBottom: 12,
      }}>
        {title}
      </div>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 13,
        color: 'var(--text-faint)',
        fontStyle: 'italic',
      }}>
        {note}
      </div>
    </div>
  );
}

export default function AdminAnalytics() {
  const [range, setRange] = useState<Range>(30);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    apiFetch<AnalyticsData>(`/api/analytics?range=${range}`)
      .then((res) => setData(res.data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [range]);

  const chartData = data?.daily.map((d) => ({
    date: fmtDate(d.date),
    Visitors: d.uniques,
    'Page Views': d.pageViews,
  })) ?? [];

  const maxCountryReqs = data?.countries[0]?.requests ?? 1;

  return (
    <div>
      {/* Range selector */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
        {([7, 14, 30] as Range[]).map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            style={{
              fontFamily: 'var(--font-data)',
              fontSize: 11,
              fontWeight: range === r ? 700 : 400,
              letterSpacing: '0.08em',
              color: range === r ? 'var(--thm-green)' : 'var(--text-muted)',
              background: range === r ? 'rgba(168,255,120,0.08)' : 'none',
              border: `1px solid ${range === r ? 'rgba(168,255,120,0.3)' : 'var(--border-subtle)'}`,
              borderRadius: 6,
              padding: '5px 14px',
              cursor: 'pointer',
            }}
          >
            {r}d
          </button>
        ))}
      </div>

      {loading && (
        <div style={{ padding: 32, color: 'var(--text-muted)', fontFamily: 'var(--font-data)', fontSize: 12 }}>
          Loading analytics…
        </div>
      )}

      {!loading && error && (
        <div style={{
          padding: '16px 20px',
          background: 'rgba(248,113,113,0.06)',
          border: '1px solid rgba(248,113,113,0.2)',
          borderRadius: 8,
          fontFamily: 'var(--font-data)',
          fontSize: 12,
          color: 'var(--loss)',
          letterSpacing: '0.04em',
        }}>
          {error.includes('503')
            ? 'Cloudflare analytics not configured. Add CF_ANALYTICS_TOKEN and CF_ZONE_ID to Railway Variables.'
            : `Error: ${error}`}
        </div>
      )}

      {!loading && data && (
        <>
          {/* Stat cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 14,
            marginBottom: 28,
          }}>
            <StatCard label="Unique Visitors" value={fmt(data.totals.uniques)} sub={`last ${range} days`} />
            <StatCard label="Page Views" value={fmt(data.totals.pageViews)} sub={`last ${range} days`} />
            <StatCard label="Requests" value={fmt(data.totals.requests)} sub={`last ${range} days`} />
            <StatCard label="Bandwidth" value={fmtBytes(data.totals.bytes)} sub={`last ${range} days`} />
          </div>

          {/* Line chart */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            borderRadius: 10,
            padding: '20px 24px',
            marginBottom: 20,
          }}>
            <div style={{
              fontFamily: 'var(--font-data)',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: 'var(--text-faint)',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}>
              Traffic over time
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis
                  dataKey="date"
                  tick={{ fontFamily: 'JetBrains Mono', fontSize: 10, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontFamily: 'JetBrains Mono', fontSize: 10, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={fmt}
                  width={40}
                />
                <Tooltip
                  contentStyle={{
                    background: '#0f1117',
                    border: '1px solid #1e293b',
                    borderRadius: 6,
                    fontFamily: 'JetBrains Mono',
                    fontSize: 11,
                  }}
                  labelStyle={{ color: '#94a3b8', marginBottom: 4 }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Legend
                  wrapperStyle={{ fontFamily: 'JetBrains Mono', fontSize: 10, paddingTop: 12 }}
                />
                <Line
                  type="monotone"
                  dataKey="Visitors"
                  stroke="#a8ff78"
                  strokeWidth={1.5}
                  dot={false}
                  activeDot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="Page Views"
                  stroke="#f59e0b"
                  strokeWidth={1.5}
                  dot={false}
                  activeDot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Country breakdown + device placeholder */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              borderRadius: 10,
              padding: '20px 24px',
            }}>
              <div style={{
                fontFamily: 'var(--font-data)',
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: 'var(--text-faint)',
                textTransform: 'uppercase',
                marginBottom: 16,
              }}>
                Countries
              </div>
              {data.countries.map(({ country, requests }) => {
                const pct = Math.round((requests / maxCountryReqs) * 100);
                const share = Math.round((requests / data.totals.requests) * 100);
                return (
                  <div key={country} style={{ marginBottom: 10 }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontFamily: 'var(--font-data)',
                      fontSize: 11,
                      color: 'var(--text-secondary)',
                      marginBottom: 4,
                    }}>
                      <span>{country}</span>
                      <span style={{ color: 'var(--text-faint)' }}>{share}%</span>
                    </div>
                    <div style={{
                      height: 3,
                      background: 'var(--border-subtle)',
                      borderRadius: 2,
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${pct}%`,
                        background: 'var(--thm-green)',
                        borderRadius: 2,
                        opacity: 0.7,
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <PlaceholderSection
              title="Device Types"
              note="Add the Cloudflare Web Analytics beacon to unlock device type, top pages, and referrer data."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <PlaceholderSection title="Top Pages" note="Requires Cloudflare Web Analytics beacon." />
            <PlaceholderSection title="Top Referrers" note="Requires Cloudflare Web Analytics beacon." />
          </div>
        </>
      )}
    </div>
  );
}
