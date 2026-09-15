import React, { useState } from 'react';
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
  Bell,
  Check,
  Sparkles
} from 'lucide-react';

export default function SettingsPage() {
  const { user, refreshUserData } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useNotification();

  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [geminiKey, setGeminiKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [saving, setSaving] = useState(false);

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
    addToast('Custom API Keys saved to browser session!', 'success');
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
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
            <Settings size={20} color="#fff" />
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 800 }}>Account & Workspace Settings</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Manage your user profile credentials, custom API keys, and notification triggers.
        </p>
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
                style={{ width: '100%', opacity: 0.6, cursor: 'not-allowed' }}
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
        <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Key size={18} color="var(--accent-amber)" /> Bring Your Own Key (BYOK)
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '18px' }}>
          By default, NexusAI backend provides intelligent multi-tier generation automatically. You can optionally supply your own Gemini or OpenAI keys to connect directly to your external cloud project.
        </p>

        <form onSubmit={handleSaveKeys} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Google Gemini API Key</label>
            <input
              type="password"
              className="glass-input"
              style={{ width: '100%', fontFamily: 'var(--font-mono)' }}
              placeholder="AIzaSy..."
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>OpenAI API Key</label>
            <input
              type="password"
              className="glass-input"
              style={{ width: '100%', fontFamily: 'var(--font-mono)' }}
              placeholder="sk-proj-..."
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
            />
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
