import { useState, useEffect } from 'react';

const STORAGE_KEY = 'fmw_explainer_collapsed';

export default function THMExplainer() {
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(collapsed));
  }, [collapsed]);

  return (
    <div style={{
      maxWidth: 1600,
      margin: '16px auto 0',
      padding: '0 40px',
    }}>
      <div style={{
        background: 'rgba(168,255,120,0.04)',
        border: '1px solid var(--border-accent)',
        borderRadius: 8,
        overflow: 'hidden',
      }}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 16px',
            fontFamily: 'var(--font-data)',
            fontSize: 11,
            color: 'var(--thm-green)',
            letterSpacing: '0.06em',
            background: 'transparent',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="16" height="8" viewBox="0 0 16 8">
              <line x1="0" y1="4" x2="16" y2="4"
                stroke="#a8ff78" strokeWidth="2" strokeDasharray="5 3" />
            </svg>
            THM — Theoretical Hard Money benchmark
          </span>
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
            {collapsed ? 'explain ↓' : 'collapse ↑'}
          </span>
        </button>

        {!collapsed && (
          <div style={{
            padding: '0 16px 14px',
            fontFamily: 'var(--font-data)',
            fontSize: 11,
            color: 'var(--text-muted)',
            lineHeight: 1.7,
            maxWidth: 900,
          }}>
            The dashed green line on every chart is <span style={{ color: 'var(--thm-green)' }}>THM</span> — Theoretical Hard Money.
            It's not a real asset. It's a benchmark: the purchasing power an honest monetary system would deliver.
            {' '}THM grows at exactly <span style={{ color: 'var(--text-secondary)' }}>+2% per year</span>, representing
            the natural productivity-driven price decline of a functioning economy — the rate at which goods
            get cheaper as production improves. Anything above THM is gaining real purchasing power.
            Anything below is losing it. The dollar, every fiat currency, and most traditional safe havens
            have spent the last century below this line.
          </div>
        )}
      </div>
    </div>
  );
}
