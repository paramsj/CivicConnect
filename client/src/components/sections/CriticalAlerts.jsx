// components/sections/CriticalAlerts.jsx
import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const CriticalAlerts = ({ criticalCount, onViewCritical }) => {
  if (criticalCount === 0) return null;

  return (
    <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-6 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-red-100 rounded-lg">
            <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-red-800">
              Critical Issues Requiring Attention
            </h3>
            <p className="text-red-700">
              {criticalCount} high-priority issues need immediate action
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full">
            {criticalCount}
          </span>
          <button
            onClick={onViewCritical}
            className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            View Critical Issues
          </button>
        </div>
      </div>
    </div>
  );
};

export default CriticalAlerts;
