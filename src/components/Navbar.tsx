import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: '⬡' },
  { to: '/profile', label: 'Profile', icon: '◈' },
  { to: '/recommendations', label: 'AI Advisor', icon: '✦' },
  { to: '/history', label: 'History', icon: '◫' },
  { to: '/compare', label: 'Compare', icon: '⊞' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <nav
      style={{
        background: 'rgba(7, 9, 26, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(99,102,241,0.15)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', height: 60, gap: '1rem' }}>
          {/* Logo */}
          <NavLink
            to="/dashboard"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
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
            <span
              style={{
                fontWeight: 700,
                fontSize: '1rem',
                color: '#E8EAF6',
                letterSpacing: '-0.02em',
              }}
            >
              CareerAI
            </span>
          </NavLink>

          {/* Desktop Nav */}
          <div
            className="nav-desktop"
            style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flex: 1 }}
          >
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                <span style={{ fontSize: 13 }}>{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* User */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(34,211,238,0.3))',
                  border: '1px solid rgba(99,102,241,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#818CF8',
                }}
              >
                {initials}
              </div>
              <span
                style={{ fontSize: '0.875rem', color: '#94A3B8', fontWeight: 500 }}
                className="nav-username"
              >
                {user?.name?.split(' ')[0]}
              </span>
            </div>
            <button onClick={handleLogout} className="btn-ghost" style={{ padding: '0.375rem 0.75rem', fontSize: '0.875rem' }}>
              Sign out
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="mobile-menu-btn"
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              color: '#94A3B8',
              fontSize: 20,
              cursor: 'pointer',
              padding: '0.5rem',
            }}
            aria-label="Toggle menu"
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            style={{
              borderTop: '1px solid rgba(99,102,241,0.1)',
              padding: '0.75rem 0',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
            }}
          >
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                <span style={{ fontSize: 13 }}>{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
            <div className="divider" style={{ margin: '0.5rem 0' }} />
            <button onClick={handleLogout} className="btn-ghost" style={{ justifyContent: 'flex-start', padding: '0.5rem 0.875rem' }}>
              Sign out
            </button>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-username { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
