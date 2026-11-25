// components/sections/QuickActions.jsx
import React from 'react';
import {
  PlusCircleIcon,
  DocumentTextIcon,
  MapIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

const QuickActions = ({ onNavigate }) => {
  const actions = [
    {
      icon: PlusCircleIcon,
      title: "Report New Issue",
      description: "Submit a new civic issue report",
      color: "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
      textColor: "text-green-600",
      bgColor: "bg-green-50 hover:bg-green-100",
      action: () => onNavigate('/report-issue')
    },
    {
      icon: DocumentTextIcon,
      title: "View All Reports",
      description: "Browse and manage civic issue reports",
      color: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50 hover:bg-blue-100",
      action: () => onNavigate('/reports')
    },
    {
      icon: MapIcon,
      title: "Geographic View",
      description: "Explore issues on interactive map",
      color: "from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700",
      textColor: "text-teal-600",
      bgColor: "bg-teal-50 hover:bg-teal-100",
      action: () => onNavigate('/map-view')
    },
    {
      icon: UsersIcon,
      title: "View Leaderboard",
      description: "Check community engagement rankings",
      color: "from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700",
      textColor: "text-purple-600",
      bgColor: "bg-purple-50 hover:bg-purple-100",
      action: () => onNavigate('/leaderboard')
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <p className="text-gray-600 text-lg">Access key functions with one click</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={action.action}
                className={`${action.bgColor} p-6 rounded-xl border-2 border-transparent hover:border-current transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg text-left group`}
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className={`font-semibold ${action.textColor} mb-2 group-hover:scale-105 transition-transform duration-300`}>
                  {action.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {action.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default QuickActions;

