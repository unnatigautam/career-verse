import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProfile, getProfileCompletion } from '../services/profileService';
import { getRecommendations } from '../services/recommendationService';
import type { Profile, Recommendation } from '../types';

const QUICK_LINKS = [
  { to: '/profile', icon: '◈', label: 'Edit Profile', desc: 'Update skills & goals', color: '#818CF8' },
  { to: '/recommendations', icon: '✦', label: 'AI Advisor', desc: 'Get career recommendations', color: '#22D3EE' },
  { to: '/history', icon: '◫', label: 'History', desc: 'View past recommendations', color: '#34D399' },
  { to: '/compare', icon: '⊞', label: 'Compare', desc: 'Compare career paths', color: '#FCD34D' },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    if (!user) return;
    const p = getProfile(user.id);
    setProfile(p);
    setCompletion(getProfileCompletion(p));
    setRecommendations(getRecommendations(user.id).slice(0, 3));
  }, [user]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.name?.split(' ')[0] ?? 'there';

  const latestRec = recommendations[0];

  return (
    <div className="mesh-bg" style={{ minHeight: '100vh', padding: '2rem 1.5rem' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem', color: '#6366F1', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 0.5rem' }}>
              Dashboard
            </p>
            <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', fontWeight: 800, color: '#E8EAF6', margin: 0, letterSpacing: '-0.02em' }}>
              {greeting}, {firstName} 👋
            </h1>
            <p style={{ color: '#475569', margin: '0.5rem 0 0', fontSize: '0.9375rem' }}>
              {completion < 100
                ? `Complete your profile to unlock better AI recommendations.`
                : `Your profile is complete — ready for AI analysis.`}
            </p>
          </div>
          <Link to="/recommendations" className="btn-primary" style={{ textDecoration: 'none', flexShrink: 0 }}>
            ✦ Get AI Recommendations →
          </Link>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Profile completion', value: `${completion}%`, sub: completion < 100 ? 'Finish to improve accuracy' : 'Fully complete', color: '#6366F1' },
            { label: 'Skills added', value: String(profile?.skills.length ?? 0), sub: profile?.skills.length ? `Latest: ${profile.skills[profile.skills.length - 1]}` : 'Add your skills', color: '#22D3EE' },
            { label: 'Interests added', value: String(profile?.interests.length ?? 0), sub: 'Help AI understand you better', color: '#34D399' },
            { label: 'Recommendations', value: String(recommendations.length), sub: recommendations.length ? 'View history →' : 'None yet', color: '#FCD34D' },
          ].map((stat) => (
            <div key={stat.label} className="card" style={{ padding: '1.25rem' }}>
              <p style={{ fontSize: '0.8125rem', color: '#475569', margin: '0 0 0.5rem', fontWeight: 500 }}>{stat.label}</p>
              <p style={{ fontSize: '1.875rem', fontWeight: 800, color: stat.color, margin: '0 0 0.25rem', fontFamily: "'JetBrains Mono', monospace" }}>{stat.value}</p>
              <p style={{ fontSize: '0.8125rem', color: '#374151', margin: 0 }}>{stat.sub}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

          {/* Profile card */}
          <div className="card" style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#E8EAF6', margin: 0 }}>Your Profile</h2>
              <Link to="/profile" style={{ fontSize: '0.8125rem', color: '#818CF8', textDecoration: 'none', fontWeight: 500 }}>
                Edit →
              </Link>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8125rem', color: '#475569' }}>Completion</span>
                <span style={{ fontSize: '0.8125rem', color: '#818CF8', fontFamily: "'JetBrains Mono', monospace" }}>{completion}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${completion}%` }} />
              </div>
            </div>

            {profile ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { label: 'Degree', value: profile.degree || '—' },
                  { label: 'Year', value: profile.year || '—' },
                  { label: 'Preferred areas', value: profile.preferredAreas.length ? profile.preferredAreas.slice(0, 2).join(', ') : '—' },
                ].map((row) => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8125rem', color: '#475569' }}>{row.label}</span>
                    <span style={{ fontSize: '0.875rem', color: '#CBD5E1', fontWeight: 500 }}>{row.value}</span>
                  </div>
                ))}

                {profile.skills.length > 0 && (
                  <div style={{ paddingTop: '0.5rem', borderTop: '1px solid var(--border)' }}>
                    <p style={{ fontSize: '0.8125rem', color: '#475569', margin: '0 0 0.5rem' }}>Skills</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                      {profile.skills.slice(0, 6).map((s) => (
                        <span key={s} className="tag">{s}</span>
                      ))}
                      {profile.skills.length > 6 && (
                        <span className="tag" style={{ color: '#475569', borderColor: 'transparent' }}>+{profile.skills.length - 6}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <p style={{ color: '#374151', marginBottom: '1rem', fontSize: '0.9375rem' }}>
                  Complete your profile to get started
                </p>
                <Link to="/profile" className="btn-primary" style={{ textDecoration: 'none' }}>
                  Build Profile →
                </Link>
              </div>
            )}
          </div>

          {/* Latest recommendation */}
          <div className="card" style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#E8EAF6', margin: 0 }}>Latest Recommendation</h2>
              {recommendations.length > 0 && (
                <Link to="/history" style={{ fontSize: '0.8125rem', color: '#818CF8', textDecoration: 'none', fontWeight: 500 }}>
                  View all →
                </Link>
              )}
            </div>

            {latestRec ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <p style={{ fontSize: '0.8125rem', color: '#374151', margin: 0, fontFamily: "'JetBrains Mono', monospace" }}>
                  {new Date(latestRec.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
                {latestRec.careers.map((career, i) => {
                  const colors = ['#818CF8', '#22D3EE', '#34D399'];
                  return (
                    <div
                      key={career.title}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem',
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: 10,
                        border: '1px solid rgba(255,255,255,0.04)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', color: colors[i] }}>
                          #{i + 1}
                        </span>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#CBD5E1' }}>
                          {career.title}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: colors[i], background: `${colors[i]}15`, border: `1px solid ${colors[i]}25`, borderRadius: 100, padding: '0.15rem 0.5rem' }}>
                        {career.matchScore >= 85 ? 'Strong' : 'Good'}
                      </span>
                    </div>
                  );
                })}
                <Link to="/compare" className="btn-secondary" style={{ textDecoration: 'none', justifyContent: 'center', marginTop: '0.25rem' }}>
                  ⊞ Compare these paths →
                </Link>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <div style={{ fontSize: 36, marginBottom: '0.875rem', opacity: 0.4 }}>✦</div>
                <p style={{ color: '#374151', marginBottom: '1rem', fontSize: '0.9375rem' }}>
                  No recommendations yet
                </p>
                <Link to="/recommendations" className="btn-primary" style={{ textDecoration: 'none' }}>
                  Get AI Recommendations →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick links */}
        <div style={{ marginTop: '1.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#E8EAF6', marginBottom: '1rem' }}>Quick navigation</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  textDecoration: 'none',
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 14,
                  padding: '1.125rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.875rem',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = `${link.color}40`;
                  (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border)';
                  (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: `${link.color}18`,
                    border: `1px solid ${link.color}30`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                    color: link.color,
                    flexShrink: 0,
                  }}
                >
                  {link.icon}
                </div>
                <div>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#E8EAF6', margin: 0 }}>{link.label}</p>
                  <p style={{ fontSize: '0.8125rem', color: '#475569', margin: 0 }}>{link.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
