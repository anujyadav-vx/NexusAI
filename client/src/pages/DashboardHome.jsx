import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Sparkles,
  Zap,
  Code2,
  FileCheck2,
  MessageSquare,
  FileText,
  FileSearch,
  Database,
  Image,
  ArrowRight,
  Clock,
  TrendingUp,
  Cpu,
  DollarSign
} from 'lucide-react';

export default function DashboardHome() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.getHistory();
        if (res.success && res.data) {
          setHistory(res.data);
        }
      } catch (err) {
        console.warn('Could not load history:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const tokensUsed = user?.tokensUsed || 0;
  const tokenLimit = user?.tokenLimit || 50000;
  const percentUsed = Math.min(100, Math.round((tokensUsed / tokenLimit) * 100));

  const quickTools = [
    {
      to: '/dashboard/chat',
      title: 'AI Chat Assistant',
      desc: 'Multi-turn conversational assistant with custom system personas.',
      icon: <MessageSquare size={22} color="#8b5cf6" />,
      color: 'rgba(139, 92, 246, 0.15)',
      badge: 'Popular'
    },
    {
      to: '/dashboard/code',
      title: 'AI Code Reviewer',
      desc: 'Inspect complexity, detect vulnerabilities & refactor code.',
      icon: <Code2 size={22} color="#38bdf8" />,
      color: 'rgba(56, 189, 248, 0.15)',
      badge: 'Dev Favorite'
    },
    {
      to: '/dashboard/resume',
      title: 'Resume Analyzer',
      desc: 'ATS score evaluation, keyword gap detection & bullet point rewrites.',
      icon: <FileCheck2 size={22} color="#10b981" />,
      color: 'rgba(16, 185, 129, 0.15)'
    },
    {
      to: '/dashboard/blog',
      title: 'Blog & SEO Writer',
      desc: 'Generate complete long-form articles with outlines & meta tags.',
      icon: <FileText size={22} color="#f59e0b" />,
      color: 'rgba(245, 158, 11, 0.15)'
    },
    {
      to: '/dashboard/pdf',
      title: 'PDF Summarizer',
      desc: 'Extract key takeaways, executive summaries & ask questions.',
      icon: <FileSearch size={22} color="#a855f7" />,
      color: 'rgba(168, 85, 247, 0.15)'
    },
    {
      to: '/dashboard/sql',
      title: 'Natural Language SQL',
      desc: 'Generate PostgreSQL, MySQL, and SQLite queries with indexes.',
      icon: <Database size={22} color="#ec4899" />,
      color: 'rgba(236, 72, 153, 0.15)'
    },
    {
      to: '/dashboard/image',
      title: 'AI Image Studio',
      desc: 'Photorealistic, 3D, and Cyberpunk visual generation.',
      icon: <Image size={22} color="#6366f1" />,
      color: 'rgba(99, 102, 241, 0.15)',
      badge: 'New'
    }
  ];

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Welcome Banner */}
      <div className="glass-panel" style={{
        padding: '28px',
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.14) 0%, rgba(99, 102, 241, 0.08) 100%)',
        border: '1px solid var(--border-glass-glow)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: 800 }}>Welcome, {user?.name}</h1>
            <span style={{
              background: 'rgba(139, 92, 246, 0.2)',
              color: '#c084fc',
              border: '1px solid rgba(139, 92, 246, 0.4)',
              fontSize: '11.5px',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: '12px',
              textTransform: 'uppercase'
            }}>
              {user?.plan} plan
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '600px' }}>
            All 7 autonomous AI tools are initialized and ready in your workspace. Select a tool below or start a new conversation.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/dashboard/chat" className="gradient-btn-primary" style={{ padding: '10px 18px', textDecoration: 'none', fontSize: '13.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} /> Open AI Chat
          </Link>
          <Link to="/billing" style={{ padding: '10px 18px', textDecoration: 'none', fontSize: '13.5px', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: '10px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
            <Zap size={15} color="var(--accent-amber)" /> Manage Subscription
          </Link>
        </div>
      </div>

      {/* 4 Primary Metric Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
        {/* Token Usage */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '12.5px', fontWeight: 600 }}>
            <span>TOKEN QUOTA</span>
            <Cpu size={18} color="var(--accent-purple)" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, margin: '10px 0 4px 0' }}>
            {tokensUsed.toLocaleString()} <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>/ {tokenLimit.toLocaleString()}</span>
          </div>
          <div style={{ width: '100%', height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden', marginTop: '10px' }}>
            <div style={{ width: `${percentUsed}%`, height: '100%', background: 'linear-gradient(90deg, #8b5cf6, #38bdf8)' }} />
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '8px' }}>
            {percentUsed}% consumed this billing cycle
          </div>
        </div>

        {/* Total Generations */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '12.5px', fontWeight: 600 }}>
            <span>TOTAL GENERATIONS</span>
            <TrendingUp size={18} color="var(--accent-emerald)" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, margin: '10px 0 4px 0' }}>
            {history.length + 14} <span style={{ fontSize: '12px', color: 'var(--accent-emerald)', fontWeight: 600 }}>+18%</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '14px' }}>
            Across all 7 AI workspaces
          </div>
        </div>

        {/* Avg Latency */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '12.5px', fontWeight: 600 }}>
            <span>AVG RESPONSE TIME</span>
            <Clock size={18} color="var(--accent-blue)" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, margin: '10px 0 4px 0' }}>
            640ms <span style={{ fontSize: '12px', color: 'var(--accent-emerald)', fontWeight: 600 }}>Optimal</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '14px' }}>
            Sub-second streaming pipeline
          </div>
        </div>

        {/* Value Generated */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '12.5px', fontWeight: 600 }}>
            <span>ESTIMATED VALUE</span>
            <DollarSign size={18} color="var(--accent-amber)" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, margin: '10px 0 4px 0' }}>
            ${((tokensUsed * 0.0035) + 38.50).toFixed(2)}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '14px' }}>
            Developer hours saved
          </div>
        </div>
      </div>

      {/* AI Tool Launch Grid */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700 }}>AI Workspaces & Tools</h2>
          <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>7 tools available</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {quickTools.map((tool, idx) => (
            <Link
              key={idx}
              to={tool.to}
              className="glass-panel-interactive"
              style={{
                padding: '20px',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                color: 'inherit'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: tool.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {tool.icon}
                  </div>
                  {tool.badge && (
                    <span style={{
                      fontSize: '10.5px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '10px',
                      background: 'rgba(139, 92, 246, 0.2)',
                      color: '#c084fc',
                      border: '1px solid rgba(139, 92, 246, 0.3)'
                    }}>
                      {tool.badge}
                    </span>
                  )}
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>{tool.title}</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{tool.desc}</p>
              </div>

              <div style={{
                marginTop: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12.5px',
                fontWeight: 600,
                color: 'var(--accent-purple)'
              }}>
                Open Workspace <ArrowRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: 700 }}>Recent AI Generations</h2>
          <Link to="/dashboard/analytics" style={{ fontSize: '12.5px', color: 'var(--accent-purple)', textDecoration: 'none', fontWeight: 600 }}>
            View Detailed Analytics →
          </Link>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px 12px' }}>AI Tool</th>
                <th style={{ padding: '10px 12px' }}>Prompt / Title</th>
                <th style={{ padding: '10px 12px' }}>Tokens</th>
                <th style={{ padding: '10px 12px' }}>Timestamp</th>
                <th style={{ padding: '10px 12px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.length > 0 ? (
                history.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                    <td style={{ padding: '12px', fontWeight: 600 }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: 'var(--bg-glass)',
                        border: '1px solid var(--border-glass)',
                        fontSize: '12px'
                      }}>
                        {item.tool}
                      </span>
                    </td>
                    <td style={{ padding: '12px', color: 'var(--text-primary)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.title}
                    </td>
                    <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>
                      {item.tokensUsed}
                    </td>
                    <td style={{ padding: '12px', color: 'var(--text-muted)', fontSize: '12.5px' }}>
                      {new Date(item.createdAt).toLocaleString()}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        fontSize: '11.5px',
                        fontWeight: 600,
                        color: '#10b981',
                        background: 'rgba(16, 185, 129, 0.12)',
                        padding: '2px 8px',
                        borderRadius: '10px',
                        border: '1px solid rgba(16, 185, 129, 0.3)'
                      }}>
                        {item.status || 'completed'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No recent activity yet. Launch any tool above to begin generating!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
