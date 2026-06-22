import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../lib/apiFetch';
import AdminContact from '../components/admin/AdminContact';
import AdminPeople from '../components/admin/AdminPeople';

type Tab = 'inbox' | 'people';

export default function Admin() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('inbox');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('fmw_admin_token');
    if (!token) { navigate('/admin/login'); return; }
    apiFetch('/api/auth/me')
      .then(() => setAuthed(true))
      .catch(() => {
        localStorage.removeItem('fmw_admin_token');
        navigate('/admin/login');
      });
  }, [navigate]);

  function logout() {
    localStorage.removeItem('fmw_admin_token');
    navigate('/admin/login');
  }

  if (!authed) return null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Top bar */}
      <div style={{
        borderBottom: '1px solid var(--border-subtle)',
        padding: '0 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 52,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <div style={{
            fontFamily: 'var(--font-data)',
            fontSize: 11,
            letterSpacing: '0.1em',
            color: 'var(--thm-green)',
            textTransform: 'uppercase',
          }}>
            FMW Admin
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {([['inbox', 'Inbox'], ['people', 'People']] as [Tab, string][]).map(([tab, label]) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  fontFamily: 'var(--font-data)',
                  fontSize: 11,
                  fontWeight: activeTab === tab ? 700 : 400,
                  letterSpacing: '0.08em',
                  color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-muted)',
                  background: activeTab === tab ? 'rgba(255,255,255,0.05)' : 'none',
                  border: 'none',
                  borderRadius: 6,
                  padding: '5px 12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  textTransform: 'uppercase',
                }}
              >
                {label}
                {tab === 'inbox' && unreadCount > 0 && (
                  <span style={{
                    background: 'var(--thm-green)',
                    color: 'var(--bg-base)',
                    fontFamily: 'var(--font-data)',
                    fontSize: 9,
                    fontWeight: 700,
                    borderRadius: 10,
                    padding: '1px 6px',
                    lineHeight: 1.6,
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={logout}
          style={{
            fontFamily: 'var(--font-data)',
            fontSize: 10,
            letterSpacing: '0.08em',
            color: 'var(--text-faint)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textTransform: 'uppercase',
          }}
        >
          Log out
        </button>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 32px' }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 20,
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: 24,
        }}>
          {activeTab === 'inbox' ? 'Inbox' : 'People'}
        </div>

        {activeTab === 'inbox' && (
          <AdminContact onUnreadCount={setUnreadCount} />
        )}
        {activeTab === 'people' && (
          <AdminPeople />
        )}
      </div>
    </div>
  );
}
