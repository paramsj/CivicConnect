// components/sections/CategoryBreakdown.jsx
import React from 'react';
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

const CategoryBreakdown = ({ categories }) => {
  const getTrendIcon = (trend) => {
    if (trend === 'up') return <ArrowTrendingUpIcon className="w-4 h-4 text-red-500" />;
    if (trend === 'down') return <ArrowTrendingDownIcon className="w-4 h-4 text-green-500" />;
    return <div className="w-4 h-4 bg-gray-400 rounded-full"></div>;
  };

  const getTrendColor = (trend) => {
    if (trend === 'up') return 'text-red-600';
    if (trend === 'down') return 'text-green-600';
    return 'text-gray-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Issue Categories</h3>
      
      <div className="space-y-4">
        {categories.map((category, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-all hover:translate-x-1"
          >
            <div>
              <div className="font-medium text-gray-800">{category.name}</div>
              <div className="text-sm text-gray-600">{category.count} reports</div>
            </div>
            <div className={`flex items-center space-x-1 ${getTrendColor(category.trend)}`}>
              {getTrendIcon(category.trend)}
              <span className="text-sm font-medium">{category.change}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryBreakdown;
