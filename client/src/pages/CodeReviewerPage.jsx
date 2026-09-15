import React, { useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import {
  Code2,
  Sparkles,
  ShieldAlert,
  Zap,
  Copy,
  Check,
  Cpu,
  Clock,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export default function CodeReviewerPage() {
  const { refreshUserData } = useAuth();
  const { addToast } = useNotification();
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(
`// Example: Processing order items
function processOrders(orders) {
  let results = [];
  for (var i = 0; i < orders.length; i++) {
    for (var j = 0; j < orders.length; j++) {
      if (orders[i].id === orders[j].id && i !== j) {
        // Potential bug: duplicate handling
        orders.splice(j, 1);
      }
    }
    results.push({
      id: orders[i].id,
      total: orders[i].price * orders[i].qty
    });
  }
  return results;
}`
  );
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleReview = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    try {
      const res = await api.codeReview({ code, language });
      if (res.success && res.data) {
        setReview(res.data);
        refreshUserData();
        addToast('Code review completed!', 'success');
      } else {
        throw new Error(res.message || 'Review failed');
      }
    } catch (err) {
      addToast(err.message || 'Failed to review code.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const copyRefactored = () => {
    if (!review?.refactoredCode) return;
    navigator.clipboard.writeText(review.refactoredCode);
    setCopied(true);
    addToast('Refactored code copied to clipboard!', 'info', 2000);
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
            background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Code2 size={20} color="#fff" />
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 800 }}>AI Production Code Reviewer</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Perform static analysis, detect memory leaks, calculate algorithmic time/space complexity, and receive clean, hardened production code.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) minmax(360px, 1.3fr)', gap: '24px', alignItems: 'start' }}>
        {/* Left: Input Code */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <form onSubmit={handleReview} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '13px', fontWeight: 600 }}>Programming Language</label>
              <select
                className="glass-input"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={{ padding: '6px 12px', fontSize: '12.5px', cursor: 'pointer' }}
              >
                <option value="javascript" style={{ background: 'var(--bg-secondary)' }}>JavaScript</option>
                <option value="python" style={{ background: 'var(--bg-secondary)' }}>Python</option>
                <option value="go" style={{ background: 'var(--bg-secondary)' }}>Go</option>
                <option value="rust" style={{ background: 'var(--bg-secondary)' }}>Rust</option>
                <option value="sql" style={{ background: 'var(--bg-secondary)' }}>SQL</option>
                <option value="java" style={{ background: 'var(--bg-secondary)' }}>Java</option>
              </select>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600 }}>Source Code Snippet</label>
                <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Paste function or component</span>
              </div>
              <textarea
                className="glass-input"
                rows={14}
                style={{
                  width: '100%',
                  resize: 'vertical',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  lineHeight: 1.55,
                  background: 'rgba(0, 0, 0, 0.3)'
                }}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
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
                fontSize: '14px'
              }}
            >
              {loading ? <Sparkles size={16} className="animate-spin" /> : <Zap size={16} />}
              {loading ? 'Inspecting Code Complexity & Security...' : 'Review & Refactor Code'}
            </button>
          </form>
        </div>

        {/* Right: Review Results */}
        <div>
          {review ? (
            <div className="glass-panel animate-fade-in" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Score Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--border-glass)' }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Quality Rating</div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>Language: {review.language}</div>
                </div>

                <div style={{
                  padding: '6px 16px',
                  borderRadius: '20px',
                  background: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  fontSize: '18px',
                  fontWeight: 800,
                  color: '#38bdf8'
                }}>
                  {review.codeQualityScore} / 100
                </div>
              </div>

              {/* Complexity Badges */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ background: 'var(--bg-glass)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <Clock size={13} color="#f59e0b" /> Time Complexity
                  </div>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                    {review.complexityAnalysis.timeComplexity}
                  </div>
                </div>

                <div style={{ background: 'var(--bg-glass)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <Cpu size={13} color="#38bdf8" /> Space Complexity
                  </div>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                    {review.complexityAnalysis.spaceComplexity}
                  </div>
                </div>
              </div>

              {/* Executive Summary */}
              <div>
                <h3 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>Diagnostic Summary</h3>
                <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{review.executiveSummary}</p>
              </div>

              {/* Issues Identified */}
              <div>
                <h3 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '10px' }}>Detected Issues & Vulnerabilities</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {review.issuesFound.map((issue, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'var(--bg-glass)',
                        border: '1px solid var(--border-glass)',
                        borderRadius: '8px',
                        padding: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-primary)' }}>{issue.type}</span>
                        <span style={{
                          fontSize: '10.5px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '10px',
                          background: issue.severity === 'High' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          color: issue.severity === 'High' ? '#f43f5e' : '#f59e0b',
                          border: '1px solid var(--border-glass)'
                        }}>
                          {issue.severity} Severity
                        </span>
                      </div>
                      <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{issue.description}</div>
                      <div style={{ fontSize: '11.5px', color: 'var(--accent-purple)', marginTop: '2px' }}>
                        Fix: {issue.lineSuggestion}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Refactored Code */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '13.5px', fontWeight: 700, color: '#38bdf8' }}>
                    🚀 Hardened Production Implementation
                  </h3>
                  <button
                    onClick={copyRefactored}
                    style={{
                      background: 'var(--bg-glass)',
                      border: '1px solid var(--border-glass)',
                      color: 'var(--text-primary)',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    {copied ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                    {copied ? 'Copied' : 'Copy Code'}
                  </button>
                </div>

                <pre style={{
                  background: 'rgba(0, 0, 0, 0.45)',
                  border: '1px solid var(--border-glass)',
                  padding: '16px',
                  borderRadius: '10px',
                  overflowX: 'auto',
                  color: '#e2e8f0'
                }}>
                  <code>{review.refactoredCode}</code>
                </pre>
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
              <Code2 size={48} color="var(--border-glass-glow)" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                Awaiting Code Review Request
              </h3>
              <p style={{ fontSize: '13px', maxWidth: '360px' }}>
                Select your language and paste any function or component on the left, then click "Review & Refactor Code".
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
