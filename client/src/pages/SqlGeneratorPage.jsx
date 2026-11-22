import React, { useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import {
  Database,
  Sparkles,
  Copy,
  Check,
  Terminal,
  Zap,
  Code2,
  Braces,
  ChevronDown,
  AlertCircle,
} from "lucide-react";

const dialects = ["PostgreSQL", "MySQL", "SQLite", "Snowflake"];

export default function SqlGeneratorPage() {
  const { refreshUserData } = useAuth();
  const { addToast } = useNotification();

  const [prompt, setPrompt] = useState(
    "Find the top 5 highest spending users who made orders in 2026",
  );
  const [dialect, setDialect] = useState("PostgreSQL");
  const [schema, setSchema] = useState(
    "users(id, name, email), orders(id, user_id, total_amount, status, created_at)",
  );

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();

    if (!prompt.trim()) {
      addToast("Please enter a question first.", "error");
      return;
    }

    setLoading(true);

    try {
      const res = await api.sqlGenerate({
        prompt: prompt.trim(),
        dialect,
        schema: schema.trim(),
      });

      if (res.success && res.data) {
        setResult(res.data);
        refreshUserData();
        addToast("SQL query generated successfully!", "success");
      } else {
        throw new Error(res.message || "Generation failed");
      }
    } catch (err) {
      addToast(err.message || "Failed to generate SQL query.", "error");
    } finally {
      setLoading(false);
    }
  };

  const copySql = async () => {
    if (!result?.sql) return;

    try {
      await navigator.clipboard.writeText(result.sql);
      setCopied(true);
      addToast("SQL copied to clipboard!", "success");

      setTimeout(() => setCopied(false), 2000);
    } catch {
      addToast("Unable to copy SQL. Please copy it manually.", "error");
    }
  };

  return (
    <div className="sql-page">
      {/* Header */}
      <header className="sql-header">
        <div className="sql-heading">
          <div className="sql-heading-icon">
            <Database size={21} />
          </div>

          <div>
            <div className="sql-eyebrow">
              <span className="sql-eyebrow-dot" />
              DATABASE TOOL
            </div>
            <h1>SQL Generator</h1>
            <p>
              Turn plain English into SQL queries with AI-powered query
              generation and performance suggestions.
            </p>
          </div>
        </div>
      </header>

      {/* Main workspace */}
      <div className="sql-workspace">
        {/* Left: Input panel */}
        <section className="sql-panel sql-input-panel">
          <div className="sql-panel-header">
            <div>
              <span className="sql-section-label">QUERY BUILDER</span>
              <h2>Describe your query</h2>
            </div>
            <div className="sql-panel-icon">
              <Braces size={17} />
            </div>
          </div>

          <form onSubmit={handleGenerate} className="sql-form">
            {/* Dialect */}
            <div className="sql-field">
              <label htmlFor="sql-dialect">Database dialect</label>

              <div className="sql-select-wrap">
                <Database size={15} />
                <select
                  id="sql-dialect"
                  value={dialect}
                  onChange={(e) => setDialect(e.target.value)}
                >
                  {dialects.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <ChevronDown size={15} className="sql-select-arrow" />
              </div>
              <span className="sql-field-hint">
                Choose the database engine for your query.
              </span>
            </div>

            {/* Prompt */}
            <div className="sql-field">
              <div className="sql-label-row">
                <label htmlFor="sql-prompt">What do you want to find?</label>
                <span className="sql-required">Required</span>
              </div>

              <textarea
                id="sql-prompt"
                className="sql-textarea sql-prompt-input"
                rows={5}
                placeholder="Example: Calculate monthly revenue grouped by country..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                required
              />

              <span className="sql-field-hint">
                Describe the result you want in everyday language.
              </span>
            </div>

            {/* Schema */}
            <div className="sql-field">
              <div className="sql-label-row">
                <label htmlFor="sql-schema">Database schema</label>
                <span className="sql-optional">Optional</span>
              </div>

              <textarea
                id="sql-schema"
                className="sql-textarea sql-schema-input"
                rows={5}
                placeholder="users(id, name, email), orders(id, user_id, amount)"
                value={schema}
                onChange={(e) => setSchema(e.target.value)}
              />

              <span className="sql-field-hint">
                Add table and column names to help the AI map your query.
              </span>
            </div>

            <button
              type="submit"
              className="sql-generate-btn"
              disabled={loading || !prompt.trim()}
            >
              {loading ? (
                <>
                  <span className="sql-spinner" />
                  Generating query...
                </>
              ) : (
                <>
                  <Sparkles size={17} />
                  Generate SQL query
                </>
              )}
            </button>
          </form>

          <div className="sql-security-note">
            <AlertCircle size={15} />
            <span>
              Review generated SQL before running it against your database.
            </span>
          </div>
        </section>

        {/* Right: Results */}
        <section className="sql-results-column">
          {result ? (
            <div className="sql-panel sql-result-panel">
              <div className="sql-result-header">
                <div>
                  <span className="sql-section-label">GENERATED OUTPUT</span>
                  <h2>Query result</h2>
                </div>

                <span className="sql-dialect-badge">
                  <Database size={13} />
                  {result.dialect || dialect}
                </span>
              </div>

              {/* SQL code */}
              <div className="sql-code-container">
                <div className="sql-code-toolbar">
                  <div className="sql-code-file">
                    <Code2 size={15} />
                    <span>generated-query.sql</span>
                  </div>

                  <button
                    type="button"
                    className={`sql-copy-btn ${copied ? "is-copied" : ""}`}
                    onClick={copySql}
                    disabled={!result.sql}
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? "Copied" : "Copy SQL"}
                  </button>
                </div>

                <pre className="sql-code">
                  <code>{result.sql || "-- No SQL query returned."}</code>
                </pre>
              </div>

              {/* Explanation */}
              {result.explanation && (
                <div className="sql-detail-section">
                  <div className="sql-detail-title">
                    <div className="sql-detail-icon">
                      <Terminal size={16} />
                    </div>
                    <h3>Query explanation</h3>
                  </div>

                  <p className="sql-explanation">{result.explanation}</p>
                </div>
              )}

              {/* Performance tips */}
              {result.performanceTip && (
                <div className="sql-performance-card">
                  <div className="sql-performance-heading">
                    <Zap size={16} />
                    <h3>Performance suggestions</h3>
                  </div>

                  <p>{result.performanceTip}</p>
                </div>
              )}

              <div className="sql-result-footer">
                <AlertCircle size={14} />
                <span>
                  AI-generated SQL may need adjustments for your database
                  structure. Validate before execution.
                </span>
              </div>
            </div>
          ) : (
            <div className="sql-panel sql-empty-state">
              <div className="sql-empty-icon">
                <Database size={29} />
              </div>

              <h2>Your SQL query will appear here</h2>
              <p>
                Describe what you need, select a database dialect, and generate
                your query. Your SQL and explanation will show up in this
                workspace.
              </p>

              <div className="sql-empty-example">
                <span>EXAMPLE REQUEST</span>
                <p>
                  "Find the top 5 highest spending users who made orders in
                  2026"
                </p>
              </div>

              <div className="sql-empty-footer">
                <Sparkles size={14} />
                AI-powered SQL generation
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
