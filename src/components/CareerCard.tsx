import type { CareerPath } from '../types';

interface Props {
  career: CareerPath;
  index: number;
  isSelected?: boolean;
  onSelect?: (title: string) => void;
  compact?: boolean;
}

const ACCENT_COLORS = [
  { bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.3)', text: '#818CF8', glow: 'rgba(99,102,241,0.2)' },
  { bg: 'rgba(34,211,238,0.08)', border: 'rgba(34,211,238,0.25)', text: '#22D3EE', glow: 'rgba(34,211,238,0.15)' },
  { bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.25)', text: '#34D399', glow: 'rgba(52,211,153,0.15)' },
];

export default function CareerCard({ career, index, isSelected, onSelect, compact }: Props) {
  const accent = ACCENT_COLORS[index % 3];
  const score = career.matchScore ?? 75;

  return (
    <div
      onClick={() => onSelect?.(career.title)}
      style={{
        background: isSelected ? `rgba(${index === 0 ? '99,102,241' : index === 1 ? '34,211,238' : '52,211,153'},0.08)` : 'var(--card)',
        border: `1px solid ${isSelected ? accent.border : 'var(--border)'}`,
        borderRadius: 16,
        padding: compact ? '1.25rem' : '1.5rem',
        transition: 'all 0.25s ease',
        cursor: onSelect ? 'pointer' : 'default',
        boxShadow: isSelected ? `0 0 24px ${accent.glow}` : 'none',
        animation: 'fadeIn 0.4s ease-out forwards',
        animationDelay: `${index * 0.1}s`,
        opacity: 0,
      }}
      className="animate-fade-in"
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem', gap: '1rem' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
            <span
              style={{
                background: accent.bg,
                color: accent.text,
                border: `1px solid ${accent.border}`,
                borderRadius: '6px',
                padding: '0.2rem 0.5rem',
                fontSize: '0.75rem',
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 500,
              }}
            >
              #{index + 1}
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: accent.text,
                background: accent.bg,
                border: `1px solid ${accent.border}`,
                borderRadius: 100,
                padding: '0.2rem 0.625rem',
              }}
            >
              {score >= 85 ? 'Strong Match' : 'Good Match'}
            </span>
            {onSelect && (
              <span style={{ fontSize: '0.75rem', color: isSelected ? accent.text : '#475569' }}>
                {isSelected ? '✓ selected' : 'click to select'}
              </span>
            )}
          </div>
          <h3 style={{ fontSize: '1.1875rem', fontWeight: 700, color: '#E8EAF6', margin: 0, lineHeight: 1.3 }}>
            {career.title}
          </h3>
        </div>
      </div>

      {/* Why suitable preview */}
      <p style={{ fontSize: '0.875rem', color: '#94A3B8', margin: '0 0 1rem', lineHeight: 1.6 }}>
        {career.whySuitable.split('.')[0]}.
      </p>

      {!compact && (
        <>
          {/* Why suitable */}
          <div
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: 10,
              padding: '0.875rem',
              marginBottom: '1rem',
            }}
          >
            <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 0.5rem' }}>
              Why it suits you
            </p>
            <p style={{ fontSize: '0.9rem', color: '#CBD5E1', margin: 0, lineHeight: 1.6 }}>
              {career.whySuitable}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* Skills to learn */}
            <div>
              <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 0.625rem' }}>
                Skills to learn
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                {career.skillsToLearn.map((skill) => (
                  <div key={skill} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <span style={{ color: accent.text, fontSize: '0.75rem', marginTop: 2, flexShrink: 0 }}>◆</span>
                    <span style={{ fontSize: '0.875rem', color: '#CBD5E1', lineHeight: 1.4 }}>{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Next steps */}
            <div>
              <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 0.625rem' }}>
                Next steps
              </p>
              <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                {career.nextSteps.map((step, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <span
                      style={{
                        background: accent.bg,
                        color: accent.text,
                        border: `1px solid ${accent.border}`,
                        borderRadius: 4,
                        width: 18,
                        height: 18,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.625rem',
                        fontWeight: 700,
                        flexShrink: 0,
                        marginTop: 2,
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {i + 1}
                    </span>
                    <span style={{ fontSize: '0.875rem', color: '#CBD5E1', lineHeight: 1.4 }}>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
