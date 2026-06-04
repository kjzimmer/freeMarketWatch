import { useState, useMemo } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  Tooltip, ReferenceLine, CartesianGrid,
} from 'recharts';
import type { PanelGroup, WindowYears, BTCClassification, ChartDataPoint } from '../types';
import { SERIES_COLORS, PANEL_CONFIG } from '../types';
import { useSeriesData } from '../hooks/useSeriesData';
import DrillDownModal from './DrillDownModal';

interface ChartPanelProps {
  group: PanelGroup;
  window: WindowYears;
  btcAs: BTCClassification;
}

// ── Custom Tooltip ──────────────────────────────────────────────────────────

interface TooltipProps {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}

function ChartTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;

  const sorted = [...payload].sort((a, b) => b.value - a.value);

  return (
    <div style={{
      background: 'rgba(10,12,18,0.95)',
      border: '1px solid var(--border-accent)',
      borderRadius: 8,
      padding: '10px 14px',
      fontFamily: 'var(--font-data)',
      minWidth: 160,
    }}>
      <div style={{
        fontSize: 10,
        color: 'var(--text-muted)',
        marginBottom: 8,
        letterSpacing: '0.06em',
      }}>
        {label}
      </div>
      {sorted.map((entry) => {
        const isThm = entry.name === 'THM';
        return (
          <div key={entry.name} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 16,
            marginBottom: 4,
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{
                display: 'inline-block',
                width: 8,
                height: isThm ? 2 : 8,
                borderRadius: isThm ? 0 : '50%',
                background: entry.color,
                flexShrink: 0,
              }} />
              <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                {entry.name}
              </span>
            </span>
            <span style={{
              fontSize: 11,
              color: entry.value >= 100 ? 'var(--gain-green)' : 'var(--loss-red)',
              fontWeight: 600,
            }}>
              {entry.value.toFixed(1)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Endpoint Summary ────────────────────────────────────────────────────────

interface EndpointSummaryProps {
  chartData: ChartDataPoint[];
  tickers: string[];
  hiddenSeries: Set<string>;
  onToggle: (ticker: string) => void;
}

function EndpointSummary({ chartData, tickers, hiddenSeries, onToggle }: EndpointSummaryProps) {
  const lastRow = chartData[chartData.length - 1];
  if (!lastRow) return null;

  const entries = tickers
    .map((t) => ({ ticker: t, value: lastRow[t] as number | undefined }))
    .filter((e) => e.value !== undefined)
    .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '6px 16px',
      paddingTop: 12,
      borderTop: '1px solid var(--border-subtle)',
      marginTop: 4,
    }}>
      {entries.map(({ ticker, value }) => {
        const idx = value ?? 100;
        const isHidden = hiddenSeries.has(ticker);
        const isThm = ticker === 'THM';
        const color = SERIES_COLORS[ticker] ?? '#888';

        return (
          <button
            key={ticker}
            onClick={() => onToggle(ticker)}
            title={isHidden ? 'Show series' : 'Hide series'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              fontFamily: 'var(--font-data)',
              fontSize: 10,
              opacity: isHidden ? 0.35 : 1,
              transition: 'opacity 0.15s',
              padding: '2px 0',
            }}
          >
            <span style={{
              display: 'inline-block',
              width: isThm ? 10 : 7,
              height: isThm ? 2 : 7,
              borderRadius: isThm ? 0 : '50%',
              background: color,
              flexShrink: 0,
            }} />
            <span style={{ color: 'var(--text-muted)' }}>{ticker}</span>
            <span style={{
              color: idx >= 100 ? 'var(--gain-green)' : 'var(--loss-red)',
              fontWeight: 600,
            }}>
              {idx.toFixed(1)}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ── Chart Panel ─────────────────────────────────────────────────────────────

export default function ChartPanel({ group, window, btcAs }: ChartPanelProps) {
  const [logScale, setLogScale] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set());

  const { chartData, tickers, loading, error } = useSeriesData(group, window, btcAs);
  const config = PANEL_CONFIG[group];

  // Thin the date labels so they don't overlap
  const xTickCount = window === 1 ? 6 : window === 5 ? 6 : 6;

  const xTicks = useMemo(() => {
    if (!chartData.length) return [];
    const step = Math.max(1, Math.floor(chartData.length / xTickCount));
    return chartData
      .filter((_, i) => i % step === 0 || i === chartData.length - 1)
      .map((d) => d.date as string);
  }, [chartData, xTickCount]);

  function toggleSeries(ticker: string) {
    setHiddenSeries((prev) => {
      const next = new Set(prev);
      if (next.has(ticker)) next.delete(ticker);
      else next.add(ticker);
      return next;
    });
  }

  function formatXTick(val: string) {
    if (!val) return '';
    const d = new Date(val);
    if (isNaN(d.getTime())) return val;
    return window === 1
      ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : d.toLocaleDateString('en-US', { year: '2-digit', month: 'short' });
  }

  // ── Render: loading ──
  if (loading) {
    return (
      <div style={cardStyle}>
        <PanelHeader config={config} onLog={() => {}} logScale={false} onMethod={() => {}} />
        <div style={{
          height: 260,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-faint)',
          fontFamily: 'var(--font-data)',
          fontSize: 11,
          letterSpacing: '0.1em',
        }}>
          LOADING DATA...
        </div>
      </div>
    );
  }

  // ── Render: error ──
  if (error) {
    return (
      <div style={cardStyle}>
        <PanelHeader config={config} onLog={() => {}} logScale={false} onMethod={() => {}} />
        <div style={{
          height: 260,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          color: 'var(--loss-red)',
          fontFamily: 'var(--font-data)',
          fontSize: 11,
        }}>
          <span style={{ fontSize: 18, opacity: 0.5 }}>⚠</span>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  // Compute YAxis domain for log scale (avoid log(0))
  const yDomain: [number | string, number | string] = logScale ? ['auto', 'auto'] : ['auto', 'auto'];

  return (
    <>
      <div style={cardStyle}>
        <PanelHeader
          config={config}
          logScale={logScale}
          onLog={() => setLogScale((v) => !v)}
          onMethod={() => setShowModal(true)}
        />

        <ResponsiveContainer width="100%" height={260}>
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="2 4"
              stroke="rgba(255,255,255,0.04)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              ticks={xTicks}
              tickFormatter={formatXTick}
              tick={{ fill: 'var(--text-faint)', fontSize: 9, fontFamily: 'var(--font-data)' }}
              axisLine={{ stroke: 'var(--border-subtle)' }}
              tickLine={false}
            />
            <YAxis
              scale={logScale ? 'log' : 'auto'}
              domain={yDomain}
              allowDataOverflow={logScale}
              tick={{ fill: 'var(--text-faint)', fontSize: 9, fontFamily: 'var(--font-data)' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => {
                if (v >= 10000) return `${(v / 1000).toFixed(0)}k`;
                if (v >= 1000)  return `${(v / 1000).toFixed(1)}k`;
                return String(Math.round(v));
              }}
            />
            <Tooltip
              content={<ChartTooltip />}
              cursor={{ stroke: 'rgba(255,255,255,0.08)', strokeWidth: 1 }}
            />
            <ReferenceLine
              y={100}
              stroke="rgba(255,255,255,0.12)"
              strokeDasharray="4 4"
            />

            {/* THM first — always rendered, always visible */}
            {!hiddenSeries.has('THM') && (
              <Line
                key="THM"
                type="monotone"
                dataKey="THM"
                stroke={SERIES_COLORS.THM}
                strokeWidth={2.5}
                strokeDasharray="6 3"
                dot={false}
                activeDot={{ r: 3, strokeWidth: 0 }}
                isAnimationActive={false}
              />
            )}

            {/* All other tickers */}
            {tickers
              .filter((t) => t !== 'THM' && !hiddenSeries.has(t))
              .map((ticker) => (
                <Line
                  key={ticker}
                  type="monotone"
                  dataKey={ticker}
                  stroke={SERIES_COLORS[ticker] ?? '#888888'}
                  strokeWidth={1.5}
                  dot={false}
                  activeDot={{ r: 3, strokeWidth: 0 }}
                  isAnimationActive={false}
                />
              ))}
          </LineChart>
        </ResponsiveContainer>

        <EndpointSummary
          chartData={chartData}
          tickers={tickers}
          hiddenSeries={hiddenSeries}
          onToggle={toggleSeries}
        />
      </div>

      {showModal && (
        <DrillDownModal group={group} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}

// ── Panel Header ────────────────────────────────────────────────────────────

interface PanelHeaderProps {
  config: { title: string; subtitle: string };
  logScale: boolean;
  onLog: () => void;
  onMethod: () => void;
}

function PanelHeader({ config, logScale, onLog, onMethod }: PanelHeaderProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: 12,
    }}>
      <div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 13,
          fontWeight: 700,
          color: 'var(--text-primary)',
          letterSpacing: '0.02em',
          marginBottom: 3,
        }}>
          {config.title}
        </div>
        <div style={{
          fontFamily: 'var(--font-data)',
          fontSize: 10,
          color: 'var(--text-secondary)',
          letterSpacing: '0.04em',
        }}>
          {config.subtitle}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <button
          onClick={onLog}
          title="Toggle log scale"
          style={{
            fontFamily: 'var(--font-data)',
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.1em',
            padding: '3px 8px',
            borderRadius: 4,
            border: logScale
              ? '1px solid var(--border-accent)'
              : '1px solid var(--border-subtle)',
            background: logScale ? 'var(--thm-green-dim)' : 'transparent',
            color: logScale ? 'var(--thm-green)' : 'var(--text-faint)',
            transition: 'all 0.15s',
          }}
        >
          {logScale ? 'LOG' : 'LIN'}
        </button>

        <button
          onClick={onMethod}
          title="View methodology"
          style={{
            fontFamily: 'var(--font-data)',
            fontSize: 9,
            fontWeight: 600,
            letterSpacing: '0.08em',
            padding: '3px 8px',
            borderRadius: 4,
            border: '1px solid var(--border-subtle)',
            background: 'var(--thm-green-dim)',
            color: 'var(--thm-green)',
            transition: 'all 0.15s',
          }}
        >
          METHOD
        </button>
      </div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, rgba(15,20,30,0.9), rgba(10,14,22,0.95))',
  border: '1px solid var(--border-default)',
  borderRadius: 12,
  padding: '20px 20px 16px',
};
