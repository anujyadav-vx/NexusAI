import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import {
  Send,
  Sparkles,
  Copy,
  Check,
  Trash2,
  Cpu,
  User,
  Bot,
} from "lucide-react";

export default function ChatAssistantPage() {
  const { user, refreshUserData } = useAuth();
  const { addToast } = useNotification();

  const [persona, setPersona] = useState("Software Architect");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I am your AI Software Architect and technical co-pilot. Ask me about system design, microservices, database tuning, architectural patterns, or debugging complex problems.",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      tokensUsed: 45,
    },
  ]);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const personas = [
    "Software Architect",
    "Full-Stack Reviewer",
    "Startup Co-Founder",
    "Security Auditor",
  ];

  const promptSuggestions = [
    "Design an event-driven architecture with Kafka and Redis",
    "Best practices for securing JWT tokens",
    "How to prevent React useEffect memory leaks",
    "Database schema for a multi-tenant SaaS",
  ];

  useEffect(() => {
    const container = messagesEndRef.current?.parentElement;

    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const text = (textToSend ?? input).trim();

    if (!text || loading) return;

    const userMessage = {
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const newHistory = [...messages, userMessage];

    setMessages(newHistory);
    setInput("");
    setLoading(true);

    try {
      const res = await api.chat({
        messages: newHistory.map((message) => ({
          role: message.role,
          content: message.content,
        })),
        persona,
      });

      if (res.success && res.data) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: res.data.content,
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            tokensUsed: res.data.tokensUsed,
          },
        ]);

        refreshUserData();
      } else {
        throw new Error(res.message || "Chat generation failed");
      }
    } catch (err) {
      addToast(err.message || "Failed to communicate with AI model.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text, idx) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      addToast("Copied to clipboard!", "info", 2000);

      setTimeout(() => setCopiedIdx(null), 2000);
    } catch {
      addToast("Unable to copy text.", "error");
    }
  };

  const handleClear = () => {
    setMessages([
      {
        role: "assistant",
        content: `Workspace reset. I am ready as ${persona}. What would you like to build or explore?`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        tokensUsed: 20,
      },
    ]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <section className="chat-page">
      {/* Header */}
      <header className="chat-header">
        <div className="chat-heading">
          <div className="chat-heading-icon">
            <Bot size={21} />
          </div>

          <div className="chat-heading-text">
            <h1>AI Assistant</h1>
            <p>Your personal AI workspace</p>
          </div>
        </div>

        <div className="chat-header-actions">
          <select
            className="chat-persona-select"
            value={persona}
            onChange={(e) => setPersona(e.target.value)}
            aria-label="Select AI persona"
          >
            {personas.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          <button
            className="chat-clear-btn"
            onClick={handleClear}
            title="Clear conversation"
            type="button"
          >
            <Trash2 size={15} />
            <span>Clear</span>
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className="chat-messages">
        <div className="chat-messages-inner">
          {messages.map((msg, idx) => (
            <article
              key={idx}
              className={`chat-message ${
                msg.role === "user" ? "user-message" : "assistant-message"
              }`}
            >
              <div className="chat-avatar">
                {msg.role === "assistant" ? (
                  <Sparkles size={17} />
                ) : user?.avatar ? (
                  <img src={user.avatar} alt="You" />
                ) : (
                  <User size={17} />
                )}
              </div>

              <div className="chat-message-content">
                <div className="chat-message-author">
                  {msg.role === "assistant" ? "NexusAI" : "You"}
                  <span>{msg.timestamp}</span>
                </div>

                <div className="chat-message-bubble">
                  {msg.role === "assistant" ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </ReactMarkdown>
                  ) : (
                    msg.content
                  )}
                </div>

                <div className="chat-message-footer">
                  {msg.tokensUsed != null && (
                    <span className="chat-token-info">
                      <Cpu size={12} />
                      {msg.tokensUsed} tokens
                    </span>
                  )}

                  {msg.role === "assistant" && (
                    <button
                      className="chat-copy-btn"
                      onClick={() => handleCopy(msg.content, idx)}
                      type="button"
                    >
                      {copiedIdx === idx ? (
                        <Check size={13} />
                      ) : (
                        <Copy size={13} />
                      )}

                      {copiedIdx === idx ? "Copied" : "Copy"}
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}

          {loading && (
            <div className="chat-message assistant-message">
              <div className="chat-avatar">
                <Sparkles size={17} />
              </div>

              <div className="chat-message-content">
                <div className="chat-message-author">NexusAI</div>

                <div className="chat-typing">
                  <span />
                  <span />
                  <span />
                  <small>Thinking as {persona}...</small>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Bottom composer */}
      <div className="chat-bottom">
        <div className="chat-suggestions">
          {promptSuggestions.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              disabled={loading}
              onClick={() => handleSend(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>

        <form
          className="chat-composer"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${persona}...`}
            disabled={loading}
            rows={1}
          />

          <button
            type="submit"
            disabled={loading || !input.trim()}
            aria-label="Send message"
          >
            <Send size={18} />
          </button>
        </form>

        <p className="chat-disclaimer">
          NexusAI can make mistakes. Verify important information.
        </p>
      </div>
    </section>
  );
}
