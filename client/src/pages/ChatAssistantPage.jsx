import React, { useState, useRef, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import {
  Send,
  Sparkles,
  User,
  Bot,
  Copy,
  Check,
  Trash2,
  Cpu,
  Layers,
  HelpCircle
} from 'lucide-react';

export default function ChatAssistantPage() {
  const { user, refreshUserData } = useAuth();
  const { addToast } = useNotification();
  const [persona, setPersona] = useState('Software Architect');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I am your AI Software Architect and technical co-pilot. Ask me about system design, microservices, database tuning, architectural patterns, or debugging complex problems.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tokensUsed: 45
    }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const personas = [
    { name: 'Software Architect', desc: 'Scalable system design, resilience & microservices' },
    { name: 'Full-Stack Reviewer', desc: 'React, Node.js, caching & database indexing' },
    { name: 'Startup Co-Founder', desc: 'Product-market fit, SaaS monetization & metrics' },
    { name: 'Security Auditor', desc: 'OWASP top 10, auth hardening & pen-testing' }
  ];

  const promptSuggestions = [
    "Design an event-driven architecture with Kafka and Redis",
    "Best practices for securing JWT tokens with refresh rotation",
    "How to diagnose and resolve React useEffect memory leaks",
    "Database schema design for a multi-tenant SaaS workspace"
  ];

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMessage = {
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    try {
      const res = await api.chat({
        messages: newHistory.map(m => ({ role: m.role, content: m.content })),
        persona
      });

      if (res.success && res.data) {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: res.data.content,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            tokensUsed: res.data.tokensUsed
          }
        ]);
        refreshUserData();
      } else {
        throw new Error(res.message || 'Chat generation failed');
      }
    } catch (err) {
      addToast(err.message || 'Failed to communicate with AI model.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    addToast('Copied to clipboard!', 'info', 2000);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleClear = () => {
    setMessages([
      {
        role: 'assistant',
        content: `Workspace reset. I am ready as ${persona}. What would you like to build or explore?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tokensUsed: 20
      }
    ]);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 124px)' }}>
      {/* Top Header */}
      <div className="glass-panel" style={{
        padding: '16px 20px',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Bot size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 800 }}>Autonomous AI Assistant</h1>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Multi-turn conversational intelligence</div>
          </div>
        </div>

        {/* Persona Select */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>Persona:</label>
          <select
            className="glass-input"
            value={persona}
            onChange={(e) => setPersona(e.target.value)}
            style={{ padding: '6px 12px', fontSize: '13px', cursor: 'pointer' }}
          >
            {personas.map(p => (
              <option key={p.name} value={p.name} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                {p.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleClear}
            title="Clear Chat History"
            style={{
              background: 'var(--bg-glass)',
              border: '1px solid var(--border-glass)',
              color: 'var(--text-muted)',
              borderRadius: '8px',
              padding: '7px 10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px'
            }}
          >
            <Trash2 size={14} /> Clear
          </button>
        </div>
      </div>

      {/* Chat Messages Body */}
      <div className="glass-panel" style={{
        flex: 1,
        overflowY: 'auto',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              gap: '14px',
              maxWidth: '85%',
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            {msg.role === 'assistant' && (
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Sparkles size={16} color="#fff" />
              </div>
            )}

            <div style={{
              background: msg.role === 'user'
                ? 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)'
                : 'var(--bg-card)',
              color: msg.role === 'user' ? '#fff' : 'var(--text-primary)',
              border: msg.role === 'user' ? 'none' : '1px solid var(--border-glass)',
              padding: '14px 18px',
              borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              position: 'relative',
              whiteSpace: 'pre-wrap',
              fontSize: '14px',
              lineHeight: 1.6
            }}>
              {msg.content}

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '10px',
                paddingTop: '8px',
                borderTop: msg.role === 'user' ? '1px solid rgba(255,255,255,0.2)' : '1px solid var(--border-glass)',
                fontSize: '11px',
                color: msg.role === 'user' ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)'
              }}>
                <span>{msg.timestamp}</span>
                {msg.tokensUsed && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Cpu size={12} /> {msg.tokensUsed} tokens
                  </span>
                )}
                {msg.role === 'assistant' && (
                  <button
                    onClick={() => handleCopy(msg.content, idx)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '11px'
                    }}
                  >
                    {copiedIdx === idx ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                    {copiedIdx === idx ? 'Copied' : 'Copy'}
                  </button>
                )}
              </div>
            </div>

            {msg.role === 'user' && (
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: 'var(--bg-glass)',
                border: '1px solid var(--border-glass)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <User size={16} color="var(--text-secondary)" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', gap: '14px', alignSelf: 'flex-start', maxWidth: '85%' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sparkles size={16} color="#fff" />
            </div>
            <div className="glass-panel" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '16px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-purple)', animation: 'bounce 1s infinite 0s' }} />
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-indigo)', animation: 'bounce 1s infinite 0.2s' }} />
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-blue)', animation: 'bounce 1s infinite 0.4s' }} />
              <span style={{ fontSize: '13px', color: 'var(--text-muted)', marginLeft: '6px' }}>Thinking as {persona}...</span>
            </div>
            <style>{`@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }`}</style>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '10px 0' }}>
        {promptSuggestions.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            disabled={loading}
            style={{
              background: 'var(--bg-glass)',
              border: '1px solid var(--border-glass)',
              color: 'var(--text-secondary)',
              borderRadius: '20px',
              padding: '6px 12px',
              fontSize: '12px',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            💡 {prompt}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        className="glass-panel"
        style={{
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}
      >
        <input
          type="text"
          className="glass-input"
          style={{ flex: 1, border: 'none', background: 'transparent', padding: '10px 8px', fontSize: '14px' }}
          placeholder={`Ask ${persona} anything... (e.g. optimize schema, review architectural trade-offs)`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="gradient-btn-primary"
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0
          }}
        >
          <Send size={17} />
        </button>
      </form>
    </div>
  );
}
