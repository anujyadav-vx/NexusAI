import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  ArrowRight,
  Zap,
  Code2,
  FileCheck2,
  MessageSquare,
  FileText,
  Database,
  Image,
  Check
} from 'lucide-react';

export default function LandingPage() {
  const { user } = useAuth();

  const features = [
    {
      icon: <MessageSquare size={24} color="#8b5cf6" />,
      title: 'Contextual AI Chat',
      desc: 'Multi-turn intelligent assistant with specialized engineering, executive, and copywriting personas.'
    },
    {
      icon: <Code2 size={24} color="#38bdf8" />,
      title: 'Automated Code Reviewer',
      desc: 'Instant O(n) algorithmic complexity scan, security vulnerability analysis, and production refactoring.'
    },
    {
      icon: <FileCheck2 size={24} color="#10b981" />,
      title: 'AI Resume Analyzer',
      desc: 'Real ATS score calculation, missing keyword discovery, and quantified bullet point rewrites.'
    },
    {
      icon: <FileText size={24} color="#f59e0b" />,
      title: 'SEO Blog Generator',
      desc: 'End-to-end structured articles with outlines, headings, meta descriptions, and high-retention copy.'
    },
    {
      icon: <Database size={24} color="#ec4899" />,
      title: 'Natural Language SQL',
      desc: 'Transform plain English questions into optimized PostgreSQL, MySQL, and SQLite queries with indexes.'
    },
    {
      icon: <Image size={24} color="#6366f1" />,
      title: 'AI Image Studio',
      desc: 'High-aesthetic visual generation with customizable styles, aspect ratios, and seed reproducibility.'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Top Navbar */}
      <nav style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
          <span style={{ fontSize: '20px', fontWeight: 800 }}>
            <span className="gradient-text-purple">Nexus</span>AI
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {user ? (
            <Link to="/dashboard" className="gradient-btn-primary" style={{ padding: '8px 18px', textDecoration: 'none', fontSize: '14px' }}>
              Open Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
                Sign In
              </Link>
              <Link to="/register" className="gradient-btn-primary" style={{ padding: '8px 18px', textDecoration: 'none', fontSize: '14px' }}>
                Get Started Free
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        maxWidth: '1100px',
        margin: '60px auto 40px auto',
        padding: '0 24px',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(139, 92, 246, 0.12)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          padding: '6px 14px',
          borderRadius: '30px',
          fontSize: '12.5px',
          fontWeight: 600,
          color: '#c084fc',
          marginBottom: '24px'
        }}>
          <Sparkles size={14} /> Next-Gen Autonomous AI SaaS Workspace
        </div>

        <h1 style={{
          fontSize: 'clamp(36px, 6vw, 64px)',
          fontWeight: 800,
          lineHeight: 1.12,
          letterSpacing: '-1.5px',
          marginBottom: '24px'
        }}>
          The Intelligent Suite for <br />
          <span className="gradient-text-purple">High-Velocity Engineering Teams</span>
        </h1>

        <p style={{
          fontSize: 'clamp(16px, 2vw, 19px)',
          color: 'var(--text-secondary)',
          maxWidth: '720px',
          margin: '0 auto 36px auto',
          lineHeight: 1.6
        }}>
          Unify your AI workflows in one high-performance dashboard. Review code, summarize mission-critical documents, craft viral technical blogs, analyze candidate resumes, and query data in plain English.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <Link
            to={user ? "/dashboard" : "/register"}
            className="gradient-btn-primary"
            style={{
              padding: '14px 28px',
              fontSize: '16px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            Launch AI Workspace <ArrowRight size={18} />
          </Link>
          <Link
            to="/login"
            style={{
              padding: '14px 24px',
              fontSize: '15px',
              fontWeight: 600,
              textDecoration: 'none',
              color: 'var(--text-primary)',
              background: 'var(--bg-glass)',
              border: '1px solid var(--border-glass)',
              borderRadius: '10px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Zap size={16} color="var(--accent-amber)" /> Explore Demo Account
          </Link>
        </div>

        {/* Live Interactive Mock Preview */}
        <div className="glass-panel" style={{
          marginTop: '60px',
          padding: '12px',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          boxShadow: '0 25px 50px -12px rgba(139, 92, 246, 0.25)',
          overflow: 'hidden'
        }}>
          <div style={{
            background: 'var(--bg-secondary)',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid var(--border-glass)' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>nexus-ai-workspace.prod.internal</div>
              <div style={{ fontSize: '11px', color: 'var(--accent-emerald)', fontWeight: 600 }}>● ALL SYSTEMS OPERATIONAL</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginTop: '20px' }}>
              <div className="glass-panel" style={{ padding: '16px' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Monthly Token Quota</div>
                <div style={{ fontSize: '24px', fontWeight: 800, margin: '6px 0' }}>43,580 <span style={{ fontSize: '12px', color: 'var(--accent-emerald)' }}>/ 50k</span></div>
                <div style={{ height: '4px', background: 'linear-gradient(90deg, #8b5cf6, #38bdf8)', borderRadius: '2px' }} />
              </div>
              <div className="glass-panel" style={{ padding: '16px' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Average Latency</div>
                <div style={{ fontSize: '24px', fontWeight: 800, margin: '6px 0' }}>680ms <span style={{ fontSize: '12px', color: 'var(--accent-emerald)' }}>-18%</span></div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Sub-second streaming</div>
              </div>
              <div className="glass-panel" style={{ padding: '16px' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Active AI Models</div>
                <div style={{ fontSize: '24px', fontWeight: 800, margin: '6px 0' }}>Gemini 1.5 & GPT-4o</div>
                <div style={{ fontSize: '11px', color: 'var(--accent-purple)' }}>Smart fallback enabled</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section style={{ maxWidth: '1200px', margin: '100px auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '12px' }}>
            Engineered for Real-World Productivity
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
            Seven enterprise-grade AI tools built into one unified interface.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {features.map((feat, idx) => (
            <div key={idx} className="glass-panel-interactive" style={{ padding: '28px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'var(--bg-glass)',
                border: '1px solid var(--border-glass)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                {feat.icon}
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px' }}>{feat.title}</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section style={{ maxWidth: '1100px', margin: '100px auto', padding: '0 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '12px' }}>
          Simple, Transparent Pricing
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px', marginBottom: '48px' }}>
          Start free today, scale seamlessly as your AI workflows expand.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', textAlign: 'left' }}>
          {/* Free */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-muted)' }}>STARTER</div>
            <div style={{ fontSize: '36px', fontWeight: 800, margin: '12px 0' }}>$0 <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-muted)' }}>/forever</span></div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>Perfect for testing out AI tools and casual exploration.</p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', marginBottom: '32px' }}>
              <li style={{ display: 'flex', gap: '8px' }}><Check size={16} color="#10b981" /> 5,000 monthly AI tokens</li>
              <li style={{ display: 'flex', gap: '8px' }}><Check size={16} color="#10b981" /> Standard AI chat assistant</li>
              <li style={{ display: 'flex', gap: '8px' }}><Check size={16} color="#10b981" /> Basic code reviewer</li>
            </ul>
            <Link to="/register" style={{ display: 'block', textAlign: 'center', padding: '10px', borderRadius: '8px', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
              Get Started
            </Link>
          </div>

          {/* Pro */}
          <div className="glass-panel" style={{ padding: '32px', border: '1px solid rgba(139, 92, 246, 0.5)', background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.08) 0%, rgba(17, 24, 39, 0.8) 100%)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-12px', right: '24px', background: 'var(--accent-purple)', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '12px' }}>
              MOST POPULAR
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#c084fc' }}>PROFESSIONAL</div>
            <div style={{ fontSize: '36px', fontWeight: 800, margin: '12px 0' }}>$29 <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-muted)' }}>/month</span></div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>Designed for software engineers, freelancers & creators.</p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', marginBottom: '32px' }}>
              <li style={{ display: 'flex', gap: '8px' }}><Check size={16} color="#10b981" /> 50,000 monthly AI tokens</li>
              <li style={{ display: 'flex', gap: '8px' }}><Check size={16} color="#10b981" /> Full access to all 7 AI tools</li>
              <li style={{ display: 'flex', gap: '8px' }}><Check size={16} color="#10b981" /> High-res AI image generator</li>
              <li style={{ display: 'flex', gap: '8px' }}><Check size={16} color="#10b981" /> Priority streaming speed</li>
            </ul>
            <Link to="/register" className="gradient-btn-primary" style={{ display: 'block', textAlign: 'center', padding: '10px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px' }}>
              Upgrade to Pro
            </Link>
          </div>

          {/* Enterprise */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-muted)' }}>ENTERPRISE</div>
            <div style={{ fontSize: '36px', fontWeight: 800, margin: '12px 0' }}>$99 <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-muted)' }}>/month</span></div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>For engineering departments, agencies & startups.</p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', marginBottom: '32px' }}>
              <li style={{ display: 'flex', gap: '8px' }}><Check size={16} color="#10b981" /> 1,000,000 monthly tokens</li>
              <li style={{ display: 'flex', gap: '8px' }}><Check size={16} color="#10b981" /> Role-based team access (RBAC)</li>
              <li style={{ display: 'flex', gap: '8px' }}><Check size={16} color="#10b981" /> Dedicated model fine-tuning</li>
              <li style={{ display: 'flex', gap: '8px' }}><Check size={16} color="#10b981" /> 24/7 dedicated support</li>
            </ul>
            <Link to="/register" style={{ display: 'block', textAlign: 'center', padding: '10px', borderRadius: '8px', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-glass)',
        padding: '40px 24px',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '13px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} color="var(--accent-purple)" />
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>NexusAI SaaS Platform</span>
          </div>
          <div>
            Built with modern React.js + Node.js/Express (Full JavaScript Architecture).
          </div>
          <div>
            © 2026 NexusAI Systems. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
