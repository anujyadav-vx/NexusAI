import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import {
  Menu,
  PanelLeftClose,
  PanelLeft,
  Sun,
  Moon,
  Zap,
  LogOut,
  User,
  ShieldCheck,
  CreditCard,
  ChevronDown,
} from "lucide-react";

export default function Navbar({ onMenuClick, onCollapseClick }) {
  const { user, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate("/login");
  };

  const tokensUsed = user?.tokensUsed || 0;
  const tokenLimit = user?.tokenLimit || 5000;
  const tokenPercentage = Math.min(
    100,
    Math.round((tokensUsed / tokenLimit) * 100),
  );

  return (
    <header className="app-navbar">
      <div className="navbar-left">
        <button
          className="navbar-icon-button mobile-menu-button"
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          <Menu size={19} />
        </button>

        <button
          className="navbar-icon-button desktop-collapse-button"
          onClick={onCollapseClick}
          aria-label="Collapse sidebar"
          title="Toggle sidebar"
        >
          <PanelLeftClose size={18} />
        </button>

        <div className="navbar-breadcrumb">
          <span className="breadcrumb-workspace">Workspace</span>
          <span className="breadcrumb-divider">/</span>
          <span className="breadcrumb-current">NexusAI</span>
        </div>
      </div>

      <div className="navbar-right">
        {user && (
          <div className="navbar-quota">
            <div className="quota-label">
              <Zap size={13} />
              <span>{tokenPercentage}% used</span>
            </div>

            <div className="quota-track">
              <div
                className={`quota-fill ${tokenPercentage > 85 ? "quota-warning" : ""}`}
                style={{ width: `${tokenPercentage}%` }}
              />
            </div>
          </div>
        )}

        <button
          className="navbar-icon-button"
          onClick={toggleTheme}
          title={
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {user && (
          <div className="navbar-profile">
            <button
              className="profile-trigger"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-expanded={dropdownOpen}
            >
              <img
                src={
                  user.avatar ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name || "User")}`
                }
                alt=""
                className="profile-avatar"
              />

              <span className="profile-name">
                {user.name?.split(" ")[0] || "Account"}
              </span>

              <ChevronDown size={14} />
            </button>

            {dropdownOpen && (
              <>
                <button
                  className="dropdown-dismiss"
                  aria-label="Close profile menu"
                  onClick={() => setDropdownOpen(false)}
                />

                <div className="profile-dropdown">
                  <div className="dropdown-user">
                    <strong>{user.name}</strong>
                    <span>{user.email}</span>
                  </div>

                  <Link to="/settings" onClick={() => setDropdownOpen(false)}>
                    <User size={16} />
                    Profile Settings
                  </Link>

                  <Link to="/billing" onClick={() => setDropdownOpen(false)}>
                    <CreditCard size={16} />
                    Subscription & Billing
                  </Link>

                  {isAdmin && (
                    <Link to="/admin" onClick={() => setDropdownOpen(false)}>
                      <ShieldCheck size={16} />
                      Admin Panel
                    </Link>
                  )}

                  <button className="logout-action" onClick={handleLogout}>
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
