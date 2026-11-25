// src/pages/LandingPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import HeroSection from '../components/sections/HeroSection';
import QuickActions from '../components/sections/QuickActions';
import ActivityFeed from '../components/sections/ActivityFeed';
import PerformanceMetrics from '../components/sections/PerformanceMetrics';
import CategoryBreakdown from '../components/sections/CategoryBreakdown';
import CriticalAlerts from '../components/sections/CriticalAlerts';
import ContactSection from '../components/sections/ContactSection';

const LandingPage = () => {
  const navigate = useNavigate();
  
  // Sample data - replace with real data loading
  const [dashboardStats] = useState({
    totalReports: 1247,
    activeReports: 342,
    resolvedToday: 28,
    avgResolutionTime: '5.2 days',
    userEngagement: 7.8,
    criticalIssues: 12,
    monthlyGrowth: 12.5,
    resolutionRate: 89.2
  });

  const [recentActivity] = useState([
    { id: 1, type: 'report', message: 'New pothole reported on Main Street', time: '5 min ago', priority: 'medium', location: 'Downtown' },
    { id: 2, type: 'resolved', message: 'Streetlight issue resolved in Downtown', time: '12 min ago', priority: 'low', location: 'City Center' },
    { id: 3, type: 'critical', message: 'Water leak reported - requires immediate attention', time: '18 min ago', priority: 'high', location: 'Oak Avenue' },
    { id: 4, type: 'report', message: 'Waste collection missed on Oak Avenue', time: '25 min ago', priority: 'medium', location: 'Residential Area' },
    { id: 5, type: 'resolved', message: 'Park maintenance completed at Central Park', time: '1 hour ago', priority: 'low', location: 'Central District' }
  ]);

  const [performanceMetrics] = useState([
    { label: 'Resolution Rate', value: '89.2%', change: '+2.1%', positive: true },
    { label: 'Avg Response Time', value: '2.3 hrs', change: '-0.5 hrs', positive: true },
    { label: 'User Satisfaction', value: '4.6/5', change: '+0.2', positive: true },
    { label: 'Active Users', value: '2,847', change: '+156', positive: true }
  ]);

  const [categoryStats] = useState([
    { name: 'Potholes', count: 234, trend: 'up', change: '+12%' },
    { name: 'Streetlights', count: 156, trend: 'down', change: '-8%' },
    { name: 'Waste Management', count: 189, trend: 'up', change: '+15%' },
    { name: 'Traffic Signals', count: 67, trend: 'stable', change: '0%' },
    { name: 'Parks & Recreation', count: 98, trend: 'down', change: '-5%' }
  ]);

  const handleNavigation = (route) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header /> {/* No props needed! */}
      
      <main>
        <HeroSection dashboardStats={dashboardStats} />
        
        <QuickActions onNavigate={handleNavigation} />
        
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            {/* <CriticalAlerts 
              criticalCount={dashboardStats.criticalIssues}
              onViewCritical={() => handleNavigation('/reports?priority=critical')}
            /> */}
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <ActivityFeed activities={recentActivity} />
              </div>
              <div className="space-y-8">
                <PerformanceMetrics metrics={performanceMetrics} />
                <CategoryBreakdown categories={categoryStats} />
              </div>
            </div>
          </div>
        </section>
        
        <ContactSection />
      </main>
    </div>
  );
};

export default LandingPage;
