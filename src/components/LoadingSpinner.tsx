interface Props {
  size?: number;
  message?: string;
}

export default function LoadingSpinner({ size = 40, message }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2rem' }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          border: `3px solid rgba(99,102,241,0.15)`,
          borderTopColor: '#6366F1',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      {message && (
        <p style={{ color: '#64748B', fontSize: '0.9rem', margin: 0, textAlign: 'center' }}>
          {message}
        </p>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export function AILoadingState() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', padding: '3rem 2rem' }}>
      <div style={{ position: 'relative', width: 72, height: 72 }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '2px solid rgba(99,102,241,0.2)',
            borderTopColor: '#6366F1',
            animation: 'spin 1s linear infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 8,
            borderRadius: '50%',
            border: '2px solid rgba(34,211,238,0.2)',
            borderBottomColor: '#22D3EE',
            animation: 'spin 1.5s linear infinite reverse',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 18,
            borderRadius: '50%',
            background: 'rgba(99,102,241,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
          }}
        >
          ✦
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#E8EAF6', fontSize: '1.0625rem', fontWeight: 600, margin: '0 0 0.5rem' }}>
          Analyzing your profile...
        </p>
        <p style={{ color: '#64748B', fontSize: '0.875rem', margin: 0 }}>
          Generating personalized career recommendations based on your profile
        </p>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#6366F1',
              animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
