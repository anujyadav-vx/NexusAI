import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotification } from '../context/NotificationContext';
import { api } from '../services/api';
import {
  Settings,
  User,
  Key,
  Moon,
  Sun,
  Shield,
  CheckCircle2,
  AlertCircle,
  Database,
  Cpu,
  HelpCircle,
  ExternalLink,
  Trash2
} from 'lucide-react';

export default function SettingsPage() {
  const { user, refreshUserData } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useNotification();

  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [geminiKey, setGeminiKey] = useState(localStorage.getItem('nexus_gemini_key') || '');
  const [openaiKey, setOpenaiKey] = useState(localStorage.getItem('nexus_openai_key') || '');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [saving, setSaving] = useState(false);

  // Testing status
  const [testingGemini, setTestingGemini] = useState(false);
  const [geminiStatus, setGeminiStatus] = useState(null);
  const [testingOpenAI, setTestingOpenAI] = useState(false);
  const [openaiStatus, setOpenaiStatus] = useState(null);

  // System Diagnostics
  const [systemStatus, setSystemStatus] = useState(null);
  const [showGuide, setShowGuide] = useState(false);

  const loadStatus = async () => {
    try {
      const res = await api.getAiStatus();
      if (res.success) {
        setSystemStatus(res.data);
      }
    } catch {
      // ignore status load errors
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.updateProfile({ name, avatar });
      if (res.success) {
        await refreshUserData();
        addToast('Profile updated successfully!', 'success');
      } else {
        throw new Error(res.message || 'Update failed');
      }
    } catch (err) {
      addToast(err.message || 'Failed to save profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveKeys = (e) => {
    e.preventDefault();
    if (geminiKey.trim()) {
      localStorage.setItem('nexus_gemini_key', geminiKey.trim());
    } else {
      localStorage.removeItem('nexus_gemini_key');
    }

    if (openaiKey.trim()) {
      localStorage.setItem('nexus_openai_key', openaiKey.trim());
    } else {
      localStorage.removeItem('nexus_openai_key');
    }

    addToast('Custom API Keys saved to browser session!', 'success');
    loadStatus();
  };

  const handleClearKeys = () => {
    localStorage.removeItem('nexus_gemini_key');
    localStorage.removeItem('nexus_openai_key');
    setGeminiKey('');
    setOpenaiKey('');
    setGeminiStatus(null);
    setOpenaiStatus(null);
    addToast('Custom API keys cleared. Reverted to server configuration.', 'info');
    loadStatus();
  };

  const testKey = async (provider) => {
    const key = provider === 'gemini' ? geminiKey : openaiKey;
    if (provider === 'gemini') {
      setTestingGemini(true);
      setGeminiStatus(null);
    } else {
      setTestingOpenAI(true);
      setOpenaiStatus(null);
    }

    try {
      const res = await api.testAiConnection({ provider, apiKey: key });
      if (provider === 'gemini') {
        setGeminiStatus(res);
      } else {
        setOpenaiStatus(res);
      }
      if (res.success) {
        addToast(res.message, 'success');
      } else {
        addToast(res.message, 'error');
      }
    } catch (err) {
      const failObj = { success: false, message: err.message || 'Connection test failed.' };
      if (provider === 'gemini') setGeminiStatus(failObj);
      else setOpenaiStatus(failObj);
      addToast(err.message, 'error');
    } finally {
      if (provider === 'gemini') setTestingGemini(false);
      else setTestingOpenAI(false);
    }
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Settings size={20} color="#fff" />
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: 800 }}>Account & Workspace Settings</h1>
          </div>
          <button
            onClick={() => setShowGuide(!showGuide)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid var(--accent-purple)',
              color: 'var(--accent-purple)',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <HelpCircle size={15} />
            {showGuide ? 'Hide Setup Guide' : 'MongoDB & LLM Guide'}
          </button>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Manage your credentials, custom external API keys, real-time database connectivity, and system preferences.
        </p>
      </div>

      {/* Guide Accordion */}
      {showGuide && (
        <div className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid var(--accent-purple)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🚀 How to Connect MongoDB & LLM APIs to NexusAI
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            <div style={{ background: 'var(--bg-glass)', padding: '16px', borderRadius: '10px' }}>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Cpu size={16} color="var(--accent-cyan)" /> 1. Connect Google Gemini or OpenAI
              </div>
              <p>• <b>Google Gemini (Free):</b> Visit <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-cyan)' }}>Google AI Studio <ExternalLink size={12} style={{ display: 'inline' }} /></a>, generate a free API key, and paste it in the BYOK field below or in <code>server/.env</code> as <code>GEMINI_API_KEY=...</code>.</p>
              <p style={{ marginTop: '6px' }}>• <b>OpenAI:</b> Create an API key at <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-cyan)' }}>OpenAI Dashboard</a>, set <code>OPENAI_API_KEY=...</code> in <code>server/.env</code> or below.</p>
            </div>

            <div style={{ background: 'var(--bg-glass)', padding: '16px', borderRadius: '10px' }}>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Database size={16} color="var(--accent-emerald)" /> 2. Connect MongoDB (Cloud or Local)
              </div>
              <p>• <b>MongoDB Atlas (Free):</b> Create a free cluster at <a href="https://www.mongodb.com/atlas" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-emerald)' }}>mongodb.com/atlas</a>. Click "Connect", select Drivers, and copy your connection URI.</p>
              <p style={{ marginTop: '6px' }}>• Set in <code>server/.env</code>: <code>MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/nexusai</code>.</p>
              <p style={{ marginTop: '6px' }}>• Test with terminal command: <code>npm run test:mongo</code>.</p>
            </div>
          </div>
        </div>
      )}

      {/* Live System Diagnostics Banner */}
      <div className="glass-panel" style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: systemStatus?.database?.connected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(56, 189, 248, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: systemStatus?.database?.connected ? 'var(--accent-emerald)' : 'var(--accent-cyan)'
          }}>
            <Database size={20} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>ACTIVE DATABASE ENGINE</div>
            <div style={{ fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              {systemStatus?.database?.connected ? (
                <><CheckCircle2 size={14} color="var(--accent-emerald)" /> MongoDB Connected</>
              ) : (
                <><CheckCircle2 size={14} color="var(--accent-cyan)" /> Persistent Local DB (Zero-Downtime)</>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: systemStatus?.hasServerKey ? 'rgba(139, 92, 246, 0.15)' : 'rgba(245, 158, 11, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: systemStatus?.hasServerKey ? 'var(--accent-purple)' : 'var(--accent-amber)'
          }}>
            <Cpu size={20} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>LLM INFERENCE ENGINE</div>
            <div style={{ fontSize: '14px', fontWeight: 700, textTransform: 'capitalize' }}>
              {systemStatus?.provider === 'gemini' ? 'Google Gemini 1.5' : systemStatus?.provider === 'openai' ? 'OpenAI GPT-4o' : 'Nexus Generative Core (Offline)'}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <User size={18} color="var(--accent-purple)" /> User Profile
        </h2>

        <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Full Name</label>
              <input
                type="text"
                className="glass-input"
                style={{ width: '100%' }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Email Address (Read-Only)</label>
              <input
                type="email"
                disabled
                className="glass-input"
                style={{ width: '100%', opacity: 0.65, cursor: 'not-allowed' }}
                value={user?.email || ''}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Avatar Image URL</label>
            <input
              type="url"
              className="glass-input"
              style={{ width: '100%' }}
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="gradient-btn-primary"
            style={{
              padding: '10px 20px',
              fontSize: '13.5px',
              alignSelf: 'flex-start',
              marginTop: '6px'
            }}
          >
            {saving ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>

      {/* API Key BYOK Section */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Key size={18} color="var(--accent-amber)" /> Bring Your Own Key (BYOK)
          </h2>
          {(geminiKey || openaiKey) && (
            <button
              onClick={handleClearKeys}
              type="button"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                background: 'none',
                border: 'none',
                color: 'var(--accent-rose)',
                fontSize: '12.5px',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              <Trash2 size={13} /> Reset Keys
            </button>
          )}
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '18px' }}>
          Keys saved here take immediate priority for your current browser session and override server defaults.
        </p>

        <form onSubmit={handleSaveKeys} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600 }}>Google Gemini API Key</label>
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: 'var(--accent-cyan)', textDecoration: 'none' }}>
                Get Free Gemini Key ↗
              </a>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="password"
                className="glass-input"
                style={{ flex: 1, fontFamily: 'var(--font-mono)' }}
                placeholder="AIzaSy..."
                value={geminiKey}
                onChange={(e) => {
                  setGeminiKey(e.target.value);
                  setGeminiStatus(null);
                }}
              />
              <button
                type="button"
                onClick={() => testKey('gemini')}
                disabled={testingGemini}
                className="btn-secondary"
                style={{ padding: '8px 16px', fontSize: '12.5px', whiteSpace: 'nowrap' }}
              >
                {testingGemini ? 'Testing...' : 'Test Key'}
              </button>
            </div>
            {geminiStatus && (
              <div style={{
                marginTop: '8px',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '12.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: geminiStatus.success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                color: geminiStatus.success ? 'var(--accent-emerald)' : 'var(--accent-rose)'
              }}>
                {geminiStatus.success ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                {geminiStatus.message}
              </div>
            )}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600 }}>OpenAI API Key (Optional)</label>
              <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: 'var(--accent-cyan)', textDecoration: 'none' }}>
                Get OpenAI Key ↗
              </a>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="password"
                className="glass-input"
                style={{ flex: 1, fontFamily: 'var(--font-mono)' }}
                placeholder="sk-proj-..."
                value={openaiKey}
                onChange={(e) => {
                  setOpenaiKey(e.target.value);
                  setOpenaiStatus(null);
                }}
              />
              <button
                type="button"
                onClick={() => testKey('openai')}
                disabled={testingOpenAI}
                className="btn-secondary"
                style={{ padding: '8px 16px', fontSize: '12.5px', whiteSpace: 'nowrap' }}
              >
                {testingOpenAI ? 'Testing...' : 'Test Key'}
              </button>
            </div>
            {openaiStatus && (
              <div style={{
                marginTop: '8px',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '12.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: openaiStatus.success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                color: openaiStatus.success ? 'var(--accent-emerald)' : 'var(--accent-rose)'
              }}>
                {openaiStatus.success ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                {openaiStatus.message}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="gradient-btn-primary"
            style={{
              padding: '10px 20px',
              fontSize: '13.5px',
              alignSelf: 'flex-start',
              marginTop: '4px'
            }}
          >
            Save Custom API Keys
          </button>
        </form>
      </div>

      {/* Preferences */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={18} color="var(--accent-emerald)" /> System Preferences
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '14px', borderBottom: '1px solid var(--border-glass)' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600 }}>Theme Mode</div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>Switch between futuristic dark and crisp daylight aesthetics</div>
            </div>
            <button
              onClick={toggleTheme}
              style={{
                background: 'var(--bg-glass)',
                border: '1px solid var(--border-glass)',
                padding: '6px 14px',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                fontWeight: 600
              }}
            >
              {theme === 'dark' ? <Moon size={15} /> : <Sun size={15} />}
              {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600 }}>Token Quota Email Warnings</div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>Receive an alert when usage exceeds 85% of monthly allowance</div>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--accent-purple)', cursor: 'pointer' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
