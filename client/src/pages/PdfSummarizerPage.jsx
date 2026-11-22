import React, { useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import {
  FileSearch,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  ListTodo,
  LoaderCircle,
  FileText,
  ArrowRight,
  MessageSquareText,
} from "lucide-react";

export default function PdfSummarizerPage() {
  const { refreshUserData } = useAuth();
  const { addToast } = useNotification();

  const [documentName, setDocumentName] = useState(
    "Enterprise_Q3_Strategic_Review.pdf",
  );

  const [text, setText] = useState(
    "Executive Overview: The company achieved 38% Year-over-Year revenue growth in Q3 2026 driven by expansion of our AI Developer Cloud platform. Infrastructure efficiency initiatives reduced per-user compute costs by 22% using automated workload orchestration. Overall Customer Satisfaction (CSAT) score reached 94.2%. Priorities for next quarter include achieving SOC2 Type II certification, expanding self-serve enterprise tier onboarding, and rolling out regional multi-zone disaster recovery.",
  );

  const [query, setQuery] = useState(
    "What are the top 3 priorities for next quarter?",
  );

  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);

  const handleSummarize = async (e) => {
    e.preventDefault();

    if (!text.trim()) {
      addToast("Please enter document content first.", "error");
      return;
    }

    setLoading(true);

    try {
      const res = await api.pdfSummarize({
        text,
        documentName,
        query,
      });

      if (res.success && res.data) {
        setSummary(res.data);
        refreshUserData();
        addToast("Document summarized successfully!", "success");
      } else {
        throw new Error(res.message || "Summarization failed");
      }
    } catch (err) {
      addToast(err.message || "Failed to summarize document.", "error");
    } finally {
      setLoading(false);
    }
  };

  const keyTakeaways = Array.isArray(summary?.keyTakeaways)
    ? summary.keyTakeaways
    : [];

  const actionItems = Array.isArray(summary?.actionItems)
    ? summary.actionItems
    : [];

  return (
    <div className="pdf-page">
      {/* Page Header */}
      <header className="pdf-header">
        <div className="pdf-heading-main">
          <div className="pdf-icon">
            <FileSearch size={21} />
          </div>

          <div>
            <div className="pdf-eyebrow">AI WORKSPACE / DOCUMENTS</div>
            <h1>PDF Summarizer</h1>
          </div>
        </div>

        <p className="pdf-description">
          Turn lengthy documents into clear executive summaries, key insights,
          and actionable information.
        </p>
      </header>

      {/* Workspace */}
      <div className="pdf-workspace">
        {/* Input Panel */}
        <section className="pdf-input-panel">
          <div className="pdf-panel-heading">
            <div>
              <h2>Document input</h2>
              <p>Provide the content you want AI to analyze.</p>
            </div>

            <span className="pdf-step">STEP 01</span>
          </div>

          <form className="pdf-form" onSubmit={handleSummarize}>
            {/* Document Name */}
            <div className="pdf-field">
              <label htmlFor="pdf-document-name">Document name</label>

              <div className="pdf-name-input">
                <FileText size={16} />
                <input
                  id="pdf-document-name"
                  type="text"
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                  placeholder="Enter document name"
                  required
                />
              </div>
            </div>

            {/* Document Content */}
            <div className="pdf-field">
              <div className="pdf-label-row">
                <label htmlFor="pdf-content">Document content</label>
                <span>Required</span>
              </div>

              <textarea
                id="pdf-content"
                className="pdf-content-input"
                rows={11}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your document text here..."
                required
              />

              <div className="pdf-input-hint">
                <span>Paste extracted text from your PDF document.</span>
                <span>{text.length.toLocaleString()} characters</span>
              </div>
            </div>

            {/* Question */}
            <div className="pdf-field">
              <label htmlFor="pdf-query">
                Ask a question
                <span className="pdf-optional">Optional</span>
              </label>

              <div className="pdf-query-input">
                <HelpCircle size={16} />

                <input
                  id="pdf-query"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. What are the key findings?"
                />
              </div>

              <p className="pdf-field-hint">
                Ask something specific to get a targeted answer from your
                document.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="pdf-submit-btn"
              disabled={loading || !text.trim() || !documentName.trim()}
            >
              {loading ? (
                <>
                  <LoaderCircle size={17} className="pdf-spinner" />
                  Analyzing document...
                </>
              ) : (
                <>
                  <Sparkles size={17} />
                  Generate summary
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="pdf-privacy-note">
            <FileSearch size={15} />
            <span>AI-powered document analysis</span>
          </div>
        </section>

        {/* Results Panel */}
        <section className="pdf-results-panel">
          {summary ? (
            <div className="pdf-results animate-fade-in">
              {/* Result Header */}
              <div className="pdf-result-header">
                <div className="pdf-result-title">
                  <div className="pdf-result-icon">
                    <FileText size={19} />
                  </div>

                  <div>
                    <span className="pdf-result-eyebrow">
                      ANALYSIS COMPLETE
                    </span>
                    <h2>Document insights</h2>
                  </div>
                </div>

                <span className="pdf-result-status">
                  <CheckCircle2 size={14} />
                  Completed
                </span>
              </div>

              {/* File Information */}
              <div className="pdf-file-info">
                <div className="pdf-file-details">
                  <FileText size={17} />

                  <div>
                    <span>Analyzed document</span>
                    <strong>{summary.documentName || documentName}</strong>
                  </div>
                </div>

                {summary.pageCount != null && (
                  <span className="pdf-page-count">
                    ~{summary.pageCount} pages
                  </span>
                )}
              </div>

              {/* Executive Summary */}
              <div className="pdf-result-section">
                <div className="pdf-section-heading">
                  <span className="pdf-section-number">01</span>
                  <h3>Executive summary</h3>
                </div>

                <p className="pdf-summary-text">
                  {summary.executiveSummary ||
                    "No executive summary was returned."}
                </p>
              </div>

              {/* Query Answer */}
              {summary.answerToQuery && (
                <div className="pdf-answer-box">
                  <div className="pdf-answer-heading">
                    <MessageSquareText size={16} />
                    <span>Answer to your question</span>
                  </div>

                  <p>{summary.answerToQuery}</p>
                </div>
              )}

              {/* Key Takeaways */}
              <div className="pdf-result-section">
                <div className="pdf-section-heading">
                  <span className="pdf-section-number">02</span>
                  <h3>Key takeaways</h3>
                  <span className="pdf-count">{keyTakeaways.length}</span>
                </div>

                {keyTakeaways.length > 0 ? (
                  <div className="pdf-takeaways">
                    {keyTakeaways.map((item, idx) => (
                      <div className="pdf-takeaway" key={idx}>
                        <CheckCircle2 size={17} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="pdf-empty-result">
                    No key takeaways were returned.
                  </p>
                )}
              </div>

              {/* Action Items */}
              <div className="pdf-result-section">
                <div className="pdf-section-heading">
                  <span className="pdf-section-number">03</span>
                  <h3>Recommended next actions</h3>
                  <span className="pdf-count">{actionItems.length}</span>
                </div>

                {actionItems.length > 0 ? (
                  <div className="pdf-action-list">
                    {actionItems.map((action, idx) => (
                      <div className="pdf-action-item" key={idx}>
                        <span className="pdf-action-index">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <span>{action}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="pdf-empty-result">
                    No recommended actions were returned.
                  </p>
                )}
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="pdf-empty-state">
              <div className="pdf-empty-icon">
                <FileSearch size={29} />
              </div>

              <h3>Your insights will appear here</h3>

              <p>
                Submit your document content to generate an executive summary,
                extract important findings, and discover recommended actions.
              </p>

              <div className="pdf-empty-features">
                <div>
                  <CheckCircle2 size={15} />
                  Executive summary
                </div>
                <div>
                  <CheckCircle2 size={15} />
                  Key takeaways
                </div>
                <div>
                  <CheckCircle2 size={15} />
                  Action items
                </div>
              </div>

              <div className="pdf-empty-bottom">
                <Sparkles size={14} />
                Powered by NexusAI
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
