import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Sparkles,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  LoaderCircle,
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const isExpired = queryParams.get("expired") === "true";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password) return;

    setLoading(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        navigate("/dashboard");
      }
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (type) => {
    if (type === "admin") {
      setEmail("admin@saas.ai");
      setPassword("Admin@123");
    } else {
      setEmail("demo@saas.ai");
      setPassword("Demo@123");
    }
  };

  return (
    <main className="login-page">
      <div className="login-card">
        {/* Brand */}
        <div className="login-header">
          <Link to="/" className="login-brand">
            <span className="login-brand-icon">
              <Sparkles size={19} />
            </span>
            <span>
              Nexus<span className="login-brand-accent">AI</span>
            </span>
          </Link>

          <div className="login-heading">
            <h1>Welcome back</h1>
            <p>Sign in to continue to your AI workspace.</p>
          </div>
        </div>

        {/* Expired Session */}
        {isExpired && (
          <div className="login-alert" role="alert">
            <Lock size={15} />
            <span>Your session has expired. Please sign in again.</span>
          </div>
        )}

        {/* Demo Credentials */}
        <div className="login-demo">
          <div className="login-demo-heading">
            <span>Quick access</span>
            <span className="login-demo-tag">DEMO</span>
          </div>

          <p className="login-demo-description">
            Testing the platform? Fill in the credentials instantly.
          </p>

          <div className="login-demo-actions">
            <button
              type="button"
              className="login-demo-btn"
              onClick={() => fillCredentials("demo")}
            >
              <UserCheck size={15} />
              <span>Demo User</span>
            </button>

            <button
              type="button"
              className="login-demo-btn admin"
              onClick={() => fillCredentials("admin")}
            >
              <ShieldCheck size={15} />
              <span>Admin Access</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="login-email">Email address</label>

            <div className="login-input-wrap">
              <Mail size={17} />
              <input
                id="login-email"
                type="email"
                required
                autoComplete="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="login-field">
            <label htmlFor="login-password">Password</label>

            <div className="login-input-wrap">
              <Lock size={17} />
              <input
                id="login-password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="login-submit" disabled={loading}>
            {loading ? (
              <>
                <LoaderCircle size={17} className="login-spinner" />
                Authenticating...
              </>
            ) : (
              <>
                Sign in to workspace
                <ArrowRight size={17} />
              </>
            )}
          </button>
        </form>

        {/* Register */}
        <div className="login-footer">
          <span>Don't have an account?</span>
          <Link to="/register">Create a free account</Link>
        </div>

        <div className="login-security">
          <ShieldCheck size={14} />
          <span>Secure authentication · NexusAI Workspace</span>
        </div>
      </div>
    </main>
  );
}
