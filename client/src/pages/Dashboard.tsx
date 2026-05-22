import { useState } from 'react';
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
    </div>
  );
}
