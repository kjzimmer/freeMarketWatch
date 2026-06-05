import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const VISITED_KEY = 'fmw_visited';

const p: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 16,
  lineHeight: 1.75,
  color: 'var(--text-secondary)',
  marginBottom: 24,
};

export default function HookPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem(VISITED_KEY)) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  function handleCTA(destination: '/lens' | '/dashboard') {
    localStorage.setItem(VISITED_KEY, 'true');
    navigate(destination);
  }

  return (
    <div style={{ minHeight: '100vh', paddingTop: 56 }}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '64px 40px 80px' }}>

        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: 21,
          fontWeight: 600,
          color: 'var(--text-primary)',
          lineHeight: 1.65,
          marginBottom: 36,
          letterSpacing: '-0.01em',
        }}>
          Maybe you're falling behind and can't explain why. Maybe you're doing
          fine but sense the foundation beneath you is less stable than it looks.
          Either way, something doesn't add up.
        </p>

        <p style={p}>
          Wages rise. Prices rise faster. You save carefully and still fall behind.
          You work harder and the gap doesn't close. Your parents bought a house
          on one income. That math no longer works and nobody has a satisfying
          explanation.
        </p>

        <p style={p}>
          Most people blame someone. Politicians, corporations, the wealthy, the
          other party. The blame feels justified. But it doesn't explain the
          mechanism — and changing the people in charge has never fixed it.
          Different faces, same result.
        </p>

        <p style={{ ...p, color: 'var(--text-primary)', fontWeight: 600 }}>
          Here is what most people are never told: the problem is not the people.
          It is the structure.
        </p>

        <p style={p}>
          The monetary system — the invisible architecture beneath every price,
          every wage, every savings account — is designed in a way that
          redirects wealth quietly, automatically, every year — from the
          general population toward those at the top of the financial system.
          Not through corruption, not through conspiracy. Through mechanism.
          Because of how it is built. Any person, however well-intentioned,
          placed inside that structure faces the same incentives and produces
          the same outcomes. The structure is the problem.
        </p>

        <p style={{ ...p, marginBottom: 40 }}>
          The tools to replace it exist.
          What's missing is broad understanding — and without it, we remain
          trapped in a system of our own making.
        </p>

        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: 14,
          color: 'var(--text-muted)',
          marginBottom: 24,
          fontStyle: 'italic',
        }}>
          That's what this site is for.
        </p>

        {/* Primary CTAs */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
          <button
            onClick={() => handleCTA('/lens')}
            style={{
              fontFamily: 'var(--font-data)',
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '0.06em',
              color: '#060810',
              background: 'var(--thm-green)',
              border: 'none',
              borderRadius: 8,
              padding: '13px 28px',
              cursor: 'pointer',
            }}
          >
            The Lens →
          </button>
          <button
            onClick={() => handleCTA('/dashboard')}
            style={{
              fontFamily: 'var(--font-data)',
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '0.06em',
              color: 'var(--text-secondary)',
              background: 'transparent',
              border: '1px solid var(--border-default)',
              borderRadius: 8,
              padding: '13px 28px',
              cursor: 'pointer',
            }}
          >
            The Dashboard →
          </button>
        </div>

        {/* Fallback for returning visitors with cleared localStorage */}
        <p style={{
          fontFamily: 'var(--font-data)',
          fontSize: 11,
          color: 'var(--text-faint)',
          letterSpacing: '0.04em',
        }}>
          Already familiar?{' '}
          <button
            onClick={() => handleCTA('/dashboard')}
            style={{
              fontFamily: 'var(--font-data)',
              fontSize: 11,
              color: 'var(--text-muted)',
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              textDecoration: 'underline',
              letterSpacing: '0.04em',
            }}
          >
            Go to Dashboard →
          </button>
        </p>

      </div>
    </div>
  );
}
