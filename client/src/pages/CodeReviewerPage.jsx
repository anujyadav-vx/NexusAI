import React, { useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import {
  Code2,
  Sparkles,
  Zap,
  Copy,
  Check,
  Cpu,
  Clock,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

export default function CodeReviewerPage() {
  const { refreshUserData } = useAuth();
  const { addToast } = useNotification();

  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(`// Example: Processing order items
function processOrders(orders) {
  let results = [];
  for (var i = 0; i < orders.length; i++) {
    for (var j = 0; j < orders.length; j++) {
      if (orders[i].id === orders[j].id && i !== j) {
        // Potential bug: duplicate handling
        orders.splice(j, 1);
      }
    }
    results.push({
      id: orders[i].id,
      total: orders[i].price * orders[i].qty
    });
  }
  return results;
}`);

  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleReview = async (e) => {
    e.preventDefault();

    if (!code.trim() || loading) return;

    setLoading(true);
    setReview(null);

    try {
      const res = await api.codeReview({ code, language });

      if (res.success && res.data) {
        setReview(res.data);
        refreshUserData();
        addToast("Code review completed!", "success");
      } else {
        throw new Error(res.message || "Review failed");
      }
    } catch (err) {
      addToast(err.message || "Failed to review code.", "error");
    } finally {
      setLoading(false);
    }
  };

  const copyRefactored = async () => {
    if (!review?.refactoredCode) return;

    try {
      await navigator.clipboard.writeText(review.refactoredCode);
      setCopied(true);
      addToast("Refactored code copied!", "info", 2000);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      addToast("Unable to copy code.", "error");
    }
  };

  const issues = Array.isArray(review?.issuesFound) ? review.issuesFound : [];

  const complexity = review?.complexityAnalysis || {};

  return (
    <main className="tool-page code-reviewer-page">
      {/* Page heading */}
      <header className="tool-page-header">
        <div className="tool-page-title">
          <div className="tool-page-icon code-reviewer-icon">
            <Code2 size={21} />
          </div>

          <div>
            <h1>AI Code Reviewer</h1>
            <p>
              Analyze code quality, detect vulnerabilities, and get
              production-ready suggestions.
            </p>
          </div>
        </div>
      </header>

      {/* Main workspace */}
      <div className="code-reviewer-layout">
        {/* Code editor */}
        <section className="glass-panel code-editor-panel">
          <div className="code-panel-heading">
            <div>
              <h2>Source Code</h2>
              <p>Paste your function or component for analysis.</p>
            </div>

            <span className="code-editor-status">
              <span />
              Editor
            </span>
          </div>

          <form onSubmit={handleReview} className="code-review-form">
            <div className="code-language-row">
              <label htmlFor="code-language">Programming Language</label>

              <select
                id="code-language"
                className="glass-input code-language-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="go">Go</option>
                <option value="rust">Rust</option>
                <option value="sql">SQL</option>
                <option value="java">Java</option>
              </select>
            </div>

            <div className="code-textarea-wrapper">
              <div className="code-textarea-toolbar">
                <span>main.{language === "javascript" ? "js" : language}</span>
                <span>{code.length} characters</span>
              </div>

              <textarea
                className="glass-input code-editor-textarea"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck="false"
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                placeholder="Paste your code here..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !code.trim()}
              className="gradient-btn-primary code-review-submit"
            >
              {loading ? (
                <Sparkles size={17} className="animate-spin" />
              ) : (
                <Zap size={17} />
              )}

              {loading ? "Analyzing your code..." : "Review & Refactor Code"}
            </button>

            <p className="code-editor-hint">
              <ShieldCheck size={14} />
              Your code is submitted for AI analysis.
            </p>
          </form>
        </section>

        {/* Review results */}
        <section className="code-results-section">
          {loading ? (
            <div className="glass-panel code-empty-state">
              <div className="code-loading-icon">
                <Sparkles size={25} />
              </div>
              <h3>Analyzing your code</h3>
              <p>
                Checking code quality, complexity, potential bugs, and security
                issues...
              </p>
              <div className="code-loading-bar">
                <span />
              </div>
            </div>
          ) : review ? (
            <div className="glass-panel code-review-results animate-fade-in">
              {/* Score */}
              <div className="code-result-header">
                <div>
                  <span className="code-result-eyebrow">REVIEW COMPLETED</span>
                  <h2>Code Analysis</h2>
                  <p>Language: {review.language || language}</p>
                </div>

                <div className="code-quality-score">
                  <strong>{review.codeQualityScore ?? "—"}</strong>
                  <span>/ 100</span>
                </div>
              </div>

              {/* Complexity */}
              <div className="code-metrics-grid">
                <div className="code-metric-card">
                  <div className="code-metric-label">
                    <Clock size={15} />
                    Time Complexity
                  </div>
                  <strong>{complexity.timeComplexity || "Not provided"}</strong>
                </div>

                <div className="code-metric-card">
                  <div className="code-metric-label">
                    <Cpu size={15} />
                    Space Complexity
                  </div>
                  <strong>
                    {complexity.spaceComplexity || "Not provided"}
                  </strong>
                </div>
              </div>

              {/* Summary */}
              <div className="code-result-block">
                <h3>Diagnostic Summary</h3>
                <p className="code-summary">
                  {review.executiveSummary || "No summary provided."}
                </p>
              </div>

              {/* Issues */}
              <div className="code-result-block">
                <div className="code-section-heading">
                  <h3>Detected Issues</h3>
                  <span className="code-issue-count">
                    {issues.length} {issues.length === 1 ? "issue" : "issues"}
                  </span>
                </div>

                {issues.length > 0 ? (
                  <div className="code-issues-list">
                    {issues.map((issue, idx) => {
                      const isHigh = issue.severity?.toLowerCase() === "high";

                      return (
                        <article className="code-issue-card" key={idx}>
                          <div className="code-issue-heading">
                            <div className="code-issue-title">
                              <AlertTriangle size={15} />
                              <strong>{issue.type || "Code issue"}</strong>
                            </div>

                            <span
                              className={`code-severity ${
                                isHigh ? "severity-high" : "severity-medium"
                              }`}
                            >
                              {issue.severity || "Review"}
                            </span>
                          </div>

                          <p>
                            {issue.description || "No description provided."}
                          </p>

                          {issue.lineSuggestion && (
                            <div className="code-issue-fix">
                              <strong>Suggested fix:</strong>{" "}
                              {issue.lineSuggestion}
                            </div>
                          )}
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <div className="code-no-issues">
                    <Check size={17} />
                    No issues were reported.
                  </div>
                )}
              </div>

              {/* Refactored code */}
              {review.refactoredCode && (
                <div className="code-result-block">
                  <div className="code-section-heading">
                    <div>
                      <h3>Refactored Implementation</h3>
                      <p>Suggested improved code</p>
                    </div>

                    <button
                      type="button"
                      className="code-copy-button"
                      onClick={copyRefactored}
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>

                  <pre className="code-refactored-block">
                    <code>{review.refactoredCode}</code>
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-panel code-empty-state">
              <div className="code-empty-icon">
                <Code2 size={27} />
              </div>

              <h3>Ready to review your code</h3>

              <p>
                Select a programming language, paste your code, and let NexusAI
                analyze its quality and performance.
              </p>

              <div className="code-empty-features">
                <span>
                  <Zap size={14} /> Performance
                </span>
                <span>
                  <ShieldCheck size={14} /> Security
                </span>
                <span>
                  <Cpu size={14} /> Complexity
                </span>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
