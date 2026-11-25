// src/AdminApp.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminMapView from './pages/admin/AdminMapView';
import AdminReports from './pages/admin/AdminReports';
import AdminSettings from './pages/admin/AdminSettings';
import AdminUsers from './pages/admin/AdminUsers';

const App = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/" element={<AdminDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/analytics" element={<AdminAnalytics />} />
        <Route path="/admin/map-view" element={<AdminMapView />} />
        <Route path="/map-view" element={<AdminMapView />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/reports" element={<AdminReports />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/users" element={<AdminUsers />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/settings" element={<AdminSettings />} />
        {/* Fallback to Dashboard for any unknown admin route */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
};

export default App;
