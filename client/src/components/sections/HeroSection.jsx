// components/sections/HeroSection.jsx
import React from 'react';
import {
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

const HeroSection = ({ dashboardStats }) => {
  const statCards = [
    {
      title: 'Total Reports',
      value: dashboardStats.totalReports.toLocaleString(),
      icon: DocumentTextIcon,
      growth: `+${dashboardStats.monthlyGrowth}% this month`,
      growthType: 'positive',
      bgColor: 'bg-gradient-to-br from-blue-500 to-blue-600'
    },
    {
      title: 'Active Reports',
      value: dashboardStats.activeReports,
      icon: ExclamationTriangleIcon,
      growth: 'Requires attention',
      growthType: 'neutral',
      bgColor: 'bg-gradient-to-br from-orange-500 to-orange-600'
    },
    {
      title: 'Resolution Rate',
      value: `${dashboardStats.resolutionRate}%`,
      icon: CheckCircleIcon,
      growth: 'Excellent performance',
      growthType: 'positive',
      bgColor: 'bg-gradient-to-br from-green-500 to-green-600'
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <div className="max-w-7xl mx-auto text-center">
        {/* Hero Content */}
        <div className="mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-teal-700 mb-6 leading-tight">
            Smart City Operations Center
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Real-time monitoring and management of civic issues across the municipality. 
            Keeping our community connected and responsive.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-4 rounded-xl ${stat.bgColor} shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="text-left">
                    <h3 className="text-3xl font-bold text-gray-800 mb-2">
                      {stat.value}
                    </h3>
                    <p className="text-gray-600 font-medium mb-3">
                      {stat.title}
                    </p>
                    <div className={`flex items-center text-sm font-medium ${
                      stat.growthType === 'positive' ? 'text-green-600' : 
                      stat.growthType === 'negative' ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      {stat.growthType === 'positive' && (
                        <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                      )}
                      {stat.growth}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
