import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import {
  Sparkles,
  Zap,
  Code2,
  FileCheck2,
  MessageSquare,
  FileText,
  FileSearch,
  Database,
  Image,
  ArrowRight,
  Clock,
  TrendingUp,
  Cpu,
  DollarSign,
  LoaderCircle,
  Activity,
} from "lucide-react";

const formatNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number.toLocaleString() : "0";
};

const quickTools = [
  {
    to: "/dashboard/chat",
    title: "AI Chat Assistant",
    desc: "Multi-turn conversational assistant with custom system personas.",
    icon: MessageSquare,
    accent: "violet",
    badge: "Popular",
  },
  {
    to: "/dashboard/code",
    title: "AI Code Reviewer",
    desc: "Inspect complexity, detect vulnerabilities and refactor code.",
    icon: Code2,
    accent: "blue",
    badge: "Dev Favorite",
  },
  {
    to: "/dashboard/resume",
    title: "Resume Analyzer",
    desc: "ATS score evaluation, keyword gap detection and bullet point rewrites.",
    icon: FileCheck2,
    accent: "green",
  },
  {
    to: "/dashboard/blog",
    title: "Blog & SEO Writer",
    desc: "Generate long-form articles with outlines and meta tags.",
    icon: FileText,
    accent: "amber",
  },
  {
    to: "/dashboard/pdf",
    title: "PDF Summarizer",
    desc: "Extract key takeaways, executive summaries and ask questions.",
    icon: FileSearch,
    accent: "purple",
  },
  {
    to: "/dashboard/sql",
    title: "Natural Language SQL",
    desc: "Generate PostgreSQL, MySQL and SQLite queries.",
    icon: Database,
    accent: "pink",
  },
  {
    to: "/dashboard/image",
    title: "AI Image Studio",
    desc: "Create visuals with AI-powered image generation.",
    icon: Image,
    accent: "indigo",
    badge: "New",
  },
];

