import React, { useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import {
  Image as ImageIcon,
  Sparkles,
  Download,
  Share2,
  Cpu,
  Layers,
  Sliders,
  ExternalLink
} from 'lucide-react';

export default function ImageGeneratorPage() {
  const { refreshUserData } = useAuth();
  const { addToast } = useNotification();
  const [prompt, setPrompt] = useState('Cyberpunk neon skyscraper with holographic interfaces and volumetric fog');
  const [style, setStyle] = useState('Cyberpunk');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [loading, setLoading] = useState(false);
  const [imageResult, setImageResult] = useState(null);

  const styles = ['Photorealistic', 'Cyberpunk', '3D Render', 'Anime/Digital Art'];
  const aspectRatios = ['16:9', '1:1', '9:16'];

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const res = await api.imageGenerate({ prompt, style, aspectRatio });
      if (res.success && res.data) {
        setImageResult(res.data);
        refreshUserData();
        addToast('Visual artwork rendered successfully!', 'success');
      } else {
        throw new Error(res.message || 'Image generation failed');
      }
    } catch (err) {
      addToast(err.message || 'Failed to render image.', 'error');
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
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ImageIcon size={20} color="#fff" />
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 800 }}>AI Creative Image Studio</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Synthesize high-fidelity photorealistic and digital art assets from descriptive prompts with seed reproducibility and custom styles.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) minmax(400px, 1.5fr)', gap: '24px', alignItems: 'start' }}>
        {/* Form */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Image Prompt</label>
              <textarea
                className="glass-input"
                rows={4}
                style={{ width: '100%', resize: 'none', fontSize: '13.5px' }}
                placeholder="Describe your scene in detail..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '8px' }}>Aesthetic Style</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {styles.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStyle(s)}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: style === s ? '1px solid var(--accent-purple)' : '1px solid var(--border-glass)',
                      background: style === s ? 'rgba(139, 92, 246, 0.25)' : 'var(--bg-glass)',
                      color: style === s ? '#fff' : 'var(--text-secondary)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '8px' }}>Aspect Ratio</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                {aspectRatios.map(ar => (
                  <button
                    key={ar}
                    type="button"
                    onClick={() => setAspectRatio(ar)}
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: aspectRatio === ar ? '1px solid var(--accent-indigo)' : '1px solid var(--border-glass)',
                      background: aspectRatio === ar ? 'rgba(99, 102, 241, 0.25)' : 'var(--bg-glass)',
                      color: aspectRatio === ar ? '#fff' : 'var(--text-secondary)'
                    }}
                  >
                    {ar}
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
              {loading ? <Sparkles size={16} className="animate-spin" /> : <ImageIcon size={16} />}
              {loading ? 'Synthesizing Neural Canvas...' : 'Generate AI Visual'}
            </button>
          </form>
        </div>

        {/* Display */}
        <div>
          {imageResult ? (
            <div className="glass-panel animate-fade-in" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-glass)', background: '#000' }}>
                <img
                  src={imageResult.imageUrl}
                  alt={imageResult.prompt}
                  style={{
                    width: '100%',
                    maxHeight: '440px',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
                  padding: '20px 16px 14px 16px',
                  color: '#fff',
                  fontSize: '13px'
                }}>
                  "{imageResult.prompt}"
                </div>
              </div>

              {/* Specs & Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <span>Ratio: {imageResult.aspectRatio}</span>
                  <span>Style: {imageResult.style}</span>
                  <span>Seed: #{imageResult.seed}</span>
                </div>

                <a
                  href={imageResult.imageUrl}
                  target="_blank"
                  rel="noreferrer"
                  download={`nexus_ai_${imageResult.seed}.jpg`}
                  className="gradient-btn-primary"
                  style={{
                    padding: '8px 16px',
                    textDecoration: 'none',
                    fontSize: '12.5px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Download size={14} /> Download Full Asset
                </a>
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
              <ImageIcon size={48} color="var(--border-glass-glow)" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                Neural Studio Ready
              </h3>
              <p style={{ fontSize: '13px', maxWidth: '360px' }}>
                Type your visual prompt on the left, pick an aesthetic style and aspect ratio, then hit Generate.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
