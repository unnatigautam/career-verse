import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FEATURES = [
  {
    icon: '◈',
    title: 'Smart Profile Analysis',
    desc: 'Enter your academic background, skills, interests, and goals to create your career profile.',
    color: '#818CF8',
  },
  {
    icon: '✦',
    title: 'AI-Powered Recommendations',
    desc: 'Get career suggestions based on the information and preferences in your profile.',
    color: '#22D3EE',
  },
  {
    icon: '⊞',
    title: 'Side-by-Side Compare',
    desc: 'Compare career paths based on skills, role requirements, learning effort, and growth opportunities.',
    color: '#34D399',
  },
  {
    icon: '◫',
    title: 'Track Your Journey',
    desc: 'Save recommendations, revisit previous results, and track the career paths you\'re exploring.',
    color: '#FCD34D',
  },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Build Your Profile', desc: 'Add your academic background, skills, interests, and career goals.' },
  { step: '02', title: 'AI Analysis', desc: 'AI analyzes your profile to identify career paths that align with your interests and skills.' },
  { step: '03', title: 'Explore Recommendations', desc: 'Get personalized career suggestions with reasons, skills to develop, and next steps.' },
];


export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="mesh-bg" style={{ minHeight: '100vh' }}>
      {/* Nav */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(7,9,26,0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(99,102,241,0.12)',
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '0 2rem',
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 9,
                background: 'linear-gradient(135deg, #6366F1, #22D3EE)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                fontWeight: 700,
                color: 'white',
              }}
            >
              ✦
            </div>
            <span style={{ fontWeight: 700, fontSize: '1.0625rem', color: '#E8EAF6', letterSpacing: '-0.02em' }}>
              CareerAI
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-primary" style={{ textDecoration: 'none' }}>
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn-ghost" style={{ textDecoration: 'none' }}>
                  Log in
                </Link>
                <Link to="/signup" className="btn-primary" style={{ textDecoration: 'none' }}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '7rem 2rem 5rem', textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.25)',
            borderRadius: 100,
            padding: '0.375rem 1rem',
            marginBottom: '2rem',
            fontSize: '0.8125rem',
            color: '#818CF8',
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          <span style={{ color: '#34D399' }}>●</span> AI-Powered Career Discovery for Students
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.25rem, 5.5vw, 4rem)',
            fontWeight: 800,
            lineHeight: 1.12,
            margin: '0 0 1.5rem',
            letterSpacing: '-0.03em',
          }}
        >
          Discover the career path
          <br />
          <span className="gradient-text">that's right for you.</span>
        </h1>

        <p
          style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
            color: '#64748B',
            maxWidth: 540,
            margin: '0 auto 2.5rem',
            lineHeight: 1.75,
          }}
        >
          Explore personalized career paths based on your skills, interests, and academic background with the help of AI.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/signup" className="btn-primary" style={{ textDecoration: 'none', fontSize: '1rem', padding: '0.75rem 2rem' }}>
            Get AI Recommendations →
          </Link>
          <Link to="/login" className="btn-secondary" style={{ textDecoration: 'none', fontSize: '1rem', padding: '0.75rem 2rem' }}>
            Sign In
          </Link>
        </div>

        <p style={{ color: '#374151', fontSize: '0.8125rem', marginTop: '1.25rem', letterSpacing: '0.01em' }}>
          AI-powered &nbsp;·&nbsp; Personalized to your profile &nbsp;·&nbsp; Built for students
        </p>

        {/* Hero visual */}
        <div
          style={{
            maxWidth: 800,
            margin: '4rem auto 0',
            background: 'rgba(14,19,48,0.8)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: 20,
            padding: '1.5rem',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 40px 80px rgba(0,0,0,0.4), 0 0 60px rgba(99,102,241,0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#475569' }}>
              Recommended Career Paths
            </span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', color: '#374151' }}>
              preview
            </span>
          </div>
          <div style={{ textAlign: 'left' }}>
            {[
              { title: 'Machine Learning Engineer', label: 'Strong Match', color: '#818CF8', bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.2)' },
              { title: 'Full Stack Developer', label: 'Good Match', color: '#22D3EE', bg: 'rgba(255,255,255,0.02)', border: 'transparent' },
              { title: 'Data Scientist', label: 'Good Match', color: '#34D399', bg: 'rgba(255,255,255,0.02)', border: 'transparent' },
            ].map((item, i) => (
              <div
                key={item.title}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.875rem 1rem',
                  background: item.bg,
                  borderRadius: 10,
                  marginBottom: 6,
                  border: `1px solid ${item.border}`,
                }}
              >
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.75rem',
                    color: '#374151',
                    width: 24,
                    flexShrink: 0,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span style={{ flex: 1, fontWeight: 600, color: '#CBD5E1', fontSize: '0.9375rem' }}>
                  {item.title}
                </span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: item.color,
                    background: `${item.color}15`,
                    border: `1px solid ${item.color}30`,
                    borderRadius: 100,
                    padding: '0.2rem 0.625rem',
                    flexShrink: 0,
                  }}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem', color: '#6366F1', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            How it works
          </p>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#E8EAF6', letterSpacing: '-0.02em', margin: 0 }}>
            Three steps to clarity
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {HOW_IT_WORKS.map((item, i) => (
            <div
              key={item.step}
              className="card"
              style={{
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '3.5rem',
                  fontWeight: 700,
                  color: 'rgba(99,102,241,0.08)',
                  position: 'absolute',
                  top: '0.5rem',
                  right: '1rem',
                  lineHeight: 1,
                  userSelect: 'none',
                }}
              >
                {item.step}
              </div>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'rgba(99,102,241,0.12)',
                  border: '1px solid rgba(99,102,241,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.8125rem',
                  color: '#818CF8',
                  fontWeight: 700,
                }}
              >
                {String(i + 1)}
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#E8EAF6', margin: '0 0 0.5rem' }}>
                {item.title}
              </h3>
              <p style={{ color: '#64748B', margin: 0, lineHeight: 1.6, fontSize: '0.9375rem' }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '3rem 2rem 5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#E8EAF6', letterSpacing: '-0.02em', margin: 0 }}>
            Everything you need to explore your career
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem', maxWidth: 800, margin: '0 auto' }}>
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="card"
              style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: `${f.color}18`,
                  border: `1px solid ${f.color}30`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  color: f.color,
                }}
              >
                {f.icon}
              </div>
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#E8EAF6', margin: 0 }}>{f.title}</h3>
              <p style={{ color: '#64748B', margin: 0, lineHeight: 1.6, fontSize: '0.9rem' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '4rem 2rem 5rem' }}>
        <div
          style={{
            maxWidth: 640,
            margin: '0 auto',
            textAlign: 'center',
            background: 'rgba(14,19,48,0.8)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: 20,
            padding: '3rem 2rem',
          }}
        >
          <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.125rem)', fontWeight: 800, color: '#E8EAF6', letterSpacing: '-0.02em', margin: '0 0 1rem' }}>
            Ready to explore your career path?
          </h2>
          <p style={{ color: '#64748B', fontSize: '1rem', margin: '0 0 2.25rem', lineHeight: 1.7 }}>
            Build your profile and discover career options that align with your skills, interests, and goals.
          </p>
          <Link to="/signup" className="btn-primary" style={{ textDecoration: 'none', fontSize: '1rem', padding: '0.8125rem 2.25rem' }}>
            Start Exploring →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(99,102,241,0.1)', padding: '1.75rem 2rem', textAlign: 'center' }}>
        <p style={{ color: '#374151', fontSize: '0.875rem', margin: 0 }}>
          © 2026 CareerAI · AI-powered career exploration for students.
        </p>
      </footer>
    </div>
  );
}
