import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRecommendations, deleteRecommendation } from '../services/recommendationService';
import type { Recommendation, CareerPath } from '../types';

function RecommendationDetail({ rec, onClose }: { rec: Recommendation; onClose: () => void }) {
  const ACCENT = ['#818CF8', '#22D3EE', '#34D399'];
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 20,
          padding: '2rem',
          maxWidth: 720,
          width: '100%',
          maxHeight: '85vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#E8EAF6', margin: '0 0 0.25rem' }}>
              Recommendation Details
            </h2>
            <p style={{ fontSize: '0.8125rem', color: '#475569', margin: 0, fontFamily: "'JetBrains Mono', monospace" }}>
              {new Date(rec.createdAt).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <button onClick={onClose} className="btn-ghost" style={{ padding: '0.375rem 0.75rem', fontSize: '1rem' }}>✕</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {rec.careers.map((career: CareerPath, i: number) => (
            <div
              key={career.title}
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 14,
                padding: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', color: ACCENT[i] }}>#{i + 1}</span>
                  <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#E8EAF6', margin: 0 }}>{career.title}</h3>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: ACCENT[i], background: `${ACCENT[i]}15`, border: `1px solid ${ACCENT[i]}25`, borderRadius: 100, padding: '0.2rem 0.625rem' }}>
                  {career.matchScore >= 85 ? 'Strong Match' : 'Good Match'}
                </span>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#94A3B8', margin: '0 0 0.75rem', lineHeight: 1.6 }}>
                {career.whySuitable}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                {career.skillsToLearn.slice(0, 4).map((s) => (
                  <span key={s} style={{ background: `${ACCENT[i]}12`, color: ACCENT[i], border: `1px solid ${ACCENT[i]}25`, borderRadius: 100, padding: '0.2rem 0.625rem', fontSize: '0.75rem', fontFamily: "'JetBrains Mono', monospace" }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HistoryPage() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [selected, setSelected] = useState<Recommendation | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (user) setRecommendations(getRecommendations(user.id));
  }, [user]);

  const handleDelete = (id: string) => {
    if (!user) return;
    setDeleting(id);
    setTimeout(() => {
      deleteRecommendation(user.id, id);
      setRecommendations(getRecommendations(user.id));
      setDeleting(null);
    }, 300);
  };

  const ACCENT = ['#818CF8', '#22D3EE', '#34D399'];

  return (
    <div className="mesh-bg" style={{ minHeight: '100vh', padding: '2rem 1.5rem' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>

        <div style={{ marginBottom: '2.5rem' }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem', color: '#6366F1', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 0.5rem' }}>
            History
          </p>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#E8EAF6', margin: '0 0 0.5rem', letterSpacing: '-0.02em' }}>
            Recommendation history
          </h1>
          <p style={{ color: '#475569', margin: 0, fontSize: '0.9375rem' }}>
            All your past AI-generated career recommendations, saved automatically.
          </p>
        </div>

        {recommendations.length === 0 ? (
          <div
            className="card"
            style={{ textAlign: 'center', padding: '4rem 2rem' }}
          >
            <div style={{ fontSize: 48, marginBottom: '1.25rem', opacity: 0.3 }}>◫</div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#E8EAF6', margin: '0 0 0.75rem' }}>
              No recommendations yet
            </h2>
            <p style={{ color: '#475569', margin: '0 0 2rem', fontSize: '0.9375rem' }}>
              Get your first AI-powered career recommendation to see it here.
            </p>
            <Link to="/recommendations" className="btn-primary" style={{ textDecoration: 'none' }}>
              ✦ Get recommendations →
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="card"
                style={{
                  opacity: deleting === rec.id ? 0.4 : 1,
                  transition: 'opacity 0.3s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem', color: '#374151', margin: '0 0 0.25rem' }}>
                      {new Date(rec.createdAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p style={{ fontSize: '0.875rem', color: '#475569', margin: 0 }}>
                      {rec.profileSnapshot.skills?.slice(0, 3).join(', ')}{(rec.profileSnapshot.skills?.length ?? 0) > 3 ? '...' : ''}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                    <button
                      onClick={() => setSelected(rec)}
                      className="btn-secondary"
                      style={{ padding: '0.4rem 0.875rem', fontSize: '0.8125rem' }}
                    >
                      View details
                    </button>
                    <button
                      onClick={() => handleDelete(rec.id)}
                      className="btn-danger"
                      disabled={deleting === rec.id}
                    >
                      ✕ Delete
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {rec.careers.map((career, i) => (
                    <div
                      key={career.title}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.625rem 0.875rem',
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: 10,
                        border: '1px solid rgba(255,255,255,0.04)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', color: ACCENT[i] }}>#{i + 1}</span>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#CBD5E1' }}>{career.title}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: ACCENT[i], background: `${ACCENT[i]}15`, border: `1px solid ${ACCENT[i]}25`, borderRadius: 100, padding: '0.2rem 0.625rem' }}>
                          {career.matchScore >= 85 ? 'Strong Match' : 'Good Match'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {selected && (
          <RecommendationDetail rec={selected} onClose={() => setSelected(null)} />
        )}
      </div>
    </div>
  );
}
