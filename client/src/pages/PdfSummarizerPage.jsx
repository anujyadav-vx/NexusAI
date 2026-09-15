import React, { useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import {
  FileSearch,
  Sparkles,
  FileText,
  CheckCircle2,
  HelpCircle,
  Upload,
  ArrowRight,
  ListTodo
} from 'lucide-react';

export default function PdfSummarizerPage() {
  const { refreshUserData } = useAuth();
  const { addToast } = useNotification();
  const [documentName, setDocumentName] = useState('Enterprise_Q3_Strategic_Review.pdf');
  const [text, setText] = useState(
    "Executive Overview: The company achieved 38% Year-over-Year revenue growth in Q3 2026 driven by expansion of our AI Developer Cloud platform. Infrastructure efficiency initiatives reduced per-user compute costs by 22% using automated workload orchestration. Overall Customer Satisfaction (CSAT) score reached 94.2%. Priorities for next quarter include achieving SOC2 Type II certification, expanding self-serve enterprise tier onboarding, and rolling out regional multi-zone disaster recovery."
  );
  const [query, setQuery] = useState('What are the top 3 priorities for next quarter?');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);

  const handleSummarize = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.pdfSummarize({ text, documentName, query });
      if (res.success && res.data) {
        setSummary(res.data);
        refreshUserData();
        addToast('Document summarized successfully!', 'success');
      } else {
        throw new Error(res.message || 'Summarization failed');
      }
    } catch (err) {
      addToast(err.message || 'Failed to summarize document.', 'error');
    } finally {
      setLoading(false);
    }
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
            background: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FileSearch size={20} color="#fff" />
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 800 }}>AI Document & PDF Summarizer</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Distill multi-page PDFs, contracts, and research reports into executive summaries, key bullet points, and specific answer extractions.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) minmax(400px, 1.5fr)', gap: '24px', alignItems: 'start' }}>
        {/* Input */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <form onSubmit={handleSummarize} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Document Name</label>
              <input
                type="text"
                className="glass-input"
                style={{ width: '100%' }}
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                required
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600 }}>Document Content</label>
                <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Paste raw text or extract</span>
              </div>
              <textarea
                className="glass-input"
                rows={9}
                style={{ width: '100%', resize: 'vertical', fontSize: '13px', lineHeight: 1.5 }}
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                Target Question / Query (Optional)
              </label>
              <div style={{ position: 'relative' }}>
                <HelpCircle size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input
                  type="text"
                  className="glass-input"
                  style={{ width: '100%', paddingLeft: '38px', fontSize: '13px' }}
                  placeholder="e.g. What is the projected ROI or deadline?"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
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
              {loading ? <Sparkles size={16} className="animate-spin" /> : <FileSearch size={16} />}
              {loading ? 'Synthesizing Document...' : 'Generate Executive Summary'}
            </button>
          </form>
        </div>

        {/* Results */}
        <div>
          {summary ? (
            <div className="glass-panel animate-fade-in" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '14px', borderBottom: '1px solid var(--border-glass)' }}>
                <div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Analyzed File</div>
                  <div style={{ fontSize: '16px', fontWeight: 700 }}>{summary.documentName}</div>
                </div>
                <span style={{ fontSize: '12px', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', padding: '4px 10px', borderRadius: '12px', color: 'var(--text-secondary)' }}>
                  ~{summary.pageCount} pages parsed
                </span>
              </div>

              {/* Executive Summary */}
              <div>
                <h3 style={{ fontSize: '13.5px', fontWeight: 700, marginBottom: '6px', color: 'var(--accent-purple)' }}>Executive Summary</h3>
                <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{summary.executiveSummary}</p>
              </div>

              {/* Targeted Q&A if asked */}
              {summary.answerToQuery && (
                <div style={{ background: 'rgba(139, 92, 246, 0.12)', border: '1px solid rgba(139, 92, 246, 0.3)', padding: '14px', borderRadius: '10px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#c084fc', marginBottom: '4px' }}>
                    Direct Answer to Your Query:
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                    {summary.answerToQuery}
                  </div>
                </div>
              )}

              {/* Key Takeaways */}
              <div>
                <h3 style={{ fontSize: '13.5px', fontWeight: 700, marginBottom: '8px' }}>Key Takeaways</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {summary.keyTakeaways.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                      <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Items */}
              <div>
                <h3 style={{ fontSize: '13.5px', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ListTodo size={16} color="#f59e0b" /> Recommended Next Actions
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {summary.actionItems.map((action, idx) => (
                    <div key={idx} style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      • {action}
                    </div>
                  ))}
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
              <FileSearch size={48} color="var(--border-glass-glow)" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                No Document Summarized Yet
              </h3>
              <p style={{ fontSize: '13px', maxWidth: '360px' }}>
                Provide document text on the left and optional questions to extract precise insights.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
