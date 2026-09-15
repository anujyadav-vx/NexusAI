import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider } from './context/AuthContext';

import DashboardLayout from './components/layout/DashboardLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardHome from './pages/DashboardHome';
import ChatAssistantPage from './pages/ChatAssistantPage';
import ResumeAnalyzerPage from './pages/ResumeAnalyzerPage';
import CodeReviewerPage from './pages/CodeReviewerPage';
import BlogGeneratorPage from './pages/BlogGeneratorPage';
import PdfSummarizerPage from './pages/PdfSummarizerPage';
import SqlGeneratorPage from './pages/SqlGeneratorPage';
import ImageGeneratorPage from './pages/ImageGeneratorPage';
import AnalyticsPage from './pages/AnalyticsPage';
import BillingPage from './pages/BillingPage';
import SettingsPage from './pages/SettingsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

export default function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected User Workspace Routes */}
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<DashboardHome />} />
                <Route path="/dashboard/chat" element={<ChatAssistantPage />} />
                <Route path="/dashboard/resume" element={<ResumeAnalyzerPage />} />
                <Route path="/dashboard/code" element={<CodeReviewerPage />} />
                <Route path="/dashboard/blog" element={<BlogGeneratorPage />} />
                <Route path="/dashboard/pdf" element={<PdfSummarizerPage />} />
                <Route path="/dashboard/sql" element={<SqlGeneratorPage />} />
                <Route path="/dashboard/image" element={<ImageGeneratorPage />} />
                <Route path="/dashboard/analytics" element={<AnalyticsPage />} />
                <Route path="/billing" element={<BillingPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>

              {/* Protected Admin Routes */}
              <Route element={<DashboardLayout requireAdmin={true} />}>
                <Route path="/admin" element={<AdminDashboardPage />} />
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}
