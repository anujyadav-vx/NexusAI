import React, { useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import {
  FileCheck2,
  UploadCloud,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Copy,
  Check,
  Target,
  Award
} from 'lucide-react';

export default function ResumeAnalyzerPage() {
  const { refreshUserData } = useAuth();
  const { addToast } = useNotification();
  const [targetRole, setTargetRole] = useState('Senior Full Stack Engineer');
  const [resumeText, setResumeText] = useState(
    "Alex Johnson\nFull Stack Developer with 4 years experience building web applications using React, Node.js, and PostgreSQL.\n\nExperience:\n- Built REST APIs and connected to database.\n- Fixed bugs and improved site performance.\n- Worked in agile team with sprint ceremonies.\n\nSkills: JavaScript, HTML, CSS, React, Node.js, SQL, Git."
  );
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [copiedIdx, setCopiedIdx] = useState(null);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!resumeText.trim()) return;

    setLoading(true);
    try {
      const res = await api.resumeAnalyze({ resumeText, targetRole });
      if (res.success && res.data) {
        setAnalysis(res.data);
        refreshUserData();
        addToast('Resume analysis complete!', 'success');
      } else {
        throw new Error(res.message || 'Analysis failed');
      }
    } catch (err) {
      addToast(err.message || 'Failed to analyze resume.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const copyRewrite = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    addToast('Rewritten bullet copied!', 'info', 2000);
    setTimeout(() => setCopiedIdx(null), 2000);
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
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FileCheck2 size={20} color="#fff" />
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 800 }}>AI Resume & ATS Optimizer</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Screen your resume against modern ATS algorithmic filters, identify keyword gaps, and get high-impact bullet point rewrites.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 1fr) minmax(360px, 1.4fr)', gap: '24px', alignItems: 'start' }}>
        {/* Left Column: Input Form */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <form onSubmit={handleAnalyze} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                Target Job Role
              </label>
              <div style={{ position: 'relative' }}>
                <Target size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input
                  type="text"
                  className="glass-input"
                  style={{ width: '100%', paddingLeft: '38px' }}
                  placeholder="e.g. Senior Staff Engineer, DevOps Architect"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600 }}>Resume Content</label>
                <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Paste text or summary</span>
              </div>
              <textarea
                className="glass-input"
                rows={12}
                style={{ width: '100%', resize: 'vertical', lineHeight: 1.5, fontSize: '13px', fontFamily: 'inherit' }}
                placeholder="Paste your experience, summary, and skills here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
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
              {loading ? <Sparkles size={16} className="animate-spin" /> : <FileCheck2 size={16} />}
              {loading ? 'Analyzing with ATS Engine...' : 'Run ATS & Keyword Analysis'}
            </button>
          </form>
        </div>

        {/* Right Column: Results */}
        <div>
          {analysis ? (
            <div className="glass-panel animate-fade-in" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
              {/* Score Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '20px',
                borderBottom: '1px solid var(--border-glass)'
              }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    ATS Match Score
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Target: {analysis.targetRole}
                  </div>
                </div>

                <div style={{
                  width: '74px',
                  height: '74px',
                  borderRadius: '50%',
                  background: analysis.atsScore >= 80 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                  border: `3px solid ${analysis.atsScore >= 80 ? '#10b981' : '#f59e0b'}`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                }}>
                  <span style={{ fontSize: '24px', fontWeight: 800, color: analysis.atsScore >= 80 ? '#10b981' : '#f59e0b' }}>
                    {analysis.atsScore}
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>/ 100</span>
                </div>
              </div>

              {/* Summary */}
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>Executive Critique</h3>
                <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{analysis.summary}</p>
              </div>

              {/* Strengths & Gaps */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ background: 'var(--bg-glass)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                    <CheckCircle2 size={15} /> Identified Strengths
                  </div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                    {analysis.strengths.map((str, idx) => (
                      <li key={idx} style={{ display: 'flex', gap: '6px' }}>
                        <span>•</span> <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ background: 'var(--bg-glass)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#f43f5e', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                    <AlertCircle size={15} /> Critical ATS Gaps
                  </div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                    {analysis.criticalGaps.map((gap, idx) => (
                      <li key={idx} style={{ display: 'flex', gap: '6px' }}>
                        <span>•</span> <span>{gap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Keyword Matches */}
              <div>
                <h3 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '10px' }}>ATS Keyword Density Scan</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {analysis.keywordMatches.map((kw, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '12px',
                        padding: '4px 10px',
                        borderRadius: '16px',
                        background: kw.matched ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
                        border: `1px solid ${kw.matched ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
                        color: kw.matched ? '#10b981' : '#f43f5e',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      {kw.matched ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                      {kw.keyword}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bullet Point Rewrites */}
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px', color: '#c084fc' }}>
                  ✨ Quantified Impact Rewrites (Before vs After)
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {analysis.bulletPointRewrites.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'var(--bg-glass)',
                        border: '1px solid var(--border-glass)',
                        borderRadius: '10px',
                        padding: '14px'
                      }}
                    >
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase' }}>
                        Original Bullet:
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '10px', fontStyle: 'italic' }}>
                        "{item.original}"
                      </div>
                      <div style={{ fontSize: '11px', color: '#10b981', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 700 }}>
                        High-Impact ATS Optimized:
                      </div>
                      <div style={{ fontSize: '13.5px', color: 'var(--text-primary)', lineHeight: 1.5, fontWeight: 500 }}>
                        "{item.improved}"
                      </div>
                      <button
                        onClick={() => copyRewrite(item.improved, idx)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--accent-purple)',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                          marginTop: '8px'
                        }}
                      >
                        {copiedIdx === idx ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                        {copiedIdx === idx ? 'Copied' : 'Copy Improved Bullet'}
                      </button>
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
              <Award size={48} color="var(--border-glass-glow)" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                Awaiting Resume Input
              </h3>
              <p style={{ fontSize: '13px', maxWidth: '360px' }}>
                Fill in your target job role and paste your resume text on the left, then click "Run ATS & Keyword Analysis".
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
