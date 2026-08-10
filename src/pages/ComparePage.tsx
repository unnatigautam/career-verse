import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRecommendations } from '../services/recommendationService';
import type { Recommendation, CareerPath } from '../types';

const ACCENT = [
  { color: '#818CF8', bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.25)' },
  { color: '#22D3EE', bg: 'rgba(34,211,238,0.08)', border: 'rgba(34,211,238,0.2)' },
  { color: '#34D399', bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.2)' },
];

type CompareEntry = { rec: Recommendation; career: CareerPath; recIdx: number; careerIdx: number };

export default function ComparePage() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [selected, setSelected] = useState<CompareEntry[]>([]);

  useEffect(() => {
    if (user) setRecommendations(getRecommendations(user.id));
  }, [user]);

  const allCareers: CompareEntry[] = recommendations.flatMap((rec, ri) =>
    rec.careers.map((career, ci) => ({ rec, career, recIdx: ri, careerIdx: ci }))
  );

  const toggleSelect = (entry: CompareEntry) => {
    const key = `${entry.rec.id}-${entry.careerIdx}`;
    const already = selected.findIndex((s) => `${s.rec.id}-${s.careerIdx}` === key);
    if (already >= 0) {
      setSelected((prev) => prev.filter((_, i) => i !== already));
    } else if (selected.length < 3) {
      setSelected((prev) => [...prev, entry]);
    }
  };

  const isSelected = (entry: CompareEntry) =>
    selected.some((s) => s.rec.id === entry.rec.id && s.careerIdx === entry.careerIdx);

  const ROWS = [
    {
      label: 'Career path',
      render: (e: CompareEntry) => (
        <span style={{ fontWeight: 700, color: '#E8EAF6', fontSize: '1rem' }}>{e.career.title}</span>
      ),
    },
    {
      label: 'Match',
      render: (e: CompareEntry, idx: number) => (
        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: ACCENT[idx].color, background: ACCENT[idx].bg, border: `1px solid ${ACCENT[idx].border}`, borderRadius: 100, padding: '0.25rem 0.875rem', display: 'inline-block' }}>
          {e.career.matchScore >= 85 ? 'Strong Match' : 'Good Match'}
        </span>
      ),
    },
    {
      label: 'Why it suits you',
      render: (e: CompareEntry) => (
        <p style={{ fontSize: '0.875rem', color: '#CBD5E1', margin: 0, lineHeight: 1.6 }}>{e.career.whySuitable}</p>
      ),
    },
    {
      label: 'Skills to learn',
      render: (e: CompareEntry, idx: number) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          {e.career.skillsToLearn.map((s) => (
            <div key={s} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
              <span style={{ color: ACCENT[idx].color, flexShrink: 0, fontSize: '0.75rem', marginTop: 3 }}>◆</span>
              <span style={{ fontSize: '0.875rem', color: '#CBD5E1' }}>{s}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      label: 'Next steps',
      render: (e: CompareEntry, idx: number) => (
        <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {e.career.nextSteps.map((step, i) => (
            <li key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
              <span style={{
                background: ACCENT[idx].bg,
                color: ACCENT[idx].color,
                border: `1px solid ${ACCENT[idx].border}`,
                borderRadius: 4,
                width: 20,
                height: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.625rem',
                fontWeight: 700,
                flexShrink: 0,
                fontFamily: "'JetBrains Mono', monospace",
                marginTop: 1,
              }}>
                {i + 1}
              </span>
              <span style={{ fontSize: '0.875rem', color: '#CBD5E1', lineHeight: 1.5 }}>{step}</span>
            </li>
          ))}
        </ol>
      ),
    },
  ];

  return (
    <div className="mesh-bg" style={{ minHeight: '100vh', padding: '2rem 1.5rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        <div style={{ marginBottom: '2.5rem' }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem', color: '#6366F1', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 0.5rem' }}>
            Compare
          </p>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#E8EAF6', margin: '0 0 0.5rem', letterSpacing: '-0.02em' }}>
            Compare career paths
          </h1>
          <p style={{ color: '#475569', margin: 0, fontSize: '0.9375rem' }}>
            Select up to 3 careers from your recommendations to compare side-by-side.
          </p>
        </div>

        {recommendations.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ fontSize: 48, marginBottom: '1.25rem', opacity: 0.3 }}>⊞</div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#E8EAF6', margin: '0 0 0.75rem' }}>No recommendations to compare</h2>
            <p style={{ color: '#475569', margin: '0 0 2rem', fontSize: '0.9375rem' }}>
              Generate AI recommendations first, then come back to compare them.
            </p>
            <Link to="/recommendations" className="btn-primary" style={{ textDecoration: 'none' }}>
              ✦ Get recommendations →
            </Link>
          </div>
        ) : (
          <>
            {/* Selection panel */}
            <div className="card" style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#E8EAF6', margin: 0 }}>
                  Select careers to compare
                  <span style={{ fontSize: '0.8125rem', color: '#475569', fontWeight: 400, marginLeft: '0.5rem' }}>
                    ({selected.length}/3 selected)
                  </span>
                </h2>
                {selected.length > 0 && (
                  <button onClick={() => setSelected([])} className="btn-ghost" style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem' }}>
                    Clear all
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
                {allCareers.map((entry, i) => {
                  const sel = isSelected(entry);
                  const selIdx = selected.findIndex((s) => s.rec.id === entry.rec.id && s.careerIdx === entry.careerIdx);
                  const disabled = !sel && selected.length >= 3;
                  return (
                    <button
                      key={`${entry.rec.id}-${entry.careerIdx}`}
                      onClick={() => toggleSelect(entry)}
                      disabled={disabled}
                      style={{
                        background: sel ? ACCENT[selIdx]?.bg ?? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${sel ? ACCENT[selIdx]?.border ?? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.07)'}`,
                        borderRadius: 10,
                        padding: '0.5rem 1rem',
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        opacity: disabled ? 0.4 : 1,
                        transition: 'all 0.15s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontFamily: "'Outfit', sans-serif",
                      }}
                    >
                      {sel && (
                        <span style={{ color: ACCENT[selIdx]?.color, fontSize: '0.75rem' }}>✓</span>
                      )}
                      <span style={{ fontSize: '0.875rem', color: sel ? ACCENT[selIdx]?.color : '#94A3B8', fontWeight: sel ? 600 : 400 }}>
                        {entry.career.title}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#374151' }}>
                        {entry.career.matchScore >= 85 ? 'Strong Match' : 'Good Match'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comparison table */}
            {selected.length >= 2 ? (
              <div
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 16,
                  overflow: 'hidden',
                }}
              >
                {/* Headers */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `180px repeat(${selected.length}, 1fr)`,
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <div style={{ padding: '1.25rem', background: 'rgba(0,0,0,0.15)' }} />
                  {selected.map((entry, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '1.25rem',
                        background: ACCENT[idx].bg,
                        borderLeft: `1px solid ${ACCENT[idx].border}`,
                        borderBottom: `3px solid ${ACCENT[idx].color}`,
                      }}
                    >
                      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', color: ACCENT[idx].color, margin: '0 0 0.375rem', letterSpacing: '0.04em' }}>
                        Option {idx + 1}
                      </p>
                      <p style={{ fontSize: '1rem', fontWeight: 700, color: '#E8EAF6', margin: 0, lineHeight: 1.3 }}>
                        {entry.career.title}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Rows */}
                {ROWS.slice(1).map((row, ri) => (
                  <div
                    key={row.label}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: `180px repeat(${selected.length}, 1fr)`,
                      borderBottom: ri < ROWS.length - 2 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    }}
                  >
                    <div
                      style={{
                        padding: '1.25rem',
                        background: 'rgba(0,0,0,0.08)',
                        display: 'flex',
                        alignItems: 'flex-start',
                        borderRight: '1px solid rgba(255,255,255,0.04)',
                      }}
                    >
                      <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
                        {row.label}
                      </p>
                    </div>
                    {selected.map((entry, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '1.25rem',
                          borderLeft: '1px solid rgba(255,255,255,0.04)',
                        }}
                      >
                        {row.render(entry, idx)}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  textAlign: 'center',
                  padding: '3rem',
                  background: 'rgba(255,255,255,0.01)',
                  border: '2px dashed rgba(99,102,241,0.15)',
                  borderRadius: 16,
                  color: '#374151',
                }}
              >
                <p style={{ fontSize: '1rem', margin: 0 }}>
                  Select at least 2 career paths above to see a side-by-side comparison
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
