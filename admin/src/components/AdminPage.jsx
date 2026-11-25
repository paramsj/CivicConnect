// src/AdminApp.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminMapView from './pages/admin/AdminMapView';
import AdminReports from './pages/admin/AdminReports';
import AdminSettings from './pages/admin/AdminSettings';

const AdminApp = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/analytics" element={<AdminAnalytics />} />
        <Route path="/map-view" element={<AdminMapView />} />
        <Route path="/reports" element={<AdminReports />} />
        <Route path="/settings" element={<AdminSettings />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminApp;
