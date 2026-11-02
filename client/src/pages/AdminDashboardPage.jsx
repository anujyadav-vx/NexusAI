import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import {
  ShieldCheck,
  Users,
  DollarSign,
  Cpu,
  Trash2,
  Activity,
  Search
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { addToast } = useNotification();
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchOverview = async () => {
    try {
      const res = await api.getAdminOverview();
      if (res.success && res.data) {
        setOverview(res.data);
      }
    } catch (err) {
      addToast(err.message || 'Failed to fetch admin metrics', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const handleRoleToggle = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    try {
      const res = await api.updateUserRole(user.id, { role: newRole });
      if (res.success) {
        addToast(`Updated ${user.name}'s role to ${newRole}`, 'success');
        fetchOverview();
      }
    } catch (err) {
      addToast(err.message || 'Failed to update role', 'error');
    }
  };

  const handlePlanChange = async (userId, newPlan) => {
    try {
      const res = await api.updateUserRole(userId, { plan: newPlan });
      if (res.success) {
        addToast(`Updated user plan to ${newPlan}`, 'success');
        fetchOverview();
      }
    } catch (err) {
      addToast(err.message || 'Failed to update plan', 'error');
    }
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Are you sure you want to delete user ${user.name} (${user.email})?`)) return;

    try {
      const res = await api.deleteUser(user.id);
      if (res.success) {
        addToast(res.message, 'info');
        fetchOverview();
      }
    } catch (err) {
      addToast(err.message || 'Failed to delete user', 'error');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading admin telemetry and governance controls...
      </div>
    );
  }

  const { metrics, users = [], auditLogs = [] } = overview || {};
  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShieldCheck size={20} color="#fff" />
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 800 }}>Platform Governance & Administration</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Manage global user authorizations, monitor real-time MRR, inspect system audit trails, and configure platform limits.
        </p>
      </div>

      {/* 4 Admin Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600 }}>
            <span>TOTAL USERS</span>
            <Users size={16} color="var(--accent-purple)" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, margin: '8px 0 4px 0' }}>{metrics?.totalUsers || 0}</div>
          <div style={{ fontSize: '12px', color: 'var(--accent-emerald)' }}>Active accounts</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600 }}>
            <span>MONTHLY MRR</span>
            <DollarSign size={16} color="var(--accent-emerald)" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, margin: '8px 0 4px 0' }}>{metrics?.monthlyRecurringRevenue || '$0'}</div>
          <div style={{ fontSize: '12px', color: 'var(--accent-emerald)' }}>Recurring subscriptions</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600 }}>
            <span>PLATFORM TOKENS</span>
            <Cpu size={16} color="var(--accent-blue)" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, margin: '8px 0 4px 0' }}>
            {(metrics?.totalPlatformTokens || 0).toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Aggregate inference volume</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600 }}>
            <span>TOTAL GENERATIONS</span>
            <Activity size={16} color="var(--accent-amber)" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, margin: '8px 0 4px 0' }}>{metrics?.totalAiGenerations || 0}</div>
          <div style={{ fontSize: '12px', color: 'var(--accent-emerald)' }}>Completed successfully</div>
        </div>
      </div>

      {/* User Management Table */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '18px' }}>
          <div>
            <h2 style={{ fontSize: '17px', fontWeight: 700 }}>Registered Users & RBAC Controls</h2>
            <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>Manage user roles, assign subscription tiers, or remove accounts</div>
          </div>

          {/* Search */}
          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '10px' }} />
            <input
              type="text"
              className="glass-input"
              style={{ width: '100%', paddingLeft: '32px', fontSize: '12.5px', padding: '6px 12px 6px 32px' }}
              placeholder="Search user or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-muted)', fontSize: '12px' }}>
                <th style={{ padding: '10px 12px' }}>User</th>
                <th style={{ padding: '10px 12px' }}>Role</th>
                <th style={{ padding: '10px 12px' }}>Tier Plan</th>
                <th style={{ padding: '10px 12px' }}>Tokens Used</th>
                <th style={{ padding: '10px 12px' }}>Created</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`}
                        alt={u.name}
                        style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 600 }}>{u.name}</div>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{u.email}</div>
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: '12px' }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '12px',
                      background: u.role === 'admin' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(56, 189, 248, 0.15)',
                      color: u.role === 'admin' ? '#c084fc' : '#38bdf8',
                      border: '1px solid var(--border-glass)'
                    }}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>

                  <td style={{ padding: '12px' }}>
                    <select
                      value={u.plan || 'free'}
                      onChange={(e) => handlePlanChange(u.id, e.target.value)}
                      className="glass-input"
                      style={{ padding: '4px 8px', fontSize: '12px', cursor: 'pointer' }}
                    >
                      <option value="free" style={{ background: 'var(--bg-secondary)' }}>Free</option>
                      <option value="pro" style={{ background: 'var(--bg-secondary)' }}>Pro</option>
                      <option value="enterprise" style={{ background: 'var(--bg-secondary)' }}>Enterprise</option>
                    </select>
                  </td>

                  <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>
                    {(u.tokensUsed || 0).toLocaleString()}
                  </td>

                  <td style={{ padding: '12px', color: 'var(--text-muted)', fontSize: '12px' }}>
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Recent'}
                  </td>

                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button
                        onClick={() => handleRoleToggle(u)}
                        title={u.role === 'admin' ? 'Demote to regular user' : 'Promote to admin'}
                        style={{
                          background: 'var(--bg-glass)',
                          border: '1px solid var(--border-glass)',
                          color: 'var(--text-secondary)',
                          padding: '5px 10px',
                          borderRadius: '6px',
                          fontSize: '11.5px',
                          cursor: 'pointer'
                        }}
                      >
                        {u.role === 'admin' ? 'Demote' : 'Make Admin'}
                      </button>

                      <button
                        onClick={() => handleDeleteUser(u)}
                        title="Delete User"
                        style={{
                          background: 'rgba(244, 63, 94, 0.1)',
                          border: '1px solid rgba(244, 63, 94, 0.3)',
                          color: '#f43f5e',
                          padding: '5px 8px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Logs */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '16px' }}>System Security & Audit Log</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {auditLogs.map(log => (
            <div
              key={log.id}
              style={{
                background: 'var(--bg-glass)',
                border: '1px solid var(--border-glass)',
                borderRadius: '8px',
                padding: '12px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '8px',
                fontSize: '13px'
              }}
            >
              <div>
                <span style={{ fontWeight: 700, color: 'var(--accent-purple)', marginRight: '8px' }}>[{log.action}]</span>
                <span style={{ color: 'var(--text-secondary)' }}>{log.details}</span>
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                {log.actor} • {new Date(log.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