export default function DashboardHome() {
  const { user } = useAuth();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const fetchHistory = async () => {
      try {
        const res = await api.getHistory();

        if (active && res.success && Array.isArray(res.data)) {
          setHistory(res.data);
        }
      } catch (err) {
        if (active) {
          console.warn("Could not load history:", err.message);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchHistory();

    return () => {
      active = false;
    };
  }, []);

  const tokensUsed = Math.max(0, Number(user?.tokensUsed) || 0);
  const tokenLimit = Math.max(0, Number(user?.tokenLimit) || 50000);

  const percentUsed =
    tokenLimit > 0
      ? Math.min(100, Math.round((tokensUsed / tokenLimit) * 100))
      : 0;

  const displayName = user?.name?.trim()?.split(" ")[0] || "there";
  const planName = user?.plan || "Free";

  return (
    <main className="home-page">
      {/* Welcome */}
      <section className="home-welcome">
        <div className="home-welcome-content">
          <div className="home-welcome-label">
            <Sparkles size={14} />
            YOUR AI WORKSPACE
          </div>

          <div className="home-welcome-title-row">
            <h1>Welcome back, {displayName}</h1>

            <span className="home-plan-badge">{planName} plan</span>
          </div>

          <p>
            Your AI workspace is ready. Choose a tool to get started, or
            continue exploring your recent generations.
          </p>

          <div className="home-welcome-actions">
            <Link to="/dashboard/chat" className="home-primary-action">
              <Sparkles size={15} />
              Start a conversation
              <ArrowRight size={14} />
            </Link>

            <Link to="/billing" className="home-secondary-action">
              <Zap size={15} />
              Manage subscription
            </Link>
          </div>
        </div>

        <div className="home-welcome-decoration">
          <div className="home-orbit home-orbit-one" />
          <div className="home-orbit home-orbit-two" />
          <div className="home-orbit-core">
            <Sparkles size={32} />
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="home-overview">
        <div className="home-section-heading">
          <div>
            <h2>Workspace overview</h2>
            <p>Your account and usage at a glance.</p>
          </div>
        </div>

        <div className="home-stats-grid">
          {/* Token usage */}
          <article className="home-stat-card">
            <div className="home-stat-top">
              <span>TOKEN QUOTA</span>
              <div className="home-stat-icon violet">
                <Cpu size={17} />
              </div>
            </div>

            <div className="home-stat-value">
              {formatNumber(tokensUsed)}
              <span>/ {formatNumber(tokenLimit)}</span>
            </div>

            <div className="home-stat-progress">
              <div
                className={`home-stat-progress-fill ${
                  percentUsed > 85 ? "warning" : ""
                }`}
                style={{ width: `${percentUsed}%` }}
              />
            </div>

            <div className="home-stat-footer">
              <span>{percentUsed}% consumed</span>
              <Link to="/billing">
                View quota <ArrowRight size={12} />
              </Link>
            </div>
          </article>

          {/* Generations */}
          <article className="home-stat-card">
            <div className="home-stat-top">
              <span>TOTAL GENERATIONS</span>
              <div className="home-stat-icon green">
                <TrendingUp size={17} />
              </div>
            </div>

            <div className="home-stat-value">
              {loading ? "—" : formatNumber(history.length)}
            </div>

            <div className="home-stat-description">
              Recorded activity in your workspace
            </div>

            <div className="home-stat-footer">
              <span>All available tools</span>
              <Activity size={13} />
            </div>
          </article>

          {/* Tools */}
          <article className="home-stat-card">
            <div className="home-stat-top">
              <span>AI WORKSPACES</span>
              <div className="home-stat-icon blue">
                <Zap size={17} />
              </div>
            </div>

            <div className="home-stat-value">7</div>

            <div className="home-stat-description">
              AI tools available in your workspace
            </div>

            <div className="home-stat-footer">
              <span>Ready to explore</span>
              <span className="home-online-indicator">
                <span />
                Available
              </span>
            </div>
          </article>

          {/* Subscription */}
          <article className="home-stat-card">
            <div className="home-stat-top">
              <span>YOUR SUBSCRIPTION</span>
              <div className="home-stat-icon amber">
                <DollarSign size={17} />
              </div>
            </div>

            <div className="home-stat-value home-stat-plan">
              {String(planName).toUpperCase()}
            </div>

            <div className="home-stat-description">
              Current account subscription
            </div>

            <div className="home-stat-footer">
              <span>Plan details and limits</span>
              <Link to="/billing">
                Manage <ArrowRight size={12} />
              </Link>
            </div>
          </article>
        </div>
      </section>

      {/* AI Tools */}
      <section className="home-tools-section">
        <div className="home-section-heading">
          <div>
            <h2>AI workspaces</h2>
            <p>Everything you need, all in one place.</p>
          </div>

          <span className="home-section-count">07 TOOLS</span>
        </div>

        <div className="home-tools-grid">
          {quickTools.map((tool) => {
            const Icon = tool.icon;

            return (
              <Link key={tool.to} to={tool.to} className="home-tool-card">
                <div className="home-tool-top">
                  <div className={`home-tool-icon ${tool.accent}`}>
                    <Icon size={20} />
                  </div>

                  {tool.badge && (
                    <span className={`home-tool-badge ${tool.accent}`}>
                      {tool.badge}
                    </span>
                  )}
                </div>

                <div className="home-tool-info">
                  <h3>{tool.title}</h3>
                  <p>{tool.desc}</p>
                </div>

                <div className="home-tool-footer">
                  <span>Open workspace</span>
                  <ArrowRight size={15} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Recent Activity */}
      <section className="home-activity-section">
        <div className="home-activity-header">
          <div>
            <h2>Recent generations</h2>
            <p>Your latest AI workspace activity.</p>
          </div>

          <Link to="/dashboard/analytics" className="home-view-analytics">
            View analytics
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="home-table-wrapper">
          <table className="home-activity-table">
            <thead>
              <tr>
                <th>AI TOOL</th>
                <th>PROMPT / TITLE</th>
                <th>TOKENS</th>
                <th>TIMESTAMP</th>
                <th>STATUS</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5}>
                    <div className="home-table-state">
                      <LoaderCircle size={17} className="home-spinner" />
                      Loading recent activity...
                    </div>
                  </td>
                </tr>
              ) : history.length > 0 ? (
                history.map((item, index) => (
                  <tr key={item.id || item._id || index}>
                    <td>
                      <span className="home-tool-tag">
                        {item.tool || "AI Tool"}
                      </span>
                    </td>

                    <td className="home-history-title" title={item.title || ""}>
                      {item.title || "Untitled generation"}
                    </td>

                    <td className="home-history-tokens">
                      {formatNumber(item.tokensUsed)}
                    </td>

                    <td className="home-history-date">
                      {item.createdAt &&
                      !Number.isNaN(new Date(item.createdAt).getTime())
                        ? new Date(item.createdAt).toLocaleString()
                        : "—"}
                    </td>

                    <td>
                      <span
                        className={`home-history-status ${
                          String(item.status || "completed").toLowerCase() ===
                          "completed"
                            ? "completed"
                            : "other"
                        }`}
                      >
                        <span />
                        {item.status || "completed"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>
                    <div className="home-table-empty">
                      <div className="home-empty-icon">
                        <Clock size={20} />
                      </div>
                      <h3>No recent activity</h3>
                      <p>
                        Your AI generations will appear here when you start
                        using a workspace.
                      </p>
                      <Link to="/dashboard/chat">
                        Try AI Chat <ArrowRight size={13} />
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
