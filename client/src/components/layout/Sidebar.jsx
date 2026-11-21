import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  MessageSquare,
  FileCheck2,
  Code2,
  FileText,
  FileSearch,
  Database,
  Image,
  BarChart3,
  CreditCard,
  Settings,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

export default function Sidebar({ isOpen, collapsed, onClose }) {
  const { isAdmin } = useAuth();

  const navItems = [
    { section: "WORKSPACE" },
    {
      to: "/dashboard",
      label: "Overview",
      icon: <LayoutDashboard size={17} />,
      end: true,
    },
    {
      to: "/dashboard/chat",
      label: "AI Chat",
      icon: <MessageSquare size={17} />,
      badge: "Popular",
    },
    { section: "AI TOOLS" },
    {
      to: "/dashboard/code",
      label: "Code Reviewer",
      icon: <Code2 size={17} />,
    },
    {
      to: "/dashboard/resume",
      label: "Resume Analyzer",
      icon: <FileCheck2 size={17} />,
    },
    {
      to: "/dashboard/blog",
      label: "Blog & SEO Writer",
      icon: <FileText size={17} />,
    },
    {
      to: "/dashboard/pdf",
      label: "PDF Summarizer",
      icon: <FileSearch size={17} />,
    },
    {
      to: "/dashboard/sql",
      label: "SQL Generator",
      icon: <Database size={17} />,
    },
    {
      to: "/dashboard/image",
      label: "Image Studio",
      icon: <Image size={17} />,
      badge: "New",
    },
    { section: "MANAGEMENT" },
    {
      to: "/dashboard/analytics",
      label: "Analytics",
      icon: <BarChart3 size={17} />,
    },
    {
      to: "/billing",
      label: "Billing",
      icon: <CreditCard size={17} />,
    },
    {
      to: "/settings",
      label: "Settings",
      icon: <Settings size={17} />,
    },
  ];

  if (isAdmin) {
    navItems.push(
      { section: "ADMINISTRATION" },
      {
        to: "/admin",
        label: "Admin Dashboard",
        icon: <ShieldCheck size={17} />,
        badge: "Admin",
      },
    );
  }

  return (
    <aside
      className={`app-sidebar ${collapsed ? "collapsed" : ""} ${isOpen ? "mobile-open" : ""}`}
    >
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <Sparkles size={19} />
        </div>

        <span className="sidebar-brand-name">
          Nexus<span>AI</span>
        </span>

        <button
          className="sidebar-close"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="sidebar-navigation">
        {navItems.map((item, index) => {
          if (item.section) {
            return (
              <div className="sidebar-section" key={index}>
                {item.section}
              </div>
            );
          }

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              title={collapsed ? item.label : undefined}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <span className="sidebar-link-icon">{item.icon}</span>

              <span className="sidebar-link-label">{item.label}</span>

              {item.badge && (
                <span className={`sidebar-badge ${item.badge.toLowerCase()}`}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-pro-card">
          <div className="sidebar-pro-title">
            <Sparkles size={15} />
            <span>Unlock Pro Power</span>
          </div>

          <p>Get more from your AI workspace with premium plans.</p>

          <NavLink to="/billing" onClick={onClose}>
            View Plans
          </NavLink>
        </div>

        <div className="sidebar-version">NexusAI Workspace</div>
      </div>
    </aside>
  );
}
