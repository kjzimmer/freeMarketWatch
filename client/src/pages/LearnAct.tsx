import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ACTS, type ActBlock } from '../content/acts';

// ── Shared prose styles ──────────────────────────────────────────────────────

const P: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 15,
  lineHeight: 1.8,
  color: 'var(--text-secondary)',
  marginBottom: 20,
};

// ── Block renderers ──────────────────────────────────────────────────────────

function Paragraph({ text }: { text: string }) {
  return <p style={P}>{text}</p>;
}

function PullQuote({ text }: { text: string }) {
  return (
    <blockquote style={{
      borderLeft: '3px solid var(--thm-green)',
      paddingLeft: 20,
      margin: '28px 0',
      fontFamily: 'var(--font-display)',
      fontSize: 17,
      fontStyle: 'italic',
      lineHeight: 1.7,
      color: 'var(--text-primary)',
    }}>
      {text}
    </blockquote>
  );
}

function ComingNext({ text }: { text: string }) {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      borderLeft: '3px solid var(--thm-green)',
      borderRadius: '0 8px 8px 0',
      padding: '16px 20px',
      marginTop: 32,
      fontFamily: 'var(--font-display)',
      fontSize: 14,
      fontStyle: 'italic',
      color: 'var(--text-secondary)',
      lineHeight: 1.7,
    }}>
      <span style={{
        fontFamily: 'var(--font-data)',
        fontSize: 10,
        fontStyle: 'normal',
        color: 'var(--thm-green)',
        letterSpacing: '0.1em',
        display: 'block',
        marginBottom: 6,
      }}>
        COMING NEXT
      </span>
      {text}
    </div>
  );
}

