import React, { useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import {
  FileText,
  Sparkles,
  Copy,
  Check,
  Clock,
  BookOpen
} from 'lucide-react';

export default function BlogGeneratorPage() {
  const { refreshUserData } = useAuth();
  const { addToast } = useNotification();
  const [topic, setTopic] = useState('Architecting Autonomous AI Multi-Agent Systems in 2026');
  const [tone, setTone] = useState('Engaging & Professional');
  const [audience, setAudience] = useState('Tech Founders & Senior Developers');
  const [length, setLength] = useState('Medium');
  const [loading, setLoading] = useState(false);
  const [blog, setBlog] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    try {
      const res = await api.blogGenerate({ topic, tone, audience, length });
      if (res.success && res.data) {
        setBlog(res.data);
        refreshUserData();
        addToast('Blog generated successfully!', 'success');
      } else {
        throw new Error(res.message || 'Generation failed');
      }
    } catch (err) {
      addToast(err.message || 'Failed to generate blog.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const copyContent = () => {
    if (!blog?.content) return;
    navigator.clipboard.writeText(`${blog.title}\n\n${blog.content}`);
    setCopied(true);
    addToast('Article copied to clipboard!', 'info', 2000);
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
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FileText size={20} color="#fff" />
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 800 }}>AI Blog & SEO Content Writer</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Generate long-form, publication-ready technical articles, complete with SEO meta tags, structured outlines, and viral hooks.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) minmax(400px, 1.6fr)', gap: '24px', alignItems: 'start' }}>
        {/* Form */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Article Topic / Title</label>
              <textarea
                className="glass-input"
                rows={3}
                style={{ width: '100%', resize: 'none', fontSize: '13.5px' }}
                placeholder="e.g. Next.js 15 Server Actions vs Express REST APIs"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '6px' }}>Tone of Voice</label>
                <select
                  className="glass-input"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  style={{ width: '100%', fontSize: '12.5px', cursor: 'pointer' }}
                >
                  <option value="Engaging & Professional" style={{ background: 'var(--bg-secondary)' }}>Engaging & Pro</option>
                  <option value="Authoritative & Deep-dive" style={{ background: 'var(--bg-secondary)' }}>Deep Technical</option>
                  <option value="Casual & Conversational" style={{ background: 'var(--bg-secondary)' }}>Conversational</option>
                  <option value="Viral & Visionary" style={{ background: 'var(--bg-secondary)' }}>Visionary / Viral</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '6px' }}>Target Audience</label>
                <input
                  type="text"
                  className="glass-input"
                  style={{ width: '100%', fontSize: '12.5px' }}
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  placeholder="e.g. Developers"
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '6px' }}>Article Length</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                {['Short (500w)', 'Medium (850w)', 'In-Depth (1500w)'].map(len => (
                  <button
                    key={len}
                    type="button"
                    onClick={() => setLength(len.split(' ')[0])}
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: length === len.split(' ')[0] ? '1px solid var(--accent-purple)' : '1px solid var(--border-glass)',
                      background: length === len.split(' ')[0] ? 'rgba(139, 92, 246, 0.2)' : 'var(--bg-glass)',
                      color: length === len.split(' ')[0] ? '#fff' : 'var(--text-secondary)'
                    }}
                  >
                    {len}
                  </button>
                ))}
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
                fontSize: '14px',
                marginTop: '6px'
              }}
            >
              {loading ? <Sparkles size={16} className="animate-spin" /> : <FileText size={16} />}
              {loading ? 'Drafting SEO Article...' : 'Generate Full Article'}
            </button>
          </form>
        </div>

        {/* Results */}
        <div>
          {blog ? (
            <div className="glass-panel animate-fade-in" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Top metadata */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, lineHeight: 1.3, marginBottom: '8px' }}>
                    {blog.title}
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={13} /> {blog.readingTime}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <BookOpen size={13} /> ~{blog.estimatedWords} words
                    </span>
                  </div>
                </div>

                <button
                  onClick={copyContent}
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
                  {copied ? 'Copied' : 'Copy Article'}
                </button>
              </div>

              {/* Meta Description Box */}
              <div style={{ background: 'var(--bg-glass)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-glass)', fontSize: '12.5px' }}>
                <span style={{ fontWeight: 700, color: 'var(--accent-amber)', marginRight: '6px' }}>SEO Meta:</span>
                <span style={{ color: 'var(--text-secondary)' }}>{blog.metaDescription}</span>
              </div>

              {/* Outline */}
              <div>
                <h3 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Generated Outline
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                  {blog.outline.map((item, i) => (
                    <div key={i}>• {item}</div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {blog.tags.map((tag, i) => (
                  <span key={i} style={{ fontSize: '11px', background: 'rgba(139, 92, 246, 0.15)', color: '#c084fc', padding: '3px 8px', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Article Content */}
              <div style={{
                borderTop: '1px solid var(--border-glass)',
                paddingTop: '16px',
                fontSize: '14px',
                lineHeight: 1.7,
                whiteSpace: 'pre-wrap',
                color: 'var(--text-primary)'
              }}>
                {blog.content}
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
              <FileText size={48} color="var(--border-glass-glow)" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                No Article Generated Yet
              </h3>
              <p style={{ fontSize: '13px', maxWidth: '360px' }}>
                Choose a topic, adjust the tone and target audience, then generate a complete SEO-optimized article.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
