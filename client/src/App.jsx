// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './contexts/AppContext';
import { useApiSetup } from './utils/apiSetup';
import PublicLanding from './pages/PublicLanding';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Welcome from './pages/Welcome';
import LandingPage from './pages/LandingPage';
import HowItWorks from './pages/HowItWorks';
import Services from './pages/Services';
import ContactUs from './pages/ContactUs';
import HelpSupport from './pages/HelpSupport';
import About from './pages/About';
import NotFound from './pages/NotFound';
import ReportIssue from './pages/ReportIssue';
import Complaints from './pages/Complaints';
import Dashboard from './pages/Dashboard';
import LeaderBoard from './pages/LeaderBoard';

// Protected Route Component - requires authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useApp();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route Component - redirects authenticated users to dashboard
const PublicAuthRoute = ({ children }) => {
  const { isAuthenticated } = useApp();
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

const AppRoutes = () => {
  const { isAuthenticated, isLoading } = useApp();
  
  // Setup API service with Clerk token
  useApiSetup();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Root Route - Smart Routing */}
      <Route 
        path="/" 
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <PublicLanding />
          )
        } 
      />
      
      {/* Public Authentication Routes */}
      <Route 
        path="/signup" 
        element={
          <PublicAuthRoute>
            <Signup />
          </PublicAuthRoute>
        } 
      />
      <Route 
        path="/login" 
        element={
          <PublicAuthRoute>
            <Login />
          </PublicAuthRoute>
        } 
      />

      {/* Protected Routes - require login */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <LandingPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/welcome" 
        element={
          <ProtectedRoute>
            <Welcome />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/report-issue" 
        element={
          <ProtectedRoute>
            <ReportIssue />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/reports" 
        element={
          <ProtectedRoute>
            <Complaints />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/map-view" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/leaderboard" 
        element={
          <ProtectedRoute>
            <LeaderBoard />
          </ProtectedRoute>
        } 
      />


      {/* Semi-Public Information Pages */}
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/services" element={<Services />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/help" element={<HelpSupport />} />
      <Route path="/about" element={<About />} />

      {/* 404 - Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
};

export default App;
