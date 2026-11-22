import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import {
  BarChart3,
  TrendingUp,
  Cpu,
  DollarSign,
  Clock,
  Activity,
  Zap,
} from "lucide-react";

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.getAnalytics();

        if (res.success && res.analytics) {
          setData(res.analytics);
        } else {
          throw new Error(res.message || "Unable to load analytics");
        }
      } catch (err) {
        console.error("Failed to load analytics:", err);
        setError(err.message || "Failed to load analytics.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="analytics-state">
        <div className="analytics-loader" />
        <p>Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-state analytics-error">
        <Activity size={28} />
        <h3>Unable to load analytics</h3>
        <p>{error}</p>
      </div>
    );
  }

  const {
    totalRequests = 0,
    tokensUsed = 0,
    usagePercentage = 0,
    estimatedCostSaved = "$0",
    averageLatencyMs = 0,
    toolBreakdown = [],
    dailyTrend = [],
  } = data || {};

  const safeTrend = Array.isArray(dailyTrend) ? dailyTrend : [];
  const safeTools = Array.isArray(toolBreakdown) ? toolBreakdown : [];

  const maxDailyTokens = Math.max(
    ...safeTrend.map((item) => Number(item.tokens) || 0),
    1,
  );

  const maxToolTokens = Math.max(
    ...safeTools.map((tool) => Number(tool.tokens) || 0),
    1,
  );

  const formatNumber = (value) => (Number(value) || 0).toLocaleString();

  const metrics = [
    {
      label: "Total Requests",
      value: formatNumber(totalRequests),
      description: "Total AI requests",
      icon: TrendingUp,
      color: "violet",
    },
    {
      label: "Tokens Consumed",
      value: formatNumber(tokensUsed),
      description: `${Number(usagePercentage) || 0}% of quota used`,
      icon: Cpu,
      color: "blue",
    },
    {
      label: "Value Saved",
      value: estimatedCostSaved ?? "$0",
      description: "Estimated workflow savings",
      icon: DollarSign,
      color: "green",
    },
    {
      label: "Average Latency",
      value: `${Number(averageLatencyMs) || 0}ms`,
      description: "Average response time",
      icon: Clock,
      color: "amber",
    },
  ];

  return (
    <main className="analytics-page">
      {/* Page Header */}
      <header className="analytics-header">
        <div className="analytics-heading">
          <div className="analytics-heading-icon">
            <BarChart3 size={20} />
          </div>

          <div>
            <div className="analytics-eyebrow">WORKSPACE</div>
            <h1>Analytics</h1>
            <p>Monitor your AI usage, performance, and tool activity.</p>
          </div>
        </div>

        <div className="analytics-status">
          <span className="analytics-status-dot" />
          Usage overview
        </div>
      </header>

      {/* Metrics */}
      <section className="analytics-metrics">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <article className="analytics-metric-card" key={metric.label}>
              <div className="analytics-metric-top">
                <span>{metric.label}</span>
                <div className={`analytics-metric-icon ${metric.color}`}>
                  <Icon size={17} />
                </div>
              </div>

              <div className="analytics-metric-value">{metric.value}</div>

              <div className="analytics-metric-description">
                {metric.description}
              </div>
            </article>
          );
        })}
      </section>

      {/* Daily Trend */}
      <section className="analytics-panel">
        <div className="analytics-panel-header">
          <div>
            <h2>Usage activity</h2>
            <p>Daily token consumption</p>
          </div>

          <span className="analytics-period">
            <Activity size={13} />
            Last 7 days
          </span>
        </div>

        {safeTrend.length > 0 ? (
          <div className="analytics-chart">
            <div className="analytics-chart-grid">
              <span>Tokens</span>
            </div>

            <div className="analytics-chart-bars">
              {safeTrend.map((item, index) => {
                const tokens = Number(item.tokens) || 0;
                const height = Math.max(4, (tokens / maxDailyTokens) * 100);

                return (
                  <div className="analytics-chart-column" key={index}>
                    <span className="analytics-bar-value">
                      {formatNumber(tokens)}
                    </span>

                    <div className="analytics-bar-track">
                      <div
                        className="analytics-bar"
                        style={{ height: `${height}%` }}
                        title={`${item.day}: ${formatNumber(tokens)} tokens, ${formatNumber(item.requests)} requests`}
                      />
                    </div>

                    <span className="analytics-bar-label">{item.day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="analytics-empty">
            <BarChart3 size={28} />
            <p>No usage activity available yet.</p>
          </div>
        )}
      </section>

      {/* Tool Breakdown */}
      <section className="analytics-panel">
        <div className="analytics-panel-header">
          <div>
            <h2>AI tool usage</h2>
            <p>Breakdown of your AI tool consumption</p>
          </div>

          <div className="analytics-panel-icon">
            <Zap size={17} />
          </div>
        </div>

        {safeTools.length > 0 ? (
          <div className="analytics-tools">
            {safeTools.map((tool, index) => {
              const tokens = Number(tool.tokens) || 0;
              const percentage = (tokens / maxToolTokens) * 100;

              return (
                <article className="analytics-tool-card" key={index}>
                  <div className="analytics-tool-info">
                    <div className="analytics-tool-name">
                      <span className="analytics-tool-indicator" />
                      {tool.name}
                    </div>

                    <span className="analytics-tool-calls">
                      {formatNumber(tool.value)} calls
                    </span>
                  </div>

                  <div className="analytics-tool-tokens">
                    {formatNumber(tokens)} tokens utilized
                  </div>

                  <div className="analytics-progress-track">
                    <div
                      className="analytics-progress-bar"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="analytics-empty">
            <Cpu size={28} />
            <p>No tool usage data available yet.</p>
          </div>
        )}
      </section>

      <footer className="analytics-footer">
        <Activity size={13} />
        Metrics are based on the analytics data returned by your workspace.
      </footer>
    </main>
  );
}
