import { useState } from 'react';
import { Link } from 'react-router-dom';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

const SUBJECTS = [
  'General feedback',
  'Question about the data',
  'Question about the charts',
  "I'd like to learn more",
  'Something looks wrong',
  'Other',
];

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
  transition: 'border-color 0.15s',
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

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [message, setMessage] = useState('');
  const [formState, setFormState] = useState<FormState>('idle');
  const [submittedEmail, setSubmittedEmail] = useState('');

  const endpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT as string | undefined;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!endpoint) return;

    setFormState('submitting');
    setSubmittedEmail(email);

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });
      if (res.ok) {
        setFormState('success');
      } else {
        setFormState('error');
      }
    } catch {
      setFormState('error');
    }
  }

  return (
    <div style={{ paddingTop: 56 }}>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '48px 40px 80px' }}>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 32,
          fontWeight: 800,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
          marginBottom: 8,
        }}>
          Get in Touch
        </h1>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: 15,
          color: 'var(--text-secondary)',
          lineHeight: 1.7,
          marginBottom: 40,
        }}>
          Questions about the data, the methodology, or the ideas behind this site — we want to hear from you.
        </p>

        {formState === 'success' ? (
          <div style={{
            background: 'rgba(168,255,120,0.06)',
            border: '1px solid var(--border-accent)',
            borderRadius: 12,
            padding: '32px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>✓</div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 18,
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: 8,
            }}>
              Message received.
            </div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 14,
              color: 'var(--text-secondary)',
            }}>
              We'll get back to you at {submittedEmail}.
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {!endpoint && (
              <div style={{
                background: 'rgba(248,113,113,0.08)',
                border: '1px solid rgba(248,113,113,0.25)',
                borderRadius: 8,
                padding: '12px 16px',
                fontFamily: 'var(--font-data)',
                fontSize: 11,
                color: 'var(--loss)',
                letterSpacing: '0.04em',
              }}>
                Contact form not yet configured. Please add VITE_FORMSPREE_ENDPOINT to your environment variables.
              </div>
            )}

            <div>
              <label style={labelStyle}>Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--border-accent)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border-default)')}
              />
            </div>

            <div>
              <label style={labelStyle}>Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--border-accent)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border-default)')}
              />
            </div>

            <div>
              <label style={labelStyle}>Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                style={{ ...inputStyle, cursor: 'pointer' }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--border-accent)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border-default)')}
              >
                {SUBJECTS.map((s) => (
                  <option key={s} value={s} style={{ background: 'var(--bg-surface)' }}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Message *</label>
              <textarea
                required
                minLength={10}
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{ ...inputStyle, resize: 'vertical', minHeight: 120 }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--border-accent)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border-default)')}
              />
            </div>

            {formState === 'error' && (
              <div style={{
                background: 'rgba(248,113,113,0.08)',
                border: '1px solid rgba(248,113,113,0.25)',
                borderRadius: 8,
                padding: '12px 16px',
                fontFamily: 'var(--font-data)',
                fontSize: 11,
                color: 'var(--loss)',
                letterSpacing: '0.04em',
              }}>
                Something went wrong. Please try again or email us directly at{' '}
                <span style={{ color: 'var(--text-secondary)' }}>karl.zimmer@enterpriseedge.com</span>.
              </div>
            )}

            <button
              type="submit"
              disabled={formState === 'submitting' || !endpoint}
              style={{
                fontFamily: 'var(--font-data)',
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.1em',
                padding: '12px 24px',
                borderRadius: 8,
                border: '1px solid var(--border-accent)',
                background: formState === 'submitting' ? 'transparent' : 'var(--thm-green-dim)',
                color: 'var(--thm-green)',
                cursor: formState === 'submitting' || !endpoint ? 'not-allowed' : 'pointer',
                opacity: formState === 'submitting' || !endpoint ? 0.5 : 1,
                transition: 'opacity 0.15s',
                alignSelf: 'flex-start',
              }}
            >
              {formState === 'submitting' ? 'SENDING...' : 'SEND MESSAGE'}
            </button>
          </form>
        )}

        {/* Info blocks below form */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
          marginTop: 48,
        }}>
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            borderRadius: 10,
            padding: '20px',
          }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 13,
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: 8,
            }}>
              What this site is about
            </div>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: 13,
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              marginBottom: 10,
            }}>
              Purchasing power, measured honestly. Every asset indexed to 100 and compared against a hard
              money benchmark.
            </p>
            <Link
              to="/about"
              style={{
                fontFamily: 'var(--font-data)',
                fontSize: 11,
                color: 'var(--thm-green)',
                textDecoration: 'none',
              }}
            >
              Learn more →
            </Link>
          </div>

          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            borderRadius: 10,
            padding: '20px',
          }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 13,
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: 8,
            }}>
              Want to go deeper?
            </div>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: 13,
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              marginBottom: 10,
            }}>
              The six-act education series takes you from the basics of trade all the way to Bitcoin.
            </p>
            <Link
              to="/learn"
              style={{
                fontFamily: 'var(--font-data)',
                fontSize: 11,
                color: 'var(--thm-green)',
                textDecoration: 'none',
              }}
            >
              Start the series →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
