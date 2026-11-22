import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { useNotification } from "../context/NotificationContext";
import {
  ShieldCheck,
  Users,
  DollarSign,
  Cpu,
  Trash2,
  Activity,
  Search,
  Shield,
  Crown,
  RefreshCw,
  UserCog,
  CalendarDays,
  Database,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { addToast } = useNotification();

  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchOverview = async () => {
    try {
      const res = await api.getAdminOverview();

      if (res.success && res.data) {
        setOverview(res.data);
      }
    } catch (err) {
      addToast(err.message || "Failed to fetch admin metrics", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const handleRoleToggle = async (user) => {
    const newRole = user.role === "admin" ? "user" : "admin";

    try {
      const res = await api.updateUserRole(user.id, {
        role: newRole,
      });

      if (res.success) {
        addToast(`Updated ${user.name}'s role to ${newRole}`, "success");
        fetchOverview();
      }
    } catch (err) {
      addToast(err.message || "Failed to update role", "error");
    }
  };

  const handlePlanChange = async (userId, newPlan) => {
    try {
      const res = await api.updateUserRole(userId, {
        plan: newPlan,
      });

      if (res.success) {
        addToast(`Updated user plan to ${newPlan}`, "success");
        fetchOverview();
      }
    } catch (err) {
      addToast(err.message || "Failed to update plan", "error");
    }
  };

  const handleDeleteUser = async (user) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.name} (${user.email})?`,
    );

    if (!confirmed) return;

    try {
      const res = await api.deleteUser(user.id);

      if (res.success) {
        addToast(res.message || "User deleted successfully", "info");
        fetchOverview();
      }
    } catch (err) {
      addToast(err.message || "Failed to delete user", "error");
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <RefreshCw size={20} className="admin-loading-icon" />
        <span>Loading administration dashboard...</span>
      </div>
    );
  }

  const { metrics = {}, users = [], auditLogs = [] } = overview || {};

  const filteredUsers = users.filter((u) => {
    const search = searchTerm.toLowerCase();

    return (
      u.name?.toLowerCase().includes(search) ||
      u.email?.toLowerCase().includes(search)
    );
  });

  const statCards = [
    {
      label: "Total users",
      value: metrics.totalUsers || 0,
      description: "Registered accounts",
      icon: Users,
      className: "users",
    },
    {
      label: "Monthly revenue",
      value: metrics.monthlyRecurringRevenue || "$0",
      description: "Recurring subscriptions",
      icon: DollarSign,
      className: "revenue",
    },
    {
      label: "Platform tokens",
      value: (metrics.totalPlatformTokens || 0).toLocaleString(),
      description: "Total inference volume",
      icon: Cpu,
      className: "tokens",
    },
    {
      label: "AI generations",
      value: metrics.totalAiGenerations || 0,
      description: "Total generations",
      icon: Activity,
      className: "generations",
    },
  ];

  return (
    <section className="admin-page">
      {/* Page header */}
      <header className="admin-header">
        <div className="admin-header-main">
          <div className="admin-heading-icon">
            <ShieldCheck size={21} />
          </div>

          <div>
            <div className="admin-eyebrow">
              <span>Workspace</span>
              <span className="admin-breadcrumb-separator">/</span>
              <span>Administration</span>
            </div>

            <h1>Admin dashboard</h1>

            <p>
              Manage users, monitor platform usage and oversee account
              permissions.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="admin-refresh-btn"
          onClick={fetchOverview}
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </header>

      {/* Statistics */}
      <section className="admin-stats">
        {statCards.map((stat) => {
          const Icon = stat.icon;

          return (
            <article className="admin-stat-card" key={stat.label}>
              <div className="admin-stat-top">
                <span>{stat.label}</span>

                <div className={`admin-stat-icon ${stat.className}`}>
                  <Icon size={17} />
                </div>
              </div>

              <div className="admin-stat-value">{stat.value}</div>

              <div className="admin-stat-description">{stat.description}</div>
            </article>
          );
        })}
      </section>

      {/* User management */}
      <section className="admin-section">
        <div className="admin-section-header">
          <div className="admin-section-title">
            <div className="admin-section-icon">
              <UserCog size={17} />
            </div>

            <div>
              <h2>User management</h2>
              <p>Manage roles, subscription plans and registered accounts.</p>
            </div>
          </div>

          <div className="admin-user-count">
            <Users size={14} />
            {users.length} users
          </div>
        </div>

        <div className="admin-table-toolbar">
          <div className="admin-search">
            <Search size={15} />

            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search users"
            />

            {searchTerm && (
              <button
                type="button"
                className="admin-search-clear"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Plan</th>
                <th>Tokens used</th>
                <th>Joined</th>
                <th className="admin-actions-heading">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="admin-user-cell">
                        <img
                          src={
                            u.avatar ||
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                              u.name || u.email || "user",
                            )}`
                          }
                          alt=""
                          className="admin-user-avatar"
                        />

                        <div className="admin-user-info">
                          <span className="admin-user-name">{u.name}</span>

                          <span className="admin-user-email">{u.email}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`admin-role-badge ${
                          u.role === "admin" ? "is-admin" : "is-user"
                        }`}
                      >
                        {u.role === "admin" ? (
                          <Shield size={12} />
                        ) : (
                          <Users size={12} />
                        )}

                        {u.role || "user"}
                      </span>
                    </td>

                    <td>
                      <select
                        value={u.plan || "free"}
                        onChange={(e) => handlePlanChange(u.id, e.target.value)}
                        className="admin-plan-select"
                        aria-label={`Change plan for ${u.name}`}
                      >
                        <option value="free">Free</option>
                        <option value="pro">Pro</option>
                        <option value="enterprise">Enterprise</option>
                      </select>
                    </td>

                    <td>
                      <span className="admin-token-value">
                        <Database size={13} />
                        {(u.tokensUsed || 0).toLocaleString()}
                      </span>
                    </td>

                    <td>
                      <span className="admin-date">
                        <CalendarDays size={13} />
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString()
                          : "Recent"}
                      </span>
                    </td>

                    <td>
                      <div className="admin-row-actions">
                        <button
                          type="button"
                          className="admin-role-action"
                          onClick={() => handleRoleToggle(u)}
                          title={
                            u.role === "admin"
                              ? "Demote to user"
                              : "Promote to admin"
                          }
                        >
                          {u.role === "admin" ? "Demote" : "Make admin"}
                        </button>

                        <button
                          type="button"
                          className="admin-delete-btn"
                          onClick={() => handleDeleteUser(u)}
                          title="Delete user"
                          aria-label={`Delete ${u.name}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">
                    <div className="admin-empty-users">
                      <Search size={22} />
                      <strong>No users found</strong>
                      <span>Try searching with a different name or email.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="admin-table-footer">
          Showing {filteredUsers.length} of {users.length} users
        </div>
      </section>

      {/* Audit logs */}
      <section className="admin-section admin-audit-section">
        <div className="admin-section-header">
          <div className="admin-section-title">
            <div className="admin-section-icon audit-icon">
              <Activity size={17} />
            </div>

            <div>
              <h2>Security & audit activity</h2>
              <p>Recent administrative actions and platform activity.</p>
            </div>
          </div>

          <span className="admin-live-indicator">
            <span />
            Activity log
          </span>
        </div>

        <div className="admin-audit-list">
          {auditLogs.length > 0 ? (
            auditLogs.map((log) => (
              <article className="admin-audit-item" key={log.id}>
                <div className="admin-audit-marker">
                  <Activity size={14} />
                </div>

                <div className="admin-audit-content">
                  <div className="admin-audit-description">
                    <span className="admin-audit-action">{log.action}</span>

                    <span>{log.details}</span>
                  </div>

                  <div className="admin-audit-meta">
                    <span>{log.actor}</span>
                    <span className="admin-audit-dot">·</span>
                    <span>
                      {log.timestamp
                        ? new Date(log.timestamp).toLocaleString()
                        : "Unknown time"}
                    </span>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="admin-empty-audit">
              <Activity size={22} />
              <strong>No audit activity yet</strong>
              <span>Administrative activity will appear here.</span>
            </div>
          )}
        </div>
      </section>
    </section>
  );
}
