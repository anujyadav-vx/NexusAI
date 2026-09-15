import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  BarChart3,
  TrendingUp,
  Cpu,
  DollarSign,
  Clock,
  Layers,
  ArrowUpRight,
  PieChart
} from 'lucide-react';

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.getAnalytics();
        if (res.success && res.analytics) {
          setData(res.analytics);
        }
      } catch (err) {
        console.error('Failed to load analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading real-time platform telemetry...
      </div>
    );
  }

  const { totalRequests, tokensUsed, tokenLimit, usagePercentage, estimatedCostSaved, averageLatencyMs, toolBreakdown, dailyTrend } = data || {};
  const maxDailyTokens = Math.max(...(dailyTrend || []).map(d => d.tokens), 1000);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <BarChart3 size={20} color="#fff" />
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 800 }}>Usage & Performance Telemetry</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Real-time metrics on token consumption, request frequency, AI tool distribution, and financial cost offsets.
        </p>
      </div>

      {/* Top 4 Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600 }}>
            <span>TOTAL REQUESTS</span>
            <TrendingUp size={16} color="var(--accent-emerald)" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, margin: '8px 0 4px 0' }}>{totalRequests}</div>
          <div style={{ fontSize: '12px', color: 'var(--accent-emerald)' }}>+24% vs last week</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600 }}>
            <span>TOKENS CONSUMED</span>
            <Cpu size={16} color="var(--accent-purple)" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, margin: '8px 0 4px 0' }}>{tokensUsed.toLocaleString()}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{usagePercentage}% of quota used</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600 }}>
            <span>VALUE SAVED</span>
            <DollarSign size={16} color="var(--accent-amber)" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, margin: '8px 0 4px 0' }}>{estimatedCostSaved}</div>
          <div style={{ fontSize: '12px', color: 'var(--accent-emerald)' }}>Vs manual workflows</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600 }}>
            <span>AVERAGE LATENCY</span>
            <Clock size={16} color="var(--accent-blue)" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, margin: '8px 0 4px 0' }}>{averageLatencyMs}ms</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Edge-accelerated</div>
        </div>
      </div>

      {/* 7-Day Interactive Trend Chart */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 700 }}>Daily Token Ingestion Trend (Last 7 Days)</h2>
            <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>Aggregate token volume per 24-hour cycle</div>
          </div>
          <span style={{ fontSize: '12px', background: 'rgba(139, 92, 246, 0.15)', color: '#c084fc', padding: '4px 10px', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
            Real-Time Feed
          </span>
        </div>

        {/* Responsive SVG Bar Chart */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '200px', padding: '10px 0', borderBottom: '1px solid var(--border-glass)' }}>
          {dailyTrend?.map((item, idx) => {
            const heightPercent = Math.max(15, Math.round((item.tokens / maxDailyTokens) * 100));
            return (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, height: '100%', justifyContent: 'flex-end', gap: '8px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.tokens}</span>
                <div
                  title={`${item.day}: ${item.tokens} tokens, ${item.requests} requests`}
                  style={{
                    width: '55%',
                    maxWidth: '44px',
                    height: `${heightPercent}%`,
                    borderRadius: '6px 6px 0 0',
                    background: 'linear-gradient(180deg, #8b5cf6 0%, #6366f1 100%)',
                    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.filter = 'none'}
                />
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>{item.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tool Distribution Breakdown */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>AI Tool Consumption Breakdown</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {toolBreakdown?.map((tool, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--bg-glass)',
                border: '1px solid var(--border-glass)',
                borderRadius: '10px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', fontWeight: 700 }}>{tool.name}</span>
                <span style={{ fontSize: '12px', color: 'var(--accent-purple)', fontWeight: 600 }}>{tool.value} calls</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {tool.tokens.toLocaleString()} tokens utilized
              </div>
              <div style={{ height: '4px', background: 'var(--bg-tertiary)', borderRadius: '2px', overflow: 'hidden', marginTop: '4px' }}>
                <div style={{ width: `${Math.min(100, (tool.tokens / 3000) * 100)}%`, height: '100%', background: 'linear-gradient(90deg, #8b5cf6, #38bdf8)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
