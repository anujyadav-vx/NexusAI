import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Sparkles,
  ArrowRight,
  Zap,
  Code2,
  FileCheck2,
  MessageSquare,
  FileText,
  Database,
  Image,
  Check,
  ShieldCheck,
  Layers3,
  Activity,
} from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "AI Chat Assistant",
    desc: "Get intelligent responses, explore ideas, and work through complex questions with a conversational AI assistant.",
    color: "violet",
  },
  {
    icon: Code2,
    title: "Code Reviewer",
    desc: "Review code, identify potential issues, and get suggestions to improve readability and maintainability.",
    color: "blue",
  },
  {
    icon: FileCheck2,
    title: "Resume Analyzer",
    desc: "Analyze resumes, identify missing keywords, and get actionable feedback to improve your profile.",
    color: "green",
  },
  {
    icon: FileText,
    title: "Blog & SEO Writer",
    desc: "Create structured blog content with outlines, headings, and search-friendly descriptions.",
    color: "orange",
  },
  {
    icon: Database,
    title: "Natural Language SQL",
    desc: "Turn plain English questions into SQL queries for supported database systems.",
    color: "pink",
  },
  {
    icon: Image,
    title: "AI Image Studio",
    desc: "Bring creative ideas to life with AI-generated images and customizable visual styles.",
    color: "indigo",
  },
];

const plans = [
  {
    name: "Starter",
    price: "$0",
    period: "/forever",
    description: "A simple way to explore AI-powered productivity.",
    features: [
      "5,000 monthly AI tokens",
      "Standard AI chat assistant",
      "Basic code reviewer",
    ],
    button: "Get Started",
    popular: false,
  },
  {
    name: "Professional",
    price: "$29",
    period: "/month",
    description: "More capabilities for developers and creators.",
    features: [
      "50,000 monthly AI tokens",
      "Access to all 7 AI tools",
      "AI image generation",
      "Priority streaming speed",
    ],
    button: "Get Started",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/month",
    description: "A plan designed for larger teams and organizations.",
    features: [
      "1,000,000 monthly tokens",
      "Role-based team access",
      "Dedicated model fine-tuning",
      "Dedicated support",
    ],
    button: "Contact Sales",
    popular: false,
  },
];

