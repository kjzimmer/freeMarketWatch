import { useState } from 'react';
import { Link } from 'react-router-dom';

const prose: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 15,
  lineHeight: 1.8,
  color: 'var(--text-secondary)',
  marginBottom: 20,
};

export default function LensAdoption() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  async function handleNotify(e: React.FormEvent) {
    e.preventDefault();
    const endpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT as string | undefined;
    if (!endpoint) return;
    setStatus('submitting');
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          subject: 'Adoption Index Notification',
          _gotcha: '',
        }),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div style={{ paddingTop: 56 }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 40px 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{
              fontFamily: 'var(--font-data)',
              fontSize: 10,
              color: 'var(--text-faint)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}>
              Component 4
            </div>
            <div style={{
              fontFamily: 'var(--font-data)',
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.08em',
              padding: '3px 8px',
              borderRadius: 4,
              border: '1px solid #94a3b840',
              background: '#94a3b812',
              color: '#94a3b8',
              textTransform: 'uppercase',
            }}>
              In Development
            </div>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 40,
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            marginBottom: 0,
          }}>
            Bitcoin Adoption Index
          </h1>
        </div>

        {/* Section 1 — What this measures */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 18,
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: 16,
          }}>
            What this measures
          </h2>
          <p style={prose}>
            This index measures Bitcoin's adoption as a medium of exchange —
            not its price, not sentiment, but its actual use as money in the
            economy. Transaction volume through the Lightning Network, merchant
            acceptance, and payment flows — normalized against global payment
            benchmarks to express genuine market share, not raw growth.
          </p>
        </section>

        {/* Section 2 — Why it matters */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 18,
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: 16,
          }}>
            Why it matters
          </h2>
          <p style={prose}>
            THM represents where Bitcoin ends up as a mature monetary
            standard — when adoption is substantially complete and the price
            primarily reflects monetary properties rather than adoption momentum.
            The adoption index tracks how far along that path the world actually is.
          </p>
          <p style={prose}>
            The index focuses on Medium of Exchange (MOE) as the primary
            adoption signal — the function that distinguishes money from a store of
            value asset. A world where everyone holds Bitcoin but nobody spends it
            is not monetary adoption. MOE tracks actual use. Store of Value (SOV)
            and Unit of Account (UOA) indexes may follow as data and methodology
            mature.
          </p>
        </section>

        {/* Section 3 — Notify me */}
        <section style={{
          background: 'rgba(168,255,120,0.03)',
          border: '1px solid var(--border-accent)',
          borderRadius: 10,
          padding: '28px 32px',
          marginBottom: 40,
        }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 16,
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: 16,
          }}>
            Get notified when the adoption index launches
          </h2>

          {status === 'success' ? (
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: 14,
              color: 'var(--thm-green)',
            }}>
              You're on the list.
            </p>
          ) : (
            <form onSubmit={handleNotify} style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 14,
                  color: 'var(--text-primary)',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 6,
                  padding: '10px 14px',
                  flex: '1 1 220px',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                disabled={status === 'submitting'}
                style={{
                  fontFamily: 'var(--font-data)',
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  color: '#060810',
                  background: status === 'submitting' ? 'rgba(168,255,120,0.6)' : 'var(--thm-green)',
                  border: 'none',
                  borderRadius: 6,
                  padding: '10px 22px',
                  cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
                  flexShrink: 0,
                }}
              >
                {status === 'submitting' ? 'Sending...' : 'Notify Me'}
              </button>
              {status === 'error' && (
                <p style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 13,
                  color: '#f87171',
                  width: '100%',
                  margin: 0,
                }}>
                  Something went wrong. Please try again.
                </p>
              )}
            </form>
          )}
        </section>

        {/* Back navigation */}
        <Link
          to="/lens"
          style={{
            fontFamily: 'var(--font-data)',
            fontSize: 12,
            color: 'var(--text-muted)',
            textDecoration: 'none',
            letterSpacing: '0.04em',
          }}
        >
          ← Back to The Lens
        </Link>

      </div>
    </div>
  );
}
