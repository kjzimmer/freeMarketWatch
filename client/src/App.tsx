import { useState } from 'react';
import type { WindowYears, BTCClassification } from './types';
import Header from './components/Header';
import THMExplainer from './components/THMExplainer';
import ChartPanel from './components/ChartPanel';

const STORAGE_KEY_BTC = 'fmw_btcAs';
const STORAGE_KEY_WINDOW = 'fmw_window';

function loadBTCAs(): BTCClassification {
  const stored = localStorage.getItem(STORAGE_KEY_BTC);
  return stored === 'riskon' ? 'riskon' : 'currency';
}

function loadWindow(): WindowYears {
  const stored = localStorage.getItem(STORAGE_KEY_WINDOW);
  if (stored === '1' || stored === '5' || stored === '10') return parseInt(stored, 10) as WindowYears;
  return 10;
}

export default function App() {
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
    <div style={{ minHeight: '100vh', paddingBottom: 64 }}>
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

      <footer style={{
        textAlign: 'center',
        marginTop: 48,
        paddingBottom: 24,
        fontFamily: 'var(--font-data)',
        fontSize: 11,
        color: 'var(--text-muted)',
        letterSpacing: '0.05em',
      }}>
        Data: FRED · CryptoCompare · Yahoo Finance · Purchasing power indexed to 100 at window start
      </footer>
    </div>
  );
}
