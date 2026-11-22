import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Sparkles,
  Lock,
  Mail,
  User,
  ArrowRight,
  Check,
  LoaderCircle,
  ShieldCheck,
} from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password) return;

    setLoading(true);

    try {
      const result = await register(name.trim(), email.trim(), password);

      if (result.success) {
        navigate("/dashboard");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="register-page">
      <div className="register-card">
        {/* Brand */}
        <div className="register-header">
          <Link to="/" className="register-brand">
            <span className="register-brand-icon">
              <Sparkles size={19} />
            </span>
            <span>
              Nexus<span className="register-brand-accent">AI</span>
            </span>
          </Link>

          <div className="register-heading">
            <h1>Create your account</h1>
            <p>Start building with AI. Your workspace is just one step away.</p>
          </div>
        </div>

        {/* Registration Form */}
        <form className="register-form" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="register-field">
            <label htmlFor="register-name">Full name</label>

            <div className="register-input-wrap">
              <User size={17} />

              <input
                id="register-name"
                type="text"
                required
                autoComplete="name"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          {/* Email */}
          <div className="register-field">
            <label htmlFor="register-email">Email address</label>

            <div className="register-input-wrap">
              <Mail size={17} />

              <input
                id="register-email"
                type="email"
                required
                autoComplete="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password */}
          <div className="register-field">
            <label htmlFor="register-password">
              Password
              <span className="register-field-hint">Minimum 6 characters</span>
            </label>

            <div className="register-input-wrap">
              <Lock size={17} />

              <input
                id="register-password"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Benefits */}
          <div className="register-benefits">
            <div>
              <Check size={15} />
              <span>No credit card required</span>
            </div>

            <div>
              <Check size={15} />
              <span>Access to your AI workspace</span>
            </div>
          </div>

          {/* Submit */}
          <button type="submit" className="register-submit" disabled={loading}>
            {loading ? (
              <>
                <LoaderCircle size={17} className="register-spinner" />
                Creating account...
              </>
            ) : (
              <>
                Get started free
                <ArrowRight size={17} />
              </>
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="register-footer">
          <span>Already have an account?</span>
          <Link to="/login">Sign in</Link>
        </div>

        {/* Security Note */}
        <div className="register-security">
          <ShieldCheck size={14} />
          <span>Secure authentication · NexusAI Workspace</span>
        </div>
      </div>
    </main>
  );
}
