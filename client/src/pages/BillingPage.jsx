import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import {
  CreditCard,
  Check,
  Zap,
  Sparkles,
  ShieldCheck,
  Download,
  AlertCircle
} from 'lucide-react';

export default function BillingPage() {
  const { user, refreshUserData } = useAuth();
  const { addToast } = useNotification();
  const [plans, setPlans] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loadingPlan, setLoadingPlan] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plansRes, invoicesRes] = await Promise.all([
          api.getPlans(),
          api.getInvoices()
        ]);
        if (plansRes.success) setPlans(plansRes.plans);
        if (invoicesRes.success) setInvoices(invoicesRes.invoices);
      } catch (err) {
        console.error('Failed to load billing data', err);
      }
    };
    fetchData();
  }, []);

  const handleUpgrade = async (planId) => {
    if (user?.plan === planId) return;

    setLoadingPlan(planId);
    try {
      const res = await api.upgradePlan(planId);
      if (res.success) {
        // Trigger celebratory confetti
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });

        await refreshUserData();
        addToast(res.message, 'success');
      } else {
        throw new Error(res.message || 'Upgrade failed');
      }
    } catch (err) {
      addToast(err.message || 'Failed to update plan.', 'error');
    } finally {
      setLoadingPlan(null);
    }
  };

  const tokensUsed = user?.tokensUsed || 0;
  const tokenLimit = user?.tokenLimit || 5000;
  const percentUsed = Math.min(100, Math.round((tokensUsed / tokenLimit) * 100));

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <CreditCard size={20} color="#fff" />
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 800 }}>Plans, Quotas & Invoicing</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Scale token allowances on-demand. All plans feature instant zero-latency provisioning and rollover protection.
        </p>
      </div>

      {/* Current Quota Status */}
      <div className="glass-panel" style={{
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(17, 24, 39, 0.6) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.25)'
      }}>
        <div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Current Active Subscription
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, marginTop: '4px', textTransform: 'capitalize' }}>
            {user?.plan} Tier Plan
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {tokensUsed.toLocaleString()} of {tokenLimit.toLocaleString()} monthly tokens consumed ({percentUsed}%)
          </div>
        </div>

        <div style={{ width: '240px' }}>
          <div style={{ height: '8px', background: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${percentUsed}%`, height: '100%', background: percentUsed > 85 ? '#f43f5e' : 'linear-gradient(90deg, #10b981, #38bdf8)' }} />
          </div>
        </div>
      </div>

      {/* Plans Comparison Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {plans.map((p) => {
          const isCurrent = user?.plan === p.id;
          const isPro = p.id === 'pro';

          return (
            <div
              key={p.id}
              className="glass-panel"
              style={{
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                border: isCurrent
                  ? '2px solid var(--accent-purple)'
                  : isPro
                  ? '1px solid rgba(139, 92, 246, 0.4)'
                  : '1px solid var(--border-glass)',
                background: isPro
                  ? 'linear-gradient(180deg, rgba(139, 92, 246, 0.1) 0%, rgba(17, 24, 39, 0.8) 100%)'
                  : 'var(--bg-card)'
              }}
            >
              {isCurrent && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  right: '24px',
                  background: 'var(--accent-purple)',
                  color: '#fff',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: '12px'
                }}>
                  CURRENT ACTIVE PLAN
                </div>
              )}

              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: isPro ? '#c084fc' : 'var(--text-muted)' }}>
                  {p.name.toUpperCase()}
                </div>
                <div style={{ fontSize: '36px', fontWeight: 800, margin: '12px 0 6px 0' }}>
                  ${p.price} <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-muted)' }}>/{p.interval}</span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                  Includes {p.tokenLimit.toLocaleString()} monthly tokens
                </div>

                <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '20px', marginBottom: '28px' }}>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13.5px' }}>
                    {p.features.map((feat, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Check size={16} color="#10b981" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                onClick={() => handleUpgrade(p.id)}
                disabled={isCurrent || loadingPlan === p.id}
                className={isPro || p.id === 'enterprise' ? 'gradient-btn-primary' : ''}
                style={{
                  padding: '12px',
                  width: '100%',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: isCurrent ? 'default' : 'pointer',
                  border: isCurrent ? '1px solid var(--border-glass)' : 'none',
                  background: isCurrent ? 'var(--bg-glass)' : undefined,
                  color: isCurrent ? 'var(--text-muted)' : '#fff'
                }}
              >
                {loadingPlan === p.id ? 'Processing...' : isCurrent ? 'Active Subscription' : `Switch to ${p.name}`}
              </button>
            </div>
          );
        })}
      </div>

      {/* Invoice History */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '16px' }}>Invoice & Billing History</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-muted)', fontSize: '12px' }}>
                <th style={{ padding: '10px 12px' }}>Invoice ID</th>
                <th style={{ padding: '10px 12px' }}>Billing Date</th>
                <th style={{ padding: '10px 12px' }}>Amount</th>
                <th style={{ padding: '10px 12px' }}>Payment Status</th>
                <th style={{ padding: '10px 12px' }}>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                  <td style={{ padding: '12px', fontWeight: 600 }}>{inv.id}</td>
                  <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{inv.date}</td>
                  <td style={{ padding: '12px', fontWeight: 700 }}>{inv.amount}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ fontSize: '11.5px', color: '#10b981', background: 'rgba(16, 185, 129, 0.12)', padding: '2px 8px', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                      {inv.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <button
                      onClick={() => addToast(`Downloaded receipt ${inv.id}`, 'info')}
                      style={{ background: 'none', border: 'none', color: 'var(--accent-purple)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600 }}
                    >
                      <Download size={13} /> PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
