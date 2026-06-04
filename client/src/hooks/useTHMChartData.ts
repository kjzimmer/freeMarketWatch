import { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_URL ?? '';

export interface THMVariantPoint {
  year: number;
  thm_cpi: number;
  thm_m2gdp: number;
  thm_m2raw: number;
}

export interface GapSeriesPoint {
  year: number;
  m2_index: number;
  gdp_index: number;
  ratio_index: number;
}

export interface Chart4Point {
  year: number;
  stolen: number;
}

export interface THMChartData {
  thm_variants: THMVariantPoint[];
  gap_series: GapSeriesPoint[];
  chart4: Chart4Point[];
}

export function useTHMChartData(): { data: THMChartData | null; loading: boolean; error: string | null } {
  const [data, setData] = useState<THMChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`${API_BASE}/api/learn/thm-charts`)
      .then((r) => r.json())
      .then((json: { success: boolean; data?: THMChartData; error?: string }) => {
        if (cancelled) return;
        if (json.success && json.data) {
          setData(json.data);
        } else {
          setError(json.error ?? 'Failed to load THM chart data');
        }
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  return { data, loading, error };
}
