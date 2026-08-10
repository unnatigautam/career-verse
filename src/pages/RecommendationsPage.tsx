import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProfile } from '../services/profileService';
import { createRecommendation } from '../services/recommendationService';
import CareerCard from '../components/CareerCard';
import { AILoadingState } from '../components/LoadingSpinner';
import type { Profile, Recommendation } from '../types';

export default function RecommendationsPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) setProfile(getProfile(user.id));
  }, [user]);

  const handleGenerate = async () => {
    if (!profile) return;
    setLoading(true);
    setError('');
    setRecommendation(null);
    try {
      const rec = await createRecommendation(profile);
      setRecommendation(rec);
    } catch (err) {
      setError('Something went wrong generating recommendations. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const profileIncomplete = !profile || !profile.skills.length || !profile.interests.length;

  return (
    <div className="mesh-bg" style={{ minHeight: '100vh', padding: '2rem 1.5rem' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem', color: '#6366F1', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 0.5rem' }}>
            AI Career Advisor
          </p>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#E8EAF6', margin: '0 0 0.5rem', letterSpacing: '-0.02em' }}>
            Your Career Recommendations
          </h1>
          <p style={{ color: '#475569', margin: 0, fontSize: '0.9375rem' }}>
            Based on your skills, interests, academic background, and career goals.
          </p>
        </div>

        {/* Profile incomplete warning */}
        {profileIncomplete && !loading && !recommendation && (
          <div
            style={{
              background: 'rgba(251,191,36,0.08)',
              border: '1px solid rgba(251,191,36,0.25)',
              borderRadius: 14,
              padding: '1.25rem 1.5rem',
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem',
            }}
          >
            <span style={{ color: '#FCD34D', fontSize: 20, flexShrink: 0 }}>⚠</span>
            <div>
              <p style={{ color: '#FCD34D', fontWeight: 600, margin: '0 0 0.375rem', fontSize: '0.9375rem' }}>
                Your profile needs more information
              </p>
              <p style={{ color: '#92400E', margin: '0 0 0.75rem', fontSize: '0.875rem' }}>
                Add at least your skills and interests for more accurate recommendations.
              </p>
              <Link to="/profile" className="btn-primary" style={{ textDecoration: 'none', background: 'rgba(251,191,36,0.2)', color: '#FCD34D', border: '1px solid rgba(251,191,36,0.3)' }}>
                Complete profile →
              </Link>
            </div>
          </div>
        )}

        {/* Profile summary */}
        {profile && !loading && (
          <div className="card" style={{ marginBottom: '2rem' }}>
            <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 1rem' }}>
              Analyzing based on your profile
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {profile.degree && (
                <div>
                  <p style={{ fontSize: '0.8125rem', color: '#374151', margin: '0 0 0.375rem' }}>Degree</p>
                  <p style={{ fontSize: '0.9rem', color: '#CBD5E1', fontWeight: 500, margin: 0 }}>{profile.degree}</p>
                </div>
              )}
              {profile.skills.length > 0 && (
                <div>
                  <p style={{ fontSize: '0.8125rem', color: '#374151', margin: '0 0 0.375rem' }}>Skills ({profile.skills.length})</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                    {profile.skills.slice(0, 4).map((s) => (
                      <span key={s} className="tag" style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}>{s}</span>
                    ))}
                    {profile.skills.length > 4 && <span style={{ fontSize: '0.75rem', color: '#475569' }}>+{profile.skills.length - 4}</span>}
                  </div>
                </div>
              )}
              {profile.preferredAreas.length > 0 && (
                <div>
                  <p style={{ fontSize: '0.8125rem', color: '#374151', margin: '0 0 0.375rem' }}>Focus areas</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                    {profile.preferredAreas.slice(0, 2).map((a) => (
                      <span key={a} className="tag tag-cyan" style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}>{a}</span>
                    ))}
                    {profile.preferredAreas.length > 2 && <span style={{ fontSize: '0.75rem', color: '#475569' }}>+{profile.preferredAreas.length - 2}</span>}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Generate button */}
        {!loading && !recommendation && (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: 20,
                background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(34,211,238,0.1))',
                border: '1px solid rgba(99,102,241,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 32,
                margin: '0 auto 1.5rem',
              }}
            >
              ✦
            </div>
            <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#E8EAF6', margin: '0 0 0.75rem' }}>
              Ready to discover your career paths?
            </h2>
            <p style={{ color: '#475569', margin: '0 0 2rem', fontSize: '0.9375rem', maxWidth: 420, marginLeft: 'auto', marginRight: 'auto' }}>
              Click below to let our AI analyze your profile and generate 3 personalized career recommendations.
            </p>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '0.75rem 1rem', color: '#F87171', fontSize: '0.875rem', marginBottom: '1.5rem', maxWidth: 400, margin: '0 auto 1.5rem' }}>
                {error}
              </div>
            )}

            <button
              onClick={handleGenerate}
              className="btn-primary"
              style={{ fontSize: '1.0625rem', padding: '0.875rem 2.5rem' }}
            >
              ✦ Generate AI Recommendations →
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
            <AILoadingState />
          </div>
        )}

        {/* Results */}
        {recommendation && !loading && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#E8EAF6', margin: '0 0 0.25rem' }}>
                  Your 3 career recommendations
                </h2>
                <p style={{ color: '#475569', fontSize: '0.875rem', margin: 0, fontFamily: "'JetBrains Mono', monospace" }}>
                  Generated {new Date(recommendation.createdAt).toLocaleString()}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link to="/compare" className="btn-secondary" style={{ textDecoration: 'none' }}>
                  ⊞ Compare paths →
                </Link>
                <button onClick={handleGenerate} className="btn-ghost">
                  ↺ Regenerate
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {recommendation.careers.map((career, i) => (
                <CareerCard key={career.title} career={career} index={i} />
              ))}
            </div>

            <div
              style={{
                marginTop: '2rem',
                background: 'rgba(99,102,241,0.05)',
                border: '1px solid rgba(99,102,241,0.15)',
                borderRadius: 14,
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                flexWrap: 'wrap',
              }}
            >
              <span style={{ color: '#818CF8', fontSize: 20 }}>◫</span>
              <p style={{ color: '#94A3B8', fontSize: '0.9rem', margin: 0, flex: 1 }}>
                These recommendations have been saved to your history. You can revisit them anytime.
              </p>
              <Link to="/history" style={{ color: '#818CF8', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none', flexShrink: 0 }}>
                View history →
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
