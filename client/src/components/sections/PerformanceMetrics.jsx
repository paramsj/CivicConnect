// components/sections/PerformanceMetrics.jsx
import React from 'react';
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

const PerformanceMetrics = ({ metrics }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Performance Metrics</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800 mb-1">
                {metric.value}
              </div>
              <div className="text-sm text-gray-600 mb-2">
                {metric.label}
              </div>
              <div className={`flex items-center justify-center text-xs font-medium ${
                metric.positive ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.positive ? (
                  <ArrowTrendingUpIcon className="w-3 h-3 mr-1" />
                ) : (
                  <ArrowTrendingDownIcon className="w-3 h-3 mr-1" />
                )}
                {metric.change}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformanceMetrics;
