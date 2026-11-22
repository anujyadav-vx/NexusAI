import React, { useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import {
  FileCheck2,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Copy,
  Check,
  Target,
  Award,
  ArrowUpRight,
  FileText,
  ClipboardCheck,
  Search,
  RotateCcw,
} from "lucide-react";

export default function ResumeAnalyzerPage() {
  const { refreshUserData } = useAuth();
  const { addToast } = useNotification();

  const [targetRole, setTargetRole] = useState("Senior Full Stack Engineer");
  const [resumeText, setResumeText] = useState(
    "Alex Johnson\nFull Stack Developer with 4 years experience building web applications using React, Node.js, and PostgreSQL.\n\nExperience:\n- Built REST APIs and connected to database.\n- Fixed bugs and improved site performance.\n- Worked in agile team with sprint ceremonies.\n\nSkills: JavaScript, HTML, CSS, React, Node.js, SQL, Git.",
  );

  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [copiedIdx, setCopiedIdx] = useState(null);

  const strengths = Array.isArray(analysis?.strengths)
    ? analysis.strengths
    : [];

  const criticalGaps = Array.isArray(analysis?.criticalGaps)
    ? analysis.criticalGaps
    : [];

  const keywordMatches = Array.isArray(analysis?.keywordMatches)
    ? analysis.keywordMatches
    : [];

  const rewrites = Array.isArray(analysis?.bulletPointRewrites)
    ? analysis.bulletPointRewrites
    : [];

  const score = Math.min(100, Math.max(0, Number(analysis?.atsScore) || 0));

  const handleAnalyze = async (e) => {
    e.preventDefault();

    if (!resumeText.trim()) {
      addToast("Please enter your resume content.", "error");
      return;
    }

    if (!targetRole.trim()) {
      addToast("Please enter a target job role.", "error");
      return;
    }

    setLoading(true);

    try {
      const res = await api.resumeAnalyze({
        resumeText,
        targetRole,
      });

      if (res.success && res.data) {
        setAnalysis(res.data);
        refreshUserData();
        addToast("Resume analysis complete!", "success");
      } else {
        throw new Error(res.message || "Analysis failed");
      }
    } catch (err) {
      addToast(err.message || "Failed to analyze resume.", "error");
    } finally {
      setLoading(false);
    }
  };

  const copyRewrite = async (text, idx) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      addToast("Rewritten bullet copied!", "info", 2000);

      setTimeout(() => {
        setCopiedIdx((current) => (current === idx ? null : current));
      }, 2000);
    } catch {
      addToast("Unable to copy. Please copy the text manually.", "error");
    }
  };

  const getScoreLabel = () => {
    if (score >= 80) return "Strong match";
    if (score >= 60) return "Good foundation";
    if (score >= 40) return "Needs improvement";
    return "Low match";
  };

  return (
    <div className="resume-page">
      {/* Page Header */}
      <header className="resume-header">
        <div className="resume-heading">
          <div className="resume-heading-icon">
            <FileCheck2 size={21} />
          </div>

          <div>
            <div className="resume-eyebrow">
              AI WORKSPACE <span>/</span> RESUME ANALYZER
            </div>

            <h1>Resume Analyzer</h1>

            <p>
              Improve your resume with role-specific feedback, keyword insights,
              and actionable suggestions.
            </p>
          </div>
        </div>

        {analysis && (
          <button
            type="button"
            className="resume-reset-btn"
            onClick={() => setAnalysis(null)}
          >
            <RotateCcw size={14} />
            New analysis
          </button>
        )}
      </header>

      {/* Main Workspace */}
      <div className="resume-workspace">
        {/* Input Panel */}
        <section className="resume-input-panel">
          <div className="resume-panel-heading">
            <div>
              <span className="resume-section-label">INPUT</span>
              <h2>Resume details</h2>
              <p>Provide the role and resume you want to evaluate.</p>
            </div>

            <div className="resume-panel-icon">
              <FileText size={18} />
            </div>
          </div>

          <form onSubmit={handleAnalyze} className="resume-form">
            <div className="resume-field">
              <label htmlFor="targetRole">
                <Target size={14} />
                Target job role
              </label>

              <input
                id="targetRole"
                type="text"
                placeholder="e.g. Full Stack Developer"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                required
              />

              <span className="resume-field-hint">
                Enter the position you're applying for.
              </span>
            </div>

            <div className="resume-field">
              <div className="resume-textarea-heading">
                <label htmlFor="resumeText">
                  <ClipboardCheck size={14} />
                  Resume content
                </label>

                <span className="resume-char-count">
                  {resumeText.length.toLocaleString()} characters
                </span>
              </div>

              <textarea
                id="resumeText"
                rows={16}
                placeholder="Paste your resume content here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                required
              />

              <span className="resume-field-hint">
                Include your experience, skills, projects, and education.
              </span>
            </div>

            <button
              type="submit"
              className="resume-analyze-btn"
              disabled={loading || !resumeText.trim() || !targetRole.trim()}
            >
              {loading ? (
                <>
                  <Sparkles size={17} className="resume-spin" />
                  Analyzing resume...
                </>
              ) : (
                <>
                  <Sparkles size={17} />
                  Analyze my resume
                  <ArrowUpRight size={16} />
                </>
              )}
            </button>

            <div className="resume-secure-note">
              <CheckCircle2 size={13} />
              AI-powered resume feedback
            </div>
          </form>
        </section>

        {/* Results Panel */}
        <section className="resume-results-panel">
          {loading ? (
            <div className="resume-empty-state">
              <div className="resume-loading-icon">
                <Sparkles size={27} className="resume-spin" />
              </div>
              <h3>Analyzing your resume</h3>
              <p>
                Reviewing your resume against the selected role. This may take a
                moment.
              </p>
              <div className="resume-loading-track">
                <div />
              </div>
            </div>
          ) : analysis ? (
            <div className="resume-results">
              {/* Results Heading */}
              <div className="resume-results-heading">
                <div>
                  <span className="resume-section-label">ANALYSIS REPORT</span>
                  <h2>Your resume insights</h2>
                  <p>Target role: {analysis.targetRole || targetRole}</p>
                </div>

                <div className="resume-completed">
                  <CheckCircle2 size={14} />
                  Complete
                </div>
              </div>

              {/* ATS Score */}
              <div className="resume-score-card">
                <div className="resume-score-info">
                  <div className="resume-score-icon">
                    <Award size={20} />
                  </div>

                  <div>
                    <span>ATS MATCH SCORE</span>
                    <h3>{getScoreLabel()}</h3>
                    <p>Resume alignment with your target role</p>
                  </div>
                </div>

                <div
                  className={`resume-score-circle ${
                    score >= 80
                      ? "score-high"
                      : score >= 60
                        ? "score-medium"
                        : "score-low"
                  }`}
                  style={{ "--score": `${score * 3.6}deg` }}
                >
                  <div className="resume-score-inner">
                    <strong>{score}</strong>
                    <span>/ 100</span>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="resume-summary-card">
                <div className="resume-result-title">
                  <Sparkles size={16} />
                  <h3>Executive critique</h3>
                </div>

                <p>{analysis.summary || "No summary was provided."}</p>
              </div>

              {/* Strengths and Gaps */}
              <div className="resume-insights-grid">
                <div className="resume-insight-card">
                  <div className="resume-result-title strength-title">
                    <CheckCircle2 size={16} />
                    <h3>Strengths</h3>
                    <span>{strengths.length}</span>
                  </div>

                  {strengths.length > 0 ? (
                    <ul>
                      {strengths.map((item, idx) => (
                        <li key={idx}>
                          <CheckCircle2 size={14} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="resume-no-data">No strengths identified.</p>
                  )}
                </div>

                <div className="resume-insight-card">
                  <div className="resume-result-title gap-title">
                    <AlertCircle size={16} />
                    <h3>Critical gaps</h3>
                    <span>{criticalGaps.length}</span>
                  </div>

                  {criticalGaps.length > 0 ? (
                    <ul>
                      {criticalGaps.map((item, idx) => (
                        <li key={idx}>
                          <AlertCircle size={14} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="resume-no-data">
                      No critical gaps identified.
                    </p>
                  )}
                </div>
              </div>

              {/* Keywords */}
              <div className="resume-keywords-section">
                <div className="resume-result-title">
                  <Search size={16} />
                  <h3>Keyword analysis</h3>
                  <span className="resume-count-badge">
                    {keywordMatches.length} keywords
                  </span>
                </div>

                <p className="resume-section-description">
                  Keywords identified for your target role and their presence in
                  your resume.
                </p>

                <div className="resume-keyword-list">
                  {keywordMatches.map((kw, idx) => (
                    <div
                      key={idx}
                      className={`resume-keyword ${
                        kw.matched ? "keyword-matched" : "keyword-missing"
                      }`}
                    >
                      {kw.matched ? (
                        <CheckCircle2 size={13} />
                      ) : (
                        <AlertCircle size={13} />
                      )}
                      {kw.keyword}
                    </div>
                  ))}

                  {keywordMatches.length === 0 && (
                    <p className="resume-no-data">
                      No keyword analysis available.
                    </p>
                  )}
                </div>
              </div>

              {/* Bullet Rewrites */}
              <div className="resume-rewrites-section">
                <div className="resume-result-title">
                  <Sparkles size={16} />
                  <h3>Bullet point improvements</h3>
                  <span className="resume-count-badge">
                    {rewrites.length} suggestions
                  </span>
                </div>

                <p className="resume-section-description">
                  Compare your original bullet points with the suggested
                  rewrites. Review each suggestion before using it.
                </p>

                <div className="resume-rewrite-list">
                  {rewrites.map((item, idx) => (
                    <article className="resume-rewrite-card" key={idx}>
                      <div className="resume-rewrite-label">
                        <span>ORIGINAL</span>
                      </div>

                      <p className="resume-original-text">{item.original}</p>

                      <div className="resume-rewrite-divider">
                        <ArrowUpRight size={15} />
                      </div>

                      <div className="resume-rewrite-label improved-label">
                        <span>SUGGESTED REWRITE</span>
                      </div>

                      <p className="resume-improved-text">{item.improved}</p>

                      <div className="resume-rewrite-footer">
                        <span>Review before adding to your resume</span>

                        <button
                          type="button"
                          onClick={() => copyRewrite(item.improved, idx)}
                          disabled={!item.improved}
                        >
                          {copiedIdx === idx ? (
                            <>
                              <Check size={14} />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy size={14} />
                              Copy text
                            </>
                          )}
                        </button>
                      </div>
                    </article>
                  ))}

                  {rewrites.length === 0 && (
                    <p className="resume-no-data">
                      No bullet point rewrites available.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="resume-empty-state">
              <div className="resume-empty-icon">
                <FileCheck2 size={28} />
              </div>

              <span className="resume-section-label">READY TO ANALYZE</span>

              <h3>Your resume, reviewed smarter.</h3>

              <p>
                Add your resume and target job role to receive an AI-generated
                analysis with strengths, missing keywords, and improvement
                suggestions.
              </p>

              <div className="resume-empty-features">
                <div>
                  <CheckCircle2 size={15} />
                  ATS match score
                </div>
                <div>
                  <CheckCircle2 size={15} />
                  Keyword insights
                </div>
                <div>
                  <CheckCircle2 size={15} />
                  Bullet point rewrites
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
