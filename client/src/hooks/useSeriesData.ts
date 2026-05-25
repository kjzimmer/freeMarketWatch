import { useState, useEffect } from 'react';
import type { GroupData, PanelGroup, WindowYears, BTCClassification, ChartDataPoint } from '../types';

interface UseSeriesDataResult {
  chartData: ChartDataPoint[];
  tickers: string[];
  loading: boolean;
  error: string | null;
}

export function useSeriesData(
  group: PanelGroup,
  windowYears: WindowYears,
  btcAs: BTCClassification
): UseSeriesDataResult {
  const [rawData, setRawData] = useState<GroupData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/series/group/${group}?window=${windowYears}&btcAs=${btcAs}`)
      .then((r) => {
        if (!r.ok) throw new Error(`API ${r.status}`);
        return r.json();
      })
      .then((json) => {
        if (cancelled) return;
        if (json.success) {
          setRawData(json.data as GroupData);
        } else {
          setError(json.error ?? 'Unknown error');
        }
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [group, windowYears, btcAs]);

  if (!rawData) return { chartData: [], tickers: [], loading, error };

  // Collect all tickers that have at least one data point
  const tickers = Object.entries(rawData.series)
    .filter(([, points]) => points.length > 0)
    .map(([ticker]) => ticker);

  // Merge series into flat Recharts format: [{date, THM: 100, BTC: 100, ...}]
  const dateMap = new Map<string, ChartDataPoint>();
  for (const [ticker, points] of Object.entries(rawData.series)) {
    for (const { date, value } of points) {
      if (!dateMap.has(date)) dateMap.set(date, { date });
      (dateMap.get(date) as ChartDataPoint)[ticker] = value - 100;
    }
  }

  const chartData = Array.from(dateMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, row]) => row);

  return { chartData, tickers, loading, error };
}