export default function LandingPage() {
  const { user } = useAuth();

  const primaryLink = user ? "/dashboard" : "/register";

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <Link to="/" className="landing-brand">
          <span className="landing-brand-icon">
            <Sparkles size={19} />
          </span>
          <span>
            Nexus<span>AI</span>
          </span>
        </Link>

        <div className="landing-nav-links">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
        </div>

        <div className="landing-nav-actions">
          {user ? (
            <Link to="/dashboard" className="landing-nav-primary">
              Dashboard <ArrowRight size={15} />
            </Link>
          ) : (
            <>
              <Link to="/login" className="landing-login-link">
                Sign in
              </Link>
              <Link to="/register" className="landing-nav-primary">
                Get started <ArrowRight size={15} />
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <main>
        <section className="landing-hero">
          <div className="landing-hero-content">
            <div className="landing-announcement">
              <span className="landing-announcement-dot" />
              ONE WORKSPACE. MULTIPLE AI TOOLS.
            </div>

            <h1>
              Your ideas deserve
              <br />
              <span>more intelligent tools.</span>
            </h1>

            <p className="landing-hero-description">
              NexusAI brings AI-powered tools for coding, writing, document
              analysis, image generation, and more into one simple workspace.
            </p>

            <div className="landing-hero-actions">
              <Link to={primaryLink} className="landing-cta-primary">
                Explore NexusAI
                <ArrowRight size={17} />
              </Link>

              {!user && (
                <Link to="/login" className="landing-cta-secondary">
                  Sign in to your account
                </Link>
              )}
            </div>

            <div className="landing-hero-note">
              <ShieldCheck size={15} />
              One workspace for your everyday AI workflows
            </div>
          </div>

          {/* Product Preview */}
          <div className="landing-product-preview">
            <div className="landing-preview-window">
              <div className="landing-window-topbar">
                <div className="landing-window-dots">
                  <span />
                  <span />
                  <span />
                </div>

                <div className="landing-window-title">NexusAI / Workspace</div>

                <div className="landing-window-indicator">
                  <span />
                  Workspace preview
                </div>
              </div>

              <div className="landing-preview-layout">
                <aside className="landing-preview-sidebar">
                  <div className="landing-preview-logo">
                    <Sparkles size={16} />
                    NexusAI
                  </div>

                  <div className="landing-preview-section-label">WORKSPACE</div>

                  <div className="landing-preview-nav-item active">
                    <Activity size={14} />
                    Overview
                  </div>

                  <div className="landing-preview-nav-item">
                    <MessageSquare size={14} />
                    AI Assistant
                  </div>

                  <div className="landing-preview-nav-item">
                    <Code2 size={14} />
                    Code Reviewer
                  </div>

                  <div className="landing-preview-nav-item">
                    <FileText size={14} />
                    Documents
                  </div>

                  <div className="landing-preview-nav-item">
                    <Image size={14} />
                    Image Studio
                  </div>
                </aside>

                <div className="landing-preview-main">
                  <div className="landing-preview-welcome">
                    <div>
                      <span>YOUR WORKSPACE</span>
                      <h3>Everything in one place.</h3>
                      <p>Choose a tool and get started with your next task.</p>
                    </div>
                    <div className="landing-preview-avatar">N</div>
                  </div>

                  <div className="landing-preview-stats">
                    <div className="landing-preview-stat">
                      <div className="landing-preview-stat-icon violet">
                        <Zap size={16} />
                      </div>
                      <span>AI-powered</span>
                      <strong>Workflows</strong>
                    </div>

                    <div className="landing-preview-stat">
                      <div className="landing-preview-stat-icon blue">
                        <Layers3 size={16} />
                      </div>
                      <span>Multiple</span>
                      <strong>AI tools</strong>
                    </div>

                    <div className="landing-preview-stat">
                      <div className="landing-preview-stat-icon green">
                        <Activity size={16} />
                      </div>
                      <span>One unified</span>
                      <strong>Workspace</strong>
                    </div>
                  </div>

                  <div className="landing-preview-tools-heading">
                    <h4>Explore your tools</h4>
                    <span>WORKSPACE</span>
                  </div>

                  <div className="landing-preview-tool-grid">
                    {features.slice(0, 4).map((feature) => {
                      const Icon = feature.icon;

                      return (
                        <div
                          className="landing-preview-tool"
                          key={feature.title}
                        >
                          <div className={`landing-tool-icon ${feature.color}`}>
                            <Icon size={17} />
                          </div>
                          <div>
                            <strong>{feature.title}</strong>
                            <span>
                              Open tool <ArrowRight size={10} />
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="landing-preview-caption">
              <span />A glimpse inside the NexusAI workspace
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="landing-section" id="features">
          <div className="landing-section-heading">
            <span className="landing-section-eyebrow">WHAT YOU CAN DO</span>
            <h2>Tools that work as hard as you do.</h2>
            <p>
              From writing code to creating content, bring your everyday
              workflows together with AI.
            </p>
          </div>

          <div className="landing-feature-grid">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article className="landing-feature-card" key={feature.title}>
                  <div className={`landing-feature-icon ${feature.color}`}>
                    <Icon size={21} />
                  </div>

                  <h3>{feature.title}</h3>
                  <p>{feature.desc}</p>

                  <Link to={primaryLink} className="landing-feature-link">
                    Explore tool <ArrowRight size={14} />
                  </Link>
                </article>
              );
            })}
          </div>
        </section>

        {/* Call to Action */}
        <section className="landing-banner">
          <div className="landing-banner-icon">
            <Sparkles size={22} />
          </div>

          <div className="landing-banner-content">
            <span>READY TO GET STARTED?</span>
            <h2>Make room for smarter workflows.</h2>
            <p>Bring your AI-powered tasks together with NexusAI.</p>
          </div>

          <Link to={primaryLink} className="landing-cta-primary">
            Open workspace <ArrowRight size={16} />
          </Link>
        </section>

        {/* Pricing */}
        <section className="landing-section landing-pricing" id="pricing">
          <div className="landing-section-heading">
            <span className="landing-section-eyebrow">PRICING</span>
            <h2>Simple plans. Clear choices.</h2>
            <p>
              Start with the essentials and explore the plan that suits your
              workflow.
            </p>
          </div>

          <div className="landing-pricing-grid">
            {plans.map((plan) => (
              <article
                className={`landing-plan-card ${plan.popular ? "popular" : ""}`}
                key={plan.name}
              >
                {plan.popular && (
                  <div className="landing-popular-label">MOST POPULAR</div>
                )}

                <div className="landing-plan-name">{plan.name}</div>

                <div className="landing-plan-price">
                  {plan.price}
                  <span>{plan.period}</span>
                </div>

                <p className="landing-plan-description">{plan.description}</p>

                <div className="landing-plan-divider" />

                <div className="landing-plan-features">
                  {plan.features.map((item) => (
                    <div className="landing-plan-feature" key={item}>
                      <Check size={15} />
                      {item}
                    </div>
                  ))}
                </div>

                <Link
                  to={primaryLink}
                  className={`landing-plan-button ${plan.popular ? "primary" : ""}`}
                >
                  {plan.button}
                  <ArrowRight size={15} />
                </Link>
              </article>
            ))}
          </div>

          <p className="landing-pricing-note">
            Pricing and plan features shown are illustrative. Check the
            application billing page for current plan details.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <Link to="/" className="landing-brand">
            <span className="landing-brand-icon">
              <Sparkles size={17} />
            </span>
            <span>
              Nexus<span>AI</span>
            </span>
          </Link>

          <p>Built for smarter everyday workflows.</p>

          <span>© 2026 NexusAI. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
