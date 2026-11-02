import React, { useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import {
  Database,
  Sparkles,
  Copy,
  Check,
  Terminal,
  Zap
} from 'lucide-react';

export default function SqlGeneratorPage() {
  const { refreshUserData } = useAuth();
  const { addToast } = useNotification();
  const [prompt, setPrompt] = useState('Find the top 5 highest spending users who made orders in 2026');
  const [dialect, setDialect] = useState('PostgreSQL');
  const [schema, setSchema] = useState('users(id, name, email), orders(id, user_id, total_amount, status, created_at)');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const res = await api.sqlGenerate({ prompt, dialect, schema });
      if (res.success && res.data) {
        setResult(res.data);
        refreshUserData();
        addToast('SQL query generated!', 'success');
      } else {
        throw new Error(res.message || 'Generation failed');
      }
    } catch (err) {
      addToast(err.message || 'Failed to generate SQL query.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const copySql = () => {
    if (!result?.sql) return;
    navigator.clipboard.writeText(result.sql);
    setCopied(true);
    addToast('SQL copied to clipboard!', 'info', 2000);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Database size={20} color="#fff" />
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 800 }}>AI Natural Language SQL Generator</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Convert natural language questions into performant, production-ready SQL queries with automated join inference and indexing tips.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) minmax(400px, 1.4fr)', gap: '24px', alignItems: 'start' }}>
        {/* Form */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '13px', fontWeight: 600 }}>SQL Dialect</label>
              <select
                className="glass-input"
                value={dialect}
                onChange={(e) => setDialect(e.target.value)}
                style={{ padding: '6px 12px', fontSize: '12.5px', cursor: 'pointer' }}
              >
                <option value="PostgreSQL" style={{ background: 'var(--bg-secondary)' }}>PostgreSQL</option>
                <option value="MySQL" style={{ background: 'var(--bg-secondary)' }}>MySQL</option>
                <option value="SQLite" style={{ background: 'var(--bg-secondary)' }}>SQLite</option>
                <option value="Snowflake" style={{ background: 'var(--bg-secondary)' }}>Snowflake</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                Natural Language Question / Intent
              </label>
              <textarea
                className="glass-input"
                rows={4}
                style={{ width: '100%', resize: 'none', fontSize: '13.5px' }}
                placeholder="e.g. Calculate month-over-month revenue growth grouped by country"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                required
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600 }}>Table Schema / Context (Optional)</label>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Helps accurate column mapping</span>
              </div>
              <textarea
                className="glass-input"
                rows={3}
                style={{ width: '100%', resize: 'none', fontSize: '12px', fontFamily: 'var(--font-mono)' }}
                placeholder="e.g. users(id, email), orders(id, user_id, amount, status)"
                value={schema}
                onChange={(e) => setSchema(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="gradient-btn-primary"
              style={{
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '14px',
                marginTop: '6px'
              }}
            >
              {loading ? <Sparkles size={16} className="animate-spin" /> : <Terminal size={16} />}
              {loading ? 'Synthesizing Query...' : `Generate ${dialect} Query`}
            </button>
          </form>
        </div>

        {/* Results */}
        <div>
          {result ? (
            <div className="glass-panel animate-fade-in" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#ec4899', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Target: {result.dialect}
                </span>

                <button
                  onClick={copySql}
                  style={{
                    background: 'var(--bg-glass)',
                    border: '1px solid var(--border-glass)',
                    color: 'var(--text-primary)',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '12.5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                  {copied ? 'Copied' : 'Copy SQL'}
                </button>
              </div>

              {/* SQL Code Box */}
              <pre style={{
                background: 'rgba(0, 0, 0, 0.45)',
                border: '1px solid var(--border-glass)',
                padding: '16px',
                borderRadius: '10px',
                overflowX: 'auto',
                color: '#38bdf8',
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                lineHeight: 1.5
              }}>
                <code>{result.sql}</code>
              </pre>

              {/* Explanation */}
              <div>
                <h3 style={{ fontSize: '13.5px', fontWeight: 700, marginBottom: '6px' }}>Query Logic Breakdown</h3>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                  {result.explanation}
                </div>
              </div>

              {/* Performance Tip */}
              <div style={{ background: 'rgba(236, 72, 153, 0.1)', border: '1px solid rgba(236, 72, 153, 0.25)', padding: '12px 16px', borderRadius: '10px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#f472b6', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <Zap size={14} /> Performance & Index Advice
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                  {result.performanceTip}
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel" style={{
              padding: '60px 24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)'
            }}>
              <Database size={48} color="var(--border-glass-glow)" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                No SQL Generated Yet
              </h3>
              <p style={{ fontSize: '13px', maxWidth: '360px' }}>
                Type your question in plain English on the left, pick your database engine, and generate optimized queries instantly.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
