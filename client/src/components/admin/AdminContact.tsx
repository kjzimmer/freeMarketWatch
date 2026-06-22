import { useState, useEffect } from 'react';
import { apiFetch } from '../../lib/apiFetch';

interface ContactMessage {
  id: string;
  person_id: string | null;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
  tags: string[] | null;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function MessageRow({
  msg,
  onMarkRead,
}: {
  msg: ContactMessage;
  onMarkRead: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      style={{
        background: msg.read ? 'transparent' : 'rgba(168,255,120,0.04)',
        border: `1px solid ${msg.read ? 'var(--border-subtle)' : 'var(--border-default)'}`,
        borderRadius: 8,
        marginBottom: 8,
        overflow: 'hidden',
      }}
    >
      <button
        onClick={() => setExpanded((v) => !v)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          {!msg.read && (
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: 'var(--thm-green)', flexShrink: 0,
            }} />
          )}
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 13,
              fontWeight: msg.read ? 400 : 600,
              color: 'var(--text-primary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {msg.name}
              <span style={{
                fontWeight: 400,
                color: 'var(--text-muted)',
                marginLeft: 8,
                fontSize: 12,
              }}>
                {msg.email}
              </span>
            </div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 12,
              color: 'var(--text-secondary)',
              marginTop: 2,
            }}>
              {msg.subject}
            </div>
          </div>
        </div>
        <div style={{
          fontFamily: 'var(--font-data)',
          fontSize: 10,
          color: 'var(--text-faint)',
          letterSpacing: '0.04em',
          flexShrink: 0,
        }}>
          {timeAgo(msg.created_at)}
        </div>
      </button>

      {expanded && (
        <div style={{ padding: '0 16px 16px', borderTop: '1px solid var(--border-subtle)' }}>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: 14,
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            margin: '14px 0',
            whiteSpace: 'pre-wrap',
          }}>
            {msg.message}
          </p>
          {!msg.read && (
            <button
              onClick={(e) => { e.stopPropagation(); onMarkRead(msg.id); }}
              style={{
                fontFamily: 'var(--font-data)',
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.08em',
                color: 'var(--text-muted)',
                background: 'none',
                border: '1px solid var(--border-default)',
                borderRadius: 6,
                padding: '5px 10px',
                cursor: 'pointer',
                textTransform: 'uppercase',
              }}
            >
              Mark read
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminContact({ onUnreadCount }: { onUnreadCount?: (n: number) => void }) {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch<ContactMessage[]>('/api/contact')
      .then((res) => {
        setMessages(res.data);
        onUnreadCount?.(res.data.filter((m) => !m.read).length);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [onUnreadCount]);

  function handleMarkRead(id: string) {
    apiFetch('/api/contact/' + id + '/read', { method: 'PATCH' }).then(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, read: true } : m))
      );
      onUnreadCount?.(messages.filter((m) => !m.read && m.id !== id).length);
    });
  }

  if (loading) return <LoadState text="Loading messages…" />;
  if (error) return <LoadState text={`Error: ${error}`} />;

  const unread = messages.filter((m) => !m.read);
  const read = messages.filter((m) => m.read);

  if (messages.length === 0) {
    return (
      <div style={{ padding: 32, color: 'var(--text-muted)', fontFamily: 'var(--font-display)', fontSize: 14 }}>
        No messages yet.
      </div>
    );
  }

  return (
    <div>
      {unread.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <SectionLabel>{`Unread · ${unread.length}`}</SectionLabel>
          {unread.map((m) => (
            <MessageRow key={m.id} msg={m} onMarkRead={handleMarkRead} />
          ))}
        </div>
      )}
      {read.length > 0 && (
        <div>
          <SectionLabel>{`Read · ${read.length}`}</SectionLabel>
          {read.map((m) => (
            <MessageRow key={m.id} msg={m} onMarkRead={handleMarkRead} />
          ))}
        </div>
      )}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: 'var(--font-data)',
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: '0.1em',
      color: 'var(--text-faint)',
      textTransform: 'uppercase',
      marginBottom: 10,
    }}>
      {children}
    </div>
  );
}

function LoadState({ text }: { text: string }) {
  return (
    <div style={{ padding: 32, color: 'var(--text-muted)', fontFamily: 'var(--font-data)', fontSize: 12 }}>
      {text}
    </div>
  );
}
