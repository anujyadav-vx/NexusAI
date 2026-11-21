import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import {
  FileText,
  Sparkles,
  Copy,
  Check,
  Clock,
  BookOpen,
  Users,
  WandSparkles,
} from "lucide-react";

export default function BlogGeneratorPage() {
  const { refreshUserData } = useAuth();
  const { addToast } = useNotification();

  const [topic, setTopic] = useState(
    "Architecting Autonomous AI Multi-Agent Systems in 2026",
  );
  const [tone, setTone] = useState("Engaging & Professional");
  const [audience, setAudience] = useState("Tech Founders & Senior Developers");
  const [length, setLength] = useState("Medium");
  const [loading, setLoading] = useState(false);
  const [blog, setBlog] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();

    if (!topic.trim() || loading) return;

    setLoading(true);

    try {
      const res = await api.blogGenerate({
        topic,
        tone,
        audience,
        length,
      });

      if (res.success && res.data) {
        setBlog(res.data);
        refreshUserData();
        addToast("Blog generated successfully!", "success");
      } else {
        throw new Error(res.message || "Generation failed");
      }
    } catch (err) {
      addToast(err.message || "Failed to generate blog.", "error");
    } finally {
      setLoading(false);
    }
  };

  const copyContent = async () => {
    if (!blog?.content) return;

    const article = `${blog.title || "Untitled Article"}\n\n${blog.content}`;

    try {
      await navigator.clipboard.writeText(article);
      setCopied(true);
      addToast("Article copied to clipboard!", "info", 2000);

      setTimeout(() => setCopied(false), 2000);
    } catch {
      addToast("Unable to copy article.", "error");
    }
  };

  const outline = Array.isArray(blog?.outline) ? blog.outline : [];
  const tags = Array.isArray(blog?.tags) ? blog.tags : [];

  return (
    <main className="blog-page">
      {/* Page heading */}
      <header className="blog-page-header">
        <div className="blog-title-group">
          <div className="blog-title-icon">
            <FileText size={21} />
          </div>

          <div>
            <h1>Blog & SEO Writer</h1>
            <p>Turn your ideas into structured, publication-ready articles.</p>
          </div>
        </div>
      </header>

      {/* Main layout */}
      <div className="blog-layout">
        {/* Generator form */}
        <section className="blog-form-panel">
          <div className="blog-panel-heading">
            <div>
              <h2>Create an article</h2>
              <p>Configure your content before generating.</p>
            </div>
            <WandSparkles size={19} />
          </div>

          <form onSubmit={handleGenerate} className="blog-form">
            <div className="blog-field">
              <label htmlFor="blog-topic">Article topic or title</label>

              <textarea
                id="blog-topic"
                className="blog-input blog-topic-input"
                rows={4}
                placeholder="e.g. Building scalable AI applications with React and Node.js"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
              />
            </div>

            <div className="blog-field">
              <label htmlFor="blog-tone">Tone of voice</label>

              <select
                id="blog-tone"
                className="blog-input"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
              >
                <option value="Engaging & Professional">
                  Engaging & Professional
                </option>
                <option value="Authoritative & Deep-dive">
                  Authoritative & Deep-dive
                </option>
                <option value="Casual & Conversational">
                  Casual & Conversational
                </option>
                <option value="Viral & Visionary">Viral & Visionary</option>
              </select>
            </div>

            <div className="blog-field">
              <label htmlFor="blog-audience">
                <Users size={14} />
                Target audience
              </label>

              <input
                id="blog-audience"
                type="text"
                className="blog-input"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g. Software developers"
              />
            </div>

            <div className="blog-field">
              <label>Article length</label>

              <div className="blog-length-options">
                {[
                  { value: "Short", label: "Short", detail: "~500 words" },
                  { value: "Medium", label: "Medium", detail: "~850 words" },
                  {
                    value: "In-Depth",
                    label: "In-depth",
                    detail: "~1500 words",
                  },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    className={`blog-length-option ${
                      length === item.value ? "active" : ""
                    }`}
                    onClick={() => setLength(item.value)}
                    aria-pressed={length === item.value}
                  >
                    <span>{item.label}</span>
                    <small>{item.detail}</small>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !topic.trim()}
              className="blog-generate-btn"
            >
              {loading ? (
                <>
                  <Sparkles size={17} className="blog-spin" />
                  Generating article...
                </>
              ) : (
                <>
                  <Sparkles size={17} />
                  Generate article
                </>
              )}
            </button>

            <p className="blog-form-note">
              <Sparkles size={12} />
              Generated content may need fact-checking before publication.
            </p>
          </form>
        </section>

        {/* Generated article */}
        <section className="blog-result-section">
          {loading ? (
            <div className="blog-empty-state">
              <div className="blog-loading-icon">
                <Sparkles size={27} className="blog-spin" />
              </div>
              <h2>Writing your article</h2>
              <p>
                NexusAI is organizing your ideas and preparing your content.
              </p>
              <div className="blog-loading-bar">
                <span />
              </div>
            </div>
          ) : blog ? (
            <article className="blog-result-panel">
              {/* Article header */}
              <div className="blog-result-header">
                <div className="blog-result-label">
                  <span className="blog-status-dot" />
                  GENERATED ARTICLE
                </div>

                <button
                  type="button"
                  className="blog-copy-btn"
                  onClick={copyContent}
                >
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                  {copied ? "Copied" : "Copy article"}
                </button>
              </div>

              <h2 className="blog-article-title">{blog.title || topic}</h2>

              {/* Article metadata */}
              <div className="blog-article-meta">
                {blog.readingTime && (
                  <span>
                    <Clock size={14} />
                    {blog.readingTime}
                  </span>
                )}

                {blog.estimatedWords != null && (
                  <span>
                    <BookOpen size={14} />~{blog.estimatedWords} words
                  </span>
                )}
              </div>

              {/* SEO description */}
              {blog.metaDescription && (
                <div className="blog-seo-box">
                  <span>SEO DESCRIPTION</span>
                  <p>{blog.metaDescription}</p>
                </div>
              )}

              {/* Article outline */}
              {outline.length > 0 && (
                <div className="blog-outline">
                  <h3>In this article</h3>

                  <ol>
                    {outline.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Tags */}
              {tags.length > 0 && (
                <div className="blog-tags">
                  {tags.map((tag, index) => (
                    <span key={index}>#{tag}</span>
                  ))}
                </div>
              )}

              {/* Markdown article content */}
              <div className="blog-article-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {blog.content || ""}
                </ReactMarkdown>
              </div>

              <div className="blog-article-bottom">
                <span>
                  <Sparkles size={13} />
                  Generated with NexusAI
                </span>

                <button type="button" onClick={copyContent}>
                  <Copy size={14} />
                  Copy full article
                </button>
              </div>
            </article>
          ) : (
            <div className="blog-empty-state">
              <div className="blog-empty-icon">
                <FileText size={29} />
              </div>

              <h2>Your article will appear here</h2>

              <p>
                Enter a topic, select your preferred writing style, and generate
                a complete article with SEO information.
              </p>

              <div className="blog-empty-features">
                <span>
                  <Check size={14} /> Structured content
                </span>
                <span>
                  <Check size={14} /> SEO description
                </span>
                <span>
                  <Check size={14} /> Article outline
                </span>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
