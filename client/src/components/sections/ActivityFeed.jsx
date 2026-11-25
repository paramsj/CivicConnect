// components/sections/ActivityFeed.jsx
import React from 'react';

const ActivityFeed = ({ activities }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Live Activity Feed</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-green-600">Live</span>
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className={`w-3 h-3 rounded-full ${getPriorityColor(activity.priority)} mt-2 flex-shrink-0`}></div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-800 text-sm font-medium">
                {activity.message}
              </p>
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-xs text-gray-500">{activity.time}</span>
                <span className="text-xs text-gray-500">{activity.location}</span>
              </div>
            </div>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityBadgeColor(activity.priority)}`}>
              {activity.priority}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;
