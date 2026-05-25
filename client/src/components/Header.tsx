import type { WindowYears, BTCClassification } from '../types';

interface HeaderProps {
  window: WindowYears;
  btcAs: BTCClassification;
  onWindowChange: (w: WindowYears) => void;
  onBTCChange: (c: BTCClassification) => void;
}

const WINDOWS: WindowYears[] = [1, 5, 10];

export default function Header({ window, btcAs, onWindowChange, onBTCChange }: HeaderProps) {
  return (
    <header style={{
      borderBottom: '1px solid var(--border-default)',
      background: 'rgba(6,8,16,0.95)',
      backdropFilter: 'blur(12px)',
    }}>
      <div style={{
        maxWidth: 1600,
        margin: '0 auto',
        padding: '14px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 24,
        flexWrap: 'wrap',
      }}>
        {/* Dashboard headline */}
        <div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 18,
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.01em',
            marginBottom: 3,
          }}>
            Purchasing Power Dashboard
          </div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 13,
            color: 'var(--text-secondary)',
            lineHeight: 1.4,
          }}>
            Every currency and asset indexed to 100 — measured against hard money, not the dollar.
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
          {/* Timeframe selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              fontFamily: 'var(--font-data)',
              fontSize: 10,
              color: 'var(--text-muted)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}>
              Window
            </span>
            <div style={{ display: 'flex', gap: 4 }}>
              {WINDOWS.map((w) => (
                <button
                  key={w}
                  onClick={() => onWindowChange(w)}
                  style={{
                    fontFamily: 'var(--font-data)',
                    fontSize: 12,
                    fontWeight: 500,
                    padding: '5px 12px',
                    borderRadius: 6,
                    border: window === w
                      ? '1px solid var(--thm-green)'
                      : '1px solid var(--border-default)',
                    background: window === w
                      ? 'var(--thm-green-dim)'
                      : 'transparent',
                    color: window === w
                      ? 'var(--thm-green)'
                      : 'var(--text-muted)',
                    transition: 'all 0.15s',
                  }}
                >
                  {w}Y
                </button>
              ))}
            </div>
          </div>

          {/* BTC classification toggle */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                fontFamily: 'var(--font-data)',
                fontSize: 10,
                color: 'var(--text-muted)',
                letterSpacing: '0.08em',
              }}>
                Treat Bitcoin as:
              </span>
              <div style={{ display: 'flex', gap: 4 }}>
                {(['currency', 'riskon'] as BTCClassification[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => onBTCChange(c)}
                    style={{
                      fontFamily: 'var(--font-data)',
                      fontSize: 11,
                      fontWeight: 500,
                      padding: '5px 12px',
                      borderRadius: 6,
                      border: btcAs === c
                        ? '1px solid var(--btc-orange)'
                        : '1px solid var(--border-default)',
                      background: btcAs === c
                        ? 'var(--btc-orange-dim)'
                        : 'transparent',
                      color: btcAs === c
                        ? 'var(--btc-orange)'
                        : 'var(--text-muted)',
                      transition: 'all 0.15s',
                    }}
                  >
                    {c === 'currency' ? 'Currency' : 'Risk-On Asset'}
                  </button>
                ))}
              </div>
            </div>
            <span style={{
              fontFamily: 'var(--font-data)',
              fontSize: 10,
              color: 'var(--text-faint)',
              fontStyle: 'italic',
            }}>
              Two schools of thought — see methodology
            </span>
          </div>

          {/* Index reference */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontFamily: 'var(--font-data)',
            fontSize: 10,
            color: 'var(--text-muted)',
          }}>
            <span>% change from start of window</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <svg width="20" height="8" viewBox="0 0 20 8">
                <line x1="0" y1="4" x2="20" y2="4"
                  stroke="#a8ff78" strokeWidth="2"
                  strokeDasharray="5 3" />
              </svg>
              <span style={{ color: 'var(--thm-green)' }}>THM benchmark</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
