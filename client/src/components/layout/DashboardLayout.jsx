import React, { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useAuth } from "../../context/AuthContext";

export default function DashboardLayout({ requireAdmin = false }) {
  const { user, loading, isAdmin } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (loading) {
    return (
      <div className="workspace-loading">
        <div className="loading-spinner" />
        <span>Loading workspace...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="app-layout">
      <Sidebar
        isOpen={sidebarOpen}
        collapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="workspace-main">
        <Navbar
          onMenuClick={() => setSidebarOpen(true)}
          onCollapseClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <main className="main-content">
          <div className="page-container">
            <Outlet />
          </div>
        </main>
      </div>

      {sidebarOpen && (
        <button
          className="sidebar-overlay"
          aria-label="Close navigation menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
