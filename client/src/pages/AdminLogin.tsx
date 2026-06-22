import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--bg-surface)',
  border: '1px solid var(--border-default)',
  borderRadius: 8,
  padding: '10px 14px',
  fontFamily: 'var(--font-display)',
  fontSize: 14,
  color: 'var(--text-primary)',
  outline: 'none',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-data)',
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.08em',
  color: 'var(--text-secondary)',
  marginBottom: 6,
  textTransform: 'uppercase',
};

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error ?? 'Invalid credentials');
        return;
      }
      localStorage.setItem('fmw_admin_token', json.data.token);
      navigate('/admin');
    } catch {
      setError('Connection error. Is the server running?');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-base)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{
        width: '100%',
        maxWidth: 380,
      }}>
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <div style={{
            fontFamily: 'var(--font-data)',
            fontSize: 10,
            letterSpacing: '0.14em',
            color: 'var(--thm-green)',
            textTransform: 'uppercase',
            marginBottom: 8,
          }}>
            FreeMarketWatch
          </div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 22,
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.01em',
          }}>
            Admin
          </div>
        </div>

        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          borderRadius: 12,
          padding: '28px 28px',
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--border-accent)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border-default)')}
              />
            </div>
            <div>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--border-accent)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border-default)')}
              />
            </div>

            {error && (
              <div style={{
                fontFamily: 'var(--font-data)',
                fontSize: 11,
                color: 'var(--loss)',
                letterSpacing: '0.04em',
                padding: '8px 12px',
                background: 'rgba(248,113,113,0.08)',
                border: '1px solid rgba(248,113,113,0.25)',
                borderRadius: 6,
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                fontFamily: 'var(--font-data)',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.1em',
                padding: '11px',
                borderRadius: 8,
                border: '1px solid var(--border-accent)',
                background: 'var(--thm-green-dim)',
                color: 'var(--thm-green)',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1,
                textTransform: 'uppercase',
              }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