function StatCards({ items }: { items: { stat: string; label: string }[] }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${items.length}, 1fr)`,
      gap: 12,
      margin: '28px 0',
    }}>
      {items.map(({ stat, label }) => (
        <div key={stat} style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          borderRadius: 10,
          padding: '20px 16px',
          textAlign: 'center',
        }}>
          <div style={{
            fontFamily: 'var(--font-data)',
            fontSize: 28,
            fontWeight: 700,
            color: 'var(--thm-green)',
            marginBottom: 8,
            letterSpacing: '-0.02em',
          }}>
            {stat}
          </div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 12,
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
          }}>
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}

function TwoColTable({ left, right }: { left: { title: string; body: string }; right: { title: string; body: string } }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 12,
      margin: '24px 0',
    }}>
      {[left, right].map(({ title, body }) => (
        <div key={title} style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          borderRadius: 10,
          padding: '20px',
        }}>
          <div style={{
            fontFamily: 'var(--font-data)',
            fontSize: 11,
            fontWeight: 700,
            color: 'var(--thm-green)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: 10,
          }}>
            {title}
          </div>
          <p style={{ ...P, marginBottom: 0, fontSize: 14 }}>{body}</p>
        </div>
      ))}
    </div>
  );
}

function FourCards({ items }: { items: { title: string; body: string }[] }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: 16,
      margin: '24px 0',
    }}>
      {items.map(({ title, body }) => (
        <div key={title} style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          borderRadius: 10,
          padding: '20px',
        }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 14,
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: 10,
          }}>
            {title}
          </div>
          <p style={{ ...P, marginBottom: 0, fontSize: 13 }}>{body}</p>
        </div>
      ))}
    </div>
  );
}

function ComparisonTable({
  leftTitle, rightTitle, leftItems, rightItems,
}: {
  leftTitle: string; rightTitle: string; leftItems: string[]; rightItems: string[];
}) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 2,
      margin: '28px 0',
      border: '1px solid var(--border-default)',
      borderRadius: 10,
      overflow: 'hidden',
    }}>
      {/* Headers */}
      <div style={{
        background: 'rgba(248,113,113,0.08)',
        padding: '12px 20px',
        fontFamily: 'var(--font-data)',
        fontSize: 11,
        fontWeight: 700,
        color: '#f87171',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
      }}>
        {leftTitle}
      </div>
      <div style={{
        background: 'rgba(168,255,120,0.08)',
        padding: '12px 20px',
        fontFamily: 'var(--font-data)',
        fontSize: 11,
        fontWeight: 700,
        color: 'var(--thm-green)',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
      }}>
        {rightTitle}
      </div>
      {/* Rows */}
      {leftItems.map((item, i) => (
        <>
          <div key={`l${i}`} style={{
            padding: '12px 20px',
            background: i % 2 === 0 ? 'rgba(248,113,113,0.04)' : 'transparent',
            borderTop: '1px solid var(--border-subtle)',
            fontFamily: 'var(--font-display)',
            fontSize: 13,
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
          }}>
            {item}
          </div>
          <div key={`r${i}`} style={{
            padding: '12px 20px',
            background: i % 2 === 0 ? 'rgba(168,255,120,0.04)' : 'transparent',
            borderTop: '1px solid var(--border-subtle)',
            fontFamily: 'var(--font-display)',
            fontSize: 13,
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
          }}>
            {rightItems[i]}
          </div>
        </>
      ))}
    </div>
  );
}

function PropertyGrid({ items }: { items: { name: string; description: string }[] }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: 12,
      margin: '24px 0',
    }}>
      {items.map(({ name, description }) => (
        <div key={name} style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          borderTop: '2px solid var(--thm-green)',
          borderRadius: '0 0 8px 8px',
          padding: '16px',
        }}>
          <div style={{
            fontFamily: 'var(--font-data)',
            fontSize: 13,
            fontWeight: 700,
            color: 'var(--thm-green)',
            marginBottom: 6,
          }}>
            {name}
          </div>
          <p style={{ ...P, marginBottom: 0, fontSize: 12 }}>{description}</p>
        </div>
      ))}
    </div>
  );
}

function ComparisonMatrix({
  headers, rows,
}: {
  headers: [string, string, string];
  rows: { prop: string; left: string; right: string }[];
}) {
  return (
    <div style={{
      margin: '28px 0',
      border: '1px solid var(--border-default)',
      borderRadius: 10,
      overflow: 'hidden',
    }}>
      {/* Header row */}
      <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr 1fr' }}>
        <div style={{ padding: '12px 16px', background: 'var(--bg-elevated)' }} />
        <div style={{
          padding: '12px 16px',
          background: 'var(--bg-elevated)',
          fontFamily: 'var(--font-data)',
          fontSize: 11,
          fontWeight: 700,
          color: '#fbbf24',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          borderLeft: '1px solid var(--border-default)',
        }}>
          {headers[1]}
        </div>
        <div style={{
          padding: '12px 16px',
          background: 'var(--bg-elevated)',
          fontFamily: 'var(--font-data)',
          fontSize: 11,
          fontWeight: 700,
          color: '#f7931a',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          borderLeft: '1px solid var(--border-default)',
        }}>
          {headers[2]}
        </div>
      </div>
      {/* Data rows */}
      {rows.map(({ prop, left, right }, i) => (
        <div
          key={prop}
          style={{
            display: 'grid',
            gridTemplateColumns: '140px 1fr 1fr',
            borderTop: '1px solid var(--border-subtle)',
            background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
          }}
        >
          <div style={{
            padding: '14px 16px',
            fontFamily: 'var(--font-data)',
            fontSize: 11,
            fontWeight: 700,
            color: 'var(--text-secondary)',
            letterSpacing: '0.06em',
            display: 'flex',
            alignItems: 'flex-start',
          }}>
            {prop}
          </div>
          <div style={{
            padding: '14px 16px',
            fontFamily: 'var(--font-display)',
            fontSize: 13,
            color: 'var(--text-secondary)',
            lineHeight: 1.55,
            borderLeft: '1px solid var(--border-subtle)',
          }}>
            {left}
          </div>
          <div style={{
            padding: '14px 16px',
            fontFamily: 'var(--font-display)',
            fontSize: 13,
            color: 'var(--text-secondary)',
            lineHeight: 1.55,
            borderLeft: '1px solid var(--border-subtle)',
            background: 'rgba(247,147,26,0.03)',
          }}>
            {right}
          </div>
        </div>
      ))}
    </div>
  );
}

function FaqBlocks({ items }: { items: { question: string; answer: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div style={{ margin: '28px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map(({ question, answer }, i) => (
        <div key={i} style={{
          border: '1px solid var(--border-default)',
          borderRadius: 8,
          overflow: 'hidden',
        }}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 18px',
              background: open === i ? 'rgba(168,255,120,0.04)' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              gap: 12,
            }}
          >
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--text-primary)',
              lineHeight: 1.4,
            }}>
              {question}
            </span>
            <span style={{
              fontFamily: 'var(--font-data)',
              fontSize: 16,
              color: 'var(--thm-green)',
              flexShrink: 0,
              transition: 'transform 0.2s',
              transform: open === i ? 'rotate(45deg)' : 'rotate(0deg)',
            }}>
              +
            </span>
          </button>
          {open === i && (
            <div style={{
              padding: '4px 18px 16px',
              fontFamily: 'var(--font-display)',
              fontSize: 14,
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
            }}>
              {answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function InsightBlocks({ items }: { items: { title: string; body: string }[] }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: 16,
      margin: '24px 0',
    }}>
      {items.map(({ title, body }) => (
        <div key={title} style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          borderLeft: '3px solid var(--thm-green)',
          borderRadius: '0 10px 10px 0',
          padding: '20px',
        }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 14,
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: 10,
          }}>
            {title}
          </div>
          <p style={{ ...P, marginBottom: 0, fontSize: 13 }}>{body}</p>
        </div>
      ))}
    </div>
  );
}

const TAG_COLORS: Record<string, string> = {
  Bitcoin: '#f7931a',
  Monetary: '#a8ff78',
  Foundation: '#60a5fa',
};

function BookCards({ items }: { items: { title: string; author: string; description: string; tag: string }[] }) {
  return (
    <div style={{ margin: '28px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
      {items.map(({ title, author, description, tag }) => (
        <div key={title} style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          borderRadius: 10,
          padding: '20px',
          display: 'flex',
          gap: 16,
          alignItems: 'flex-start',
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 15,
                fontWeight: 700,
                color: 'var(--text-primary)',
              }}>
                {title}
              </div>
              <span style={{
                fontFamily: 'var(--font-data)',
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '0.1em',
                padding: '2px 8px',
                borderRadius: 4,
                border: `1px solid ${TAG_COLORS[tag] ?? '#94a3b8'}40`,
                background: `${TAG_COLORS[tag] ?? '#94a3b8'}12`,
                color: TAG_COLORS[tag] ?? '#94a3b8',
              }}>
                {tag.toUpperCase()}
              </span>
            </div>
            <div style={{
              fontFamily: 'var(--font-data)',
              fontSize: 11,
              color: 'var(--text-muted)',
              marginBottom: 8,
              letterSpacing: '0.04em',
            }}>
              {author}
            </div>
            <p style={{ ...P, marginBottom: 0, fontSize: 13 }}>{description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function CtaPanels({
  left, right,
}: {
  left: { title: string; label: string; to: string };
  right: { title: string; label: string; note: string };
}) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 16,
      marginTop: 32,
    }}>
      <Link to={left.to} style={{ textDecoration: 'none' }}>
        <div style={{
          background: 'rgba(168,255,120,0.06)',
          border: '1px solid var(--border-accent)',
          borderRadius: 12,
          padding: '28px',
          textAlign: 'center',
          cursor: 'pointer',
        }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 16,
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: 16,
          }}>
            {left.title}
          </div>
          <div style={{
            fontFamily: 'var(--font-data)',
            fontSize: 12,
            color: 'var(--thm-green)',
            letterSpacing: '0.06em',
          }}>
            {left.label}
          </div>
        </div>
      </Link>
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        borderRadius: 12,
        padding: '28px',
        textAlign: 'center',
        opacity: 0.6,
      }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 16,
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: 16,
        }}>
          {right.title}
        </div>
        <div style={{
          fontFamily: 'var(--font-data)',
          fontSize: 11,
          color: 'var(--text-muted)',
          letterSpacing: '0.06em',
        }}>
          {right.note}
        </div>
      </div>
    </div>
  );
}

// ── Block dispatcher ─────────────────────────────────────────────────────────

function Block({ block }: { block: ActBlock }) {
  switch (block.type) {
    case 'paragraph':        return <Paragraph text={block.text} />;
    case 'pullquote':        return <PullQuote text={block.text} />;
    case 'coming-next':      return <ComingNext text={block.text} />;
    case 'stat-cards':       return <StatCards items={block.items} />;
    case 'two-col-table':    return <TwoColTable left={block.left} right={block.right} />;
    case 'four-cards':       return <FourCards items={block.items} />;
    case 'comparison-table': return <ComparisonTable leftTitle={block.leftTitle} rightTitle={block.rightTitle} leftItems={block.leftItems} rightItems={block.rightItems} />;
    case 'property-grid':    return <PropertyGrid items={block.items} />;
    case 'comparison-matrix': return <ComparisonMatrix headers={block.headers} rows={block.rows} />;
    case 'faq-blocks':       return <FaqBlocks items={block.items} />;
    case 'insight-blocks':   return <InsightBlocks items={block.items} />;
    case 'book-cards':       return <BookCards items={block.items} />;
    case 'cta-panels':       return <CtaPanels left={block.left} right={block.right} />;
    default:                 return null;
  }
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function LearnAct() {
  const { n } = useParams<{ n: string }>();
  const navigate = useNavigate();

  const actNum = parseInt(n ?? '1', 10);
  const act = ACTS.find((a) => a.n === actNum);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [actNum]);

  if (!act) {
    return (
      <div style={{ paddingTop: 56, textAlign: 'center', padding: '120px 40px' }}>
        <div style={{ fontFamily: 'var(--font-data)', color: 'var(--text-muted)', marginBottom: 16 }}>
          Act not found.
        </div>
        <Link to="/learn" style={{ color: 'var(--thm-green)', fontFamily: 'var(--font-data)', fontSize: 12 }}>
          ← Back to series
        </Link>
      </div>
    );
  }

  const prevAct = ACTS.find((a) => a.n === actNum - 1);
  const nextAct = ACTS.find((a) => a.n === actNum + 1);

  return (
    <div style={{ paddingTop: 56 }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 40px 80px' }}>

        {/* Progress bar */}
        <div style={{ marginBottom: 32 }}>
          <div style={{
            fontFamily: 'var(--font-data)',
            fontSize: 11,
            color: 'var(--text-muted)',
            letterSpacing: '0.08em',
            marginBottom: 10,
          }}>
            ACT {act.n} OF {ACTS.length}
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {ACTS.map((a) => (
              <div
                key={a.n}
                onClick={() => navigate(`/learn/act/${a.n}`)}
                style={{
                  flex: 1,
                  height: 4,
                  borderRadius: 2,
                  background: a.n === actNum
                    ? 'var(--thm-green)'
                    : a.n < actNum
                    ? 'rgba(168,255,120,0.3)'
                    : 'var(--border-default)',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
              />
            ))}
          </div>
        </div>

        {/* Act title */}
        <div style={{
          fontFamily: 'var(--font-data)',
          fontSize: 10,
          color: 'var(--thm-green)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: 10,
        }}>
          Education Series
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 28,
          fontWeight: 800,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
          lineHeight: 1.25,
          marginBottom: 40,
        }}>
          {act.title}
        </h1>

        {/* Content blocks */}
        <div>
          {act.blocks.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </div>

        {/* Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 48,
          paddingTop: 24,
          borderTop: '1px solid var(--border-subtle)',
          gap: 12,
          flexWrap: 'wrap',
        }}>
          {prevAct ? (
            <Link
              to={`/learn/act/${prevAct.n}`}
              style={{
                fontFamily: 'var(--font-data)',
                fontSize: 11,
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                letterSpacing: '0.06em',
              }}
            >
              ← Act {prevAct.n}: {prevAct.title.split(' ').slice(0, 4).join(' ')}…
            </Link>
          ) : (
            <div />
          )}

          {nextAct ? (
            <Link
              to={`/learn/act/${nextAct.n}`}
              style={{
                fontFamily: 'var(--font-data)',
                fontSize: 11,
                fontWeight: 600,
                color: 'var(--thm-green)',
                textDecoration: 'none',
                letterSpacing: '0.06em',
                padding: '10px 20px',
                border: '1px solid var(--border-accent)',
                borderRadius: 8,
                background: 'var(--thm-green-dim)',
              }}
            >
              Next: Act {nextAct.n} →
            </Link>
          ) : (
            <div style={{ display: 'flex', gap: 12 }}>
              <Link
                to="/"
                style={{
                  fontFamily: 'var(--font-data)',
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--thm-green)',
                  textDecoration: 'none',
                  letterSpacing: '0.06em',
                  padding: '10px 20px',
                  border: '1px solid var(--border-accent)',
                  borderRadius: 8,
                  background: 'var(--thm-green-dim)',
                }}
              >
                Return to Dashboard →
              </Link>
              <Link
                to="/contact"
                style={{
                  fontFamily: 'var(--font-data)',
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  letterSpacing: '0.06em',
                  padding: '10px 20px',
                  border: '1px solid var(--border-default)',
                  borderRadius: 8,
                }}
              >
                Contact Us →
              </Link>
            </div>
          )}
        </div>

        {/* Back to series */}
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <Link
            to="/learn"
            style={{
              fontFamily: 'var(--font-data)',
              fontSize: 11,
              color: 'var(--text-muted)',
              textDecoration: 'none',
              letterSpacing: '0.06em',
            }}
          >
            ← Back to series overview
          </Link>
        </div>

      </div>
    </div>
  );
}
