import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
            THM — The Fixed Ruler
          </span>
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
            {collapsed ? 'explain ↓' : 'collapse ↑'}
          </span>
        </button>

        {!collapsed && (
          <div style={{
            padding: '0 16px 16px',
            fontFamily: 'var(--font-display)',
            fontSize: 14,
            color: 'var(--text-secondary)',
            lineHeight: 1.75,
            maxWidth: 820,
          }}>
            <div style={{ marginBottom: 10 }}>Every financial chart measures value in dollars. This one doesn't.</div>
            <div style={{ marginBottom: 10 }}>
              The dashed green line is <span style={{ color: 'var(--thm-green)', fontFamily: 'var(--font-data)', fontSize: 13 }}>THM — Theoretical Hard Money</span> — the fixed ruler.
              THM represents what money would look like if the supply were fixed — as Bitcoin's
              supply is fixed. In a hard money world, productivity gains flow through as gently
              falling prices, increasing the purchasing power of every unit of money over time.
              That is the natural, healthy deflation of a sound monetary system.
            </div>
            <div style={{ marginBottom: 10 }}>
              We calculate THM using M2/GDP: how much faster the money supply actually grew than
              the real economy required. That excess is monetary debasement. The inverse is what
              purchasing power should have been. Not a guess — 111 years of real data.
            </div>
            <div style={{ marginBottom: 14 }}>
              Everything above the THM line is genuinely gaining purchasing power.
              Everything below it is losing ground — regardless of what the dollar price shows.
            </div>
            <Link
              to="/lens/thm"
              style={{
                fontFamily: 'var(--font-data)',
                fontSize: 11,
                color: 'var(--thm-green)',
                textDecoration: 'none',
                letterSpacing: '0.06em',
              }}
            >
              How we define THM →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
