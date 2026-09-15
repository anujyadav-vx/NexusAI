import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Sparkles,
  Sun,
  Moon,
  Zap,
  LogOut,
  User,
  ShieldCheck,
  CreditCard,
  ChevronDown
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const tokensUsed = user?.tokensUsed || 0;
  const tokenLimit = user?.tokenLimit || 5000;
  const tokenPercentage = Math.min(100, Math.round((tokensUsed / tokenLimit) * 100));

  return (
    <header className="glass-panel" style={{
      borderRadius: 0,
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      height: '68px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 40
    }}>
      {/* Brand & Workspace */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)'
          }}>
            <Sparkles size={20} color="#fff" />
          </div>
          <span style={{ fontSize: '19px', fontWeight: 800, letterSpacing: '-0.5px' }}>
            <span className="gradient-text-purple">Nexus</span>
            <span style={{ color: 'var(--text-primary)' }}>AI</span>
          </span>
        </Link>

        {user && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'var(--bg-glass)',
            padding: '4px 10px',
            borderRadius: '20px',
            border: '1px solid var(--border-glass)',
            fontSize: '12px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            color: user.plan === 'enterprise' ? '#a855f7' : user.plan === 'pro' ? '#38bdf8' : '#94a3b8'
          }}>
            <Zap size={13} />
            {user.plan} tier
          </div>
        )}
      </div>

      {/* Right controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Token Quota Progress */}
        {user && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            width: '140px',
            display: 'none',
            '@media (min-width: 640px)': { display: 'flex' }
          }} className="sm-show">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
              <span>Quota</span>
              <span>{tokenPercentage}%</span>
            </div>
            <div style={{
              width: '100%',
              height: '5px',
              borderRadius: '4px',
              background: 'var(--bg-tertiary)',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${tokenPercentage}%`,
                background: tokenPercentage > 85 ? 'var(--accent-rose)' : 'linear-gradient(90deg, #8b5cf6, #38bdf8)',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        )}

        {/* Dark/Light toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          style={{
            background: 'var(--bg-glass)',
            border: '1px solid var(--border-glass)',
            color: 'var(--text-primary)',
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* User Profile dropdown */}
        {user ? (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'var(--bg-glass)',
                border: '1px solid var(--border-glass)',
                padding: '4px 8px 4px 4px',
                borderRadius: '24px',
                cursor: 'pointer',
                color: 'var(--text-primary)'
              }}
            >
              <img
                src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                alt={user.name}
                style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <span style={{ fontSize: '13px', fontWeight: 600, maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.name.split(' ')[0]}
              </span>
              <ChevronDown size={14} color="var(--text-muted)" />
            </button>

            {dropdownOpen && (
              <div
                className="glass-panel animate-fade-in"
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '46px',
                  width: '220px',
                  padding: '8px',
                  zIndex: 50,
                  boxShadow: '0 12px 30px rgba(0,0,0,0.5)'
                }}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <div style={{ padding: '8px', borderBottom: '1px solid var(--border-glass)' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700 }}>{user.name}</div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
                </div>

                <Link
                  to="/settings"
                  onClick={() => setDropdownOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 10px',
                    fontSize: '13px',
                    color: 'var(--text-primary)',
                    textDecoration: 'none',
                    borderRadius: '6px'
                  }}
                >
                  <User size={15} color="var(--accent-purple)" />
                  Profile Settings
                </Link>

                <Link
                  to="/billing"
                  onClick={() => setDropdownOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 10px',
                    fontSize: '13px',
                    color: 'var(--text-primary)',
                    textDecoration: 'none',
                    borderRadius: '6px'
                  }}
                >
                  <CreditCard size={15} color="var(--accent-indigo)" />
                  Subscription & Billing
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 10px',
                      fontSize: '13px',
                      color: '#a855f7',
                      textDecoration: 'none',
                      borderRadius: '6px',
                      fontWeight: 600
                    }}
                  >
                    <ShieldCheck size={15} />
                    Admin Panel
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '8px 10px',
                    fontSize: '13px',
                    color: 'var(--accent-rose)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '6px',
                    textAlign: 'left',
                    marginTop: '4px'
                  }}
                >
                  <LogOut size={15} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link
              to="/login"
              style={{
                fontSize: '13.5px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                textDecoration: 'none',
                padding: '8px 14px',
                borderRadius: '8px',
                background: 'var(--bg-glass)'
              }}
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="gradient-btn-primary"
              style={{
                fontSize: '13.5px',
                textDecoration: 'none',
                padding: '8px 16px',
                display: 'inline-block'
              }}
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
