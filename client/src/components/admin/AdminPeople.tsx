import { useState, useEffect } from 'react';
import { apiFetch } from '../../lib/apiFetch';

interface Person {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  notes: string | null;
  tags: string[];
  message_count: number;
  created_at: string;
}

interface PersonDetail extends Person {
  messages: {
    id: string;
    subject: string;
    message: string;
    read: boolean;
    created_at: string;
  }[];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function DetailPanel({
  personId,
  onClose,
}: {
  personId: string;
  onClose: () => void;
}) {
  const [detail, setDetail] = useState<PersonDetail | null>(null);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDetail(null);
    apiFetch<PersonDetail>(`/api/admin/people/${personId}`).then((res) => {
      setDetail(res.data);
      setNotes(res.data.notes ?? '');
    });
  }, [personId]);

  function handleSaveNotes() {
    if (!detail) return;
    setSaving(true);
    apiFetch(`/api/admin/people/${detail.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ notes }),
    }).then(() => {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }).finally(() => setSaving(false));
  }

  if (!detail) {
    return (
      <div style={{ padding: 24, color: 'var(--text-muted)', fontFamily: 'var(--font-data)', fontSize: 12 }}>
        Loading…
      </div>
    );
  }

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-default)',
      borderRadius: 10,
      padding: 24,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 17,
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: 4,
          }}>
            {detail.name}
          </div>
          <div style={{
            fontFamily: 'var(--font-data)',
            fontSize: 12,
            color: 'var(--text-muted)',
            letterSpacing: '0.02em',
          }}>
            {detail.email}
          </div>
          {detail.phone && (
            <div style={{
              fontFamily: 'var(--font-data)',
              fontSize: 12,
              color: 'var(--text-muted)',
              marginTop: 2,
            }}>
              {detail.phone}
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          style={{
            fontFamily: 'var(--font-data)',
            fontSize: 11,
            color: 'var(--text-faint)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            letterSpacing: '0.04em',
          }}
        >
          ✕
        </button>
      </div>

      {detail.tags.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
          {detail.tags.map((tag) => (
            <span key={tag} style={{
              fontFamily: 'var(--font-data)',
              fontSize: 10,
              letterSpacing: '0.06em',
              color: 'var(--thm-green)',
              background: 'rgba(168,255,120,0.1)',
              border: '1px solid rgba(168,255,120,0.2)',
              borderRadius: 4,
              padding: '2px 8px',
            }}>
              {tag}
            </span>
          ))}
        </div>
      )}

      <div style={{ marginBottom: 20 }}>
        <div style={{
          fontFamily: 'var(--font-data)',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.1em',
          color: 'var(--text-faint)',
          textTransform: 'uppercase',
          marginBottom: 8,
        }}>
          Notes
        </div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          style={{
            width: '100%',
            background: 'var(--bg-base)',
            border: '1px solid var(--border-default)',
            borderRadius: 6,
            padding: '8px 12px',
            fontFamily: 'var(--font-display)',
            fontSize: 13,
            color: 'var(--text-primary)',
            outline: 'none',
            resize: 'vertical',
            boxSizing: 'border-box',
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--border-accent)')}
          onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border-default)')}
        />
        <button
          onClick={handleSaveNotes}
          disabled={saving}
          style={{
            marginTop: 6,
            fontFamily: 'var(--font-data)',
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.08em',
            color: saved ? 'var(--thm-green)' : 'var(--text-muted)',
            background: 'none',
            border: '1px solid var(--border-default)',
            borderRadius: 5,
            padding: '4px 10px',
            cursor: saving ? 'not-allowed' : 'pointer',
            textTransform: 'uppercase',
          }}
        >
          {saved ? 'Saved ✓' : saving ? 'Saving…' : 'Save notes'}
        </button>
      </div>

      <div>
        <div style={{
          fontFamily: 'var(--font-data)',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.1em',
          color: 'var(--text-faint)',
          textTransform: 'uppercase',
          marginBottom: 10,
        }}>
          {`Messages · ${detail.messages.length}`}
        </div>
        {detail.messages.length === 0 ? (
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--text-muted)' }}>
            No messages.
          </div>
        ) : (
          detail.messages.map((m) => (
            <div key={m.id} style={{
              borderLeft: '2px solid var(--border-subtle)',
              paddingLeft: 12,
              marginBottom: 14,
            }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: 4,
              }}>
                {m.subject}
              </div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 12,
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                marginBottom: 4,
                whiteSpace: 'pre-wrap',
              }}>
                {m.message}
              </div>
              <div style={{
                fontFamily: 'var(--font-data)',
                fontSize: 10,
                color: 'var(--text-faint)',
                letterSpacing: '0.04em',
              }}>
                {formatDate(m.created_at)}
                {!m.read && (
                  <span style={{ marginLeft: 8, color: 'var(--thm-green)' }}>· unread</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function AdminPeople() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<Person[]>('/api/admin/people')
      .then((res) => setPeople(res.data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ padding: 32, color: 'var(--text-muted)', fontFamily: 'var(--font-data)', fontSize: 12 }}>
      Loading people…
    </div>
  );
  if (error) return (
    <div style={{ padding: 32, color: 'var(--loss)', fontFamily: 'var(--font-data)', fontSize: 12 }}>
      Error: {error}
    </div>
  );
  if (people.length === 0) return (
    <div style={{ padding: 32, color: 'var(--text-muted)', fontFamily: 'var(--font-display)', fontSize: 14 }}>
      No contacts yet.
    </div>
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: selectedId ? '1fr 1fr' : '1fr', gap: 20 }}>
      <div>
        {people.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedId(p.id === selectedId ? null : p.id)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              marginBottom: 6,
              background: p.id === selectedId ? 'rgba(168,255,120,0.04)' : 'var(--bg-surface)',
              border: `1px solid ${p.id === selectedId ? 'var(--border-accent)' : 'var(--border-subtle)'}`,
              borderRadius: 8,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: 2,
              }}>
                {p.name}
              </div>
              <div style={{
                fontFamily: 'var(--font-data)',
                fontSize: 11,
                color: 'var(--text-muted)',
                letterSpacing: '0.02em',
              }}>
                {p.email}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontFamily: 'var(--font-data)',
                fontSize: 11,
                color: 'var(--text-faint)',
              }}>
                {p.message_count} {p.message_count === 1 ? 'message' : 'messages'}
              </div>
              <div style={{
                fontFamily: 'var(--font-data)',
                fontSize: 10,
                color: 'var(--text-faint)',
                marginTop: 2,
              }}>
                {formatDate(p.created_at)}
              </div>
            </div>
          </button>
        ))}
      </div>

      {selectedId && (
        <DetailPanel
          personId={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}
