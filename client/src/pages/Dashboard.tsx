import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { WindowYears, BTCClassification } from '../types';
import Header from '../components/Header';
import THMExplainer from '../components/THMExplainer';
import ChartPanel from '../components/ChartPanel';

const STORAGE_KEY_BTC = 'fmw_btcAs';
const STORAGE_KEY_WINDOW = 'fmw_window';

function loadBTCAs(): BTCClassification {
  const stored = localStorage.getItem(STORAGE_KEY_BTC);
  return stored === 'currency' ? 'currency' : 'riskon';
}

function loadWindow(): WindowYears {
  const stored = localStorage.getItem(STORAGE_KEY_WINDOW);
  if (stored === '1' || stored === '5' || stored === '10') return parseInt(stored, 10) as WindowYears;
  return 10;
}

function LensCalloutCard() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(168,255,120,0.04), rgba(168,255,120,0.02))',
      border: '1px solid var(--border-accent)',
      borderRadius: 12,
      padding: '24px 28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 24,
      flexWrap: 'wrap',
    }}>
      <div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 17,
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: 8,
          lineHeight: 1.3,
        }}>
          See through the distortion.
        </div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 14,
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          maxWidth: 440,
          marginBottom: 10,
        }}>
          The charts show what's happening. The Lens explains why — and what to do about it.
        </div>
        <div style={{
          fontFamily: 'var(--font-data)',
          fontSize: 11,
          color: 'var(--text-muted)',
          letterSpacing: '0.04em',
        }}>
          Three components: the fiat problem, the THM benchmark, and investing under hard money assumptions.
        </div>
      </div>
      <Link
        to="/lens"
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
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        Explore The Lens →
      </Link>
    </div>
  );
}

export default function Dashboard() {
  const [window, setWindowYears] = useState<WindowYears>(loadWindow);
  const [btcAs, setBtcAs] = useState<BTCClassification>(loadBTCAs);

  function handleWindowChange(w: WindowYears) {
    setWindowYears(w);
    localStorage.setItem(STORAGE_KEY_WINDOW, String(w));
  }

  function handleBTCChange(classification: BTCClassification) {
    setBtcAs(classification);
    localStorage.setItem(STORAGE_KEY_BTC, classification);
  }

  return (
    <div style={{ minHeight: '100vh', paddingTop: 56 }}>
      <Header
        window={window}
        btcAs={btcAs}
        onWindowChange={handleWindowChange}
        onBTCChange={handleBTCChange}
      />

      <THMExplainer />

      <main style={{
        maxWidth: 1600,
        margin: '0 auto',
        padding: '0 40px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
        gap: 20,
        marginTop: 24,
      }}>
        <ChartPanel group="currency" window={window} btcAs={btcAs} />
        <ChartPanel group="riskoff"  window={window} btcAs={btcAs} />
        <ChartPanel group="riskon"   window={window} btcAs={btcAs} />
      </main>

      <div style={{
        maxWidth: 1600,
        margin: '24px auto 0',
        padding: '0 40px',
      }}>
        <LensCalloutCard />
      </div>
    </div>
  );
}
