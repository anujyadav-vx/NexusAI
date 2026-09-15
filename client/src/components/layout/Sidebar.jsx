import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  MessageSquare,
  FileCheck2,
  Code2,
  FileText,
  FileSearch,
  Database,
  Image,
  BarChart3,
  CreditCard,
  Settings,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export default function Sidebar() {
  const { isAdmin } = useAuth();

  const navItems = [
    { section: 'CORE WORKSPACE' },
    { to: '/dashboard', label: 'Overview', icon: <LayoutDashboard size={18} />, end: true },
    { to: '/dashboard/chat', label: 'AI Chat Assistant', icon: <MessageSquare size={18} />, badge: 'Popular' },
    { section: 'AI GENERATORS' },
    { to: '/dashboard/code', label: 'Code Reviewer', icon: <Code2 size={18} /> },
    { to: '/dashboard/resume', label: 'Resume Analyzer', icon: <FileCheck2 size={18} /> },
    { to: '/dashboard/blog', label: 'Blog & SEO Writer', icon: <FileText size={18} /> },
    { to: '/dashboard/pdf', label: 'PDF Summarizer', icon: <FileSearch size={18} /> },
    { to: '/dashboard/sql', label: 'SQL Generator', icon: <Database size={18} /> },
    { to: '/dashboard/image', label: 'Image Studio', icon: <Image size={18} />, badge: 'New' },
    { section: 'MANAGEMENT' },
    { to: '/dashboard/analytics', label: 'Usage Analytics', icon: <BarChart3 size={18} /> },
    { to: '/billing', label: 'Billing & Quotas', icon: <CreditCard size={18} /> },
    { to: '/settings', label: 'Settings', icon: <Settings size={18} /> }
  ];

  if (isAdmin) {
    navItems.push(
      { section: 'ADMINISTRATION' },
      { to: '/admin', label: 'Admin Dashboard', icon: <ShieldCheck size={18} />, badge: 'Admin' }
    );
  }

  return (
    <aside style={{
      width: '260px',
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-glass)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      minHeight: 'calc(100vh - 68px)',
      padding: '20px 12px'
    }}>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
        {navItems.map((item, idx) => {
          if (item.section) {
            return (
              <div
                key={idx}
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.8px',
                  color: 'var(--text-muted)',
                  padding: '16px 12px 6px 12px'
                }}
              >
                {item.section}
              </div>
            );
          }

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '10px',
                fontSize: '13.5px',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                background: isActive ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(99, 102, 241, 0.25) 100%)' : 'transparent',
                border: isActive ? '1px solid rgba(139, 92, 246, 0.35)' : '1px solid transparent',
                textDecoration: 'none',
                transition: 'all 0.18s ease'
              })}
            >
              {item.icon}
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: '12px',
                  background: item.badge === 'Admin' ? 'rgba(236, 72, 153, 0.2)' : 'rgba(139, 92, 246, 0.2)',
                  color: item.badge === 'Admin' ? '#f43f5e' : '#a855f7',
                  border: '1px solid var(--border-glass)'
                }}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Pro Banner in sidebar */}
      <div className="glass-panel" style={{
        marginTop: '16px',
        padding: '14px',
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(99, 102, 241, 0.12) 100%)',
        border: '1px solid rgba(139, 92, 246, 0.25)',
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px', fontWeight: 700 }}>
          <Sparkles size={16} color="#a855f7" />
          <span>Unlock Pro Power</span>
        </div>
        <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', margin: '6px 0 10px 0' }}>
          50k tokens, frontier models, and zero latency limits.
        </div>
        <NavLink
          to="/billing"
          style={{
            display: 'block',
            padding: '6px 12px',
            background: 'var(--accent-purple)',
            color: '#fff',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 600,
            textDecoration: 'none'
          }}
        >
          View Plans
        </NavLink>
      </div>
    </aside>
  );
}
