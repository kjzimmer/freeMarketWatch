export type WindowYears = 1 | 5 | 10;
export type BTCClassification = 'currency' | 'riskon';
export type PanelGroup = 'currency' | 'riskoff' | 'riskon';
export type ViewMode = 'real' | 'nominal';

export interface DataPoint {
  date: string;
  value: number;
}

export interface GroupData {
  group: PanelGroup;
  window: WindowYears;
  btcAs: BTCClassification;
  series: Record<string, DataPoint[]>;
}

// Recharts needs a flat object per data point
export type ChartDataPoint = Record<string, string | number>;

// Fixed color per ticker — users build visual memory, never change these
export const SERIES_COLORS: Record<string, string> = {
  THM:   '#a8ff78',
  BTC:   '#f7931a',
  USD:   '#60a5fa',
  EUR:   '#818cf8',
  JPY:   '#f472b6',
  GBP:   '#34d399',
  CNY:   '#fb923c',
  TLT:   '#94a3b8',
  GLD:   '#fbbf24',
  TIPS:  '#a78bfa',
  MM:    '#38bdf8',
  CASH:  '#64748b',
  AAPL:  '#f87171',
  MSFT:  '#4ade80',
  GOOGL: '#facc15',
  AMZN:  '#fb923c',
  NVDA:  '#c084fc',
  META:  '#60a5fa',
  TSLA:  '#f472b6',
};

export const PANEL_CONFIG: Record<PanelGroup, { title: string; subtitle: string }> = {
  currency: {
    title: 'World Currencies',
    subtitle: 'Measured against THM — the fixed ruler. Which currencies preserved real value? Which only appeared to?',
  },
  riskoff: {
    title: 'Risk-Off Assets',
    subtitle: 'Traditional "safe havens" — measured honestly. Does gold protect purchasing power against THM? Do bonds?',
  },
  riskon: {
    title: 'Risk-On Assets — Mag 7',
    subtitle: 'The most productive public companies. Genuine value creation — or riding a fiat tailwind? THM separates the two.',
  },
};

// Ordered display sequence per panel (THM first, then alphabetical by asset class)
export const PANEL_TICKERS: Record<PanelGroup, string[]> = {
  currency: ['THM', 'USD', 'EUR', 'GBP', 'CNY', 'JPY', 'BTC'],
  riskoff:  ['THM', 'GLD', 'TLT', 'TIPS', 'MM', 'CASH'],
  riskon:   ['THM', 'NVDA', 'MSFT', 'AAPL', 'GOOGL', 'AMZN', 'META', 'TSLA', 'BTC'],
};
