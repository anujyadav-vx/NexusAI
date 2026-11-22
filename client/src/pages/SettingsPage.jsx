import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useNotification } from "../context/NotificationContext";
import { api } from "../services/api";
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
  Trash2,
  Save,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Eye,
  EyeOff,
  Sparkles,
  Mail,
  Lock,
  Server,
  Activity,
} from "lucide-react";

export default function SettingsPage() {
  const { user, refreshUserData } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useNotification();

  const [name, setName] = useState(user?.name || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");

  const [geminiKey, setGeminiKey] = useState(
    localStorage.getItem("nexus_gemini_key") || "",
  );

  const [openaiKey, setOpenaiKey] = useState(
    localStorage.getItem("nexus_openai_key") || "",
  );

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingKeys, setSavingKeys] = useState(false);

  const [testingGemini, setTestingGemini] = useState(false);
  const [geminiStatus, setGeminiStatus] = useState(null);

  const [testingOpenAI, setTestingOpenAI] = useState(false);
  const [openaiStatus, setOpenaiStatus] = useState(null);

  const [systemStatus, setSystemStatus] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [showGuide, setShowGuide] = useState(false);
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showOpenAIKey, setShowOpenAIKey] = useState(false);

  const loadStatus = async () => {
    setLoadingStatus(true);

    try {
      const res = await api.getAiStatus();

      if (res.success) {
        setSystemStatus(res.data);
      }
    } catch {
      setSystemStatus(null);
    } finally {
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  useEffect(() => {
    setName(user?.name || "");
    setAvatar(user?.avatar || "");
  }, [user?.name, user?.avatar]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await api.updateProfile({ name, avatar });

      if (res.success) {
        await refreshUserData();
        addToast("Profile updated successfully!", "success");
      } else {
        throw new Error(res.message || "Update failed");
      }
    } catch (err) {
      addToast(err.message || "Failed to save profile.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveKeys = async (e) => {
    e.preventDefault();
    setSavingKeys(true);

    try {
      if (geminiKey.trim()) {
        localStorage.setItem("nexus_gemini_key", geminiKey.trim());
      } else {
        localStorage.removeItem("nexus_gemini_key");
      }

      if (openaiKey.trim()) {
        localStorage.setItem("nexus_openai_key", openaiKey.trim());
      } else {
        localStorage.removeItem("nexus_openai_key");
      }

      addToast("Custom API keys saved in this browser.", "success");
      await loadStatus();
    } catch {
      addToast("Unable to save API keys.", "error");
    } finally {
      setSavingKeys(false);
    }
  };

  const handleClearKeys = async () => {
    localStorage.removeItem("nexus_gemini_key");
    localStorage.removeItem("nexus_openai_key");

    setGeminiKey("");
    setOpenaiKey("");
    setGeminiStatus(null);
    setOpenaiStatus(null);

    addToast(
      "Custom API keys cleared. Server configuration will be used.",
      "info",
    );

    await loadStatus();
  };

  const testKey = async (provider) => {
    const key = provider === "gemini" ? geminiKey : openaiKey;

    if (provider === "gemini") {
      setTestingGemini(true);
      setGeminiStatus(null);
    } else {
      setTestingOpenAI(true);
      setOpenaiStatus(null);
    }

    try {
      const res = await api.testAiConnection({
        provider,
        apiKey: key,
      });

      if (provider === "gemini") {
        setGeminiStatus(res);
      } else {
        setOpenaiStatus(res);
      }

      addToast(
        res.message ||
          (res.success ? "Connection successful." : "Connection failed."),
        res.success ? "success" : "error",
      );
    } catch (err) {
      const failObj = {
        success: false,
        message: err.message || "Connection test failed.",
      };

      if (provider === "gemini") {
        setGeminiStatus(failObj);
      } else {
        setOpenaiStatus(failObj);
      }

      addToast(failObj.message, "error");
    } finally {
      if (provider === "gemini") {
        setTestingGemini(false);
      } else {
        setTestingOpenAI(false);
      }
    }
  };

  const providerName =
    systemStatus?.provider === "gemini"
      ? "Google Gemini"
      : systemStatus?.provider === "openai"
        ? "OpenAI"
        : systemStatus?.provider || "Not reported";

  const StatusIndicator = ({ status, loading, successLabel, failureLabel }) => (
    <span
      className={`settings-status ${loading ? "status-loading" : status ? "status-success" : "status-unknown"}`}
    >
      {loading ? (
        <RefreshCw size={12} className="settings-spin" />
      ) : status ? (
        <CheckCircle2 size={12} />
      ) : (
        <AlertCircle size={12} />
      )}
      {loading ? "Checking" : status ? successLabel : failureLabel}
    </span>
  );

  const KeyStatus = ({ status }) => {
    if (!status) return null;

    return (
      <div
        className={`settings-key-status ${status.success ? "key-status-success" : "key-status-error"}`}
      >
        {status.success ? (
          <CheckCircle2 size={15} />
        ) : (
          <AlertCircle size={15} />
        )}
        <span>{status.message}</span>
      </div>
    );
  };

  return (
    <div className="settings-page">
      {/* Header */}
      <header className="settings-header">
        <div className="settings-heading">
          <div className="settings-heading-icon">
            <Settings size={21} />
          </div>

          <div>
            <div className="settings-eyebrow">
              WORKSPACE <span>/</span> PREFERENCES
            </div>

            <h1>Settings</h1>

            <p>
              Manage your profile, AI integrations, and workspace preferences.
            </p>
          </div>
        </div>

        <button
          type="button"
          className={`settings-guide-btn ${showGuide ? "guide-active" : ""}`}
          onClick={() => setShowGuide(!showGuide)}
        >
          <HelpCircle size={15} />
          Setup guide
          {showGuide ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </header>

      {/* Setup Guide */}
      {showGuide && (
        <section className="settings-guide">
          <div className="settings-guide-heading">
            <div className="settings-guide-icon">
              <Sparkles size={19} />
            </div>

            <div>
              <h2>Connect your services</h2>
              <p>Quick setup instructions for your NexusAI workspace.</p>
            </div>
          </div>

          <div className="settings-guide-grid">
            <div className="settings-guide-card">
              <div className="settings-guide-card-title">
                <Cpu size={17} />
                <h3>Connect an AI provider</h3>
              </div>

              <p>
                Generate an API key from your preferred provider and add it to
                the BYOK section below.
              </p>

              <div className="settings-guide-links">
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                >
                  Google AI Studio <ExternalLink size={12} />
                </a>

                <a
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  rel="noreferrer"
                >
                  OpenAI Dashboard <ExternalLink size={12} />
                </a>
              </div>

              <div className="settings-code">GEMINI_API_KEY=your_api_key</div>
            </div>

            <div className="settings-guide-card">
              <div className="settings-guide-card-title">
                <Database size={17} />
                <h3>Connect MongoDB</h3>
              </div>

              <p>
                Create a MongoDB Atlas cluster and configure its connection URI
                in your backend environment.
              </p>

              <div className="settings-guide-links">
                <a
                  href="https://www.mongodb.com/atlas"
                  target="_blank"
                  rel="noreferrer"
                >
                  MongoDB Atlas <ExternalLink size={12} />
                </a>
              </div>

              <div className="settings-code">MONGODB_URI=mongodb+srv://...</div>
            </div>
          </div>

          <div className="settings-guide-note">
            <Lock size={14} />
            Keep server environment variables private. Never commit API keys or
            database credentials to GitHub.
          </div>
        </section>
      )}

      {/* Diagnostics */}
      <section className="settings-section">
        <div className="settings-section-heading">
          <div>
            <span className="settings-section-label">OVERVIEW</span>
            <h2>System diagnostics</h2>
            <p>Current status reported by your backend.</p>
          </div>

          <button
            type="button"
            className="settings-icon-btn"
            onClick={loadStatus}
            disabled={loadingStatus}
            title="Refresh diagnostics"
          >
            <RefreshCw
              size={15}
              className={loadingStatus ? "settings-spin" : ""}
            />
          </button>
        </div>

        <div className="settings-diagnostics-grid">
          <div className="settings-diagnostic-card">
            <div className="settings-diagnostic-top">
              <div className="settings-diagnostic-icon database-icon">
                <Database size={19} />
              </div>

              <StatusIndicator
                status={systemStatus?.database?.connected}
                loading={loadingStatus}
                successLabel="Connected"
                failureLabel={systemStatus ? "Not connected" : "Unknown"}
              />
            </div>

            <div className="settings-diagnostic-title">Database</div>

            <div className="settings-diagnostic-value">
              {loadingStatus
                ? "Checking connection..."
                : systemStatus?.database?.connected
                  ? "MongoDB"
                  : "Connection not confirmed"}
            </div>

            <p>Database connectivity reported by the API.</p>
          </div>

          <div className="settings-diagnostic-card">
            <div className="settings-diagnostic-top">
              <div className="settings-diagnostic-icon ai-icon">
                <Cpu size={19} />
              </div>

              <StatusIndicator
                status={systemStatus?.hasServerKey}
                loading={loadingStatus}
                successLabel="Server key configured"
                failureLabel={
                  systemStatus ? "No server key reported" : "Unknown"
                }
              />
            </div>

            <div className="settings-diagnostic-title">AI provider</div>

            <div className="settings-diagnostic-value">
              {loadingStatus ? "Checking provider..." : providerName}
            </div>

            <p>Configured provider and server key status.</p>
          </div>
        </div>
      </section>

      {/* Profile */}
      <section className="settings-section">
        <div className="settings-section-heading">
          <div>
            <span className="settings-section-label">ACCOUNT</span>
            <h2>Profile information</h2>
            <p>Update the personal details associated with your account.</p>
          </div>

          <div className="settings-section-icon">
            <User size={18} />
          </div>
        </div>

        <form onSubmit={handleProfileSave} className="settings-form">
          <div className="settings-form-grid">
            <div className="settings-field">
              <label htmlFor="settings-name">Full name</label>

              <input
                id="settings-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>

            <div className="settings-field">
              <label htmlFor="settings-email">Email address</label>

              <input
                id="settings-email"
                type="email"
                value={user?.email || ""}
                disabled
              />

              <span className="settings-field-hint">
                Email address cannot be changed here.
              </span>
            </div>
          </div>

          <div className="settings-field">
            <label htmlFor="settings-avatar">Avatar image URL</label>

            <input
              id="settings-avatar"
              type="url"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://example.com/avatar.png"
            />

            <span className="settings-field-hint">
              Enter a publicly accessible image URL.
            </span>
          </div>

          <div className="settings-form-footer">
            <button
              type="submit"
              className="settings-primary-btn"
              disabled={saving}
            >
              {saving ? (
                <RefreshCw size={15} className="settings-spin" />
              ) : (
                <Save size={15} />
              )}
              {saving ? "Saving changes..." : "Save profile"}
            </button>
          </div>
        </form>
      </section>

      {/* BYOK */}
      <section className="settings-section">
        <div className="settings-section-heading">
          <div>
            <span className="settings-section-label">INTEGRATIONS</span>
            <h2>API key management</h2>
            <p>Configure personal provider keys for your AI requests.</p>
          </div>

          <div className="settings-section-icon key-section-icon">
            <Key size={18} />
          </div>
        </div>

        <div className="settings-security-note">
          <Shield size={16} />
          <div>
            <strong>Browser storage</strong>
            <p>
              These keys are stored in this browser's localStorage. They are not
              encrypted by this UI. Use a trusted device and avoid sharing your
              browser session.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSaveKeys}
          className="settings-form settings-keys-form"
        >
          {/* Gemini */}
          <div className="settings-key-card">
            <div className="settings-key-heading">
              <div className="settings-provider-icon gemini-provider">
                <Sparkles size={17} />
              </div>

              <div>
                <h3>Google Gemini</h3>
                <p>Configure your Gemini API key.</p>
              </div>

              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="settings-provider-link"
              >
                Get key <ExternalLink size={12} />
              </a>
            </div>

            <div className="settings-key-input-row">
              <div className="settings-key-input-wrap">
                <input
                  type={showGeminiKey ? "text" : "password"}
                  value={geminiKey}
                  onChange={(e) => {
                    setGeminiKey(e.target.value);
                    setGeminiStatus(null);
                  }}
                  placeholder="Enter Gemini API key"
                  autoComplete="off"
                />

                <button
                  type="button"
                  className="settings-reveal-btn"
                  onClick={() => setShowGeminiKey(!showGeminiKey)}
                  aria-label={
                    showGeminiKey ? "Hide Gemini key" : "Show Gemini key"
                  }
                >
                  {showGeminiKey ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              <button
                type="button"
                className="settings-secondary-btn"
                onClick={() => testKey("gemini")}
                disabled={testingGemini}
              >
                {testingGemini ? (
                  <RefreshCw size={14} className="settings-spin" />
                ) : (
                  <Activity size={14} />
                )}
                {testingGemini ? "Testing..." : "Test key"}
              </button>
            </div>

            <KeyStatus status={geminiStatus} />
          </div>

          {/* OpenAI */}
          <div className="settings-key-card">
            <div className="settings-key-heading">
              <div className="settings-provider-icon openai-provider">
                <Cpu size={17} />
              </div>

              <div>
                <h3>OpenAI</h3>
                <p>Configure your OpenAI API key.</p>
              </div>

              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noreferrer"
                className="settings-provider-link"
              >
                Get key <ExternalLink size={12} />
              </a>
            </div>

            <div className="settings-key-input-row">
              <div className="settings-key-input-wrap">
                <input
                  type={showOpenAIKey ? "text" : "password"}
                  value={openaiKey}
                  onChange={(e) => {
                    setOpenaiKey(e.target.value);
                    setOpenaiStatus(null);
                  }}
                  placeholder="Enter OpenAI API key"
                  autoComplete="off"
                />

                <button
                  type="button"
                  className="settings-reveal-btn"
                  onClick={() => setShowOpenAIKey(!showOpenAIKey)}
                  aria-label={
                    showOpenAIKey ? "Hide OpenAI key" : "Show OpenAI key"
                  }
                >
                  {showOpenAIKey ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              <button
                type="button"
                className="settings-secondary-btn"
                onClick={() => testKey("openai")}
                disabled={testingOpenAI}
              >
                {testingOpenAI ? (
                  <RefreshCw size={14} className="settings-spin" />
                ) : (
                  <Activity size={14} />
                )}
                {testingOpenAI ? "Testing..." : "Test key"}
              </button>
            </div>

            <KeyStatus status={openaiStatus} />
          </div>

          <div className="settings-keys-footer">
            <button
              type="submit"
              className="settings-primary-btn"
              disabled={savingKeys}
            >
              {savingKeys ? (
                <RefreshCw size={15} className="settings-spin" />
              ) : (
                <Save size={15} />
              )}
              {savingKeys ? "Saving keys..." : "Save API keys"}
            </button>

            {(geminiKey || openaiKey) && (
              <button
                type="button"
                className="settings-danger-btn"
                onClick={handleClearKeys}
              >
                <Trash2 size={14} />
                Clear keys
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Preferences */}
      <section className="settings-section">
        <div className="settings-section-heading">
          <div>
            <span className="settings-section-label">PREFERENCES</span>
            <h2>Workspace preferences</h2>
            <p>Adjust the way NexusAI looks and behaves.</p>
          </div>

          <div className="settings-section-icon preference-icon">
            <Shield size={18} />
          </div>
        </div>

        <div className="settings-preference-list">
          <div className="settings-preference-row">
            <div className="settings-preference-info">
              <div className="settings-preference-icon">
                {theme === "dark" ? <Moon size={17} /> : <Sun size={17} />}
              </div>

              <div>
                <h3>Appearance</h3>
                <p>Choose your preferred application theme.</p>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              className="settings-theme-toggle"
            >
              {theme === "dark" ? <Moon size={14} /> : <Sun size={14} />}
              {theme === "dark" ? "Dark mode" : "Light mode"}
            </button>
          </div>

          <div className="settings-preference-row">
            <div className="settings-preference-info">
              <div className="settings-preference-icon">
                <Mail size={17} />
              </div>

              <div>
                <h3>Token quota email warnings</h3>
                <p>
                  Receive an alert when usage exceeds 85% of your monthly
                  allowance.
                </p>
                <span className="settings-field-hint">
                  This is currently a local UI preference.
                </span>
              </div>
            </div>

            <label className="settings-switch">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
              />
              <span className="settings-switch-track" />
            </label>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="settings-footer">
        <div>
          <Server size={14} />
          NexusAI workspace settings
        </div>

        <span>Manage your workspace responsibly.</span>
      </footer>
    </div>
  );
}
